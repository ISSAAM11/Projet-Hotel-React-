import React, { useEffect,useState,useRef,useReducer,useContext } from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'    
import Table from 'react-bootstrap/Table';
import Pagination from '../PageElement/Pagination';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import UserContext from '../../ContextHandler'
import {useTranslation} from 'react-i18next'
import "../../App.css"

export default function ChoseProduct(props) {
  const [ t, i18n ] = useTranslation()
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
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}

  useEffect(()=> {
    myProduitsList()
    
  } ,[reducerValue])  


  const myProduitsList = async () => {
    setLoading(true)
    axios.get(`http://localhost:3000/myProduitsList/${localStorage.getItem('id')}`,config ).then(
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


    return (
<div>
  <Modal size="lg" show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Choisir un produit")}</Modal.Title>
    </Modal.Header>
    <Modal.Body >
      <Form>
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
                </tr>
            </thead>    
        </Table>
       
        <Table id="example2" className="table " striped bordered hover>
            <thead >           
              <tr >
                <th>#</th>
                <th>{t("Type")}</th>
                <th>{t("Nom de produit")}</th>
                <th>{t("Catégorie")}</th>
                <th>{t("Quantité")}</th>
                <th>{t("Etat")}</th>
              </tr>
            </thead>
            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={2}></td>
                    <td > {t("Chargement")}  <Spinner animation="border" variant="primary" /></td>
                    <td colSpan={3}></td>
                  </tr>
                </tbody>
                : 
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id} >
                  
                  {post.etat == true || post.amount == 0
                  ?<td> </td>   
                  :props.selectedProduct.indexOf(post.id) == -1
                    ?<td> <input type="checkbox" name="react-radio_btn" onChange={()=>props.handleChange(post.id)} /> </td>   
                    :<td> <input type="checkbox" name="react-radio_btn" onChange={()=>props.handleChange(post.id)} defaultChecked={true}/> </td>
                  }
                  <td>{post.type}</td>             
                  <td>{post.name}</td>             
                  <td>{post.category}</td>             
                  <td>{post.amount}</td>             
                  <td>{post.etat
                    ?<div className="card-tools"><span className="badge badge-secondary">Impayé</span></div>
                    :<div className="card-tools"><span className="badge badge-success">Payé</span></div>}
                  </td>         
                </tr>
            ))} 
            </tbody>
          }
        </Table>      
        <Pagination
            currentPage={currentPage}
            Paginate={Paginate} 
            postsPerPage={postsPerPage} 
            totalPosts={searchResults.length}>
        </Pagination>
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="" onClick={() => props.handleClose() }>{t("Retour")}</Button>
      <Button variant="success" onClick={() => props.GetProducts(props.selectedProduct) }>  {t("Choisir")} </Button>
    </Modal.Footer>
  </Modal>
 </div>

)}