import { useState } from 'react';
import axios from 'axios';
import logo from './Logos/LOGO_S.jpg'



function TrackingUPS() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:8000/tracking_UPS/${trackingNumber}`);
    setStatusDescription(response.data.join('\n'));
  };

  const handleChange = (event) => {
    setTrackingNumber(event.target.value);
  };

  return (
    <div>
      <img src={logo} />
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>
          Tracking number: 
          <input type="text" value={trackingNumber} onChange={handleChange} />
        </label>
        <button type="submit">Track</button>
      </form>
      <div>
        <pre>{statusDescription}</pre>
      </div>
    </div>
  );
}

export default TrackingUPS;