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
   
    
     //function that will handle submission
    //use post instead of get to not send sensitive data through the URL
    const handleSubmit = async (event) => {

       

        try {
            event.preventDefault(); //stops the page from refreshing and allows an AJAX request to be sent instead
            const response = await axios.post('http://localhost:8000/verify_Address_UPS', {streetNumber, city, state, zipCode})
            setVerifyUPSAddress(response)
        } catch(error){
            console.error(error);
            setVerifyUPSAddress('Error verifying address');
        }
    }

    const handleChange = (event) => {
        const {field, value} = event.target;
        if(field == 'streetNumber')
            setStreetNumber(value)
        if(field == 'city')
            setCity(value)
        if(field == 'state')
            setState(value)        
        if(field == 'zipCode')
            setZipCode(value)
            


        
      };

    return (
        <div>
          <img src={logo} />
          <br/>
          <br/>
          <form onSubmit={handleSubmit}>
            <label className='verify-style'>
              Street number and name: 
              <input type="text" name = "streetNumber" onBlur={handleChange} size={100} />
            </label>
            <br/>
            <label className='verify-style'>
              City: 
              <input type="text" name = 'city' onBlur={handleChange} />
            </label>
            <br/>
            <label className='verify-style'>
              State: 
              <input type="text" name = 'state' onBlur={handleChange} />
            </label>
            <br/>
            <label className='verify-style'>
              Zip: 
              <input type="text" name = 'zipCode' onBlur={handleChange} />
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