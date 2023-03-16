import React, { useEffect, useRef, useState } from "react";
// import Quagga from 'quagga'
import { useScanner } from "../components/useScanner";
let lock = false;

export default function Item() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [note, setNote] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [classification, setClassification] = useState('');
  const [classifyArr, setClassifyArr] = useState([])
  const { start } = useScanner();

  const [costOrder, setCostOrder] = useState(undefined);
  const [priceOrder, setPriceOrder] = useState(undefined);
  const [classification2, setClassification2] = useState(undefined);

  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return JSON.parse(tokenString);

  }
  let formDatas = {
    itemID: "",
    description: "",
    cost: "",
    sellingPrice: "",
    note: "",
    supplierID: "",
    Classification: "",
  };
  React.useEffect(() => {
    listItem();
  }, []);

  const costChanged = (event) => {
    // console.log(event.target.value);
    setCostOrder(event.target.value);
  };

  const priceChanged = (event) => {
    // console.log(event.target.value);
    setPriceOrder(event.target.value);
  };

  const classificationChanged = (event) => {
    // console.log(event.target.value);
    setClassification2(event.target.value);
  };


  const listItem = () => {
    let url = "http://localhost:8000/item?";
    if(costOrder && costOrder != ''){
      url += "costOrder=" + costOrder;
    }
    if(priceOrder && priceOrder != ''){
      url += "priceOrder=" + priceOrder;
    }

    if(classification2 && classification2 != ''){
      url += "classification=" + classification2;
    }

    fetch(url, {
      headers: new Headers({
        'Authorization': 'Bearer ' + getToken()
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        let classify = [];
        data.map((item) => { 
            if(classify.indexOf(item.classification) == -1){
              classify.push(item.classification);
            }
        });
        setClassifyArr(classify);
        setLoading(false);
      }).catch((error) => {
        console.log('error: ' + error);
        // this.setState({ requestFailed: true });
      });
  }

  const inputChanged = (event) => {
    formDatas[event.target.name] = event.target.value;
  };
  function resetForm() {
    document.getElementById("itemForm").reset();
    formDatas = {
      itemID: "",
      description: "",
      cost: "",
      sellingPrice: "",
      note: "",
      supplierID: "",
      classification: "",
    };
  }
  const handleSubmit = (event) => {
    submitForm(formDatas);
  };
  const editItem = (itemID) => {
    console.log(itemID);
    console.log("edit");
    fetch("http://localhost:8000/item/find/" + itemID, {

      headers: new Headers({
        'Authorization': 'Bearer ' + getToken()
      })
    })
      .then((res) => res.json())
      .then((data) => {
        formDatas.itemID = data.itemID;
        formDatas.description = data.description;
        formDatas.cost = data.cost;
        formDatas.sellingPrice = data.sellingPrice;
        formDatas.note = data.note;
        formDatas.supplierID = data.supplierID;
        formDatas.Classification = data.Classification;
        console.log(formDatas);
        addItem();
      });

  };
  function deleteItem(ItemID) {
    let confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      fetch("http://localhost:8000/item/delete/" + ItemID, {
        method: "DELETE",
        headers: new Headers({
          'Authorization': 'Bearer ' + getToken()
        })
      }).then((res) => {
        if (res.ok) {
          alert("Item deleted");
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
  function getItem(itemID) {
    fetch("http://localhost:8000/item/find/" + itemID)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      }
      );
  };

  function submitForm(datas) {
    if (datas.itemID === "") {
      fetch("http://localhost:8000/item/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + getToken(),
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
      fetch("http://localhost:8000/item/update/" + datas.itemID + "/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + getToken(),
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

  const addItem = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    // set the values of the form
    for (let key in formDatas) {
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

  const handleScan = () => {
    start((code) => {
      if (code && !lock) {
        lock = true;
        fetch(`https://barcode-look-api.herokuapp.com/product/${code}`)
          .then(res => {
            if (res.status === 404) {
              alert('Not found');
              return;
            }
            return res.json();
          })
          .then(data => {
            // result
            if (data && Array.isArray(data.products) && data.products.length > 0) {
              const product = data.products[0];
              const description = product.description;
              const title = product.title;
              const prices = product.stores.map(item => Number(item.price));
              const classification = product.category.split(' > ');
              const avgPrice = prices.reduce((prev, next) => prev + next, 0) / prices.length;
              setNote(description);
              setDescription(title);
              setSellingPrice(avgPrice.toFixed(2));
              setClassification(classification.join(' - '));
            }
          }).catch(err => {
            console.log(err)

          }).finally(() => {
            lock = false;
          })
      }
    })
  }

  const search = () => {
    listItem();
  }

const reset = () => {
    setPriceOrder(undefined);
    setCostOrder(undefined);
    setTimeout(() => {
        listItem();
    }, 0);
}


  // loading
  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <div>
        <h1 className="title is-1">Item</h1>
        <div style={{margin: '10px'}}>
            Cost:
            <select placeholder="cost" value={costOrder} onChange={costChanged} style={{margin: '10px', padding: '10px'}}>
              <option style={{display:'none'}}></option>
              <option value="cost">Low to High</option>
              <option value="-cost">High to Low</option>
            </select>
            Selling Price:
            <select placeholder="price" value={priceOrder} onChange={priceChanged} style={{margin: '10px', padding: '10px'}}>
              <option style={{display:'none'}}></option>
              <option value="sellingPrice">Low to High</option>
              <option value="-sellingPrice">High to Low</option>
            </select>
            Classification:
            <select value={classification2} onChange={classificationChanged} style={{margin: '10px', padding: '10px'}}>
              <option style={{display:'none'}}></option>
              <option value="Fruit">Fruit</option>
              <option value="Food">Food</option>
              <option value="Gas">Gas</option>
              <option value="Beverage">Beverage</option>
              <option value="Equipment">Equipment</option>
            </select>
            <button className="button is-primary" onClick={search} style={{margin: '10px', padding: '10px'}}>Search</button>
            <button className="button is-primary" onClick={reset} >Reset</button>
        </div>
        {/* add button */}
        <button className="button is-primary" onClick={addItem}>Add Item</button>
        {/* button that redirects to the item visualization page */}
        <a href="/itemchart">
          <button className="button is-primary" >Visualize</button>
        </a>
      </div>

      <div className="data-table">
        <table className="my-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Selling Price</th>
              <th>Note</th>
              <th>Supplier ID</th>
              <th>Classification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.description}</td>
                <td>{item.cost}</td>
                <td>{item.sellingPrice}</td>
                <td>{item.note}</td>
                <td>{item.supplierID}</td>
                <td>{item.classification}</td>
                <td>
                  <button className="button is-warning is-fullwidth" onClick={() => editItem(item.itemID)}>Edit</button>
                  <button className="button is-danger is-fullwidth" onClick={() => deleteItem(item.itemID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="myModal" className="modal">
        <div className="modal-content">
          <header className="modal-header">
            <p className="modal-card-title">Add Item</p>
            <button className="button delete is-danger" aria-label="close" onClick={closeModal}>X</button>
          </header>
          <section className="modal-body">
            <form id="itemForm">
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <input value={description} onChange={e => setDescription(e.target.value)} className="input" type="text" placeholder="Description" />
                </div>
              </div>
              <div className="field">
                <label className="label">Cost</label>
                <div className="control">
                <input className="input" type="text" placeholder="Cost"/>
                </div>
              </div>
              <div className="field">
                <label className="label">Selling Price</label>
                <div className="control">
                <input value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} className="input" type="tel" placeholder="Selling Price"/>
                </div>
              </div>
              <div className="field">
                <label className="label">Note</label>
                <div className="control">
                <input value={note} onChange={e => setNote(e.target.value)} className="input" type="text" placeholder="Note"/>
                </div>
              </div>
              <div className="field">
                <label className="label">Supplier ID</label>
                <div className="control">
                <input className="input" type="text" placeholder="Supplier ID"/>
                </div>
              </div>
              <div className="field">
                <label className="label">Classification</label>
                <div className="control">
                <input value={classification} onChange={e => setClassification(e.target.value)} className="input" type="text" placeholder="Classification"/>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-footer">
          <button onClick={handleScan} className={'button is-info'}>Scan</button>
            <button className="button is-success" onClick={saveChanges} >Save changes</button>
            <button className="button is-danger" onClick={closeModal}>Cancel</button>
          </footer>

        </div>
      </div>

    </div>
  );
}