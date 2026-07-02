import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useCallback, useContext } from 'react';
import AddColumn from './AddColumn.jsx';
import Column from './Column.jsx';
import { BoardContext } from './context/boardContext';
import useCardsByColumn from './hooks/useCardsByColumn.jsx';

export default function Board() {
  const { state, dispatch } = useContext(BoardContext);

  const { sortedColumns, cardsByColumn } = useCardsByColumn(
    state.columns,
    state.cards
  );

  const deleteCardHandler = useCallback(
    (cardId) => {
      dispatch({ type: 'DELETE_CARD', payload: cardId });
    },
    [dispatch]
  );

  const deleteColumnHandler = useCallback(
    (columnId) => {
      dispatch({ type: 'DELETE_COLUMN', payload: columnId });
    },
    [dispatch]
  );

  const handleDragEnd = useCallback(
    (event) => {
      if (event.canceled) return;
      const { source, target } = event.operation;

      if (!isSortable(source)) return;
      if (!target) return;

      const cardId = source.id;
      let newColumnId;
      let newIndex;

      if (isSortable(target)) {
        newColumnId = target.group;
        newIndex = target.index;
      } else {
        newColumnId = target.id;
        newIndex = 0;
      }

      if (
        source.initialGroup === newColumnId &&
        source.initialIndex === newIndex
      ) {
        return;
      }

      dispatch({
        type: 'MOVE_CARD',
        payload: { cardId, newColumnId, newIndex },
      });
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-aurora">
      <header className="px-8 pt-8 pb-6">
        <h1 className="font-display text-[28px] text-ink tracking-tight">
          {state.boards[0]?.title}
        </h1>
      </header>

      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex gap-6 px-8 pb-10 overflow-x-auto items-start max-w-[1400px] mx-auto">
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={cardsByColumn.get(column.id)}
              handleDeleteCard={deleteCardHandler}
              handleDeleteColumn={deleteColumnHandler}
            />
          ))}
          <AddColumn boardId={state.boards[0]?.id} />
        </div>
      </DragDropProvider>
    </div>
  );
}
