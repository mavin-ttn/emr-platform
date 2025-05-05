import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

interface SlotData {
  id: string;
  start: string;
  end: string;
}

interface Patient {
  id: string;
  name: string;
}

interface BookAppointmentProps {
  slotData: SlotData;
  onClose: () => void;
  patients: Patient[];
}

interface FormData {
  patientId: string;
  appointmentId: string;
  appointmentNote: string;
}

const initialFormData: FormData = {
  patientId: "",
  appointmentId: "",
  appointmentNote: "",
};

const BookAppointment: React.FC<BookAppointmentProps> = ({
  slotData,
  onClose,
  patients,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (slotData) {
      setFormData((prev) => ({
        ...prev,
        appointmentId: slotData.id,
      }));
    }
  }, [slotData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3007/v2/book-appointment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage = `Appointment booked for ${
        selectedPatient?.name
      } on ${moment(slotData?.start).format("dddd, MMMM D, YYYY")} at ${moment(
        slotData?.start
      ).format("hh:mm A")} -
            ${moment(slotData?.end).format("hh:mm A")}`;

      toast.success(successMessage);
      console.log(successMessage, response.data);
      onClose();
    } catch (err) {
      toast.error("Failed to book appointment!");
      console.error("Failed to book appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl animate-fade-in">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          🩺 Book Your Appointment
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-md text-blue-700 font-medium">
            📅 {moment(slotData?.start).format("dddd, MMMM D, YYYY")}
          </p>
          <p className="text-md text-blue-700">
            ⏰ {moment(slotData?.start).format("hh:mm A")} -{" "}
            {moment(slotData?.end).format("hh:mm A")}
          </p>
        </div>

        <div className="space-y-4">
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Patient
            </label>
            <input
              type="text"
              placeholder="Type to search..."
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
                      setFormData((prev) => ({
                        ...prev,
                        patientId: patient.id,
                      }));
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Note
            </label>
            <textarea
              name="appointmentNote"
              value={formData.appointmentNote}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add any relevant details..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleBookAppointment}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
