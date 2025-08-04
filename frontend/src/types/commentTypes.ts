export type Comment = {
  id: number;
  comment: string;
  username: string;
  userId: string;
  pictureId: number;
  updatedAt: Date;
  createdAt: Date;
};

export type CurrentComment = {
  comment: string | undefined;
  reply: string | undefined;
  username: string;
  pictureId: number;
  commentId: number;
  id: number;
};

export type CreateComment = {
  pictureId: number;
  comment: string;
  username: string;
  userId: string;
};

export type CommentResponse = {
  messageEn: string;
  messageFi: string;
  comment: Comment;
};

export type UpdateComment = {
  formData: { comment: string; username: string };
  userId: string;
  commentId: number;
};

export type DeleteComment = {
  userId: string;
  comment: Comment;
};
