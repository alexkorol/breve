import type { Stats } from './types';
import { flameTier } from './flame';
import { isNative } from './native';

/**
 * Shareable streak card: a canvas-rendered square image with the flame at the
 * user's current tier color, streak count, and mastery. Native shares a file
 * via the system sheet; web uses the Web Share API or falls back to download.
 */

const SIZE = 1080;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderStreakCard(stats: Stats, mastered: number, totalCards: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const tier = flameTier(stats.streak);

  // Background
  ctx.fillStyle = '#161310';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Card panel
  ctx.fillStyle = '#1f1b16';
  roundRect(ctx, 60, 60, SIZE - 120, SIZE - 120, 48);
  ctx.fill();
  ctx.strokeStyle = '#362f26';
  ctx.lineWidth = 3;
  roundRect(ctx, 60, 60, SIZE - 120, SIZE - 120, 48);
  ctx.stroke();

  // Flame glow
  const cx = SIZE / 2;
  const glow = ctx.createRadialGradient(cx, 360, 20, cx, 360, 240);
  glow.addColorStop(0, tier.core);
  glow.addColorStop(0.45, tier.outer);
  glow.addColorStop(1, 'rgba(22, 19, 16, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, 360, 240, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '160px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔥', cx, 360);

  // Streak
  ctx.fillStyle = '#f0e9dc';
  ctx.font = 'bold 110px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${stats.streak}-day streak`, cx, 590);

  // Tier + mastery
  ctx.fillStyle = '#a49a8a';
  ctx.font = '52px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(tier.name, cx, 680);
  ctx.fillText(`${mastered}/${totalCards} cards mastered · ${stats.totalReviews} reviews`, cx, 760);

  // Brand
  ctx.fillStyle = '#ecb64f';
  ctx.font = 'bold 56px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🦝 Jimothy', cx, 890);
  ctx.fillStyle = '#a49a8a';
  ctx.font = '40px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Interview prep that sticks', cx, 950);

  return canvas;
}

async function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  );
}

/** Render and share; resolves true if a share/download was handed off. */
export async function shareStreakImage(stats: Stats, mastered: number, totalCards: number): Promise<boolean> {
  const canvas = renderStreakCard(stats, mastered, totalCards);
  const filename = `jimothy-streak-${stats.streak}.png`;

  if (isNative) {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      const written = await Filesystem.writeFile({
        path: filename,
        data: dataUrl.split(',')[1],
        directory: Directory.Cache,
      });
      await Share.share({ files: [written.uri] });
      return true;
    } catch {
      return false; // user cancelled the sheet, or share unavailable
    }
  }

  try {
    const blob = await canvasBlob(canvas);
    const file = new File([blob], filename, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return true;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
