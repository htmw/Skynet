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
              <input type="text" name = 'state' value={state} onChange={(event) => setState(event.target.value)} />
            </label>
            <br/>
            <label className='verify-style'>
              Zip: 
              <input type="text" name = 'zipCode' value={zipCode} onChange={(event) => setZipCode(event.target.value)} />
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