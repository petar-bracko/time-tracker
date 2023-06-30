import { collection } from "firebase/firestore";
import { DB } from "../../config/firebase";
import type { Tracker } from "../../types";

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
