import React, { useEffect, useRef, useState } from "react";
import Print from 'react-print-html'
import './cash.css';

export default function Cash() {
  const [items, setItems] = React.useState([]);
  let printTemp = useRef(null)
  const [total, setTotal] = React.useState(0.0);
  const [dateStr, setDateStr] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [arr, setArr] = React.useState([]);

  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return JSON.parse(tokenString);

  }
  React.useEffect(() => {
    listItem();
    let d = new Date();
    setDateStr(d.toUTCString());
  }, []);



  const listItem = () => {
    let url = "http://localhost:8000/item";
    fetch(url, {
      headers: new Headers({
        'Authorization': 'Bearer ' + getToken()
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      }).catch((error) => {
        console.log('error: ' + error);
        // this.setState({ requestFailed: true });
      });
  }

  const addItem = () => {
    // console.log(123);
    var lists = arr.concat();
    lists.push({"itemId": "", "quantity": 1, "note": "", sellingPrice : 0.0, "id":-1})
    setTimeout(() => {
      setArr(lists);
      // console.log(lists);
    }, 0)
  }

  const delItem = (index) => {
    // console.log(333);
    var lists = arr.concat();
    lists.splice(index, 1)
    setTimeout(() => {
      setArr(lists);
      // console.log(lists);
    }, 0)
  }

  const setQuantity = (value, index) => {
    // console.log(value, index);
    var lists = arr.concat();
    lists[index]['quantity'] = value;
    setTimeout(() => {
      setArr(lists);
      // console.log(lists);
      let sum  = 0;
      for(let i = 0; i < lists.length; i++){
        sum += lists[i]['sellingPrice'] * lists[i]['quantity']
      }
      setTotal(sum);
    }, 0)
  }

  const setItemId = (index2, index) => {
    var lists = arr.concat();
    // console.log(index2, index, lists[index], items[index2]);
    if(index2 == -1){
      lists[index]['itemId'] = "";
      lists[index]['id'] = -1;
      lists[index]['note'] = "";
      lists[index]['sellingPrice'] = "";
    }else{
      lists[index]['id'] = index2;
      lists[index]['itemId'] = items[index2].itemID;
      lists[index]['note'] = items[index2].note;
      lists[index]['sellingPrice'] = items[index2].sellingPrice;
    }
    setTimeout(() => {
      let sum  = 0;
      for(let i = 0; i < lists.length; i++){
        sum += lists[i]['sellingPrice'] * lists[i]['quantity']
      }
      setTotal(sum);
      setArr(lists);
    }, 0)
  }

  const cash = () => {
    let lists = arr.concat();
    let data = []
    for(let i = 0; i < lists.length; i++){
      if(lists[i]['itemId'] == ''){
        alert("please select item")
        return;
      }
      data.push(lists[i]);
    }
    fetch("http://localhost:8000/cash/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + getToken(),
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if(data.code == 0){
            alert(data.msg)
          }else{
            alert(data.msg)
          }
          window.location.reload();
    });
  }

  const print = () => {
    // window.print();
    setTimeout(() => {
      Print(printTemp.current)
    })
  }

  
  // loading
  if (loading) {
    return <div>Loading...</div>;
  }

  const start = `<!--startprint-->`
  const end = `<!--endprint-->`

  return (
    <div>
        <div className="cash_div" id="cash_div" ref={printTemp}>
        <header>
          <h1 className="cash-header">Invoice</h1>
          <address >
            <p>One Pace Plaza</p>
            <p>New York, NY 10038</p>
          </address>
          {/* <span><img alt="" src="http://www.jonathantneal.com/examples/invoice/logo.png" /><input type="file" accept="image/*" /></span> */}
        </header>
        <article>
          <h1>Recipient</h1>
          <address >
            <p>Some Company<br/>c/o Some Guy</p>
          </address>
          <table className="meta">
            <tbody>
              <tr>
                <th><span >Invoice #</span></th>
                <td><span >101138</span></td>
              </tr>
              <tr>
                <th><span >Date</span></th>
                <td><span >{dateStr}</span></td>
              </tr>
              <tr>
                <th><span >Amount Due</span></th>
                <td><span id="prefix" >$</span><span>{total}</span></td>
              </tr>
            </tbody>
          </table>
          <div>
              <button className="addBtn" onClick={addItem}>+</button>
              {/* {arr.length} */}
          </div>
          <table className="inventory">
            <thead>
              <tr>
                <th><span >Item</span></th>
                <th><span >Description</span></th>
                <th><span >Rate</span></th>
                <th><span >Quantity</span></th>
                <th><span >Price</span></th>
              </tr>
            </thead>
            <tbody>
              {
                arr.map((e, index) => (
                  <tr key={index}>
                    <td>
                      <button className="cutBtn" onClick={() => delItem(index)}>-</button>
                      <select name="" id="" value={e.id} onChange={e => setItemId(e.target.value, index)}>
                        <option value="-1"></option>
                        {items.map((i, index2) => (
                          <option key={index2} value={index2}>{i.description}</option>
                        ))}
                      </select>
                    </td>
                    <td><span >{e.note}</span></td>
                    <td><span data-prefix>$</span><span >{e.sellingPrice}</span></td>
                    <td><span ><input value={e.quantity} type="number" min="1" onChange={e => setQuantity(e.target.value, index)}/></span></td>
                    <td><span data-prefix>$</span><span>{e.sellingPrice * e.quantity}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {/* <a className="add">+</a> */}
          <table className="balance">
            <tbody>
              <tr>
                <th><span >Total</span></th>
                <td><span data-prefix>$</span><span>{total}</span></td>
              </tr>
              <tr>
                <th><span >Amount Paid</span></th>
                <td><span data-prefix>$</span><span >0.00</span></td>
              </tr>
              <tr>
                <th><span >Balance Due</span></th>
                <td><span data-prefix>$</span><span>{total}</span></td>
              </tr>
            </tbody>
          </table>
        </article>
        <div>
            <button className="cash" onClick={cash}>Submit</button>
            <button className="print" onClick={print}>Print</button>
        </div>
        <aside>
          <h1><span >Additional Notes</span></h1>
          <div >
            <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
          </div>
        </aside>
      </div>
    </div>
    
  );
}