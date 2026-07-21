/**
 * Renders card text: `backtick` spans become inline code, and newlines become
 * real line breaks so long answers can be written as scannable steps instead
 * of a wall of text.
 */
export function Rich({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split('`');
        return (
          <span key={li} className={li > 0 ? 'rich-line' : undefined}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <code key={i}>{part}</code> : <span key={i}>{part}</span>,
            )}
          </span>
        );
      })}
    </>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  );
}
