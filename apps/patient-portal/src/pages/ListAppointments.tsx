import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { PATIENTS_DATA } from "../constants";
import { useNavigate } from "react-router-dom";

interface Patient {
    id: string;
    name: string;
}

interface AppointmentResource {
    id: string;
    start: string;
    end: string;
    status: string;
}

interface Appointment {
    resource: AppointmentResource;
}

const ListAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const navigate = useNavigate();

    const filteredPatients = PATIENTS_DATA.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    const getAppointments = async (patientId: string) => {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        if (!token) {
            console.warn("Missing access_token in localStorage");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:3007/v2/patient-appointments/${patientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(response.data.entry || []);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedPatient) {
            getAppointments(selectedPatient.id);
        }
    }, [selectedPatient]);

    const now = moment();
    const upcoming = appointments.filter((a) =>
        moment(a.resource.start).isSameOrAfter(now)
    );
    const past = appointments
        .filter((a) => moment(a.resource.start).isBefore(now))
        .reverse();

    const AppointmentCard = ({ resource }: { resource: AppointmentResource }) => {
        const start = moment(resource.start);
        const end = moment(resource.end);

        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 text-sm">
                <h3 className="text-sm font-medium text-gray-900">
                    {start.format("ddd, MMM D, YYYY")}
                </h3>
                <p className="text-gray-500 mt-1 text-xs">
                    {start.format("hh:mm A")} – {end.format("hh:mm A")}
                </p>
                <span
                    className={`mt-3 inline-block px-2 py-1 text-xs font-semibold rounded-full ${resource.status === "booked"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {resource.status.toUpperCase()}
                </span>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all shadow-sm cursor-pointer"
            >
                ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
                Appointment Tracker
            </h1>

            {/* Search Patient */}
            <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Patient
                </label>
                <input
                    type="text"
                    placeholder="Start typing a patient's name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                />
                {dropdownOpen && filteredPatients.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-40 overflow-y-auto">
                        {filteredPatients.map((patient) => (
                            <li
                                key={patient.id}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedPatient(patient);
                                    setQuery(patient.name);
                                    setDropdownOpen(false);
                                }}
                            >
                                {patient.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedPatient && (
                <>
                    <h2 className="text-lg font-semibold text-center text-gray-700 mb-8">
                        Appointments for{" "}
                        <span className="text-blue-600">{selectedPatient.name}</span>
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-base font-medium text-blue-700 border-b border-blue-200 pb-2 mb-4 uppercase tracking-wide">
                                    Upcoming Appointments
                                </h3>
                                {upcoming.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">
                                        No upcoming appointments.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {upcoming.map((a) => (
                                            <AppointmentCard
                                                key={a.resource.id}
                                                resource={a.resource}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <h3 className="text-base font-medium text-gray-700 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">
                                    Past Appointments
                                </h3>
                                {past.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">
                                        No past appointments.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {past.map((a) => (
                                            <AppointmentCard
                                                key={a.resource.id}
                                                resource={a.resource}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListAppointments;
