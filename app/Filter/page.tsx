/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Board, Card } from "@/types/trello";
import "../css/Dashboard.css";

interface FilteredCard {
  boardName: string;
  listName: string;
  card: Card;
}

export default function FilterPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("loggedInUserId") || "guest";
    const stored = localStorage.getItem(`boardsData_${userId}`);
    if (stored) setBoards(JSON.parse(stored));
  }, []);

  const allCards: FilteredCard[] = [];

  boards.forEach((board) => {
    board.lists.forEach((list) => {
      list.cards.forEach((card) => {
        allCards.push({
          boardName: board.name,
          listName: list.name,
          card,
        });
      });
    });
  });

  const filtered = allCards.filter(({ card }) => {
    const matchesSearch =
      !search ||
      card.name.toLowerCase().includes(search.toLowerCase());

    const matchesLabel =
      !labelFilter ||
      card.labels?.some((l) =>
        l.name.toLowerCase().includes(labelFilter.toLowerCase())
      );

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "completed" && card.completed) ||
      (statusFilter === "pending" && !card.completed);

    const matchesLocation =
      !locationFilter ||
      card.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesStart =
      !startDateFilter || card.startDate === startDateFilter;

    const matchesDue =
      !dueDateFilter || card.dueDate === dueDateFilter;

    return (
      matchesSearch &&
      matchesLabel &&
      matchesStatus &&
      matchesLocation &&
      matchesStart &&
      matchesDue
    );
  });

 return (
  <div className="dashboard">
    <div className="top-bar">
      <h2 className="boardTitleInline">🔎 Filter Cards</h2>
    </div>

    <div className="filterPanel">
      <input
        className="filterInput"
        placeholder="Search by card name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        className="filterInput"
        placeholder="Filter by label..."
        value={labelFilter}
        onChange={(e) => setLabelFilter(e.target.value)}
      />

      <select
        className="filterInput"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <input
        className="filterInput"
        placeholder="Filter by location..."
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />

      <input
        className="filterInput"
        type="date"
        value={startDateFilter}
        onChange={(e) => setStartDateFilter(e.target.value)}
      />

      <input
        className="filterInput"
        type="date"
        value={dueDateFilter}
        onChange={(e) => setDueDateFilter(e.target.value)}
      />
    </div>

    <div className="lists-row" style={{ marginTop: 20 }}>
      {filtered.length === 0 && (
        <div className="cardResultEmpty">
          No matching cards found.
        </div>
      )}

      {filtered.map(({ boardName, listName, card }, index) => (
        <div key={index} className="list-card cardResultStyled">
          <h3>{card.name}</h3>

          <p className="metaText">
            <strong>Board:</strong> {boardName}
          </p>

          <p className="metaText">
            <strong>List:</strong> {listName}
          </p>

          {card.labels && (
            <div className="labelsRow">
              {card.labels.map((l) => (
                <span
                  key={l.id}
                  className="labelChip"
                  style={{ background: l.color }}
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}

          {card.startDate && (
            <p className="metaText">
              <strong>Start:</strong> {card.startDate}
            </p>
          )}

          {card.dueDate && (
            <p className="metaText">
              <strong>Due:</strong> {card.dueDate}
            </p>
          )}

          {card.location && (
            <p className="metaText">
              <strong>Location:</strong> {card.location}
            </p>
          )}

          <p className="metaText">
            <strong>Status:</strong>{" "}
            {card.completed ? "✅ Completed" : "⏳ Pending"}
          </p>
        </div>
      ))}
    </div>
  </div>
);
}