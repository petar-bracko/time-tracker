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

export type FilterForm = {
  startDate: string | null;
  endDate: string | null;
  description: string;
};

export type Date = {
  day: number;
  month: number;
  year: number;
};
