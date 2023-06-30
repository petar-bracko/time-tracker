import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import type { Tracker } from "../types";
import { useUserStore } from "../zustand/store";
import { TrackersTable } from "../components";
import { useSpinner } from "../hooks";
import { ProgressSpinner } from "primereact/progressspinner";
import { createTimer, initFetchTrackers } from "../helpers/utils";
import { CURRENT_DATE } from "../data/constants";
import { MdOutlineTimer } from "react-icons/md";
import { FaRegCircleStop } from "react-icons/fa6";

export const Trackers = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const user = useUserStore((state) => state.user);
  const spinner = useSpinner();

  function handleCreateTimer() {
    createTimer(user.id, setTrackers);
  }

  function handleStopAllTimers() {
    console.log("stopping all timers...");
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

  const removeDeletedTrackerFromTable = (updatedTrackerId: string) => {
    const tempTrackers = [...trackers];
    const indexOfDeletedTracker = tempTrackers.findIndex(
      (t) => t.id === updatedTrackerId
    );
    if (indexOfDeletedTracker === -1) {
      console.error("Error while removing deleted tracker from table");
      return;
    }
    tempTrackers.splice(indexOfDeletedTracker, 1);
    setTrackers([...tempTrackers]);
  };

  useEffect(() => {
    initFetchTrackers(spinner, user.id)
      .then((fetchedTrackers) => setTrackers([...fetchedTrackers]))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="trackers-wrapper">
      <p className="current-date">Today ({CURRENT_DATE})</p>
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
          />
        )}
      </div>
    </div>
  );
};
