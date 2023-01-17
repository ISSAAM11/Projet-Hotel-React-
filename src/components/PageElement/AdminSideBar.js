import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hotelLogo from "../../Images/Mascir.png"
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {useTranslation} from 'react-i18next'
import axios from 'axios'

 const AdminSideBar = () => {
  const [ t, i18n ] = useTranslation()
  const [ nonlu, setnonLu ] = useState(false)
  const [ MessagesClos, setMessagesClos ] = useState(0)

  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
  const selected = () => {
    setnonLu(false)
    console.log("test Lu")
  }

  useEffect(()=> {
      axios.get(`http://localhost:3000/messages/${localStorage.getItem('id')}?filter[order]=date`,config ).then(
        res => {
          setMessagesClos(res.data.filter(post => post.etat==false).length)
        },
        err => {
          console.log( err)
        }
      ).then(
        res => {if (MessagesClos > 0) {
          setnonLu(true)
        }else{setnonLu(false)}
      })       
  })

    return(
      <aside className="main-sidebar sidebar-light-primary " style={{position: "fixed" }}  >
      {/* Brand Logo */}
      <a className="brand-link" style={{backgroundColor: "#EBEBEB" }} >
        <Link to="/Admin/hotels" className="nav-link " aria-current="page">
        <img src={hotelLogo}alt="AdminLTE Logo" className="brand-image  " style={{opacity: '.8'} } />
        <span >Admin</span>
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

                  <Link to="/Admin/Dashbord" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p> {t('Tableau de bord')} </p>
                  </Link>

                  <Link to="/Admin/hotels" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p> {t('Hôtels')} </p>
                  </Link>

                  <Link to="/Admin/Ditributors" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Distributeurs')}</p>
                  </Link>

                  <Link to="/Admin/ReclamationList" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Reclamation')}</p>
                    {nonlu == false || MessagesClos.length == 0
                      ?null
                      :<span className="ml-2 badge badge-danger">{MessagesClos}</span>
                    }
                  </Link>
                  <Link to="/Admin/products" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Produits')}</p>
                  </Link>

                  <Link to="/Admin/PurchaseOrder" className="nav-link " aria-current="page"  >
                    <i className="far blue  nav-icon " />
                    <p>{t('Commandes')}</p>
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
  
    )}
export default AdminSideBar