import React, { useState } from "react";
import axios from 'axios';
import './trackingstyle.css';



function TrackingUPS() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [status, setStatus] = useState('');
  
    const handleTrackingNumberChange = (event) => {
      setTrackingNumber(event.target.value);
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.get(`https://wwwcie.ups.com/track/api/Track/GetStatus?loc=en_US&tracknum=${trackingNumber}`);
        setStatus(response.data.TrackResponse.Shipment.Package.Activity[0].Status.StatusType.Description);
      } catch (error) {
        setStatus('Error: Unable to retrieve tracking information.');
      }
    };
  
    return (
      <div >
        <h1 class="tracking-header">UPS Tracking</h1>
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
  
  export default TrackingUPS;