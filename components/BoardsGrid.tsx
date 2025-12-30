"use client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import BoardCard from "./BoardCard";
import { Board } from "@/types/trello";

interface Props {
  boards: Board[];
  onSelect: (i: number) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  onAdd: () => void;
}

export default function BoardsGrid({
  boards,
  onSelect,
  onEdit,
  onDelete,
  onAdd
}: Props) {
  return (
    <>
      <button className="addBoardBtn" onClick={onAdd}>
        + Add Board
      </button>

      <Droppable droppableId="boards" type="BOARD">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {boards.map((b, i) => (
              <BoardCard
                key={i}
                board={b}
                index={i}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
