"use client";
import { useState } from "react";

import "../app/css/popup.css";

type Label = {
  id: string;
  name: string;
  color: string;
};

type ChecklistItem = {
  text: string;
  done: boolean;
};

type Checklist = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

type CommentType = {
  text: string;
  time: string;
};

type ActivityType = {
  text: string;
  time: string;
};

export type CardType = {
  id?: string;
  name: string;
  description: string;
  labels: Label[];
  checklist?: ChecklistItem[]; 
  checklists?: Checklist[];
  comments: CommentType[];
  activity: ActivityType[];
  attachments: string[];
  startDate: string;
  dueDate: string;
  location: string;
  completed: boolean;
};


const getChecklistProgress = (items: ChecklistItem[] = []) => {
  if (!items.length) return 0;
  const done = items.filter(i => i.done).length;
  return Math.round((done / items.length) * 100);
};


const buildDraftFromCard = (card: CardType) => {
  let checklists: Checklist[] = [];

  if (Array.isArray(card.checklists) && card.checklists.length) {
    checklists = card.checklists;
  } else if (Array.isArray(card.checklist)) {
    checklists = [
      { id: "default", title: "Checklist", items: card.checklist }
    ];
  } else {
    checklists = [{ id: "default", title: "Checklist", items: [] }];
  }

  return {
    name: card.name || "",
    description: card.description || "",
    labels: card.labels || [],
    checklists,
    comments: card.comments || [],
    activity: card.activity || [],
    attachments: card.attachments || [],
    startDate: card.startDate || "",
    dueDate: card.dueDate || "",
    location: card.location || "",
    completed: card.completed || false
  };
};


