import { useState, useEffect } from "react";
import { HistoryTable } from "../components/HistoryTable";
import { useSpinner } from "../hooks";
import { ProgressSpinner } from "primereact/progressspinner";
import type { FilterForm, Tracker } from "../types";
import { useUserStore } from "../zustand/store";
import { initFetchHistory } from "../helpers/utils/initFetchHistory";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

export const History = () => {
  const spinner = useSpinner();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const user = useUserStore((state) => state.user);
  const [filterForm, setFilterForm] = useState<FilterForm>({
    startDate: null,
    endDate: null,
    description: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [calendarValues, setCalendarValues] = useState<any>({
    start: null,
    end: null,
  });

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
      <div className="hisotry-filter-form-wrapper">
        <form className="history-filter-form">
          <label className="filter-form-label">
            Start date
            <Calendar
              // value type: string | Date | Date[] | null | undefined
              value={calendarValues.start}
              showIcon
              dateFormat="dd.mm.yy."
              // event value type: Nullable<string | Date | Date[]> ??
              onChange={({ value }) => {
                setCalendarValues({ ...calendarValues, start: value });
                if (value) {
                  const startDate = new Date(value.toString());
                  setFilterForm({
                    ...filterForm,
                    startDate: startDate.toLocaleDateString(),
                  });
                  return;
                }
                setFilterForm({ ...filterForm, startDate: null });
              }}
            />
          </label>
          <label className="filter-form-label">
            End date
            <Calendar
              value={calendarValues.end}
              showIcon
              dateFormat="dd.mm.yy."
              onChange={({ value }) => {
                setCalendarValues({ ...calendarValues, end: value });
                if (value) {
                  const endDate = new Date(value.toString());
                  setFilterForm({
                    ...filterForm,
                    endDate: endDate.toLocaleDateString(),
                  });
                  return;
                }
                setFilterForm({ ...filterForm, endDate: null });
              }}
            />
          </label>
          <label className="filter-form-label">
            Description contains
            <InputText
              value={filterForm.description}
              onInput={({ currentTarget: { value } }) =>
                setFilterForm({ ...filterForm, description: value })
              }
            />
          </label>
        </form>
      </div>
      <div className="history-search-form-wrapper"></div>
      <div>
        {spinner.spinning ? (
          <ProgressSpinner />
        ) : (
          <HistoryTable
            trackers={trackers}
            onDescriptionUpdate={updateHistoryTable}
            onTrackerDelete={removeDeletedTrackerFromHistory}
            filterForm={filterForm}
          />
        )}
      </div>
    </div>
  );
};
