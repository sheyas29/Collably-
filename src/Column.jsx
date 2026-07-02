import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { memo, useMemo } from 'react';
import AddCard from './AddCard.jsx';
import Card from './Card.jsx';

function Column({ column, cards, handleDeleteColumn, handleDeleteCard }) {
  const COLUMN_ACCENTS = {
    // Map by column id or index — swap this to however you distinguish columns
    0: 'bg-periwinkle',
    1: 'bg-rose',
    2: 'bg-sage',
  };
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    collisionPriority: CollisionPriority.Low,
  });

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.position - b.position),
    [cards]
  );

  return (
    <div
      ref={ref}
      className={`
        group/col flex flex-col w-[280px] shrink-0
        max-h-[calc(100vh-140px)]
        rounded-3xl bg-mist-violet/60 p-4
        transition-colors duration-300 ease-out
        ${isDropTarget ? 'bg-mist-violet ring-1 ring-periwinkle/40' : ''}
      `}
    >
      <div className="flex items-center justify-between px-1 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${COLUMN_ACCENTS[column.id % 3]}`}
          />
          <h2 className="font-sans text-[13px] font-medium tracking-wide text-ink-soft uppercase">
            {column.title}
          </h2>
          <span className="text-[11px] text-ink-soft/60 font-sans">
            {sortedCards.length}
          </span>
        </div>
        <button
          onClick={() => handleDeleteColumn(column.id)}
          aria-label={`Delete ${column.title} column`}
          className="
            opacity-0 group-hover/col:opacity-100
            text-ink-soft hover:text-ink text-xs
            transition-opacity duration-200
          "
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[70vh] px-0.5 scroll-mist">
        {sortedCards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            handleDeleteCard={handleDeleteCard}
            index={index}
          />
        ))}

        {sortedCards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink/10 py-8 text-center">
            <p className="font-display text-[13px] text-ink-soft/70 italic">
              Nothing here yet
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 sticky bottom-0 bg-mist-violet/95 backdrop-blur-sm shrink-0">
        <AddCard columnId={column.id} />
      </div>
    </div>
  );
}

export default memo(Column);
