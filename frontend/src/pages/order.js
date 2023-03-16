import React from "react";

export default function Order() {

  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
  return JSON.parse(tokenString);

}
  let formDatas = {
    orderID: "",
    itemID: "",
    quantity: "",
    orderDate: "",
    orderPrice: "",
    customerID: "",
    shipID: "",
  };
  React.useEffect(() => {
    fetch("http://localhost:8000/order",{
      headers: new Headers({
        'Authorization': 'Bearer '+ getToken()
    })
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        orders.map((order) => {});
        setLoading(false);
      }).catch((error) => {
        console.log('error: ' + error);
        // this.setState({ requestFailed: true });
      });
  }, []);
  const inputChanged = (event) => {
    formDatas[event.target.name] = event.target.value;
  };
  function resetForm() {
    document.getElementById("orderForm").reset();
    formDatas = {
      orderID: "",
      itemID: "",
      quantity: "",
      orderDate: "",
      orderPrice: "",
      customerID: "",
      shipID: "",
    };
  }
  const handleSubmit = (event) => {
    submitForm(formDatas);
  };
  const editOrder = (orderID) => {
    console.log(orderID);
    console.log("edit");
    fetch("http://localhost:8000/order/find/" + orderID,{

        headers: new Headers({
          'Authorization': 'Bearer '+ getToken()
      })
    })
      .then((res) => res.json())
      .then((data) => {
        formDatas.orderID = data.orderID;
        formDatas.itemID = data.itemID;
        formDatas.quantity = data.quantity;
        formDatas.orderDate = data.orderDate;
        formDatas.orderPrice = data.orderPrice;
        formDatas.customerID = data.customerID;
        formDatas.shipID = data.shipID;
        console.log(formDatas);
        addOrder();
      });

  };
  function deleteOrder(orderID) {
    let confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      fetch("http://localhost:8000/order/delete/" + orderID, {
        method: "DELETE",
        headers: new Headers({
          'Authorization': 'Bearer '+ getToken()
      })
      }).then((res) => {
        if (res.ok) {
          alert("Order deleted");
          window.location.reload();
        }
      });
    }

  };
  const saveChanges = () => {
    // get the values from the form
    console.log("saving changes");
    submitForm(formDatas);
    // reload the page
    closeModal();
    // window.location.reload();

  };
  function getOrder(orderID) {
    fetch("http://localhost:8000/order/find/" + orderID)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      }
      );
  };

  function submitForm(datas) {
    if (datas.orderID === "") {
      fetch("http://localhost:8000/order/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+ getToken(),
        },
        body: JSON.stringify(datas),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          resetForm();
          window.location.reload();
        });
    } else {
    fetch("http://localhost:8000/order/update/" + datas.orderID+"/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ getToken(),
      },
      body: JSON.stringify(datas),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resetForm();
        window.location.reload();
      // });
    });
  }

  }

  const addOrder = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    // set the values of the form
    for(let key in formDatas) {
      try {
      document.getElementById(key).value = formDatas[key];

      } catch (error) {
        console.log(error);
      }
    }

  };
  const closeModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
  };
  // loading
  if (loading) {
    return <div>Loading...</div>;
  }

    return (
  <div>
    <div>
      <h1 className="title is-1">Order</h1>
      {/* add button */}
      <button className="button is-primary" onClick={addOrder}>Add Order</button>
      {/* button that redirects to the item visualization page */}
      <a href="/orderchart">
          <button className="button is-primary" >Visualize</button>
        </a>
    </div>

      <div className="data-table">
      <table className="my-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Item ID</th>
          <th>Quantity</th>
          <th>Order Date</th>
          <th>Order Price</th>
          <th>Customer ID</th>
          <th>Ship ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>

        {orders.map((order, i) => (
          <tr key={i}>
            <td>{i+1}</td>
            <td>{order.itemID}</td>
            <td>{order.quantity}</td>
            <td>{order.orderDate}</td>
            <td>{order.orderPrice}</td>
            <td>{order.customerID}</td>
            <td>{order.shipID}</td>
            <td>
              <button className="button is-warning is-fullwidth" onClick={() => editOrder(order.orderID)}>Edit</button>
              <button className="button is-danger is-fullwidth" onClick={() => deleteOrder(order.orderID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

 <div id="myModal" className="modal">
    <div className="modal-content">
      <header className="modal-header">
        <p className="modal-card-title">Add Order</p>
        <button className="button delete is-danger" aria-label="close" onClick={closeModal}>X</button>
      </header>
      <section className="modal-body">
        <form id="orderForm">
          <div className="field">
            <label className="label">Item ID</label>
            <div className="control">
              <input className="input" type="text"  name="itemID" id="itemID" onChange={inputChanged} placeholder="Item ID" />
            </div>
            </div>
            <div className="field">
            <label className="label">Quantity</label>
            <div className="control">
              <input className="input" type="text" name="quantity" id="quantity"  onChange={inputChanged} placeholder="Quantity" />
              </div>
              </div>
              <div className="field">
            <label className="label">Order Date</label>
            <div className="control">
              <input className="input" type="tel" name="orderDate" id="orderDate"  onChange={inputChanged} placeholder="Order Date" />
              </div>
              </div>
              <div className="field">
            <label className="label">Order Price</label>
            <div className="control">
              <input className="input" type="text" name="orderPrice" id="orderPrice"  onChange={inputChanged} placeholder="Order Price" />
              </div>
              </div>
              <div className="field">
            <label className="label">Customer ID</label>
            <div className="control">
              <input className="input" type="text" name="customerID" id="customerID"  onChange={inputChanged} placeholder="Customer ID" />
              </div>
              </div>
              <div className="field">
            <label className="label">Ship ID</label>
            <div className="control">
              <input className="input" type="text" name="shipID" id="shipID"  onChange={inputChanged} placeholder="Ship ID" />
              </div>
              </div>
        </form>
      </section>
      <footer className="modal-footer">
        <button className="button is-success" onClick={saveChanges}>Save changes</button>
        <button className="button is-danger" onClick={closeModal}>Cancel</button>
      </footer>

      </div>
      </div>
  </div>
    );
}