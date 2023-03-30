import React, { useState } from 'react';
import axios from 'axios';

function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState('');

  const handleTrackingNumberChange = (event) => {
    setTrackingNumber(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`https://onlinetools.ups.com/track/v1/details/${trackingNumber}`, {
        headers: {
          "AccessLicenseNumber": 'vBp1ER70HisKWtX5jr7GNyrdhhCrmrkNtQIRADaYAfAhwQhS',
          "Content-Type": "application/json"
        }
      });
      setStatus(response.data.trackDetails[0].shipmentProgressActivities[0].statusType.description);
    } catch (error) {
      setStatus('Error: Unable to retrieve tracking information.');
    }
  };

  return (
    <div class = "tracking-output">
      <h1 class = "tracking-header">UPS Tracking</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Tracking Number:
          <input type="text" value={trackingNumber} onChange={handleTrackingNumberChange} />
        </label>
        <button type="submit">Track</button>
      </form>
      {status && <div>Status: {status}</div>}
    </div>
  );
}

export default TrackingPage;
