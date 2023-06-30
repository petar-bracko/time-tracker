import { useState, useEffect } from "react";
import { HistoryTable } from "../components/HistoryTable";
import { useSpinner } from "../hooks";
import { ProgressSpinner } from "primereact/progressspinner";
import type { Tracker } from "../types";
import { useUserStore } from "../zustand/store";
import { initFetchHistory } from "../helpers/utils/initFetchHistory";

export const History = () => {
  const spinner = useSpinner();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const user = useUserStore((state) => state.user);

  const updateHistoryTable = (updatedTrackerId: string, newDesc: string) => {
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

  const removeDeletedTrackerFromHistory = (updatedTrackerId: string) => {
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
    initFetchHistory(spinner, user.id)
      .then((fetchedTrackers) => setTrackers([...fetchedTrackers]))
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="history-wrapper">
      <p className="current-date">Trackers history</p>
      {/* SEARCH FORM PLACEHOLDER */}
      <div className="history-search-form-wrapper"></div>
      <div>
        {spinner.spinning ? (
          <ProgressSpinner />
        ) : (
          <HistoryTable
            trackers={trackers}
            onDescriptionUpdate={updateHistoryTable}
            onTrackerDelete={removeDeletedTrackerFromHistory}
          />
        )}
      </div>
    </div>
  );
};
