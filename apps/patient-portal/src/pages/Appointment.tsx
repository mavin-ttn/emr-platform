import axios from "axios";
import { useEffect } from "react";

const Appointment = () => {
  useEffect(() => {
    getBookingData();
  }, []);

  const getBookingData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No access token found!");
      return;
    }

    const body = {
      resourceType: "Parameters",
      parameter: [
        {
          name: "startTime",
          valueDateTime: "2025-05-01",
        },
        {
          name: "endTime",
          valueDateTime: "2025-05-02",
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/Appointment/$find`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("booking data - >", data);
    } catch (err) {
      console.error("Failed to fetch booking data:", err);
    }
  };
  return <div>Appointment</div>;
};

export default Appointment;
