export type ReplyCommentInfo = {
  username: string;
  comment: string;
};

export type ParentReplyInfo = {
  reply: string;
  username: string;
};

export type ChildReplyInfo = {
  id: number;
  reply: string;
  username: string;
  userId: string;
  parentReplyId: number;
  commentId: number;
};

export type Reply = {
  id: number;
  reply: string;
  commentId: number;
  pictureId: number;
  userId: string;
  username: string;
  adminReply: boolean;
  parentReplyId: number | null;
  parentReply: ParentReplyInfo | null;
  createdAt: string;
  updatedAt: string;
  comment: ReplyCommentInfo;
  profilePicture?: string;
};

export type ReplyAllData = Reply & {
  childReplies: ChildReplyInfo[];
};

export type AddReply = {
  adminReply: boolean;
  commentId: number;
  parentReplyId?: number | null;
  pictureId: number;
  reply: string;
  username: string;
  userId: string;
};

export type ReplyResponse = {
  messageEn: string;
  messageFi: string;
  reply: Reply;
};

export type UpdateReply = {
  commentId: number;
  formData: {
    reply: string;
    username: string;
  };
  userId: string;
};

export type DeleteReply = {
  userId: string;
  reply: Reply;
};
