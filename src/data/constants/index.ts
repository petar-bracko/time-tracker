import { collection } from "firebase/firestore";
import { DB } from "../../config/firebase";
import type { RegisterData, Tracker } from "../../types";

export const TRACKERS_COLLECTION = collection(DB, "trackers");

export const CURRENT_DATE = new Date().toLocaleDateString();

export const EMPTY_TRACKER: Tracker = {
  created: "",
  description: "",
  finished: true,
  id: "",
  paused: true,
  seconds: -1,
  userId: "",
};

export const INIT_REGISTER_DATA: RegisterData = {
  confirmPassword: "",
  password: "",
  username: "",
};

export const USERS_COLLECTION = collection(DB, "users");
