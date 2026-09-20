export type AppNotification = {
  _id: string;
  type: string;
  title: string;
  message: string;
  data: { bookingId?: string; action?: string; [key: string]: unknown };
  readAt: string | null;
  createdAt: string;
};
