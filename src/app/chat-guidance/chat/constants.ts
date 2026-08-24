// Types and constants
export interface IOption {
  id: string;
  label: string;
  nextResponseText: string;
}

export interface IMessage {
  id?: string;
  sender: "advisor" | "student";
  text: string;
  options?: IOption[];
}

export interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export interface ITopic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
}

export interface ChatMessageType {
  id: string;
  sender: "advisor" | "student";
  text: string;
  time: string;
  status: "read";
  isVisible: boolean;
}

// Utility functions
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getTimeString = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};