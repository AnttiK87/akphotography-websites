import axios from "axios";
import loginService from "./login";
import type { DeleteResponseDualLang } from "../types/types";
import type {
  Comment,
  CommentResponse,
  CreateComment,
  UpdateComment,
  DeleteComment,
} from "../types/commentTypes";

const baseUrl: string = "/api/comments";
const token: string | undefined = loginService.getToken();

const getAll = async (id: number): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${baseUrl}?search=${id}`);
  return response.data;
};

const create = async (newObject: CreateComment): Promise<CommentResponse> => {
  const response = await axios.post<CommentResponse>(`${baseUrl}`, newObject);
  return response.data;
};

const update = async (content: UpdateComment): Promise<CommentResponse> => {
  const newObject = {
    comment: content.formData.comment,
    username: content.formData.username,
    userId: content.userId,
  };

  const response = await axios.put<CommentResponse>(
    `${baseUrl}/${content.commentId}`,
    newObject
  );
  return response.data;
};

const remove = async (
  content: DeleteComment
): Promise<DeleteResponseDualLang> => {
  const config = token
    ? {
        headers: { Authorization: token },
        data: content,
      }
    : {
        data: content,
      };
  const response = await axios.delete<DeleteResponseDualLang>(
    `${baseUrl}/${content.comment.id}`,
    config
  );
  return response.data;
};

export default { getAll, create, remove, update };
