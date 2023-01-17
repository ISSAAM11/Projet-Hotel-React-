import React ,{useState, useContext}from 'react'
import Footer from '../PageElement/Footer';
import {useTranslation} from 'react-i18next'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import axios from "axios"
import UserContext from "../../ContextHandler"
function Reclamation() {
    const [ t, i18n ] = useTranslation()
    const {user, setUser} = useContext(UserContext);

    const config = { headers: { Authorization : 'Bearer ' +localStorage.getItem('token') } }
    const [title, settitle] = useState("");
    const [content, setcontent] = useState("");
    const [type, settype] = useState("");
    const [destination, setdestination] = useState("");
    const [error, seterror] = useState("");
    const [errorbool, seterrorbool] = useState("");

    const [labelType, setlabelType] = useState("Choisir votre option")

  const AddMessage = () => {
    const tmp_date = new Date().toISOString().split("T")
    const date = `${tmp_date[0]}`
    const source = user.username
    const idSource = `${localStorage.getItem('id')}`
    const userEmail = user.email
    const message = { source, date, type, content, title ,idSource,userEmail }
    console.log( message )

    let errorbool = false 
    if(type === "" || type === null){
      seterror("Le type de reclamation est requis"); 
      errorbool = true ;
    }else if (title === "" || content === title){
      seterror("Le title de reclamation est requis");
      errorbool = true ;
    }else if (content === "" || content === null){
      seterror("You must write your description"); 
      errorbool = true ;
    }

    if(errorbool == false){
      axios.post(`http://localhost:3000/messages`,message, config).then(
        res => {
          console.log(res)
          setdestination("")
          settitle("")
          setcontent("")
          settype("")
          setlabelType("Choisir votre option")
          alert ("reclamation envoyer avec succès")
        },
        err => {
          console.log( err)
          alert(err)

        }
      )
    }
  }
  return (
    <div>
        <div>
            <div className="content-wrapper page-container" >
                {/* Content Header (Page header) */}
                <div className="content-header ">
                    <div className="container-fluid ">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">{t("Reclammation")}
                                
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
        <div className="card-header col-12 votre-information" >
        <label>{t('Détail réclamation')}:</label>
          
        <Form>
            <Table borderless>
                <thead>
                <tr>  
                </tr>  

                <tr>  
                    <th>

                    <div className="row">
                      <div className="col ">
                        <ul className="list-unstyled">
                            <li className="mb-2">{t("Type de reclammation")}:</li>
                            <li >
    <Dropdown>
      <Dropdown.Toggle  variant="white" id="dropdown-basic"> {t(labelType)}</Dropdown.Toggle>
      
      <Dropdown.Menu>
          <Dropdown.Item >
              <a type="button"className="nav-link active" onClick={() => {settype("Probleme Technique");setlabelType('Probleme Technique')}} aria-current="page" >{t("Probleme Technique")}</a>
          </Dropdown.Item>

          <Dropdown.Item >
              <a type="button"className="nav-link active" aria-current="page"onClick={() =>{settype("Reclamer un Distributeur");setlabelType('Reclamer un Distributeur')}} >{t("Reclamer un Distributeur")} </a>
          </Dropdown.Item>

          <Dropdown.Item >
              <a type="button"className="nav-link active" aria-current="page" onClick={() =>{settype("Reclamer un client");setlabelType('Reclamer un client')}}>{t("Reclamer un client")}</a>
          </Dropdown.Item>

          <Dropdown.Item >
              <a type="button"className="nav-link active" aria-current="page" onClick={() =>{settype("site web Bug");setlabelType('site web Bug')}}>{t("site web Bug")} </a>
          </Dropdown.Item>

          <Dropdown.Item >
              <a type="button"className="nav-link active" aria-current="page" onClick={() =>{settype("Autre");setlabelType('Autre')}}>{t("Autre")}</a>
          </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

                            </li>
                        </ul>
                      </div>
                      
                    </div>
                </th>
                <th>      
                </th>
                </tr>  
                </thead>
            </Table>

            <Form.Group className="mb-3 mr-5" controlId="exampleForm.ControlTextarea1">
              <Form.Label>{t("Titre")}</Form.Label>
              <Form.Control
                  type = "text"
                  placeholder={t("Ecrire ici")}
                  autoFocus 
                  className="mb-3" 
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
              />
              <Form.Label placeholder={t("Votre discription")}>Description</Form.Label>
              <Form.Control className="mb-2" as="textarea" rows={5} value={content} onChange={(e) => setcontent(e.target.value)}/>
                
              <p className="mb-2" style={{ color: "red", fontSize:"13px"}}>{error}</p>

              <Button variant="primary" onClick={() => AddMessage() } >
                  {t("Enregister")} 
              </Button>
            </Form.Group>
          </Form>



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
    </div>
  )
}

export default Reclamation;