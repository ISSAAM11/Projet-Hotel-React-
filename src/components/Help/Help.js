import { useEffect,useState,useReducer  } from 'react'

import 'react-phone-number-input/style.css'
import {useTranslation} from 'react-i18next'
import Footer from '../PageElement/Footer';
import '../../App.css'

import download_driver from '../../Images/download_driver.jpg'
import install_driver from '../../Images/install driver.jpg'
import install_assintant_64 from '../../Images/install assintant 64.jpg'
import install_assintant_86 from '../../Images/install assintant 86.jpg'
import Card_incoder_icon from '../../Images/Card incoder icon.jpg'
import application_runnung from '../../Images/application runnung.jpg'
import './Help.css'
function Help() {
    const [ t, i18n ] = useTranslation()

  return (
    <div>
    <div className="content-wrapper page-container" >
      {/* Content Header (Page header) */}
      <div className="content-header ">
        <div className="container-fluid ">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark"> {t("Aide")}
              </h1>         
  
            </div>{/* /.col */}
          </div>{/* /.row */}
          <hr></hr>
        </div>{/* /.container-fluid */}
      </div>
  
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
            </div>
          </div>
            <div className="row">
              <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header col-12 help-page" >
            <div>
                <h3>{t("Quelle est notre application?")}</h3>
            </div>
            <p>
                {t("Ce système est destiné aux fournisseurs qui fournissent des serrures pour les hôtels. Les fournisseurs peuvent gérer leurs clients et distributeurs dans ce système. Les distributeurs peuvent également gérer leurs hôtels et sous-distributeurs dans ce système.")}
            </p>
            <div>
                <h3> {t("Manuel de l'Utilisateur")} </h3> 
                <p> {t("Téléchargez le manuel d'utilisation du système du fournisseur de serrures pour plus de détails")} <a href='https://supplier.sciener.com/plug-in/manual_en.pdf' download>{t("cliquez ici")}</a></p> 
            </div>
                <h3>{t("Avant d'utiliser")}</h3>
            <div>
                <label>1- {t("Installer le pilote d'encodeur de carte")}: </label> 
                <p> {t("Pour télécharger le pilote de l'encodeur de carte")} <a href='https://supplier.sciener.com/plug-in/CP210x_Windows_Win10_Drivers.rar' download>{t("cliquez ici")}</a> </p> 

                <p>{t("Si le pilote de périphérique n'a pas été installé, veuillez le télécharger à partir du système et l'installer d'abord")}.</p>

                <center><img src={download_driver} style={{width: '600px'}} className="mb-2"></img></center>
                <center><img src={install_driver} style={{width: '600px'}}  className="mb-3"></img></center>

            </div>
                    
            <div >
            
                <label>2- {t("Télécharger l'assistant d'encodeur de carte")}: </label> 

                <p> {t("Pour télécharger l'assistant encodeur de carte")} <a href='https://supplier.sciener.com/plug-in/CardEncoderAssistant.zip' download>{t("cliquez ici")}</a> </p> 
                <p> {t("Et ensuite cliquez sur installer")}.</p>

                <center><img src={install_assintant_64} style={{width: '600px'}}  className="mb-2"></img></center>
                <center><img src={install_assintant_86} style={{width: '600px'}}  className="mb-3"></img></center>

                <p>{t("Il y aura une icône sur le bureau une fois le logiciel installé")}.</p>

                <center><img src={Card_incoder_icon} style={{width: '120px'}}  className="mb-2"></img></center>
                <center><img src={application_runnung} style={{width: '600px'}}  className="mb-3"></img></center>

                <p style={{color: 'red'}}>{t("L'assistant d'encodeur de carte ne peut fonctionner que sur le système Windows")}.</p>
                <p >{t("Pour chiffrer la carte ou l'encodeur de carte, veuillez vous assurer que l'encodeur de carte est prêt a utiliser")}. </p>
                <br/>
                <br/>
                <p >{t("Si vous avez des problèmes techniques ou bien vous avez besoin d'aide vous pouvez nous contacter")}. </p>

            </div>
            
          </div>
        </div>
      </div>
    </div>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
  
    </div>
</div>
  )
}

export default Help