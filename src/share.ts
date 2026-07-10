import type { Deck } from './types';

/**
 * Serverless deck sharing: the deck JSON travels inside the URL fragment
 * (never sent to any server), gzip-compressed where the browser supports it.
 */

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function gzip(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzip(bytes: Uint8Array): Promise<string> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

export async function deckToShareUrl(deck: Deck): Promise<string> {
  // Strip the custom flag — the receiver marks it custom on import.
  const { custom: _custom, ...clean } = deck;
  const json = JSON.stringify(clean);
  const base = `${location.origin}${location.pathname}`;
  if (typeof CompressionStream !== 'undefined') {
    return `${base}#deck=gz.${toBase64Url(await gzip(json))}`;
  }
  return `${base}#deck=b64.${toBase64Url(new TextEncoder().encode(json))}`;
}

/** Returns the deck JSON text from a #deck= fragment, or null if absent. */
export async function deckJsonFromHash(hash: string): Promise<string | null> {
  const match = hash.match(/#deck=(gz|b64)\.([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const bytes = fromBase64Url(match[2]);
  if (match[1] === 'gz') {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('This browser can’t decompress shared decks.');
    }
    return gunzip(bytes);
  }
  return new TextDecoder().decode(bytes);
}
