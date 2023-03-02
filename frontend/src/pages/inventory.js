import React from "react";
import AppCss from '../App.css';

export default function InventoryPage() {
    const [items, setItems] = React.useState([]);
    const [allItems, setAllItems] = React.useState([]);
    
    const [loading, setLoading] = React.useState(true);

    const [itemId, setItemId] = React.useState('');
    const [quantityOrder, setQuantityOrder] = React.useState('');
    const [expirationDateOrder, setExpirationDateOrder] = React.useState('');

    let formDatas = {
        stackID: "",
        itemID: "",
        quantity: "",
        expirationDate: "",
        inboundDate: ""
    };

    React.useEffect(() => {
        listItem();
    }, []);

    const inputChanged = (event) => {
        formDatas[event.target.name] = event.target.value;
    };

    const quantityChanged = (event) => {
        setQuantityOrder(event.target.value);
    }

    const expirationDateChanged = (event) => {
        setExpirationDateOrder(event.target.value);
    }

    const listItem = (id) => {
        let url = 'http://localhost:8000/inventory/?';
        url += "itemId=" + id;
        url += "&quantityOrder=" + quantityOrder;
        url += "&expirationDateOrder=" + expirationDateOrder;

        fetch(url)
            .then(res => res.json())
            .then(json => {
                setItems(json);
                if(!(id && id != '')){
                    setAllItems(json)
                }
                setLoading(false);
                console.log(json);
                let inventoryTime = localStorage.getItem("inventoryTime");
                let flag = true;
                if(inventoryTime){
                    let tmpTime = new Date(parseInt(inventoryTime));
                    let day1 = tmpTime.getFullYear() + "" + tmpTime.getMonth() + "" + tmpTime.getDate();
                    let now = new Date();
                    let day2 = now.getFullYear() + "" + now.getMonth() + "" + now.getDate();
                    // console.log(tmpTime, now, day1, day2);
                    if(day1 != day2){
                        flag = false;
                        localStorage.setItem("inventoryTime", +new Date());
                    }
                }else{
                    flag = false;
                    localStorage.setItem("inventoryTime", +new Date());
                }
                if(flag){
                    return;
                }
                let itemStr = "";
                let count = 0;
                for(let i = 0; i < json.length; i++){
                    if(json[i].quantity == 1){
                        count++;
                        itemStr += "," + json[i].itemID;
                    }
                }
                if(count > 0){
                    window.confirm("Lack of stock,ItemId: " + itemStr);
                }
            })
            .catch(err => console.log(err));
    }

    const itemIdChanged = (event) => {
        setItemId(event.target.value);
    };

    const search = () => {
        listItem(itemId);
    }

    const reset = () => {
        setItemId('');
        setExpirationDateOrder('');
        setQuantityOrder('')
        setTimeout(() => {
            listItem();
        }, 0);
    }

    const saveChanges = () => {
        // get the values from the form
        console.log("saving changes");
        submitForm(formDatas);
        // reload the page
        closeModal();
        // window.location.reload();
    
    };

    
    const print = () => {
        // console.log(AppCss);
        let iframe = document.createElement('IFRAME');
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;size: auto;margin: 0mm;');
        document.body.appendChild(iframe);
        let doc = iframe.contentWindow.document;
        doc.write("<h2 style='margin:auto;text-align: center;'>Invoice</h2><br/>");
        let data = [['123', '333', '444', '555'], ['123', '333', '444', '555']];
        let tbody = "";
        for(let i = 0;i < data.length; i++){
            let tr = "<tr>"
            tr += "<td style='border: 1px solid black;'>" + data[i][0] + "</td>"
            tr += "<td style='border: 1px solid black;'>" + data[i][1] + "</td>"
            tr += "<td style='border: 1px solid black;'>" + data[i][2] + "</td>"
            tr += "<td style='border: 1px solid black;'>" + data[i][3] + "</td>"
            tr+= "</tr>"
            tbody += tr;
        }
        let table = "<table style= 'margin:auto; border: 1px solid black; text-align: center; width: 90%;' cellspacing='0'>"
                   +"<thead><tr>"
                   +"<th style='border: 1px solid black;'>itemID</th>"
                   +"<th style='border: 1px solid black;'>quantity</th>"
                   +"<th style='border: 1px solid black;'>inboundDate</th>"
                   +"<th style='border: 1px solid black;'>expirationDate</th>"
                   +"</tr></thead><tbody>"
                   + tbody
                   +"</tbody></table>";
        
        doc.write(table);
        // doc.body.innerHTML = obj.innerHTML;
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
        
        // iframe.onload = function() { //解决图片显示不了的问题
        //     iframe.contentWindow.focus();
        //     iframe.contentWindow.print();
        //     document.body.removeChild(iframe);
        // };


    }

    function submitForm(datas) {
        if (datas.stackID === "") {
            console.log(datas, allItems);
            for(let i = 0; i < allItems.length; i++){
                if(datas.itemID == allItems[i].itemID){
                    window.confirm("ItemID already exist");
                    return;
                }
            }
            fetch("http://localhost:8000/inventory/add/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datas),
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.code == 0){
                    window.confirm(data.msg);
                }else{
                    window.location.reload();
                }
            });
        } else {
            fetch("http://localhost:8000/inventory/update/" + datas.stackID+"/", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(datas),
            })
                .then((res) => res.json())
                .then((data) => {
                // console.log(data);
                window.location.reload();
                // });
            });
        }
    
    }

    const addItem = () => {
        let modal = document.getElementById("myModal");
        document.getElementById("itemID").disabled=false;
        modal.style.display = "block";
        formDatas = {
            stackID: "",
            itemID: "",
            quantity: "",
            expirationDate: "",
            inboundDate: ""
        };
        for(let key in formDatas) {
            try {
                document.getElementById(key).value = formDatas[key];
            } catch (error) {
                console.log(error);
            }
        }
    }

    const editItem = (item) => {
        formDatas = Object.assign({}, item);
        let modal = document.getElementById("myModal");
        document.getElementById("itemID").disabled=true;
        modal.style.display = "block";
        for(let key in formDatas) {
            try {
                document.getElementById(key).value = formDatas[key];
            } catch (error) {
                console.log(error);
            }
        }
    }

    const deleteItem = (id) => {
        let confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            fetch("http://localhost:8000/inventory/delete/" + id, {
                method: "DELETE",
            }).then((res) => {
                if (res.ok) {
                alert("Inventory deleted");
                window.location.reload();
                }
            });
        }
    }

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
            <h1 className="title is-1">Inventory</h1>


            <div style={{margin: '10px'}}>
                <input className="input" placeholder="please input itemId" value={itemId} onChange={itemIdChanged} style={{margin: '10px', padding: '10px'}}/>
                expirationDate:
                <select placeholder="" value={expirationDateOrder} onChange={expirationDateChanged} style={{margin: '10px', padding: '10px'}}>
                    <option style={{display:'none'}}></option>
                    <option value="expirationDate">Low to High</option>
                    <option value="-expirationDate">High to Low</option>
                </select>
                Quantity:
                <select placeholder="" value={quantityOrder} onChange={quantityChanged} style={{margin: '10px', padding: '10px'}}>
                    <option style={{display:'none'}}></option>
                    <option value="quantity">Low to High</option>
                    <option value="-quantity">High to Low</option>
                </select>
                <button className="button is-primary" onClick={search} style={{margin: '10px', padding: '10px'}}>Search</button>
                <button className="button is-primary" onClick={reset} >Reset</button>
            </div>
            {/* add button */}
            <button className="button is-primary" onClick={addItem} >Add Inventory</button>
            {/* <button className="button is-primary" onClick={print} >Print</button> */}
            </div>



            <div className="data-table" id="dataTable">
            <table className="my-table">
            <thead>
                <tr>
                <th>#</th>
                <th>itemID</th>
                <th>quantity</th>
                <th>inboundDate</th>
                <th>expirationDate</th>
                <th>action</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, i) => (
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{item.itemID}</td>
                    <td>{item.quantity}</td>
                    <td>{item.inboundDate}</td>
                    <td>{item.expirationDate}</td>
                    <td>
                    <button className="button is-warning is-fullwidth" onClick={() => editItem(item)}>Edit</button>
                    <button className="button is-danger is-fullwidth" onClick={() => deleteItem(item.stackID)} >Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>

            <div id="myModal" className="modal">
                <div className="modal-content">
                    <header className="modal-header">
                        <p className="modal-card-title">Inventory</p>
                        <button className="button delete is-danger" aria-label="close" onClick={closeModal} >X</button>
                    </header>
                    <section className="modal-body">
                        <form>
                            <div className="field">
                                <label className="label">quantity</label>
                                <div className="control">
                                <input className="input" type="number" placeholder="quantity" id="quantity" name="quantity" onChange={inputChanged}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">inboundDate</label>
                                <div className="control">
                                <input className="input" type="text" placeholder="inboundDate" id="inboundDate" name="inboundDate" onChange={inputChanged}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">expirationDate</label>
                                <div className="control">
                                <input className="input" type="text" placeholder="expirationDate" id="expirationDate" name="expirationDate" onChange={inputChanged}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Item ID</label>
                                <div className="control">
                                <input className="input" type="text" placeholder="Item ID" id="itemID" name="itemID" onChange={inputChanged}/>
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