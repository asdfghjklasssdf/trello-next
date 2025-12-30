export interface ColorPalette {
  bg: string;
  border: string;
  text: string;
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

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface Comment {
  text: string;
  time: string;
}

export interface Activity {
  text: string;
  time: string;
}

export interface CardLocation {
  boardIndex: number;
  listIndex: number;
  cardIndex: number;
}
export interface DragItem {
  source: CardLocation;
  destination: CardLocation;
}
export interface TrelloData {
  boards: Board[];
}
export interface TrelloState {
  trelloData: TrelloData;
  setTrelloData: (data: TrelloData) => void;
  selectedBoardIndex: number;
  setSelectedBoardIndex: (index: number) => void;
  selectedCardLocation: CardLocation | null;


  setSelectedCardLocation: (location: CardLocation | null) => void;
  isCardModalOpen: boolean;
  setIsCardModalOpen: (isOpen: boolean) => void;
  palette: ColorPalette[];
  setPalette: (palette: ColorPalette[]) => void;
}
export type CardType = Required<
  Omit<Card, "color">
> & {
  color?: ColorPalette;
};
