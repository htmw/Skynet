import React,{ useState, useRef } from "react"
import {TopThreeTable, OrderbyCustomerTable, TopItemsByMonth} from "./ML_helper_functions";



const ML_order_function = () => {
    const [orderCustomerResponse, setOrderCustomerResponse] = useState(null);
    const isOrderDataFetchedRef = useRef(null); 

    const [top3CustomerResponse, settop3CustomerResponse] = useState(null);
    const istop3CustomerDataFetchedRef = useRef(null); 

    const [itemsByMonth, setItemsByMonth] = useState(null);
    const isItemsByMonthFetchedRef = useRef(null);

    
    
    //order number by customer
    const handleOrderByCustomer = async() =>{
        try{
            //connect to Django endpoint
            const response = await fetch('http://localhost:8000/order_number_by_customer/');
                if(response.status<200 || response.status>299){
                    throw Error('couldnt reach server or no response');
                }
            
            //assign json response to a variable
            const OCdata = await response.json();
            setOrderCustomerResponse(OCdata);
            isOrderDataFetchedRef.current = true;
        }
        catch(error){
            console.error(error);
        }
    };



    const handleOrderButtonClick = () => {
      if (!isOrderDataFetchedRef.current) {
        handleOrderByCustomer();
      }
    };
    
    //top 3 customers
    const handleTopThreeCustomer = async() => {
      try{
        const response = await fetch('http://localhost:8000/top_customers/');
          if(response.status<200 || response.status>299){
            throw Error('couldnt reach server or no response');
          }

          const top3Data = await response.json();
          settop3CustomerResponse(top3Data);
          istop3CustomerDataFetchedRef.current = true;
      }
      catch(error){
        console.error(error);
      }
    };

    const handleTopThreeButtonClick = () => {
      if (!istop3CustomerDataFetchedRef.current) {
        handleTopThreeCustomer();
      }
    };

    const handleItemByMonth = async() => {
      try{
        const response = await fetch('http://localhost:8000/items_by_month/');
        if(response.status<200 || response.status>299){
          throw Error('couldnt reach server or no response');
        }
        const itemsByMonthData = await response.json();
        console.log(itemsByMonthData);
        setItemsByMonth(itemsByMonthData);
        isItemsByMonthFetchedRef.current = true;
      }
      catch(error){
        console.log(error);
      }
    };

    const handleItemByMonthClick = () => {
      if (!isItemsByMonthFetchedRef.current) {
        handleItemByMonth();
      }
    };


 

    return (
        <div>
          <br/>
          <br/>
              Metrics 
              <div>
                <button className="button is-primary" onClick={handleOrderButtonClick} >Orders by Customer</button>
                {orderCustomerResponse && <OrderbyCustomerTable customers ={orderCustomerResponse}/>
                }
              </div>
              <div>
                <button className="button is-primary" onClick={handleTopThreeButtonClick} >Top 3 Customers</button>
                {top3CustomerResponse && <TopThreeTable datas = {top3CustomerResponse}/>}
              </div>
              <div>
                <button className="button is-primary" onClick={handleItemByMonthClick} >Top items by month</button> 
                {itemsByMonth && <TopItemsByMonth items ={itemsByMonth}/> }
              </div>
        </div>
      );
}
export default ML_order_function