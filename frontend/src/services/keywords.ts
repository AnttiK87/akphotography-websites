import axios from "axios";
import loginService from "./login";
import type { DeleteResponseDualLang } from "../types/types";
import type {
  Keyword,
  KeywordUpdate,
  KeywordUpdateResponse,
  KeywordDelete,
} from "../types/keywordTypes";

const baseUrl = "/api/keywords";

const getAll = async (): Promise<Keyword[]> => {
  const response = await axios.get<Keyword[]>(baseUrl);
  return response.data;
};

const update = async (
  content: KeywordUpdate
): Promise<KeywordUpdateResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    keyword: content.formData.keyword,
  };

  const response = await axios.put<KeywordUpdateResponse>(
    `${baseUrl}/update/${content.keywordId}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (
  content: KeywordDelete
): Promise<DeleteResponseDualLang> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
    data: content,
  };
  const response = await axios.delete<DeleteResponseDualLang>(
    `${baseUrl}/${content.keywordId}`,
    config
  );

  return response.data;
};

export default { getAll, remove, update };
