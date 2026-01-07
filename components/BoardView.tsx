"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Board } from "@/types/trello";

interface BoardViewProps {
  board: Board;
  boardIndex: number;

  onBack: () => void;

  onEditBoard: () => void;
  onDeleteBoard: () => void;

  onEditList: (listIndex: number, value: string) => void;
  onDeleteList: (listIndex: number) => void;
  onAddList: (value: string) => void;

  onAddCard: (listIndex: number, value: string) => void;
  onEditCard: (
    listIndex: number,
    cardIndex: number,
    value: string
  ) => void;
  onDeleteCard: (listIndex: number, cardIndex: number) => void;

  openModal: (
    label: string,
    action: (value: string) => void,
    initialValue?: string
  ) => void;
  onOpenCard: (listIndex: number, cardIndex: number) => void;
}

export default function BoardView({
  board,
  boardIndex,
  onBack,
  onEditBoard,
  onDeleteBoard,
  onEditList,
  onDeleteList,
  onAddList,
  onAddCard,
  onEditCard,
  onDeleteCard,
  openModal,
  onOpenCard
}: BoardViewProps) {
  if (!board) return null;

  return (
    <>
      <div className="top-bar">
        <button
          type="button"
          className="backBtn"
          onClick={onBack}
          aria-label="Go back to boards"
        >
          ⬅ Back
        </button>

        <h2 className="boardTitleInline">{board.name}</h2>

        <div className="boardTopActions">
          <button
            type="button"
            className="iconBtn"
            aria-label="Edit board"
            title="Edit board"
            onClick={onEditBoard}
          >
            <EditIcon aria-hidden="true" />
          </button>

          <button
            type="button"
            className="iconBtn delete"
            aria-label="Delete board"
            title="Delete board"
            onClick={onDeleteBoard}
          >
            <DeleteIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <Droppable
        droppableId={String(boardIndex)}
        direction="horizontal"
        type="LIST"
      >
        {(provided) => (
          <div
            className="lists-row"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {board.lists.map((list, listIndex) => (
              <Draggable
                key={listIndex}
                draggableId={`list-${boardIndex}-${listIndex}`}
                index={listIndex}
              >
                {(provided) => (
                  <div
                    className="list"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      backgroundColor: list.color?.bg,
                      border: `2px solid ${list.color?.border}`,
                      color: list.color?.text
                    }}
                  >
                    <div
                      className="listHeader"
                      {...provided.dragHandleProps}
                    >
                      <h3 className="listTitle">{list.name}</h3>

                      <div className="listActions">
                        <button
                          type="button"
                          className="iconBtn"
                          aria-label={`Edit list ${list.name}`}
                          title="Edit list"
                          onClick={() =>
                            openModal(
                              "Edit List",
                              (v) => onEditList(listIndex, v),
                              list.name
                            )
                          }
                        >
                          <EditIcon aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          className="iconBtn"
                          aria-label={`Delete list ${list.name}`}
                          title="Delete list"
                          onClick={() => onDeleteList(listIndex)}
                        >
                          <DeleteIcon aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <Droppable
                      droppableId={`${boardIndex}-${listIndex}`}
                      type="CARD"
                    >
                      {(provided) => (
                        <div
                          className="cardsContainer"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {list.cards.map((card, cardIndex) => (
                            <Draggable
                              key={cardIndex}
                              draggableId={`card-${boardIndex}-${listIndex}-${cardIndex}`}
                              index={cardIndex}
                            >
                              {(provided) => (
                                <div
                                  className="card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() =>
                                    onOpenCard(listIndex, cardIndex)
                                  }
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: card.color?.bg,
                                    border: `1px solid ${card.color?.border}`,
                                    color: card.color?.text,
                                    cursor: "pointer"
                                  }}
                                >
                                  <div className="cardContent">
                                    {card.name}
                                  </div>

                                  <div className="cardActions">
                                    <button
                                      type="button"
                                      className="iconBtn"
                                      aria-label={`Edit card ${card.name}`}
                                      title="Edit card"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(
                                          "Edit Card",
                                          (v) =>
                                            onEditCard(
                                              listIndex,
                                              cardIndex,
                                              v
                                            ),
                                          card.name
                                        );
                                      }}
                                    >
                                      <EditIcon aria-hidden="true" />
                                    </button>

                                    <button
                                      type="button"
                                      className="iconBtn"
                                      aria-label={`Delete card ${card.name}`}
                                      title="Delete card"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCard(
                                          listIndex,
                                          cardIndex
                                        );
                                      }}
                                    >
                                      <DeleteIcon aria-hidden="true" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <button
                      type="button"
                      className="addCardFloating"
                      aria-label={`Add card to ${list.name}`}
                      onClick={() =>
                        openModal(
                          "Add Card",
                          (v) => onAddCard(listIndex, v)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            <button
              type="button"
              className="addListFloating"
              aria-label="Add new list"
              onClick={() =>
                openModal("Add List", (v) => onAddList(v))
              }
            >
              + Add List
            </button>
          </div>
        )}
      </Droppable>
    </>
  );
}
