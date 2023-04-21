import React,{ useState, useRef } from "react"



const ML_order_function = () => {
    const [orderCustomerResponse, setOrderCustomerResponse] = useState(null);
    const isOrderDataFetchedRef = useRef(null); 
    
    
    //order number by customer
    const handleOrderByCustomer = async() =>{
        try{
            //connect to Django endpoint
            const response = await fetch('http://localhost:8000/order_number_by_customer/');
                if(response.status<200 || response.status>299){
                    throw Error('couldnt reach server or no response');
                }
            
            //assign json response to a variable
            const data = await response.json();
            setOrderCustomerResponse(data);
            isOrderDataFetchedRef.current = true;
        }
        catch(error){
            console.error(error)
        }
    };

    const handleOrderButtonClick = () => {
      if (!isOrderDataFetchedRef.current) {
        handleOrderByCustomer();
      }
    };

 

    return (
        <div>
          <br/>
          <br/>
              Metrics 
              <div>
                <button className="button is-primary" onClick={handleOrderButtonClick} >Orders by Customer</button>
                <pre>{JSON.stringify(orderCustomerResponse, null, 4)}</pre>
              </div>
        </div>
      );
}
export default ML_order_function