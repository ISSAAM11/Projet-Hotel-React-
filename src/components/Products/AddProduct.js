import React , {useState, useRef, useContext, useEffect} from"react"
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown';
import 'react-country-dropdown/dist/index.css'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import UserContext from '../../ContextHandler'
import {useTranslation} from 'react-i18next'
const AddProduct = (props) => { 

  const [ t, i18n ] = useTranslation()
  const {user, setUser} = useContext(UserContext);
  const [ErrorAccount , setErrorAccount] = useState()

  const [type, settype] = useState("Choisir le type de produit")
  const [name, setname] = useState("")
  const [category, setcategory] = useState("")
  const [amount, setamount] = useState(0)
  const [etat, setetat] = useState(false)
  const [prix, setprix] = useState(0)
  
  const form = useRef();
  const config = { headers: { Authorization : 'Bearer ' +localStorage.getItem('token') } }


  const AddProduit =() =>{

    let error = false

    if(type == "Choisir le type de produit" || name == ""|| name == null || category == ""||category == null ){
        setErrorAccount( "compléter le formulaire")
        error = true
      }

    if (error == false){
      const produit = { name ,type, etat, category , amount , prix }
      axios.post(`http://localhost:3000/produits/${localStorage.getItem('id')}`,produit, config).then(
        res => {
          props.handleClose()     
          setname("")
          setamount(0)
          setcategory("")
          settype("Choisir le type de produit")
          setetat(false)
          setprix(0)
          props.update()
        },
        err => {
          console.log( err.response.data)
          alert(err.response.data.error.message)

        }
      )
    }
  }

  const handleSwitchbutton = (etatSelected) => {

    if (etatSelected == true){
      setetat(false)
    }else if (etatSelected == false){
      setetat(true)
    }
    console.log(etat)
    console.log(etatSelected)
  }
  
    return(
    <Modal show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Créer un produit")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form ref={form} >
        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
          
          <Form.Label> {t("Type de dispositive")} </Form.Label>
            <Dropdown  className="mb-2">
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                    {type}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>settype("Serrure")} >{t("Serrure")}</Dropdown.Item>
                    <Dropdown.Item onClick={()=>settype("Dispositif réseau")} >{t("Dispositif réseau")}</Dropdown.Item>
                    <Dropdown.Item onClick={()=>settype("Contrôleur d'ascenceur")} >{t("Contrôleur d'ascenceur")}</Dropdown.Item>
                    <Dropdown.Item onClick={()=>settype("Mode économique")} >{t("Mode économique")}</Dropdown.Item>
                    <Dropdown.Item onClick={()=>settype("Autre")} >{t("Autre")}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

          <Form.Label> {t("Nom de produit")}  </Form.Label>
          <Form.Control
            type = "text"
            placeholder={t("Ecrire ici")}
            autoFocus
            className="mb-2"
            value={name}
            onChange={(e) => setname(e.target.value)}/>

          <Form.Label> {t("Catégorie")} </Form.Label>
          <Form.Control
            type = "text"
            placeholder={t("Ecrire ici")}
            autoFocus
            className="mb-2"
            value={category}
            onChange={(e) => setcategory(e.target.value)}/>

          <Form.Label> {t("Quantité")} </Form.Label>
          <Form.Control
            type="number"
            placeholder={t("Ecrire ici")}
            autoFocus
            className="mb-2"
            value={Math.floor(amount)}
            onChange={(e) => setamount( Math.floor(e.target.value))}/>

          <Form.Label> {t("Prix (DT)")} </Form.Label>
          <Form.Control
            type="number"
            placeholder={t("Ecrire ici")}
            autoFocus
            className="mb-3"
            value={Math.floor(prix)}
            onChange={(e) => setprix( Math.floor(e.target.value))}/>

          <Form.Label > {t("Etat de produit")}: </Form.Label> &nbsp;
          <BootstrapSwitchButton 
          offlabel={t("Payé")}
          onlabel={t("Impayé")}  
          width={100} 
          checked={etat}
          onChange={()=> handleSwitchbutton(etat)} 
          className="ml-3"
          onstyle="secondary" offstyle="success" />

          <div className="button mb-2">
            <center>
              <p className="mb-1" style={{ color: "red", fontSize:"13px"}}>{ErrorAccount}</p>
            </center>
          </div>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.handleClose()}>
        {t("Cancel")}
      </Button>
      <Button variant="primary" onClick={() => AddProduit() } >
        {t("Enregister")} 
      </Button>
    </Modal.Footer>
    </Modal>
  )
}
export default AddProduct