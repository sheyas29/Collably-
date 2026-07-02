const boards = [{ id: 1, title: 'My First Board' }];
const columns = [
  { id: 1, title: 'To Do', boardId: 1, position: 0 },
  { id: 2, title: 'In Progress', boardId: 1, position: 1 },
  { id: 3, title: 'Done', boardId: 1, position: 2 },
];
const cards = [
  // To Do (column 1)
  {
    id: 1,
    title: 'Design homepage mockup',
    columnId: 1,
    position: 0,
    tags: ['design', 'ui'],
  },
  {
    id: 2,
    title: 'Set up project repo',
    columnId: 1,
    position: 1,
    tags: ['dev', 'setup'],
  },
  {
    id: 3,
    title: 'Write API documentation',
    columnId: 1,
    position: 2,
    tags: ['docs', 'api'],
  },
  {
    id: 4,
    title: 'Configure CI/CD pipeline',
    columnId: 1,
    position: 3,
    tags: ['devops', 'setup'],
  },

  // In Progress (column 2)
  {
    id: 5,
    title: 'Implement auth flow',
    columnId: 2,
    position: 0,
    tags: ['dev', 'auth'],
  },
  {
    id: 6,
    title: 'Build card component',
    columnId: 2,
    position: 1,
    tags: ['dev', 'ui'],
  },
  {
    id: 7,
    title: 'Connect to backend',
    columnId: 2,
    position: 2,
    tags: ['dev', 'api'],
  },

  // Done (column 3)
  {
    id: 8,
    title: 'Project kickoff meeting',
    columnId: 3,
    position: 0,
    tags: ['meeting'],
  },
  {
    id: 9,
    title: 'Choose tech stack',
    columnId: 3,
    position: 1,
    tags: ['planning'],
  },
  {
    id: 10,
    title: 'Create wireframes',
    columnId: 3,
    position: 2,
    tags: ['design'],
  },
  {
    id: 11,
    title: 'Set up staging server',
    columnId: 3,
    position: 3,
    tags: ['devops'],
  },
];

export const initialState = {
  boards,
  columns,
  cards,
};

export function boardReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };
    case 'DELETE_CARD': {
      const cardToDelete = state.cards.find(
        (card) => card.id === action.payload
      );
      const affectedColumnId = cardToDelete.columnId;

      const remainingInColumn = state.cards
        .filter(
          (card) =>
            card.columnId === affectedColumnId && card.id !== action.payload
        )
        .sort((a, b) => a.position - b.position)
        .map((card, index) => ({ ...card, position: index }));

      return {
        ...state,
        cards: [
          ...state.cards.filter((card) => card.columnId !== affectedColumnId),
          ...remainingInColumn,
        ],
      };
    }
    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [...state.columns, action.payload],
      };
    case 'DELETE_COLUMN':
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.payload),
        cards: state.cards.filter((card) => card.columnId !== action.payload),
      };
    case 'MOVE_CARD': {
      const { cardId, newColumnId, newIndex } = action.payload;
      const movedCard = state.cards.find((card) => card.id === cardId);
      if (!movedCard) return state;

      const oldColumnId = movedCard.columnId;

      // Helper: given a list of cards (already in the right final order),
      // reassign sequential positions 0, 1, 2...
      const reindex = (cards) =>
        cards.map((card, index) => ({ ...card, position: index }));

      if (oldColumnId === newColumnId) {
        // --- Reordering within the same column ---
        const columnCards = state.cards
          .filter((card) => card.columnId === oldColumnId)
          .sort((a, b) => a.position - b.position);

        const withoutMovedCard = columnCards.filter(
          (card) => card.id !== cardId
        );
        const clampedIndex = Math.max(
          0,
          Math.min(newIndex, withoutMovedCard.length)
        );
        withoutMovedCard.splice(clampedIndex, 0, movedCard);

        return {
          ...state,
          cards: [
            ...state.cards.filter((card) => card.columnId !== oldColumnId),
            ...reindex(withoutMovedCard),
          ],
        };
      }

      // --- Moving to a different column ---
      const oldColumnCards = reindex(
        state.cards
          .filter((card) => card.columnId === oldColumnId && card.id !== cardId)
          .sort((a, b) => a.position - b.position)
      );

      const newColumnCards = state.cards
        .filter((card) => card.columnId === newColumnId && card.id !== cardId)
        .sort((a, b) => a.position - b.position);

      const clampedIndex = Math.max(
        0,
        Math.min(newIndex, newColumnCards.length)
      );
      newColumnCards.splice(clampedIndex, 0, {
        ...movedCard,
        columnId: newColumnId,
      });

      return {
        ...state,
        cards: [
          ...state.cards.filter(
            (card) =>
              card.columnId !== oldColumnId && card.columnId !== newColumnId
          ),
          ...oldColumnCards,
          ...reindex(newColumnCards),
        ],
      };
    }

    default:
      return state;
  }
}
