import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard';
// import
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// React Router import S
import SupplierManagement from './pages/suppliermanagement';
import Item from './pages/item';
import InventoryPage from './pages/inventory';
import Order from './pages/order';
import ItemChart from './pages/itemchart';
import OrderChart from './pages/orderchart';
import Cash from './pages/cash';
import TrackingUPS from './components/tracking/trackingUPS';
import AdressVerifyUPS from './components/addressVerification/addressVerifyUPS'
import Order_Metrics from './components/ML_order/order_metrics'




function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken['access']));
}

function getToken() {
    const tokenString = sessionStorage.getItem('token');
//   const userToken = JSON.parse(tokenString);
//   console.log(userToken,userToken != null && userToken.length > 1);
//   return userToken != null && userToken.length > 1;
    return tokenString;
}

function App() {
    const token = getToken();
    // const [token, setToken] = useState();

    return (
        <BrowserRouter>
            <Navbar />
            <div className="pcoded-main-container">
                <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                        <div className="card p-5">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/suppliermanagement" element={<SupplierManagement />} />
                                <Route path="/item" element={<Item />} />
                                <Route path="/inventory" element={<InventoryPage />} />
                                <Route path="/order" element={<Order />} />
                                <Route path="/tracking" element ={<TrackingUPS />}  />
                                <Route path="/addressVerifyUPS" element ={<AdressVerifyUPS />}  />
                                <Route path="/itemchart" element ={<ItemChart />}  />
                                <Route path="/orderchart" element ={<OrderChart />}  />
                                <Route path="/cashregisters" element={<Cash />} />
                                <Route path="/ml_order" element={<Order_Metrics />} />
                            </Routes>
                        </div>
                    </div>

                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
