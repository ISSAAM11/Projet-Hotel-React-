import React, { useContext, useEffect,useRef ,useReducer , useState } from 'react';
import axios from 'axios'    
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Pagination from '../PageElement/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import UserContext from '../../ContextHandler'
import {useTranslation} from 'react-i18next'
import Button from 'react-bootstrap/Button';

import Footer from '../PageElement/Footer'
const Historique = ()  => {
  const {user, setUser} = useContext(UserContext);
  const [ t, i18n ] = useTranslation()

  const inputEl = useRef("");
  const [Hotels , setHotels] = useState([])
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(7)
  const [searchTerm, setSearchTerm] = useState()
  const [searchResults, setsearchResults] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x+1, 0)
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [ThisHotel, setThisHotel] = useState();
  
  let linkhotels = "/home/hotels"
  if (user?.role == 0)
    linkhotels = "/Admin/hotels"
  
  const config  = {headers: { Authorization : 'Bearer ' +localStorage.getItem('token') } }
  useEffect(()=> {
    getAllHotels()
  } ,[reducerValue])  

  const getAllHotels = async () => {
    setLoading(true)
    
    axios.get(`http://localhost:3000/hotelsList/${localStorage.getItem('id')}?filter[where][history]=true`,config ).then(
        res => {
            setTimeout(() => {
              setLoading(false)
              setHotels(res.data)
              setsearchResults(res.data)  
            },800)
        },
        err => {
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
  }

  const searchHandler = (term) => {
    setSearchTerm (term)

    if(searchTerm !== ""){
      const newList = Hotels.filter((item) => {
        return Object.values(item)
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


  const ReactivateHotel =(hotel) =>{
   
    hotel.deleteDate = ""
    hotel.reason = ""
    hotel.history = false

    axios.put(`http://localhost:3000/hotels/History/${hotel.id}`, hotel ,config ).then(
      res => {
        forceUpdate();
        console.log(res.data)
      },
      err => {
        console.log(err.response.data.error)
      }
    )
  }

  const finaldelete = (hotel) => {
    console.log(hotel)
    axios.delete(`http://localhost:3000/hotels/${hotel.id}`, config ).then(
      res => {
        forceUpdate();
        handleCloseConfirmation()
      },
      err => {
        console.log(err)
      }
    )
  }

  const handleOpenConfirmation=(post) => {
    setShowConfirmation(true); 
    setThisHotel(post)
  }
 
  const handleCloseConfirmation=() => setShowConfirmation(false); 

  return (
<div>

  <div className="content-wrapper page-container">
    {/* Content Header (Page header) */}
    <div className="content-header ">
      <div className="container-fluid ">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark"><Link to={linkhotels} aria-current="page">Hotel</Link> / {t("Historique")}</h1>
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
        
        <div className="card-header ">

          <Table borderless>
                <thead>
                    <tr>
                        <th className="col-xs-12 col-md-3" colSpan={2}>
                            <input className="form-control form-control-navbar" ref ={inputEl} onChange={getSearchTerm} type="search" placeholder="Nom hôtel,  nom admin,  Admin ..." aria-label="Search"/>
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
                                &nbsp; Chargement..
                              </div>
                            : "Rafraîchir"}
                        </button> 

                        </th>
                    </tr>
                </thead>    
                </Table>
        </div>

        <div className="card-body">
          <Table id="example2" className="table  ">
            <thead >           
              <tr >
                <th>{t("Nom")}</th>
                <th>{t("Crée à")}</th>
                <th>{t("Supprimer à")}</th>
                <th>{t("Motif")}</th>
                <th>Options </th>
              </tr>
            </thead>
            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={2}></td>
                    <td > <center>{t("Chargement")}  <Spinner animation="border" variant="primary" /></center></td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
                
                : <tbody>
                {
                  currentPosts.map((post) => ( 

                    <tr key={post.id} >
                      <td>{post.name}</td>
                      <td>{post.date}</td>
                      <td>{post.deleteDate}</td>
                      <td>{post.reason}</td>
                      <td>
                        <DropdownButton id="dropdown-basic-button" title="Options">
                          <Dropdown.Item onClick={() => ReactivateHotel(post)}>{t("Réactiver")}</Dropdown.Item>
                          <Dropdown.Item style={{ color: '#CE0000' }} onClick={() => handleOpenConfirmation(post)}>{t("Supprimer definitivement")}</Dropdown.Item>
                        </DropdownButton>      
                      </td>         
                    </tr>
                  ))}
                </tbody>
            }
          </Table>

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
        <Form.Label> {t("Êtes-vous sûr? cet hôtel sera définitivement supprimé")} </Form.Label>
    </Form.Group>
  </Form>
</Modal.Body>
<Modal.Footer>
  <Button variant="" onClick={() => handleCloseConfirmation()}> Close</Button>
    <Button variant="danger" onClick={() => finaldelete(ThisHotel)}> Disable </Button>
</Modal.Footer>
</Modal>

</div>




  )
}
export default Historique;