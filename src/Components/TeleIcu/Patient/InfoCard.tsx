import { Link } from "raviger";
import { GENDER } from "../../../Common/constants";
import { getDimensionOrDash } from "../../../Common/utils";
import { PatientModel } from "../../Patient/models";
import { RightArrowIcon } from "../Icons/ArrowIcon";

export interface ITeleICUPatientInfoCardProps {
  patient: PatientModel;
}

export default function TeleICUPatientInfoCard({
  patient,
}: ITeleICUPatientInfoCardProps) {
  return (
    <section className="flex items-stretch my-2 lg:flex-row flex-col space-y-3 lg:space-y-0 lg:space-x-2">
      <div className="bg-white border-b p-5 flex items-center lg:w-7/12 w-full">
        <img
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full self-start object-cover"
          src="/images/empty_avatar.jpg"
          alt="Avatar"
        />
        <div className="pl-4">
          <p className="sm:text-xl md:text-4xl font-semibold ml-1">
            {patient.name}
          </p>
          {!patient.is_active && (
            <div className="bg-red-400 text-white inline-block rounded-lg px-2 py-1">
              Discharged from CARE
            </div>
          )}
          <p className="text-sm sm:text-base my-1 ml-1 text-primary-800">
            <span>{patient.age} years</span>
            <span className="mx-2">•</span>
            <span>{patient.gender && GENDER[patient.gender]}</span>
          </p>
          <div className="text-sm flex flex-wrap">
            {patient.blood_group && (
              <div className="m-1">
                <span className="font-light text-primary-600 text-xs mr-1">
                  Blood Group
                </span>
                <span className="sm:text-base font-semibold text-sm mr-2">
                  {patient.blood_group}
                </span>
              </div>
            )}
            {patient.last_consultation?.weight && (
              <div className="m-1">
                <span className="font-light text-primary-600 text-sm mr-1">
                  Weight
                </span>
                <span className="sm:text-base font-semibold text-sm mr-2">
                  {getDimensionOrDash(patient.last_consultation.weight, " kg")}
                </span>
              </div>
            )}
            {patient.last_consultation?.height && (
              <div className="m-1">
                <span className="font-light text-primary-600 text-sm mr-1">
                  Height
                </span>
                <span className="sm:text-base font-semibold text-sm mr-2">
                  {getDimensionOrDash(patient.last_consultation?.height, "cm")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-${
          patient.is_active ? "2" : "1"
        } gap-x-4 flex-1 gap-y-2`}
      >
        {patient.is_active &&
          patient.last_consultation?.id &&
          [
            ["update", "Edit Consultation Details", "pencil-alt"],
            ["daily-rounds", "Log Update", "plus"],
          ].map((action, i) => (
            <Link
              key={i}
              href={`/facility/${patient.facility}/patient/${patient.id}/consultation/${patient.last_consultation?.id}/${action[0]}`}
              className="rounded-md bg-white shadow-sm text-primary-900 flex justify-between items-center p-2 px-4 sm:px-2 hover:bg-gray-200 cursor-pointer active:translate-y-1 transform"
            >
              <p className="text-sm sm:text-base px-2 font-semibold">
                {action[1]}
              </p>
              <span>
                <i className={`fas fa-${action[2]} mr-2`}></i>
              </span>
            </Link>
          ))}
        <Link
          href={`/patient/${patient.id}/investigation_reports`}
          className="rounded-md bg-white shadow-sm text-primary-900 flex justify-between items-center p-2 px-4 sm:px-2 hover:bg-gray-200 cursor-pointer active:translate-y-1 transform"
        >
          <p className="text-sm sm:text-base px-2 font-semibold">
            Investigation Summary
          </p>
          <span>
            <RightArrowIcon />
          </span>
        </Link>
        {patient.last_consultation?.id && (
          <Link
            href={`/facility/${patient.facility}/patient/${patient.id}/consultation/${patient.last_consultation?.id}/treatment-summary`}
            className="rounded-md bg-white shadow-sm text-primary-900 flex justify-between items-center p-2 px-4 sm:px-2 hover:bg-gray-200 cursor-pointer active:translate-y-1 transform"
          >
            <p className="text-sm sm:text-base px-2 font-semibold">
              Treatment Summary
            </p>
            <span>
              <RightArrowIcon />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