export default function CardDetailsModal({
  card,
  onClose,
  onSave,
  onDelete
}: {
  card: CardType;
  onClose: () => void;
  onSave: (card: CardType) => void;
  onDelete?: (card: CardType) => void;
}) {
  const [newLabelName, setNewLabelName] = useState<string>("");
  const [newLabelColor, setNewLabelColor] = useState<string>("#22c55e");

  const [draft, setDraft] = useState(() => buildDraftFromCard(card));

  const [labelManagerOpen, setLabelManagerOpen] = useState<boolean>(false);

  const [commentInput, setCommentInput] = useState<string>("");

  const [pendingChecklistItems, setPendingChecklistItems] = useState<
    Record<string, string>
  >({});

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [availableLabels, setAvailableLabels] = useState<Label[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("labels");
    if (stored) return JSON.parse(stored);

    const defaults: Label[] = [
      { id: "1", name: "Frontend", color: "#4caf50" },
      { id: "2", name: "Backend", color: "#f97316" },
      { id: "3", name: "UI", color: "#7b61ff" },
      { id: "4", name: "Bug", color: "#ef4444" }
    ];

    localStorage.setItem("labels", JSON.stringify(defaults));
    return defaults;
  });

 
  const log = (text: string) => {
    setDraft(d => ({
      ...d,
      activity: [...d.activity, { text, time: new Date().toLocaleString() }]
    }));
  };


  const addLabel = () => {
    if (!newLabelName.trim()) return;

    const newLabel: Label = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: newLabelName,
      color: newLabelColor
    };

    const updated = [...availableLabels, newLabel];
    setAvailableLabels(updated);
    localStorage.setItem("labels", JSON.stringify(updated));

    log(`Label "${newLabelName}" created`);
    setNewLabelName("");
  };

  const updateLabel = (id: string, updates: Partial<Label>) => {
    const updated = availableLabels.map(l =>
      l.id === id ? { ...l, ...updates } : l
    );

    setAvailableLabels(updated);
    localStorage.setItem("labels", JSON.stringify(updated));

    setDraft(d => ({
      ...d,
      labels: d.labels.map(l => (l.id === id ? { ...l, ...updates } : l))
    }));

    log("Label updated");
  };

  const deleteLabel = (id: string) => {
    const updated = availableLabels.filter(l => l.id !== id);
    setAvailableLabels(updated);
    localStorage.setItem("labels", JSON.stringify(updated));

    setDraft(d => ({
      ...d,
      labels: d.labels.filter(l => l.id !== id)
    }));

    log("Label deleted");
  };

  const toggleLabel = (label: Label) => {
    setDraft(d => {
      const exists = d.labels.some(l => l.id === label.id);
      log(`Label "${label.name}" ${exists ? "removed" : "added"}`);
      return {
        ...d,
        labels: exists
          ? d.labels.filter(l => l.id !== label.id)
          : [...d.labels, label]
      };
    });
  };


  const toggleChecklistByUser = (clId: string) => {
    setDraft(d => {
      const cl = d.checklists.find(c => c.id === clId);
      if (!cl) return d;

      const allDone = cl.items.every(i => i.done);

      return {
        ...d,
        checklists: d.checklists.map(c =>
          c.id === clId
            ? {
                ...c,
                items: c.items.map(it => ({ ...it, done: !allDone }))
              }
            : c
        )
      };
    });

    log("Checklist toggled by user");
  };

  const toggleChecklistItem = (clId: string, index: number) => {
    setDraft(d => {
      const item = d.checklists.find(c => c.id === clId)?.items[index];
      log(item?.done ? "Checklist item reopened" : "Checklist item completed");

      return {
        ...d,
        checklists: d.checklists.map(cl =>
          cl.id === clId
            ? {
                ...cl,
                items: cl.items.map((it, i) =>
                  i === index ? { ...it, done: !it.done } : it
                )
              }
            : cl
        )
      };
    });
  };


  const addComment = () => {
    if (!commentInput.trim()) return;

    setDraft(d => ({
      ...d,
      comments: [
        ...d.comments,
        { text: commentInput, time: new Date().toLocaleString() }
      ]
    }));

    log("Comment added");
    setCommentInput("");
  };

 
  const addAttachment = (file: File | null) => {
    if (!file) return;

    setDraft(d => ({
      ...d,
      attachments: [...d.attachments, file.name]
    }));

    log(`Attachment "${file.name}" added`);
  };


  const saveAll = () => {
    onSave({
      ...card,
      ...draft,
      checklists: draft.checklists,
      checklist: undefined
    });

    onClose();
  };


  const confirmDeleteYes = () => {
    if (onDelete) onDelete(card);
    onClose();
  };

 return (
  <div className="modalOverlay" onMouseDown={onClose}>
    <div className="cardModal" onMouseDown={e => e.stopPropagation()}>
      
      <div className="cardModalHeader">
        <span
          className={`cardCompleteToggle ${draft.completed ? "done" : ""}`}
          onClick={() =>
            setDraft(d => ({ ...d, completed: !d.completed }))
          }
        >
          {draft.completed ? "✓" : "○"}
        </span>

        <input
          className={`cardTitle ${draft.completed ? "titleDone" : ""}`}
          value={draft.name}
          aria-label="Card title"
          onChange={e =>
            setDraft(d => ({ ...d, name: e.target.value }))
          }
        />

        <button className="closeBtn" onClick={onClose}>✕</button>
      </div>



      {confirmDelete && (
        <div className="modalOverlay" onClick={() => setConfirmDelete(false)}>
          <div className="cardModal" onClick={e => e.stopPropagation()}>
            <h3>Delete card?</h3>
            <p>Are you sure you want to delete this card?</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="saveBtn" onClick={confirmDeleteYes}>
                Yes
              </button>

              <button
                className="cancelBtn"
                onClick={() => setConfirmDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cardModalBody">

        <div className="cardLeft">

          <h4>Labels</h4>

          <div className="labelsRow">
            {availableLabels.map(l => (
              <span
                key={l.id}
                className="labelChip"
                style={{
                  background: l.color,
                  opacity: draft.labels.some(x => x.id === l.id) ? 1 : 0.3
                }}
                onClick={() => toggleLabel(l)}
              >
                {l.name}
              </span>
            ))}
          </div>

          <button
            className="manageLabelsBtn"
            onClick={() => setLabelManagerOpen(true)}
          >
            + Manage labels
          </button>

          {labelManagerOpen && (
            <div
              className="labelManagerOverlay"
              onClick={() => setLabelManagerOpen(false)}
            >
              <div
                className="labelManager"
                onClick={e => e.stopPropagation()}
              >
                <div className="labelManagerHeader">
                  <h4>Manage Labels</h4>
                  <button onClick={() => setLabelManagerOpen(false)}>✕</button>
                </div>

                <div className="labelAddRow">
                  <input
                    placeholder="Label name"
                    aria-label="New label name"
                    value={newLabelName}
                    onChange={e => setNewLabelName(e.target.value)}
                  />

                  <input
                    type="color"
                    aria-label="New label color"
                    value={newLabelColor}
                    onChange={e => setNewLabelColor(e.target.value)}
                  />

                  <button onClick={addLabel}>+</button>
                </div>

                {availableLabels.map(l => (
                  <div key={l.id} className="labelRow">
                    <input
                      value={l.name}
                      aria-label="Edit label name"
                      onChange={e =>
                        updateLabel(l.id, { name: e.target.value })
                      }
                    />

                    <input
                      type="color"
                      aria-label="Edit label color"
                      value={l.color}
                      onChange={e =>
                        updateLabel(l.id, { color: e.target.value })
                      }
                    />

                    <button onClick={() => deleteLabel(l.id)}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h4>Description</h4>

          <textarea
            value={draft.description}
            aria-label="Card description"
            onChange={e =>
              setDraft(d => ({ ...d, description: e.target.value }))
            }
          />

    <h4>Checklist</h4>

{draft.checklists.map(cl => {
  const progress = getChecklistProgress(cl.items);

  return (
    <div key={cl.id} className="checklistBox">
      <div className="checklistHeader">
        <span>{cl.title}</span>
        <span>{progress}%</span>
      </div>

      <div
        className="progressBar clickable"
        onClick={() => toggleChecklistByUser(cl.id)}
        title="Click to toggle checklist"
      >
        <div
          className="progressFill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {cl.items.map((item, i) => (
        <div key={i} className="checkItem">
          <input
            type="checkbox"
            aria-label="Checklist item"
            checked={item.done}
            onChange={() => toggleChecklistItem(cl.id, i)}
          />
          <span className={item.done ? "done" : ""}>
            {item.text}
          </span>
        </div>
      ))}

      {/* input stays same */}
      <input
        className="commentInput"
        placeholder="Add checklist item…"
        aria-label="Add checklist item"
        value={pendingChecklistItems[cl.id] || ""}
        onChange={e =>
          setPendingChecklistItems(p => ({
            ...p,
            [cl.id]: e.target.value
          }))
        }
        onKeyDown={e => {
          if (e.key === "Enter") {
            setDraft(d => ({
              ...d,
              checklists: d.checklists.map(x =>
                x.id === cl.id
                  ? {
                      ...x,
                      items: [
                        ...x.items,
                        {
                          text: pendingChecklistItems[cl.id],
                          done: false
                        }
                      ]
                    }
                  : x
              )
            }));
            log("Checklist item added");
            setPendingChecklistItems(p => ({
              ...p,
              [cl.id]: ""
            }));
          }
        }}
      />

      <button
        onClick={() => {
          if (!pendingChecklistItems[cl.id]) return;

          setDraft(d => ({
            ...d,
            checklists: d.checklists.map(x =>
              x.id === cl.id
                ? {
                    ...x,
                    items: [
                      ...x.items,
                      {
                        text: pendingChecklistItems[cl.id],
                        done: false
                      }
                    ]
                  }
                : x
            )
          }));

          log("Checklist item added");

          setPendingChecklistItems(p => ({
            ...p,
            [cl.id]: ""
          }));
        }}
      >
        Add
      </button>
    </div>
  );
})}


          <h4>Attachments</h4>

          {draft.attachments.map((a, i) => (
            <div key={i} className="commentItem">{a}</div>
          ))}

          <input
            type="file"
            aria-label="Add attachment"
            onChange={e => addAttachment(e.target.files?.[0] || null)}
          />

          <h4>Comments</h4>

{draft.comments.map((c, i) => (
  <div key={i} className="commentItem">
    {c.text}
    <div style={{ fontSize: 11, opacity: 0.6 }}>{c.time}</div>
  </div>
))}

<input
  className="commentInput"
  placeholder="Write a comment…"
  aria-label="Add comment"
  value={commentInput}
  onChange={e => setCommentInput(e.target.value)}
  onKeyDown={e => e.key === "Enter" && addComment()}
/>

<button onClick={addComment}>Add</button>

         
        </div>

        <div className="cardRight">

          <h4>Start date</h4>
          <input
            type="date"
            aria-label="Start date"
            value={draft.startDate}
            onChange={e => {
              setDraft(d => ({ ...d, startDate: e.target.value }));
              log("Start date updated");
            }}
          />

          <h4>Due date</h4>
          <input
            type="date"
            aria-label="Due date"
            value={draft.dueDate}
            onChange={e => {
              setDraft(d => ({ ...d, dueDate: e.target.value }));
              log("Due date updated");
            }}
          />

          <h4>Location</h4>
          <input
            type="text"
            aria-label="Location"
            value={draft.location}
            onChange={e => {
              setDraft(d => ({ ...d, location: e.target.value }));
              log("Location updated");
            }}
          />

          <h4>Activity</h4>

          <div className="activityScroll">
            {draft.activity.map((a, i) => (
              <div key={i} className="commentItem">
                {a.text}
                <div style={{ fontSize: 11, opacity: 0.6 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cardModalFooter">
        <button className="cancelBtn" onClick={onClose}>Cancel</button>
        <button className="saveBtn" onClick={saveAll}>Save</button>
      </div>
    </div>
  </div>
);
}
