export type UserStatus = "active" | "blocked";

export type UserRecord = {
  username: string;
  passwordHash: string;
  status: UserStatus;
};

export type PublicUser = {
  username: string;
  status: UserStatus;
};

export type LikeRecord = {
  createdAt: string;
};

export type AuthSuccess = {
  ok: true;
  user: PublicUser;
};

export type AuthFailure = {
  ok: false;
  status: 401 | 403;
  message: string;
};

export type AuthResult = AuthSuccess | AuthFailure;

export type PhotoDto = {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  authorName: string;
  authorAvatar: string | null;
  likesCount: number;
  viewsCount: number | null;
  likedByMe: boolean;
};
