import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable';
import { useSortable } from '@dnd-kit/react/sortable';
import { memo } from 'react';

const TAG_COLORS = ['bg-rose', 'bg-sage', 'bg-periwinkle'];

function hashTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }
  return Math.abs(hash);
}

function tagColor(tag) {
  return TAG_COLORS[hashTag(tag) % TAG_COLORS.length];
}

function Card({ card, handleDeleteCard, index }) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: card.columnId,
    plugins: [SortableKeyboardPlugin],
  });

  return (
    <div
      ref={ref}
      className={`
        group relative rounded-2xl bg-surface p-5 mb-3
        border border-ink/5
        shadow-[var(--shadow-feather)]
        transition-all duration-300 ease-out
        ${
          isDragging
            ? 'opacity-60 scale-[1.02] shadow-[var(--shadow-feather-hover)] rotate-1'
            : 'hover:shadow-[var(--shadow-feather-hover)] hover:-translate-y-0.5'
        }
      `}
    >
      <h3
        title={card.title}
        className="font-display text-[17px] leading-snug text-ink tracking-tight line-clamp-2"
      >
        {card.title}
      </h3>

      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className={`
      ${tagColor(tag)}
      text-ink/70 text-[11px] font-sans font-medium
      px-2.5 py-0.5 rounded-full
    `}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => handleDeleteCard(card.id)}
        aria-label={`Delete ${card.title}`}
        className="
          absolute top-3 right-3
          opacity-0 group-hover:opacity-100
          text-ink-soft hover:text-ink
          text-xs font-sans
          transition-opacity duration-200
        "
      >
        ✕
      </button>
    </div>
  );
}

export default memo(Card);
