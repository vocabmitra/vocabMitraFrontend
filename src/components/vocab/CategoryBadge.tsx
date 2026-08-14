import type { UseCaseTag } from '../../types';

interface CategoryBadgeProps {
  tag: UseCaseTag;
  active?: boolean;
  onClick?: () => void;
}

/** 
 * Tag color accent for Joyful theme.
 * We resolve the color based on the tag name (e.g. UPSC -> --upsc).
 */
export function CategoryBadge({ tag, active = false, onClick }: CategoryBadgeProps) {
  const tagVar = tag ? `var(--${tag.toLowerCase()}, var(--ink))` : 'var(--ink)';

  const baseStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '10.5px',
    fontWeight: 700,
    borderRadius: '999px',
    padding: '3px 10px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s var(--ease)',
    userSelect: 'none',
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    color: '#fff',
    background: tagVar,
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    color: 'var(--ink)',
    background: 'transparent',
    border: `2px solid ${tagVar}`,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={active ? activeStyle : inactiveStyle}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.background = tagVar;
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';
          }
        }}
        aria-pressed={active}
        aria-label={`Filter by ${tag}`}
      >
        {tag}
      </button>
    );
  }

  return (
    <span style={activeStyle}>
      {tag}
    </span>
  );
}
