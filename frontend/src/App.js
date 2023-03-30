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
import TrackingUSPS from './components/tracking/trackingUSPS';
import TrackingRedirect from './components/tracking/trackingRedirect';
import TrackingUPS from './components/tracking/trackingUPS';




function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken['access']));
}

function getToken() {
    const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
//   console.log(userToken,userToken != null && userToken.length > 1);
  return userToken != null && userToken.length > 1;
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
                                <Route path="/tracking" element ={<TrackingRedirect/>}  />
                                <Route path="/trackingUSPS" element ={<TrackingUSPS />}  />
                                <Route path="/trackingUPS" element ={<TrackingUPS />}  />
                                <Route path="/itemchart" element ={<ItemChart />}  />
                                <Route path="/orderchart" element ={<OrderChart />}  />
                                <Route path="/crash" element={<Item />} />  {/* what is this crash? */}
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
