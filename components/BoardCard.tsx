"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Board } from "@/types/trello";

interface Props {
  board: Board;
  index: number;
  onSelect: (i: number) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  onDoubleClick?: (i: number) => void;
}

function BoardCard({
  board,
  index,
  onSelect,
  onEdit,
  onDelete,
  onDoubleClick
}: Props) {
  return (
    <Draggable draggableId={`board-${index}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="board"
          tabIndex={0}
          role="button"
          aria-label={`Open board ${board.name}`}
          onClick={() => onSelect(index)}
          onDoubleClick={(e) => {
            e.preventDefault();
            onDoubleClick?.(index);
          }}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: board.color?.bg,
            border: `2px solid ${board.color?.border}`,
            color: board.color?.text
          }}
        >
          <strong>{board.name}</strong>

          <div>
            <button
              type="button"
              className="iconBtn"
              aria-label={`Edit board ${board.name}`}
              title="Edit board"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(index);
              }}
            >
              <EditIcon aria-hidden="true" />
            </button>

            <button
              type="button"
              className="iconBtn"
              aria-label={`Delete board ${board.name}`}
              title="Delete board"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
            >
              <DeleteIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(BoardCard);
