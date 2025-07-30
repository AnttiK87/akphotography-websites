import axios from "axios";
import type {
  Rating,
  AddRating,
  AddRatingResponse,
} from "../types/ratingTypes";

const baseUrl = "/api/ratings";

const getAll = async (id: number): Promise<Rating[]> => {
  const response = await axios.get<Rating[]>(`${baseUrl}?search=${id}`);
  return response.data;
};

const create = async (newObject: AddRating): Promise<AddRatingResponse> => {
  const response = await axios.post<AddRatingResponse>(`${baseUrl}`, newObject);
  return response.data;
};

export default { getAll, create };
