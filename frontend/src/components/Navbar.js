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
                        <NavLink to="/crash" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Crash</span></NavLink>
                    </li>
                    <li data-username="Table bootstrap datatable footable" className="nav-item">
                        <NavLink to="/tracking" className="nav-link is-active "><span className="pcoded-micon"><i className="feather icon-server"></i></span><span className="pcoded-mtext">Tracking</span></NavLink>
                    </li>
                    </ul>
            </div>
        </div>
    </nav>

    <header className="navbar pcoded-header navbar-expand-lg navbar-light">
        <div className="m-header">
            <a className="mobile-menu" id="mobile-collapse1" href="#"><span></span></a>
            <a href="#" className="b-brand">
                   <div className="b-bg">
                       <i className="feather icon-trending-up"></i>
                   </div>
                   <span className="b-title">SkyNet</span>
               </a>
        </div>
        <a className="mobile-menu" id="mobile-header" href="#">
            <i className="feather icon-more-horizontal"></i>
        </a>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
                <li><a href="#" className="full-screen" onclick="javascript:toggleFullScreen()"><i className="feather icon-maximize"></i></a></li>
                <li className="nav-item dropdown">
                    <a className="dropdown-toggle" href="#" data-toggle="dropdown">Dropdown</a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <div className="main-search">
                        <div className="input-group">
                            <input type="text" id="m-search" className="form-control" placeholder="Search . . ."/>
                            <a href="#" className="input-group-append search-close">
                                <i className="feather icon-x input-group-text"></i>
                            </a>
                            <span className="input-group-append search-btn btn btn-primary">
                                <i className="feather icon-search input-group-text"></i>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                <li>
                    <div className="dropdown">
                        <a className="dropdown-toggle" href="#" data-toggle="dropdown"><i className="icon feather icon-bell"></i></a>
                        <div className="dropdown-menu dropdown-menu-right notification">
                            <div className="noti-head">
                                <h6 className="d-inline-block m-b-0">Notifications</h6>
                                <div className="float-right">
                                    <a href="#" className="m-r-10">mark as read</a>
                                    <a href="#">clear all</a>
                                </div>
                            </div>
                            <ul className="noti-body">
                                <li className="n-title">
                                    <p className="m-b-0">NEW</p>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src="assets/images/user/avatar-1.jpg" alt="Generic placeholder image"/>
                                        <div className="media-body">
                                            <p><strong>John Doe</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10"></i>30 min</span></p>
                                            <p>New ticket Added</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="n-title">
                                    <p className="m-b-0">EARLIER</p>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src="assets/images/user/avatar-2.jpg" alt="Generic placeholder image"/>
                                        <div className="media-body">
                                            <p><strong>Joseph William</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10"></i>30 min</span></p>
                                            <p>Prchace New Theme and make payment</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="notification">
                                    <div className="media">
                                        <img className="img-radius" src="assets/images/user/avatar-3.jpg" alt="Generic placeholder image"/>
                                        <div className="media-body">
                                            <p><strong>Sara Soudein</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10"></i>30 min</span></p>
                                            <p>currently login</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="noti-footer">
                                <a href="#">show all</a>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="dropdown drp-user">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <i className="icon feather icon-settings"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right profile-notification">
                            <div className="pro-head">
                                <img src="assets/images/user/avatar-1.jpg" className="img-radius" alt="User-Profile-Image"/>
                                <span>John Doe</span>
                                <a href="auth-#" className="dud-logout" title="Logout">
                                    <i className="feather icon-log-out"></i>
                                </a>
                            </div>
                            <ul className="pro-body">
                                <li><a href="#" className="dropdown-item"><i className="feather icon-settings"></i> Settings</a></li>
                                <li><a href="#" className="dropdown-item"><i className="feather icon-user"></i> Profile</a></li>
                                <li><a href="#" className="dropdown-item"><i className="feather icon-mail"></i> My Messages</a></li>
                                <li><a href="auth-#" className="dropdown-item"><i className="feather icon-lock"></i> Lock Screen</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </header>

    </div>
  );
 };

 export default Navbar;