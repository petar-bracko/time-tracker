import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { FilterForm, Tracker } from "../types";
import { MdOutlineEdit } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { formatSeconds } from "../helpers/utils";
import { Dialog } from "primereact/dialog";
import { useModal } from "../hooks";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { DB } from "../config/firebase";
import { EMPTY_TRACKER } from "../data/constants";
import { isDateBetweenRange } from "../helpers/validation";

interface Props {
  trackers: Tracker[];
  onDescriptionUpdate: (updatedTrackerId: string, newDesc: string) => void;
  onTrackerDelete: (updatedTrackerId: string) => void;
  filterForm: FilterForm;
}

export const HistoryTable = ({
  trackers,
  onDescriptionUpdate,
  onTrackerDelete,
  filterForm,
}: Props) => {
  const editModal = useModal();
  const [editingTracker, setEditingTracker] = useState<Tracker>(EMPTY_TRACKER);
  const deleteModal = useModal();
  const [deletingTracker, setDeletingTracker] =
    useState<Tracker>(EMPTY_TRACKER);

  function handleTrackerEdit(tracker: Tracker) {
    setEditingTracker({ ...tracker });
    editModal.openModal();
  }

  function handleTrackerDelete(tracker: Tracker) {
    setDeletingTracker({ ...tracker });
    deleteModal.openModal();
  }

  async function updateTrackerDescription() {
    const trackerRef = doc(DB, "trackers", editingTracker.id);
    try {
      await updateDoc(trackerRef, {
        description: editingTracker.description,
      });
      onDescriptionUpdate(editingTracker.id, editingTracker.description);
      setEditingTracker(EMPTY_TRACKER);
      editModal.closeModal();
    } catch {
      console.error("Error while updating tracker");
    }
  }

  async function deleteTracker() {
    const trackerRef = doc(DB, "trackers", deletingTracker.id);
    try {
      await deleteDoc(trackerRef);
      onTrackerDelete(deletingTracker.id);
      setEditingTracker(EMPTY_TRACKER);
      deleteModal.closeModal();
    } catch {
      console.error("Error while deleting tracker");
    }
  }

  const editModalFooter = (
    <div>
      <Button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        onClick={() => editModal.closeModal()}
        className="p-button-text"
      />
      <Button
        type="button"
        label="Confirm"
        icon="pi pi-check"
        onClick={updateTrackerDescription}
        disabled={!editingTracker.description.length}
      />
    </div>
  );

  const deleteModalFooter = (
    <div>
      <Button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        onClick={() => deleteModal.closeModal()}
        className="p-button-text"
      />
      <Button
        type="button"
        label="Delete"
        severity="danger"
        icon="pi pi-check"
        onClick={deleteTracker}
      />
    </div>
  );

  function actionsBody(tracker: Tracker) {
    return (
      <div className="tracker-actions-wrapper">
        <button
          className="tracker-action-btn"
          onClick={() => handleTrackerEdit(tracker)}
          type="button"
        >
          <MdOutlineEdit />
        </button>
        <button
          className="tracker-action-btn"
          onClick={() => handleTrackerDelete(tracker)}
          type="button"
        >
          <BsFillTrashFill />
        </button>
      </div>
    );
  }

  function displayTime(tracker: Tracker) {
    return <>{formatSeconds(tracker.seconds)}</>;
  }

  function closeEditDialog() {
    setEditingTracker(EMPTY_TRACKER);
    editModal.closeModal();
  }

  function closeDeleteModal() {
    setDeletingTracker(EMPTY_TRACKER);
    deleteModal.closeModal();
  }

  function getTableValue() {
    if (
      filterForm.description === "" &&
      !filterForm.endDate &&
      !filterForm.startDate
    ) {
      return trackers;
    }
    // BRUTE FORCE :/
    return trackers.filter((tracker) => {
      let descMatch = true;
      let startDateMatch = true;
      let endDateMatch = true;
      let rangeMatch = true;
      let isRange = false;

      if (filterForm.startDate && filterForm.endDate) isRange = true;

      if (filterForm.description !== "") {
        descMatch = tracker.description
          .toLowerCase()
          .includes(filterForm.description.toLowerCase());
      }

      if (filterForm.startDate && !filterForm.endDate) {
        // START DATE ONLY
        startDateMatch = tracker.created === filterForm.startDate;
      }

      if (!filterForm.startDate && filterForm.endDate) {
        // END DATE ONLY
        endDateMatch = tracker.created === filterForm.endDate;
      }

      if (isRange) {
        // RANGE BETWEEN
        rangeMatch = isDateBetweenRange(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          filterForm.startDate!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          filterForm.endDate!,
          tracker.created
        );
      }

      if (descMatch) {
        if (isRange && rangeMatch) return tracker;
        if (!isRange) {
          if (startDateMatch && endDateMatch) return tracker;
        }
      }
    });
  }

  return (
    <>
      <DataTable value={getTableValue()} paginator rows={5} showGridlines>
        <Column field="created" header="Date"></Column>
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "500px" }}
        ></Column>
        <Column
          field="seconds"
          header="Time tracked"
          body={displayTime}
        ></Column>
        <Column header="Actions" body={actionsBody}></Column>
      </DataTable>
      <Dialog
        header="Edit tracker"
        visible={editModal.isModalVisible}
        onHide={closeEditDialog}
        style={{ width: "50vw" }}
        footer={editModalFooter}
        draggable={false}
      >
        <div>
          <InputText
            value={editingTracker.description}
            style={{ width: "50%" }}
            autoFocus
            placeholder="Enter description"
            onInput={({ currentTarget: { value } }) =>
              setEditingTracker((current) => ({
                ...current,
                description: value,
              }))
            }
          />
        </div>
      </Dialog>
      <Dialog
        header="Delet tracker"
        visible={deleteModal.isModalVisible}
        onHide={closeDeleteModal}
        style={{ width: "50vw" }}
        footer={deleteModalFooter}
        draggable={false}
      >
        <div>
          <p>Are you sure you want to delete selected tracker?</p>
          <p>{deletingTracker.description}</p>
        </div>
      </Dialog>
    </>
  );
};
