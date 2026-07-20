import { flameTier } from '../flame';

interface Props {
  streak: number;
  size?: number;
}

/** Streak flame whose color follows the physics-of-fire tier ladder. */
export function Flame({ streak, size = 18 }: Props) {
  const tier = flameTier(streak);
  const lit = streak > 0;
  return (
    <svg
      className={`flame ${lit ? 'lit' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label={`${tier.name} streak flame`}
      style={lit ? { filter: `drop-shadow(0 0 4px ${tier.outer})` } : undefined}
    >
      <path
        fill={tier.outer}
        d="M12 1.5c.6 3-0.4 4.7-2.2 6.6C7.8 10.2 5 12.4 5 16a7 7 0 0 0 14 0c0-2.5-1.2-4.3-2.4-5.9-.4-.6-1.3-.4-1.5.3-.2.7-.5 1.3-1 1.7.3-3.6-.6-8.1-2.1-10.6z"
      />
      <path
        fill={tier.core}
        d="M12 11.2c.3 1.6-.2 2.5-1.1 3.5-.9 1-1.9 2-1.9 3.6a3.5 3.5 0 0 0 7 0c0-1.3-.7-2.3-1.4-3.2-.9-1.2-1.9-2.4-2.6-3.9z"
      />
    </svg>
  );
}
