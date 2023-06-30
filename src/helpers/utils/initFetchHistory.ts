import { TRACKERS_COLLECTION } from "../../data/constants";
import type { Spinner } from "../../hooks/useSpinner";
import type { Tracker } from "../../types";
import { query, where, getDocs } from "firebase/firestore";

export const initFetchHistory = async (spinner: Spinner, userId: string) => {
  const initTrackers: Tracker[] = [];
  spinner.startSpin();
  try {
    const initFetchTrackersQuery = query(
      TRACKERS_COLLECTION,
      where("userId", "==", userId),
      where("finished", "==", true)
    );
    const querySnapshot = await getDocs(initFetchTrackersQuery);
    querySnapshot.forEach((tracker) => {
      const tempTracker = { ...tracker.data() } as Tracker;
      initTrackers.push({
        created: tempTracker.created,
        description: tempTracker.description,
        finished: tempTracker.finished,
        id: tracker.id,
        paused: tempTracker.paused,
        seconds: tempTracker.seconds,
        userId: tempTracker.userId,
      });
    });
  } catch {
    throw new Error("Error while init fetching trackers.");
  } finally {
    spinner.endSpin();
  }
  return initTrackers;
};
