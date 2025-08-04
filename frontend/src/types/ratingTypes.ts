export type Rating = {
  id: number;
  userId: string;
  pictureId: number;
  rating: number;
  updatedAt: string;
  createdAt: string;
};

export type AddRating = {
  userId: string;
  pictureId: number;
  rating: number;
};

export type AddRatingResponse = {
  message: string;
  rating: Rating;
};

export type DeleteRating = {
  message: string;
  id: number;
};
