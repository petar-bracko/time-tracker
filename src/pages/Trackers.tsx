import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import type { Tracker } from "../types";
import { useUserStore } from "../zustand/store";
import { TrackersTable } from "../components";
import { useSpinner } from "../hooks";
import { ProgressSpinner } from "primereact/progressspinner";
import { createTimer, initFetchTrackers } from "../helpers/utils";
import { CURRENT_DATE, EMPTY_TRACKER } from "../data/constants";
import { MdOutlineTimer } from "react-icons/md";
import { FaRegCircleStop } from "react-icons/fa6";
import { doc, updateDoc } from "firebase/firestore";
import { DB } from "../config/firebase";
import { AiOutlineCalendar } from "react-icons/ai";

export const Trackers = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const user = useUserStore((state) => state.user);
  const spinner = useSpinner();
  const [activeTracker, setActiveTracker] = useState<Tracker>(EMPTY_TRACKER);
  const incrementInterval = useRef<NodeJS.Timer>();
  const syncDbInterval = useRef<NodeJS.Timer>();

  function handleCreateTimer() {
    createTimer(user.id, setTrackers);
  }

  function handleStopAllTimers() {
    if (activeTracker.id === "") {
      // ADD TOAST MSG FOR USER...
      console.log("No active tracker");
      return;
    }
    clearInterval(incrementInterval.current);
    clearInterval(syncDbInterval.current);
    const tempTrackers = [...trackers];
    const indexOfPlayingTracker = tempTrackers.findIndex(
      (t) => t.id === activeTracker.id
    );
    if (indexOfPlayingTracker === -1) {
      console.error("Error while stopping all trackers");
      return;
    }
    tempTrackers[indexOfPlayingTracker].paused = true;
    syncTracker(tempTrackers[indexOfPlayingTracker]);
    setActiveTracker(EMPTY_TRACKER);
    setTrackers([...tempTrackers]);
  }

  const updateTrackersTable = (updatedTrackerId: string, newDesc: string) => {
    const tempTrackers = [...trackers];
    const indexOfUpdatedTracker = tempTrackers.findIndex(
      (t) => t.id === updatedTrackerId
    );
    if (indexOfUpdatedTracker === -1) {
      console.error("Error while updating table after desc update");
      return;
    }
    tempTrackers[indexOfUpdatedTracker].description = newDesc;
    setTrackers([...tempTrackers]);
  };

  const removeDeletedTrackerFromTable = (deletedTrackerId: string) => {
    if (activeTracker.id === deletedTrackerId) {
      clearInterval(incrementInterval.current);
      clearInterval(syncDbInterval.current);
      setActiveTracker(EMPTY_TRACKER);
    }
    const tempTrackers = [...trackers];
    const indexOfDeletedTracker = tempTrackers.findIndex(
      (t) => t.id === deletedTrackerId
    );
    if (indexOfDeletedTracker === -1) {
      console.error("Error while removing deleted tracker from table");
      return;
    }
    tempTrackers.splice(indexOfDeletedTracker, 1);
    setTrackers([...tempTrackers]);
  };

  const incrementSeconds = (tracker: Tracker) => {
    const tempTrackers = [...trackers];
    const indexOfActiveTracker = tempTrackers.findIndex(
      (t) => t.id === tracker.id
    );
    if (indexOfActiveTracker === -1) {
      console.error("Error while incrementing seconds");
      return;
    }
    tempTrackers[indexOfActiveTracker].seconds++;
    setActiveTracker((current) => ({
      ...current,
      seconds: tempTrackers[indexOfActiveTracker].seconds,
    }));
    setTrackers([...tempTrackers]);
  };

  const syncTracker = async (tracker: Tracker) => {
    const trackerRef = doc(DB, "trackers", tracker.id);
    try {
      await updateDoc(trackerRef, {
        finished: tracker.finished,
        paused: true,
        seconds: tracker.seconds,
      });
    } catch {
      console.error("Error while syncing tracker");
    }
  };

  const engageTracker = (tracker: Tracker, action: "play" | "pause") => {
    if (action === "pause") {
      clearInterval(incrementInterval.current);
      clearInterval(syncDbInterval.current);
      syncTracker(tracker);
    }
    const tempTrackers = [...trackers];
    // IF IM HITTING PLAY, I HAVE TO CHECK THERE IS NO CURRENTLY ACTIVE TRACKER
    if (action === "play" && activeTracker.id.length > 0) {
      // THIS MEANS THERE IS CURRENTLY ACTIVE TRACKER
      // MUST TURN THAT ONE OFF, AND START PLAYING NEW ONE
      const indexOfCurrentlyActiveTracker = tempTrackers.findIndex(
        (t) => t.id === activeTracker.id
      );
      if (indexOfCurrentlyActiveTracker === -1) {
        console.error("Error while getting currently active traker");
        return;
      }
      tempTrackers[indexOfCurrentlyActiveTracker].paused = true;
      clearInterval(incrementInterval.current);
      clearInterval(syncDbInterval.current);
    }
    const indexOfEngagedTracker = tempTrackers.findIndex(
      (t) => t.id === tracker.id
    );
    if (indexOfEngagedTracker === -1) {
      console.error("Error while play/pause tracker");
      return;
    }
    tempTrackers[indexOfEngagedTracker].paused =
      !tempTrackers[indexOfEngagedTracker].paused;
    if (action === "play") {
      const incrementIntervalId = setInterval(
        incrementSeconds,
        1000,
        tempTrackers[indexOfEngagedTracker]
      );
      incrementInterval.current = incrementIntervalId;
      const syncIntervalId = setInterval(
        syncTracker,
        5000,
        tempTrackers[indexOfEngagedTracker]
      );
      syncDbInterval.current = syncIntervalId;
    }
    setActiveTracker(
      tempTrackers[indexOfEngagedTracker].paused
        ? EMPTY_TRACKER
        : { ...tempTrackers[indexOfEngagedTracker] }
    );
    setTrackers([...tempTrackers]);
  };

  const stopTracker = async (tracker: Tracker) => {
    if (activeTracker.id === tracker.id) {
      // MEANS IT IS CURRENTLY ACTIVE
      clearInterval(incrementInterval.current);
      clearInterval(syncDbInterval.current);
      setActiveTracker(EMPTY_TRACKER);
    }
    const tempTrackers = [...trackers];
    const indexOfStoppingTracker = tempTrackers.findIndex(
      (t) => t.id === tracker.id
    );
    if (indexOfStoppingTracker === -1) {
      console.error("Error while stopping tracker");
      return;
    }
    tempTrackers[indexOfStoppingTracker].finished = true;
    tempTrackers[indexOfStoppingTracker].paused = true;
    const stoppingTrackerSnapshot = { ...tempTrackers[indexOfStoppingTracker] };
    const trackerRef = doc(DB, "trackers", tracker.id);
    try {
      await updateDoc(trackerRef, {
        finished: true,
        paused: true,
        seconds: stoppingTrackerSnapshot.seconds,
      });
    } catch {
      console.error("Error while updating tracker");
    }
    tempTrackers.splice(indexOfStoppingTracker, 1);
    setTrackers([...tempTrackers]);
  };

  useEffect(() => {
    initFetchTrackers(spinner, user.id)
      .then((fetchedTrackers) => setTrackers([...fetchedTrackers]))
      .catch((err) => console.error(err));

    return () => {
      clearInterval(incrementInterval.current);
      clearInterval(syncDbInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="trackers-wrapper">
      <p className="current-date">
        <span>
          <AiOutlineCalendar />
        </span>
        <span>Today ({CURRENT_DATE})</span>
      </p>
      <div className="trackers-actions-wrapper">
        <Button
          type="button"
          className="new-timer-btn"
          onClick={handleCreateTimer}
          icon={<MdOutlineTimer />}
        >
          <span className="ml-1r">Start new timer</span>
        </Button>
        <Button
          type="button"
          className="stop-all-trackers-btn"
          onClick={handleStopAllTimers}
          icon={<FaRegCircleStop />}
          disabled={activeTracker.id === ""}
        >
          <span className="ml-1r">Stop all</span>
        </Button>
      </div>
      <div>
        {spinner.spinning ? (
          <ProgressSpinner />
        ) : (
          <TrackersTable
            trackers={trackers}
            onDescriptionUpdate={updateTrackersTable}
            onTrackerDelete={removeDeletedTrackerFromTable}
            engageTracker={engageTracker}
            stopTracker={stopTracker}
          />
        )}
      </div>
    </div>
  );
};
