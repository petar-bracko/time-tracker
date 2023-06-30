import { addDoc, doc, getDoc } from "firebase/firestore";
import { DB } from "../../config/firebase";
import type { Tracker } from "../../types";
import { CURRENT_DATE, TRACKERS_COLLECTION } from "../../data/constants";

export const createTimer = async (
  userId: string,
  setTrackers: React.Dispatch<React.SetStateAction<Tracker[]>>
) => {
  try {
    const docRef = await addDoc(TRACKERS_COLLECTION, {
      description: "lorem ipsum",
      seconds: 0,
      created: CURRENT_DATE,
      finished: false,
      paused: true,
      userId: userId,
    });
    const newDocId = docRef.id;
    const newDocRef = doc(DB, "trackers", newDocId);
    const newDocSnap = await getDoc(newDocRef);
    if (newDocSnap.exists()) {
      setTrackers((current) => [
        ...current,
        {
          created: newDocSnap.data().created,
          description: newDocSnap.data().description,
          finished: newDocSnap.data().finished,
          id: newDocId,
          paused: newDocSnap.data().paused,
          seconds: newDocSnap.data().seconds,
          userId: newDocSnap.data().userId,
        },
      ]);
    } else {
      console.error("Oops, no such document...");
    }
  } catch {
    console.error("Error while creating new timer");
  }
};
