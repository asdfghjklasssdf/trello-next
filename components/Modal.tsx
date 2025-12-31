"use client";

import React, { forwardRef, memo } from "react";

interface ModalProps {
  open: boolean;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const Modal = forwardRef<HTMLInputElement, ModalProps>(
  function Modal(
    { open, label, value, error, onChange, onCancel, onSave },
    ref
  ) {
    if (!open) return null;

    const inputId = "modal-input";

    return (
      <div className="modalOverlay" onMouseDown={onCancel}>
        <div
          className="modalBox"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h3 className="modalTitle">{label}</h3>

          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>

          <input
            id={inputId}
            ref={ref}
            type="text"
            value={value}
            placeholder="Enter name"
            aria-invalid={!!error}
            aria-describedby={error ? "modal-error" : undefined}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") onCancel();
            }}
          />

          {error && (
            <div id="modal-error" className="modalError">
              {error}
            </div>
          )}

          <div className="modalBtns">
            <button
              type="button"
              className="cancelBtn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              className="saveBtn"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export default memo(Modal);
