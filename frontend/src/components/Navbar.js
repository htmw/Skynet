import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  return (
  	<div>
    <nav className="pcoded-navbar">
        <div className="navbar-wrapper">
            <div className="navbar-brand header-logo">
                <a href="#" className="b-brand">
                    <div >
                        <img className  = "nav-logo" src= "logoImg.png"   />
                    </div>
                    <span className="b-title">SkyNet</span>
                </a>
                <a className="mobile-menu" id="mobile-collapse" href="#"><span></span></a>
            </div>
            <div className="navbar-content scroll-div">
                <ul className="nav pcoded-inner-navbar">
                    <li data-username="form elements advance componant validation masking wizard picker select" className="nav-item">
                        <NavLink to="/" className="nav-link is-active"><span className="pcoded-micon"><i className="feather icon-file-text"></i></span><span className="pcoded-mtext">Dashboard</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/suppliermanagement" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Supplier</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/item" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Item</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/inventory" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Inventory</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/order" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Order</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/cashregisters" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Cash Registers</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/tracking" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Tracking</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/addressVerifyUPS" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Address Verification</span></NavLink>
                    </li>
                    </ul>
            </div>
        </div>
    </nav>

    <header className="navbar pcoded-header navbar-expand-lg navbar-light">

    </header>

    </div>
  );
 };

 export default Navbar;