export type ChatUser = { _id: string; FirstName: string; LastName: string; Email?: string };

export type ChatMessage = {
  _id: string;
  chat: string;
  booking: string;
  sender: ChatUser | string;
  receiver: ChatUser | string;
  createdAt: string;
  /** Set locally while the send is in flight. */
  pending?: boolean;
};

/** Payload of the `chat:message` socket event. */
export type LiveMessage = {
  _id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  chat: string;
  createdAt: string;
};
