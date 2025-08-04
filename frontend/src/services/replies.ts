import axios from "axios";
import loginService from "./login";
import type {
  ReplyAllData,
  AddReply,
  ReplyResponse,
  UpdateReply,
  DeleteReply,
} from "../types/replyTypes";
import type { DeleteResponseDualLang } from "../types/types";

const baseUrl = "/api/replies";

const getAll = async (pictureId: number): Promise<ReplyAllData[]> => {
  const response = await axios.get<ReplyAllData[]>(
    `${baseUrl}?search=${pictureId}`
  );
  return response.data;
};

const create = async (newObject: AddReply): Promise<ReplyResponse> => {
  let config;
  if (newObject.adminReply) {
    const token = loginService.getToken();
    config = {
      headers: { Authorization: token },
    };
  }

  const response = await axios.post<ReplyResponse>(
    `${baseUrl}`,
    newObject,
    config
  );
  return response.data;
};

const update = async (content: UpdateReply): Promise<ReplyResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  const newObject = {
    reply: content.formData.reply,
    username: content.formData.username,
    userId: content.userId,
  };

  const response = await axios.put<ReplyResponse>(
    `${baseUrl}/${content.commentId}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (
  content: DeleteReply
): Promise<DeleteResponseDualLang> => {
  const token = loginService.getToken();
  const config = token
    ? {
        headers: { Authorization: token },
        data: content,
      }
    : {
        data: content,
      };
  const response = await axios.delete<DeleteResponseDualLang>(
    `${baseUrl}/${content.reply.id}`,
    config
  );

  return response.data;
};

export default { getAll, create, remove, update };
