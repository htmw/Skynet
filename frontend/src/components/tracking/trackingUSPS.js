import React, { useState } from "react";
import axios from 'axios';

import './trackingstyle.css';

function TrackingUSPS() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const apiKey = "289TEAMS3765";
  const apiUrl = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID='${apiKey}'><TrackID ID='${trackingNumber}'></TrackID></TrackRequest>`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl);
      const xmlString = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      const errorElement = xmlDoc.getElementsByTagName("Error");
      if (errorElement.length > 0) {
        const errorMessage = errorElement[0].getElementsByTagName("Description")[0].textContent;
        throw new Error(errorMessage);
      }

      const trackDetails = xmlDoc.getElementsByTagName("TrackDetail");

      const trackingData = [];
      for (let i = 0; i < trackDetails.length; i++) {
        const eventDate = trackDetails[i].getElementsByTagName("EventDate")[0].childNodes[0].nodeValue;
        const eventTime = trackDetails[i].getElementsByTagName("EventTime")[0].childNodes[0].nodeValue;
        const eventDescription = trackDetails[i].getElementsByTagName("Event")[0].childNodes[0].nodeValue;
        trackingData.push({ eventDate, eventTime, eventDescription });
      }
      setTrackingInfo(trackingData);
      setIsLoading(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching tracking data", error);
      setIsLoading(false);
      setErrorMessage(error.message || "An error occurred while fetching tracking data. Please try again later.");
    }
  };

  return (
    <div class = "tracking-output">
      <h1 class = "tracking-header" >USPS Tracking Number Lookup</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Track Package"}
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {trackingInfo && (
        <div>
          <h3>Tracking information for {trackingNumber}</h3>
          <ul>
            {trackingInfo.map((event) => (
              <li key={event.eventDate + event.eventTime + event.eventDescription}>
                {event.eventDate} - {event.eventTime} - {event.eventDescription}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrackingUSPS;
