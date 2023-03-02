import React, { useState } from "react";

function OutputBox(props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="output-box">
          <button className="close-button" onClick={handleClose}>
            X
          </button>
          <p>{props.output}</p>
        </div>
      )}
    </>
  );
}

export default OutputBox;


//function lookupUpsTrackingNumber(trackingNo) {
//  // Set the URL for the UPS tracking API
//  const trackingApiUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';
//
//  // Send the request to UPS API
//  const requestOptions = {
//    method: 'POST',
//    headers: {
//      'Content-Type': 'application/json'
//    },
//    body: JSON.stringify({
//      Locale: 'en_US',
//      Requester: 'UPSHome',
//      TrackingNumber: [trackingNo]
//    })
//  };
//
//  // Make a request to the UPS tracking API to get the tracking information
//  const response = fetch(trackingApiUrl, requestOptions);
//
//  // Process the response to extract the tracking information
//  const trackingInfo = response.trackingInfo;
//
//  // Return the tracking information
//  return trackingInfo;
//
//}

