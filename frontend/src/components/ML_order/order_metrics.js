import React,{ useState } from "react";


const ML_order_function = () => {
    const [orderCustomerResponse, setOrderCustomerResponse] = useState(null)
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
        }
        catch(error){
            console.error(error)
        }
    };
    handleOrderByCustomer();


    return (
        <div>
          <br/>
          <br/>
          <form >
            <label>
              Metrics 
              <button className="button is-primary" onClick={handleOrderByCustomer} >Orders by Customer</button>
              <button className="button is-primary" >top 3 customers</button>
              {orderCustomerResponse && (
                <div>
                    <pre>{JSON.stringify(orderCustomerResponse, null, 4)}</pre>
                </div>
              )}
             
            </label>
          </form>
        </div>
      );
}
export default ML_order_function