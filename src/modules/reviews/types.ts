export type Review = {
  _id: string;
  booking: string;
  mother: { _id: string; FirstName: string; LastName: string } | string;
  babysitter: { _id: string; FirstName: string; LastName: string; picture?: string } | string;
  rating: number;
  comment: string;
  babysitterRating: number | null;
  babysitterComment: string;
  motherReviewedAt: string | null;
  babysitterReviewedAt: string | null;
  createdAt: string;
};

export type RatedUser = {
  _id: string;
  FirstName: string;
  LastName: string;
  picture: string;
  ratingAverage: number;
  ratingCount: number;
};
