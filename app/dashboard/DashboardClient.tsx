"use client";

import { useState, useRef, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import CardDetailsModal, { CardType } from "@/components/CardDetailsModal";

import "../css/Dashboard.css";
import Modal from "@/components/Modal";
import BoardsGrid from "@/components/BoardsGrid";
import BoardView from "@/components/BoardView";

import { generatePalette } from "@/utils/generatePalette";
import useLocalStorageState from "@/hooks/useLocalStorageState";


export interface ColorPalette {
  bg: string;
  border: string;
  text: string;
}
export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Comment {
  text: string;
  time: string;
}

export interface Activity {
  text: string;
  time: string;
}

export interface Card {
  name: string;
  color?: ColorPalette;

  description?: string;

  labels?: Label[];

  checklists?: Checklist[];

  checklist?: ChecklistItem[];

  comments?: Comment[];

  activity?: Activity[];

  attachments?: string[];

  startDate?: string;
  dueDate?: string;
  location?: string;

  completed?: boolean;
}



export interface List {
  name: string;
  color?: ColorPalette;
  cards: Card[];
}

export interface Board {
  name: string;
  color?: ColorPalette;
  lists: List[];
}

export interface CardLocation {
  boardIndex: number;
  listIndex: number;
  cardIndex: number;
}



export default function Dashboard() {
 const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("loggedInUserId") || "guest"
    : "guest";

const [boards, setBoards] = useLocalStorageState<Board[]>(
  `boardsData_${userId}`,
  []
);



  const [selectedBoardIndex, setSelectedBoardIndex] =
    useState<number | null>(null);

  const [activeCard, setActiveCard] = useState<CardLocation | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLabel, setModalLabel] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [modalError, setModalError] = useState("");

  const actionRef = useRef<((value: string) => void) | null>(null);

  const openModal = useCallback(
    (
      label: string,
      action: (value: string) => void,
      initialValue = ""
    ) => {
      setModalLabel(label);
      setModalValue(initialValue);
      setModalError("");
      actionRef.current = action;
      setModalOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalLabel("");
    setModalValue("");
    setModalError("");
    actionRef.current = null;
  }, []);

  const submitModal = useCallback(() => {
    const value = modalValue.trim();

    if (
      (modalLabel.startsWith("Add") ||
        modalLabel.startsWith("Edit")) &&
      !value
    ) {
      setModalError("Name cannot be empty");
      return;
    }

    actionRef.current?.(value);
    closeModal();
  }, [modalValue, modalLabel, closeModal]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    setBoards((prev) => {
      const data = structuredClone(prev);

      if (type === "BOARD") {
        const [m] = data.splice(source.index, 1);
        data.splice(destination.index, 0, m);
        return data;
      }

      if (type === "LIST") {
        const from = Number(source.droppableId);
        const to = Number(destination.droppableId);
        const [m] = data[from].lists.splice(source.index, 1);
        data[to].lists.splice(destination.index, 0, m);
        return data;
      }

      const [sb, sl] = source.droppableId.split("-").map(Number);
      const [db, dl] = destination.droppableId.split("-").map(Number);

      const [m] =
        data[sb].lists[sl].cards.splice(source.index, 1);
      data[db].lists[dl].cards.splice(destination.index, 0, m);
      return data;
    });
  };


  const addBoard = (name: string) =>
    setBoards((p) => [
      ...p,
      { name, color: generatePalette(), lists: [] },
    ]);

  const editBoard = (i: number, name: string) =>
    setBoards((p) => {
      const c = [...p];
      c[i] = { ...c[i], name };
      return c;
    });

  const deleteBoard = (i: number) =>
    openModal("Delete Board?", () => {
      setBoards((p) => p.filter((_, idx) => idx !== i));
      setSelectedBoardIndex(null);
    });


 const addList = (bi: number, name: string) =>
  setBoards(prev => {
    const boards = [...prev];
    const board = { ...boards[bi] };

    board.lists = [
      ...board.lists,
      { name, color: generatePalette(), cards: [] }
    ];

    boards[bi] = board;
    return boards;
  });


const editList = (bi: number, li: number, name: string) =>
  setBoards(prev => {
    const boards = [...prev];
    const board = { ...boards[bi] };
    const lists = [...board.lists];

    lists[li] = { ...lists[li], name };

    board.lists = lists;
    boards[bi] = board;
    return boards;
  });


 const deleteList = (bi: number, li: number) =>
  openModal("Delete List?", () =>
    setBoards(prev => {
      const boards = [...prev];
      const board = { ...boards[bi] };

      board.lists = board.lists.filter((_, i) => i !== li);
      boards[bi] = board;

      return boards;
    })
  );



 const addCard = (bi: number, li: number, name: string) =>
  setBoards(prev => {
    const boards = [...prev];
    const board = { ...boards[bi] };
    const lists = [...board.lists];
    const list = { ...lists[li] };

    list.cards = [
      ...list.cards,
      { name, color: generatePalette() }
    ];

    lists[li] = list;
    board.lists = lists;
    boards[bi] = board;

    return boards;
  });


  const editCard = (bi: number, li: number, ci: number, name: string) =>
  setBoards(prev => {
    const boards = [...prev];
    const board = { ...boards[bi] };
    const lists = [...board.lists];
    const list = { ...lists[li] };
    const cards = [...list.cards];

    cards[ci] = { ...cards[ci], name };
    list.cards = cards;

    lists[li] = list;
    board.lists = lists;
    boards[bi] = board;

    return boards;
  });


  const deleteCard = (bi: number, li: number, ci: number) =>
    openModal("Delete Card?", () =>
      setBoards((p) => {
        const c = structuredClone(p);
        c[bi].lists[li].cards.splice(ci, 1);
        return c;
      })
    );

 const updateCard = (loc: CardLocation, card: CardType) =>
  setBoards(prev => {
    const boards = [...prev];
    const board = { ...boards[loc.boardIndex] };
    const lists = [...board.lists];
    const list = { ...lists[loc.listIndex] };
    const cards = [...list.cards];

    cards[loc.cardIndex] = card;
    list.cards = cards;

    lists[loc.listIndex] = list;
    board.lists = lists;
    boards[loc.boardIndex] = board;

    return boards;
  });


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        <Modal
          open={modalOpen}
          label={modalLabel}
          value={modalValue}
          error={modalError}
          onChange={setModalValue}
          onSave={submitModal}
          onCancel={closeModal}
        />

        {selectedBoardIndex === null ? (
          <BoardsGrid
            boards={boards}
            onSelect={setSelectedBoardIndex}
            onAdd={() => openModal("Add Board", addBoard)}
            onEdit={(i) =>
              openModal(
                "Edit Board",
                (v) => editBoard(i, v),
                boards[i].name
              )
            }
            onDelete={deleteBoard}
          />
        ) : (
          <BoardView
            board={boards[selectedBoardIndex]}
            boardIndex={selectedBoardIndex}
            openModal={openModal}
            onBack={() => setSelectedBoardIndex(null)}
            onEditBoard={() =>
              openModal(
                "Edit Board",
                (v) =>
                  editBoard(selectedBoardIndex, v),
                boards[selectedBoardIndex].name
              )
            }
            onDeleteBoard={() =>
              deleteBoard(selectedBoardIndex)
            }
            onAddList={(v) =>
              addList(selectedBoardIndex, v)
            }
            onEditList={(li, v) =>
              editList(selectedBoardIndex, li, v)
            }
            onDeleteList={(li) =>
              deleteList(selectedBoardIndex, li)
            }
            onAddCard={(li, v) =>
              addCard(selectedBoardIndex, li, v)
            }
            onEditCard={(li, ci, v) =>
              editCard(selectedBoardIndex, li, ci, v)
            }
            onDeleteCard={(li, ci) =>
              deleteCard(selectedBoardIndex, li, ci)
            }
            onOpenCard={(li, ci) =>
              setActiveCard({
                boardIndex: selectedBoardIndex,
                listIndex: li,
                cardIndex: ci,
              })
            }
          />
        )}

   
      {activeCard && (() => {
        const raw =
          boards[activeCard.boardIndex]
            .lists[activeCard.listIndex]
            .cards[activeCard.cardIndex];

        const full: CardType = {
          ...raw,
          description: raw.description ?? "",
          labels: raw.labels ?? [],
          comments: raw.comments ?? [],
          activity: raw.activity ?? [],
          attachments: raw.attachments ?? [],
          checklists: raw.checklists ?? [],
          checklist: undefined,
          startDate: raw.startDate ?? "",
          dueDate: raw.dueDate ?? "",
          location: raw.location ?? "",
          completed: raw.completed ?? false
        };

        return (
          <CardDetailsModal
            card={full}
            onClose={() => setActiveCard(null)}
            onSave={(updated) => updateCard(activeCard, updated)}
          />
        );
      })()}
    </div>
  </DragDropContext>
);
}
