import React, { useState } from 'react';
import axios from 'axios';
import logo from '../tracking/Logos/LOGO_S.jpg';
import './addressVerifyUPS.css';


function AdressVerifyUPS(){
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [verifyUPSAddress, setVerifyUPSAddress] = useState('');
   
    function getCookie(name) {
      const value = `; ${document.cookie}`; // gets all the cookies from the page of the web browser
      const parts = value.split(`; ${name}=`); // splits on string on the name of the cookie
      if (parts.length === 2) 
        return parts.pop().split(';').shift(); 
    }



     //function that will handle submission
    //use post instead of get to not send sensitive data through the URL
    const handleSubmit = async (event) => {

      const csrfToken = getCookie('csrftoken');
      
      event.preventDefault(); //stops the page from refreshing and allows an AJAX request to be sent instead
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      };
      const body = {
        streetNumber: streetNumber,
        city: city,
        state: state,
        zipCode: zipCode,
      };
      const response = await axios.post('http://localhost:8000/address_verify_UPS/', body, {headers: headers} )
      setVerifyUPSAddress(response.data.verification_status)
      
    }

    const states = [
      { value: '', label: 'Select a state' },
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' }
    ];
    

    return (
        <div>
          <img src={logo} />
          <br/>
          <br/>
          <form onSubmit={handleSubmit}>
            <label className='verify-style'>
              Street number and name: 
              <input type="text" name = "streetNumber" value={streetNumber} onChange={(event) => setStreetNumber(event.target.value)}  size={100} />
            </label>
            <br/>
            <label className='verify-style'>
              City: 
              <input type="text" name = 'city' value={city} onChange={(event) => setCity(event.target.value)} />
            </label>
            <br/>
            <label className='verify-style'>
              State: 
              <select name='state' value={state} onChange={(event) => setState(event.target.value)}>
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                   {state.label}
                  </option>
                ))}
              </select>
            </label>
            <br/>
            <label className='verify-style'>
              Zip: 
              <input type="text" name = 'zipCode' value={zipCode} maxLength={5} onChange={(event) => setZipCode(event.target.value)} />
            </label>
            <br/>
            <button type="submit">Verify</button>
          </form>
          <div>
            <pre>{verifyUPSAddress}</pre>
          </div>
        </div>
      );
    
}

export default AdressVerifyUPS;