import React from "react";
import { Link } from "react-router-dom";
import hotelLogo from "../../Images/Mascir.png"
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {useTranslation} from 'react-i18next'

 const SideBar = () => {
  const [ t, i18n ] = useTranslation()

    return(
      <aside className="main-sidebar sidebar-light-primary " style={{position: "fixed"}}>
      {/* Brand Logo */}
      <a className="brand-link">
        <Link to="/home/hotels" className="nav-link " aria-current="page">
        <img src={hotelLogo} alt="AdminLTE Logo" className="brand-image  " style={{opacity: '.8'} } />
        <span >User</span>
        </Link>
        
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column " data-widget="treeview" role="menu" data-accordion="false">
            {/* Add icons to the links using the .nav-icon class
             with font-awesome or any other icon font library */}
            <li className="nav-item has-treeview menu-open">
            
              <ul className="nav nav-treeview " >
                <li className="nav-item ">

                  <Link to="/home/WelcomeUser" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p> {t('Détails compte')} </p>
                  </Link>

                  <Link to="/home/hotels" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p> {t('Hôtels')} </p>
                  </Link>

                  <Link to="/home/Ditributors" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Distributeurs')}</p>
                  </Link>

                  <Link to="/home/products" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Produits')}</p>
                  </Link>

                  <Link to="/home/PurchaseOrder" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Commande')}</p>
                  </Link>
                  
                </li>
              </ul>
             </li>





            <li className="nav-header" ></li>

          
          </ul>

          <ul className="nav nav-pills nav-sidebar flex-column" id="footer-nav" data-widget="treeview" role="menu" data-accordion="false">
            {/* Add icons to the links using the .nav-icon class
             with font-awesome or any other icon font library */}


            <li className="nav-item" >
            <OverlayTrigger
              key="service"
              placement="right"
              overlay={
                <Tooltip id={`tooltip-right`} className="light">
                  {t('Manuel d utilisation du système')}
                </Tooltip>
              }
            >
              <a href='https://supplier.sciener.com/plug-in/manual_en.pdf' download className="nav-link">
                <p className="text">{t('Manuel d utilisation')}</p>
              </a>
            </OverlayTrigger>

            </li>

          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  



 


















/*      <div className="Sidebar">
 
      <nav id="sidebarMenu" className="Sidebar col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              <span data-feather="home" className="align-text-bottom"></span>
              
              Fournisseur
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span data-feather="layers" className="align-text-bottom"></span>
              Distributeurs
            </a>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
          <span>Saved reports</span>
          <a className="link-secondary" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle" className="align-text-bottom"></span>
          </a>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <span data-feather="file-text" className="align-text-bottom"></span>
              Current month
            </a>
          </li>
        </ul>
 
        <div  className="d-flex align-items-center  text-decoration-none  dropdown-toggle">
        <ul className=" dropdown-menu-dark text-small shadow" >
          <li><a className="dropdown-item" href="#">Manuel d'utilisation</a></li>
          <li><a className="dropdown-item" href="#">Follow us</a></li>
          <li><a className="dropdown-item" href="#">Service client</a></li>
        </ul>
        </div>
      </div>
    </nav>
    </div >


/*
  return(
    <div className="navbar">
      <Link to="/" className="menu-bars"> 
    
      </Link>
      <nav>
        <ul  >
          <li className='navbar-toggle'>
            <Link to="/Fournisseurs" className='menu-bars'>
            Fournisseurs
            </Link>
          </li>
          <li className='navbar-toggle'>
            <Link to="/Distributeurs" className='menu-bars'>
            Distributeurs
            </Link>
          </li>
            
        </ul>
      </nav>
    </div>
  )

*/

/*
<div className="d-flex flex-column flex-shrink-0 p-3 bg-light" >
    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
      <svg className="bi me-2" width="40" height="32"><use href="#bootstrap"/></svg>
      <span className="fs-4">Sidebar</span>
    </a>
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <a href="#" className="nav-link active" aria-current="page">
          <svg className="bi me-2" width="16" height="16"><use href="#home"/></svg>
          Home
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-dark">
          <svg className="bi me-2" width="16" height="16"><use href="#speedometer2"/></svg>
          Dashboard
        </a>
      </li>      
      <li>
        <a href="#" className="nav-link link-dark">
          <svg className="bi me-2" width="16" height="16"><use href="#speedometer2"/></svg>
          test0
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-dark">
          <svg className="bi me-2" width="16" height="16"><use href="#speedometer2"/></svg>
          test
        </a>
      </li>
    </ul>

  </div>
        */
    )
}
export default SideBar;



/*

      <aside data-v-2bc947a0="" className="aside slide ant-layout-sider ant-layout-sider-light" >
      <div className="ant-layout-sider-children"><div data-v-2bc947a0="" className="menuSlider">
        <div data-v-2bc947a0="" className="logo">
            </div>
            <div data-v-3ef756e2="" data-v-2bc947a0="" className="Menu">
              <ul data-v-3ef756e2="" role="menu" className="ant-menu ant-menu-vertical ant-menu-root ant-menu-light">
                <li data-v-3ef756e2="" role="menuitem" className="ant-menu-item ant-menu-item-selected" >
                  <a data-v-3ef756e2="" href="/hotel" aria-current="page" className="router-link-exact-active router-link-active">
                    <span data-v-3ef756e2="" className="nav-text" >Hotel
                    </span>
                  </a>
                </li>
                <li data-v-3ef756e2="" role="menuitem" className="ant-menu-item"  >
                  <a data-v-3ef756e2="" href="/distributor" className="">
                    <span data-v-3ef756e2="" className="nav-text">Distributeurs
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div data-v-2bc947a0="" className="bottom">
              <div data-v-2bc947a0="" className="manual">Manuel d'utilisation</div>
              <div data-v-2bc947a0="" className="service">Follow us</div>
              <div data-v-2bc947a0="" className="service">Service client</div>
            </div>
          </div>
        </div>
    </aside>
*/