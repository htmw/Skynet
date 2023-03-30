import React, { useState } from "react";


const outputBoxStyles = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  position: "relative"
};

const closeButtonStyles = {
  position: "absolute",
  top: 0,
  right: 0
};


function TrackingRedirect() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleButtonClick = () => {
    

    if(selectedOption == "ups"){
      setShowTextBox(true);
      setOutputValue("redirecting to UPS");
      window.location.href = '/trackingUPS';
      }
    else if (selectedOption== "usps"){
      setShowTextBox(true);
      setOutputValue("redirecting to USPS");
      window.location.href = '/trackingUSPS';
      }
    
    };

    const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div class = "tracking-output">
      <div>
      <h1 class = "tracking-header">Tracking</h1>
      <label htmlFor="carrier-select">Select a carrier:&nbsp;&nbsp;&nbsp;</label>
      <select id="instrument-select" value={selectedOption} onChange={handleOptionChange}>
        <option value=""></option>
        <option value="usps">USPS</option>
        <option value="ups">UPS</option>
      </select>
      </div>
      
      
      <button onClick={handleButtonClick}>Submit</button>
      {showTextBox && (
      <div style={{ color: "black", marginLeft: "0px", marginTop: "10px", width: "25%", background: "#d3d3d3", border: "2px solid black", padding: "10px" }}>{outputValue}</div>
      )}
    </div>
  );
}


export default TrackingRedirect;
