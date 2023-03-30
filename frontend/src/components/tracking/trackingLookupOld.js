import React, { useState } from "react";
import OutputBox from "./trackingOutPutBox";

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


function InputToOutput() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    
    if(inputValue == "1Z5338FF0107231059")
      setOutputValue("Status: Delivery Attempted");
    else
    setOutputValue("Error: Please enter valid tracking number"); 
    setShowTextBox(true);
    
    };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if(inputValue == "1Z5338FF0107231059")
      setOutputValue("Status:Delivery Attempted");
    else
    setOutputValue("Error: Please enter valid tracking number"); 
    }
    setShowTextBox(true);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div style = {{border: "2px solid black"}}>
      <h1 style={{ textDecoration: 'underline', background: '#d3d3d3' }}>Tracking Number Lookup</h1>
      <br/>
      <br/>
      <br/>
      <div>
      <label htmlFor="carrier-select">Select a carrier:</label>
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

//<input type="text" id="input" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} />
//<label htmlFor="input">Enter input:</label>

export default InputToOutput;
