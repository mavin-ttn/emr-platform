import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

const Appointment = () => {

  const [startDate, setStartDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(moment().add(1, "days").format("YYYY-MM-DD"));
  const [slots, setSlots] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSlots = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No access token found!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3007/v2/find-appointments`,
        {
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("booking data - >", data);
      setSlots(data.entry || []);
    } catch (err) {
      console.error("Failed to fetch booking data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    console.log("Booking slot:", slotId);
  };

  useEffect(() => {
    getSlots();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Book Appointment</h1>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={getSlots}
            disabled={loading || !startDate || !endDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Search Slots"}
          </button>
        </div>
      </div>

      {slots.length > 0 ? (
        <div className="grid gap-4">
          {slots.map((slot) => (
            <div
              key={slot.resource.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  Date: {new Date(slot.resource.start).toLocaleDateString()}
                </p>
                <p>
                  Time: {new Date(slot.resource.start).toLocaleTimeString()} -{" "}
                  {new Date(slot.resource.end).toLocaleTimeString()}
                </p>
                <p>Status: {slot.resource.status}</p>
              </div>
              <button
                onClick={() => handleBookSlot(slot.resource.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Book Slot
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          {loading ? "Loading slots..." : "No slots available"}
        </p>
      )}
    </div>
  );
};

export default Appointment;
