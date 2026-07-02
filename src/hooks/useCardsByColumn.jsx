import { useMemo, useRef } from 'react';

const EMPTY = [];

function areCardListsEqual(oldList, newList) {
  if (oldList === newList) return true;
  if (oldList.length !== newList.length) return false;
  for (let i = 0; i < oldList.length; i++) {
    if (oldList[i] !== newList[i]) return false;
  }
  return true;
}

export default function useCardsByColumn(columns, cards) {
  const prevMapRef = useRef(new Map());

  return useMemo(() => {
    const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

    const newMap = new Map();
    for (const column of sortedColumns) {
      newMap.set(column.id, EMPTY);
    }

    for (const card of cards) {
      const list = newMap.get(card.columnId);
      if (list === EMPTY) {
        newMap.set(card.columnId, [card]);
      } else {
        list.push(card);
      }
    }

    for (const list of newMap.values()) {
      if (list !== EMPTY) {
        list.sort((a, b) => a.position - b.position);
      }
    }

    // Reuse old references where possible

    const prevMap = prevMapRef.current;
    for (const [columnId, newList] of newMap) {
      // eslint-disable-next-line react-hooks/refs -- cache current render for next comparison
      const oldList = prevMap.get(columnId);
      if (oldList && areCardListsEqual(oldList, newList)) {
        newMap.set(columnId, oldList);
      }
    }

    // eslint-disable-next-line react-hooks/refs -- cache current render for next comparison
    prevMapRef.current = newMap;

    return { sortedColumns, cardsByColumn: newMap };
  }, [columns, cards]);
}
