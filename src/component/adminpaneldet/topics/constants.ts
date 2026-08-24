// Types and interfaces
export interface IOption {
  id: string;
  label: string;
  nextResponseText: string;
}

export interface IMessage {
  id: string;
  sender: "advisor" | "student";
  text: string;
  options?: IOption[];
}

export interface IQuestion {
  id: string;
  title: string;
  messages: IMessage[];
}

export interface IExistingTopic {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  questions: IQuestion[];
}