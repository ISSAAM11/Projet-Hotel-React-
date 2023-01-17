import React, { useEffect,useState,useRef,useReducer,useContext } from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'    
import Table from 'react-bootstrap/Table';
import Pagination from '../PageElement/Pagination';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import AddHotel from './AddHotel';
import  {General_vard_M}  from './General_vard_M';
import Spinner from 'react-bootstrap/Spinner';
import DeviceAmount from './DeviceAmount'
import UserContext from '../../ContextHandler'
import { Link } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import Footer from '../PageElement/Footer';
import "../../App.css"
import No_Data from "../../Images/NO-DATA.png"

export default function Hotel() {
  const [  t, i18n ] = useTranslation()
  const {user, setUser} = useContext(UserContext);
  const inputEl = useRef("");
  const [Hotels , setHotels] = useState([])
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(7)
  const [searchTerm, setSearchTerm] = useState()
  const [searchResults, setsearchResults] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x+1, 0)

  const [show, setShow] = useState(false);
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [showDeviceAmount, setshowDeviceAmount] = useState(false);
  const [generalCardConfirmation, setgeneralCardConfirmation] = useState(false);
  const [contactType , setContactType] = useState(true)

  const [titleModal, setTitleModal] = useState(false);
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}

  useEffect(()=> {
    getAllHotels()
  } ,[reducerValue])  

  const getAllHotels = async () => {
    setLoading(true)
    axios.get(`http://localhost:3000/hotelsList/${localStorage.getItem('id')}?filter[where][history]=false`,config ).then(
        res => {
            setTimeout(() => {
              setLoading(false)
              setHotels(res.data)
              setsearchResults(res.data)  
            },800)
        },
        err => {
            setLoading(false)
            console.log( err)
        }
    )            
  }

  const handleUpdate = () => {
    forceUpdate();
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  const Paginate = (PageNumber) => {
    setCurrentPage(PageNumber)
    console.log (PageNumber)
  }

  const searchHandler = (term) => {
    setSearchTerm (term)
    setCurrentPage(1)
    if(searchTerm !== ""){
      const newList = Hotels.filter((item) => {
        let search = [item.name,
          item.email,
          item.phone,        
          item.admin_name,
          item.Created_By,
          item.Region,
          item.country,]

        return Object.values(search)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); 
      });
        setsearchResults(newList) 
    }else {
        setsearchResults(Hotels) 
    }
  };

  const getSearchTerm = () => {
      searchHandler(inputEl.current.value)
  }

  const handleClose = () => {
    setShow(false);
    setContactType(true);
  }


  const [ShowDelete, setShowDelete] = useState(false)
  const [reason, setreason] = useState("")

  const handleDelete = (hotel) => {
    const tmp_date = new Date().toISOString().split("T")
    const date = `${tmp_date[0]}`
    hotel.deleteDate = date.toString()
    hotel.reason = reason
    hotel.history = true

    axios.put(`http://localhost:3000/hotels/History/${hotel.id}`, hotel ,config ).then(
      res => {
        forceUpdate();
        setThisHotel(null)
        handleCloseDelete()
        console.log(res.data)
      },
      err => {
        console.log(err.response.data.error)
      }
    )
  }
  const handleOpenDelete=(post) => {
    setShowDelete(true); 
    setThisHotel(post)
  }
  const handleCloseDelete = ()=> {
    setShowDelete(false)
  }

  const handleGeneralCard =(post)=> {
    const newpost = post
    newpost.general_card = !newpost.general_card
    console.log(newpost.id)


      axios.put(`http://localhost:3000/hotels/${post.id}`, newpost ,config).then(
      res => { forceUpdate();},
      err => { console.log( err) }
    )
  }
  
  const [thisHotel, setThisHotel] = useState(true)
  const [enable, setenable] = useState(true)

  const handleShowAdd = () => {
    setShow(true);  
    setTitleModal("Create un distributeur")
    setenable(true)
  } 
  
  const handleOpenConfirmation=(post) => {
    setShowConfirmation(true); 
    setenable(post.enable)
    setThisHotel(post)
  }
  const handleCloseConfirmation=() => setShowConfirmation(false); 

  const handleEnable =() =>{
    const newpost = thisHotel
    newpost.enable = !newpost.enable
    axios.put(`http://localhost:3000/hotels/${newpost.id}`,newpost ,config).then(
        res => {
          forceUpdate();
          handleCloseConfirmation();
        },
        err => {
          console.log( err)
        }
      )
    }
  const handleCloseGeneralCardConfirmation=() => setgeneralCardConfirmation(false)

  const [Hotel, setHotel] = useState([])
  const ShowDeviceAmount = (Hotel) => {
    setshowDeviceAmount(true);
    setHotel(Hotel)
} 
  const CloseDeviceAmount = () => setshowDeviceAmount(false);

  const changeEmail =(e) =>{
    setContactType( true )
    console.log(contactType)
  }
  const changeTelephone =(e) =>{
    setContactType( false )
    console.log(contactType)
  }
    return (
<div>

  <AddHotel show={show} thisHotel={thisHotel} handleClose={ show => handleClose()} update={() => handleUpdate()} changeEmail={() => changeEmail()} changeTelephone={() =>changeTelephone()} contactType={contactType}/>
  <General_vard_M show={generalCardConfirmation} handleClose= {handleCloseGeneralCardConfirmation}/>
  <DeviceAmount show={showDeviceAmount} Hotel={Hotel} handleClose={ showDeviceAmount => CloseDeviceAmount()} />

  <div className="content-wrapper page-container" >
    {/* Content Header (Page header) */}
    <div className="content-header ">
      <div className="container-fluid ">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">Hotel </h1>
          </div>{/* /.col */}
        </div>{/* /.row */}
        <hr></hr>
      </div>{/* /.container-fluid */}
    </div>

    <section className="content">
      <div className="container-fluid">

        <div className="row">

        <div className="container-fluid">
  <div className="row">
    <div className="col-12">
      <div className="card">
        
        <div className="card-header ">

          <Table borderless>
                <thead>
                    <tr>
                        <th className="col-xs-12 col-md-3" colSpan={2}>
                            <input className="form-control form-control-navbar" ref ={inputEl} onChange={getSearchTerm} type="search" placeholder={t('placeholder recherche')} aria-label="Search"/>
                        </th>
                    
                        <th>
                        <button 
                            className="btn btn-outline-dark" 
                            type="button" 
                            disabled={Loading}
                            style={{whiteSpace: 'nowrap'}}
                            onClick={!Loading ? handleUpdate : null}>
                            {Loading ?
                              <div>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                &nbsp; {t("Chargement")}
                              </div>
                            : <>{t("Rafraîchir")}</> } 
                        </button> 

                        </th>
                        <th>
                          <i className=""><center> 
                            <a href='https://supplier.sciener.com/plug-in/CP210x_Windows_Win10_Drivers.rar' download>{t("Télécharger le pilote")}</a>
                            </center></i>
                        </th>
                        <th >
                          |
                        </th>
                        <th>
                        <i className=""> 
                          <center>
                            <a href='https://supplier.sciener.com/plug-in/CardEncoderAssistant.zip' download>{t("Télécharger l'assistant")} </a>
                          </center></i>
                        </th>
                        <th>
                            <Link to="historique" className="nav-link ">
                                <button className="btn btn-outline-dark" type="button" >
                                    {t("Historique")}
                                </button>
                            </Link>
                          
                        </th>
                        <th>
                          <Button variant="primary" type="button" style={{whiteSpace: 'nowrap'}} onClick={handleShowAdd}>{t("Crée un hotel")}</Button>
                        </th>
                    </tr>
                </thead>    
                </Table>
        </div>

        <div className="card-body">
          <table id="example2" className="table  ">
            <thead >           
              <tr >
                <th>{t("Nom de l'hôtel")}</th>
                <th>{t("Nom Admin")}</th>
                <th>{t("Administrateur")}</th>
                <th>{t("Créé à")} </th>
                <th>{t("Secteurs valides")} </th>
                <th>{t("Support pass général")} </th>
                <th>{t("Options")} </th>
              </tr>
            </thead>
            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={7}><center> {t("Chargement")}  <Spinner animation="border" variant="primary" /></center></td>
                  </tr>
                </tbody>
            :currentPosts.length == 0 
              ?<tr>
                <td colSpan={7}> <center>
                  <img src={No_Data}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} /></center>
                </td>
              </tr>
            :
            <tbody>
              {currentPosts?.map((post) => (
            <tr key={post.id} >
                          {/*<tr key={post.id} {/*style={{backgroundColor: post.enable? "red": null}}*/}

              {post.enable? <td>{post.name}</td>
                          : <td style={{ color: '#CE0000' }}>{post.name}</td>
              }
              {post.enable? <td>{post.Created_By}</td>
                          : <td style={{ color: '#CE0000' }}>{post.Created_By}</td>
              }              
              {post.enable? <td>{post.admin_name}</td>
                          : <td style={{ color: '#CE0000' }}>{post.admin_name}</td>
              }
              {post.enable? <td>{post.date}</td>
                          : <td style={{ color: '#CE0000' }}>{post.date}</td>
              }              
              {post.enable? <td>1,2,3,4</td>
                          : <td style={{ color: '#CE0000' }}>1,2,3,4</td>
              }              
                <td>
                  <Form ><center>
                  {post.enable? 
                    <Form.Check  
                      center 
                      type="switch"
                      id="custom-switch"
                      defaultChecked={post.general_card}
                      onChange={() => handleGeneralCard(post)}/>
                    :
                    <Form.Check  
                      center 
                      disabled
                      type="switch"
                      id="custom-switch"
                      defaultChecked={post.general_card}
                      onClick={() => handleGeneralCard(post)}/>
                  }
                  </center></Form>
                </td>
                <td>
                  {post.enable?
                    <DropdownButton id="dropdown-basic-button" title="Options">
                      <Dropdown.Item >{t("Encoder l'encodeur de cartes")}</Dropdown.Item>
                      <Dropdown.Item >{t("Encoder la carte")}</Dropdown.Item>
                      <Dropdown.Item onClick={() => ShowDeviceAmount(post)}>{t("Nombre de dispositifs")}</Dropdown.Item>
                      <Dropdown.Item > {t("Décoder la carte")}</Dropdown.Item>
                      <Dropdown.Item style={{ color: '#CE0000' }} onClick={() => handleOpenConfirmation(post)}>{t("Désactiver")}</Dropdown.Item>
                      <Dropdown.Item style={{ color: '#CE0000' }} onClick={() => handleOpenDelete(post)}>{t("Supprimer")}</Dropdown.Item>
                    </DropdownButton>
                    :  
                    <DropdownButton id="dropdown-basic-button" title="Options" variant="danger">
                      <Dropdown.Item style={{ color: 'blue' }} onClick={() => handleOpenConfirmation(post)}>{t("Activer")}</Dropdown.Item>
                      <Dropdown.Item style={{ color: '#CE0000' }} onClick={() => handleOpenDelete(post)}>{t("Supprimer")}</Dropdown.Item>
                    </DropdownButton>
                  }
                </td>

            </tr>
            ))} 

            </tbody>
          }
          </table>
          <Pagination 
                currentPage={currentPage}
                Paginate={Paginate} 
                postsPerPage={postsPerPage} 
                totalPosts={searchResults.length}>

          </Pagination>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>  

      </div>
    </section>
          <Footer ></Footer>

  </div>


  <Modal  show={ShowConfirmation} onHide={handleCloseConfirmation}>
    <Modal.Body >
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        {enable ? 
            <Form.Label> {t("Bloquer Hotel")} </Form.Label>
            :<Form.Label> {t("Débloquer Hotel")} </Form.Label>                
        }
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="" onClick={() => handleCloseConfirmation()}>
        Close
      </Button>
      {enable ? 
        <Button variant="danger" onClick={() => handleEnable()}> Disable </Button>
        :<Button variant="primary" onClick={() => handleEnable()}> Enable</Button>
      }  
    </Modal.Footer>
  </Modal>

  <Modal  show={ShowDelete} onHide={handleCloseDelete}>
    <Modal.Body >
      <Modal.Header closeButton>
          <Modal.Title>{t("Supprimer Hotel")}</Modal.Title>
      </Modal.Header>
      <Form>
        <Form.Group className="mt-3 mb-2" controlId="exampleForm.ControlInput1">
            <Form.Label className="mb-3"  > {t("C'est quoi votre motif")}</Form.Label>
            <Form.Control
            type = "reason"
            placeholder={t("Ecrire ici")}
            value={reason}
            onChange={(e) => setreason(e.target.value)}/>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="" onClick={() => handleCloseDelete()}> {t("Retour")} </Button>
      <Button variant="danger" onClick={() => handleDelete(thisHotel)}> {t("Supprimer")} </Button>
    </Modal.Footer>
  </Modal>

 </div>

        )
}