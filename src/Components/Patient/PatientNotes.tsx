import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { statusType, useAbortableEffect } from "../../Common/utils";
import {
  getPatientNotes,
  addPatientNote,
  getPatient,
} from "../../Redux/actions";
import { Button } from "@material-ui/core";
import * as Notification from "../../Utils/Notifications.js";
import moment from "moment";
import PageTitle from "../Common/PageTitle";
import Pagination from "../Common/Pagination";
import { navigate } from "raviger";
import { RESULTS_PER_PAGE_LIMIT } from "../../Common/constants";

interface PatientNotesProps {
  patientId: any;
  facilityId: any;
}

const pageSize = RESULTS_PER_PAGE_LIMIT;

const PatientNotes = (props: PatientNotesProps) => {
  const { patientId, facilityId } = props;

  const dispatch: any = useDispatch();
  let initialData: any = { notes: [], cPage: 1, count: 1 };
  const [state, setState] = useState(initialData);
  const [noteField, setNoteField] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [facilityName, setFacilityName] = useState("");
  const [patientName, setPatientName] = useState("");

  const fetchData = useCallback(
    async (page: number = 1, status: statusType = { aborted: false }) => {
      setIsLoading(true);
      const res = await dispatch(
        getPatientNotes(props.patientId, pageSize, (page - 1) * pageSize)
      );
      if (!status.aborted) {
        if (res && res.data) {
          setState({
            ...state,
            count: res.data?.count,
            notes: res.data?.results,
            cPage: page,
          });
        }
        setIsLoading(false);
      }
    },
    [props.patientId, dispatch]
  );

  useAbortableEffect(
    (status: statusType) => {
      fetchData(1, status);
    },
    [fetchData]
  );

  useEffect(() => {
    async function fetchPatientName() {
      if (patientId) {
        const res = await dispatch(getPatient({ id: patientId }));
        if (res.data) {
          setPatientName(res.data.name);
          setFacilityName(res.data.facility_object.name);
        }
      } else {
        setPatientName("");
        setFacilityName("");
      }
    }
    fetchPatientName();
  }, [dispatch, patientId]);

  function handlePagination(page: number) {
    fetchData(page);
  }

  const onAddNote = () => {
    const payload = {
      note: noteField,
    };
    dispatch(addPatientNote(props.patientId, payload)).then((res: any) => {
      Notification.Success({ msg: "Note added successfully" });
      fetchData();
    });
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <PageTitle
        title="Patient Notes"
        className="mb-5"
        crumbsReplacements={{
          [facilityId]: { name: facilityName },
          [patientId]: { name: patientName },
        }}
      />
      <h3 className="text-lg pl-10">Add new notes</h3>
      <textarea
        rows={3}
        placeholder="Type your Note"
        className="mx-10 my-4 border border-gray-500 rounded-lg p-4"
        onChange={(e) => setNoteField(e.target.value)}
      />
      <div className="flex w-full justify-end pr-10">
        <Button
          onClick={onAddNote}
          className="border border-solid border-primary-600 hover:border-primary-700 text-primary-600 hover:bg-white capitalize my-2 text-sm"
        >
          Post Your Note
        </Button>
      </div>
      <div className="px-10 py-5">
        <h3 className="text-lg">Added Notes</h3>
        <div className="w-full">
          {state.notes.map((note: any) => (
            <div className="flex p-4 bg-white rounded-lg text-gray-800 mt-4 flex-col w-full border border-gray-300">
              <div className="flex  w-full ">
                <p className="text-justify">{note.note}</p>
              </div>
              <div className="mt-3">
                <span className="text-xs text-gray-500">
                  {moment(note.created_date).format("LLL") || "-"}
                </span>
              </div>

              <div className="sm:flex space-y-2 sm:space-y-0">
                <div className="mr-2 inline-flex bg-gray-100 border items-center rounded-md py-1 pl-2 pr-3">
                  <div className="flex justify-center items-center w-8 h-8 rounded-full">
                    <i className="fas fa-user" />
                  </div>
                  <span className="text-gray-700 text-sm">
                    {note.created_by_object?.first_name || "Unknown"}{" "}
                    {note.created_by_object?.last_name}
                  </span>
                </div>

                <div
                  className="inline-flex bg-gray-100 border items-center rounded-md py-1 pl-2 pr-3 cursor-pointer"
                  onClick={() => navigate(`/facility/${note.facility?.id}`)}
                >
                  <div className="flex justify-center items-center w-8 h-8 rounded-full">
                    <i className="fas fa-hospital" />
                  </div>
                  <span className="text-gray-700 text-sm">
                    {note.facility?.name || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {state.count > pageSize && (
            <div className="mt-4 flex w-full justify-center">
              <Pagination
                data={{ totalCount: state.count }}
                onChange={handlePagination}
                defaultPerPage={pageSize}
                cPage={state.cPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientNotes;
