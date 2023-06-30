export type LoginData = {
  username: string;
  password: string;
};

export type User = {
  username: string;
  isAuthenitacted: boolean;
  id: string;
};

export type UserStore = {
  user: User;
  authUser: (username: string, id: string) => void;
  clearUser: () => void;
};

export type Tracker = {
  id: string;
  description: string;
  seconds: number;
  created: string;
  finished: boolean;
  paused: boolean;
  userId: string;
};
