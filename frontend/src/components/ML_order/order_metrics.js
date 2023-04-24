import React,{ useState, useRef } from "react"
import {TopThreeTable, OrderbyCustomerTable, TopItemsByMonth,TopThreeOrderCombo, TopTwoOrderCombo} from "./ML_helper_functions";



const ML_order_function = () => {
    const [orderCustomerResponse, setOrderCustomerResponse] = useState(null);
    const isOrderDataFetchedRef = useRef(null); 

    const [top3CustomerResponse, settop3CustomerResponse] = useState(null);
    const istop3CustomerDataFetchedRef = useRef(null); 

    const [itemsByMonth, setItemsByMonth] = useState(null);
    const isItemsByMonthFetchedRef = useRef(null);

    const [threeItemOrderComboResponse, setthreeItemOrderComboResponse] = useState(null);
    const isthreeItemOrderComboFetchedRef = useRef(null);

    const [twoItemOrderComboResponse, settwoItemOrderComboResponse] = useState(null);
    const istwoItemOrderComboFetchedRef = useRef(null);


    
    
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


    //top items by month
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

    //apriori algorithm for 3 items bought together
    const handleThreeItemOrderCombo = async() => {
      try{
        const response = await fetch('http://localhost:8000/items_bought_together/');
        if(response.status<200 || response.status>299){
          throw Error('couldnt reach server or no response');
        }
        const threeItemOrderCombo = await response.json();
        console.log(threeItemOrderCombo);
        setthreeItemOrderComboResponse(threeItemOrderCombo);
        isthreeItemOrderComboFetchedRef.current = true;
      }
      catch(error){
        console.log(error);
      }
    };

    const handlethreeItemOrderComboClick = () => {
      if (!isthreeItemOrderComboFetchedRef.current) {
        handleThreeItemOrderCombo();
      }
    };

    //apriori algorithm for 2 items bought together
    const handleTwoItemOrderCombo = async() => {
      try{
        const response = await fetch('http://localhost:8000/items_bought_together/');
        if(response.status<200 || response.status>299){
          throw Error('couldnt reach server or no response');
        }
        const twoItemOrderCombo = await response.json();
        console.log(twoItemOrderCombo);
        settwoItemOrderComboResponse(twoItemOrderCombo);
        istwoItemOrderComboFetchedRef.current = true;
      }
      catch(error){
        console.log(error);
      }
    };
      const handletwoItemOrderComboClick = () => {
      if (!istwoItemOrderComboFetchedRef.current) {
        handleTwoItemOrderCombo();
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
              <div>
              <button className="button is-primary" onClick={handlethreeItemOrderComboClick} >Top three item combo</button> 
              {threeItemOrderComboResponse && <TopThreeOrderCombo topthreecomboorders ={threeItemOrderComboResponse}/> } 
              </div>
              <div>
              <button className="button is-primary" onClick={handletwoItemOrderComboClick} >Top item combos</button> 
              {twoItemOrderComboResponse && <TopTwoOrderCombo toptwocomboorders ={twoItemOrderComboResponse}/> } 
              </div>
        </div>
      );
}
export default ML_order_function