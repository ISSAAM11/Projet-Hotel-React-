import React, { useEffect,useState,useRef,useReducer,useContext } from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'    
import Table from 'react-bootstrap/Table';
import Pagination from '../PageElement/Pagination';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import UserContext from '../../ContextHandler'
import { Link } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import Footer from '../PageElement/Footer';
import "../../App.css"
import AddProduct from './AddProduct';
import ModifyProduct from './ModifyProduct';
import No_Data from "../../Images/NO-DATA.png"

export default function Product() {
  const [ t, i18n ] = useTranslation()
  const {user, setUser} = useContext(UserContext);
  const [products , setproduct] = useState([])
  const inputEl = useRef("");
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(7)
  const [searchTerm, setSearchTerm] = useState()
  const [searchResults, setsearchResults] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x+1, 0)

  
  const [show, setShow] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [contactType , setContactType] = useState(true)
  const [thisProduct, setthisProduct] = useState();
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}

  useEffect(()=> {
    getAllProducts()
  } ,[reducerValue])  

  const getAllProducts= async () => {
    setLoading(true)
    axios.get(`http://localhost:3000/myProduitsList/${localStorage.getItem('id')}`,config ).then(
        res => {
          setTimeout(() => {
            setLoading(false)
            setproduct(res.data)
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
      const newList = products.filter((item) => {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); 
      });
        setsearchResults(newList) 
    }else {
        setsearchResults(products) 
    }
  };

  const getSearchTerm = () => {
      searchHandler(inputEl.current.value)
  }

  const handleClose = () => { setShow(false)}
  const handleShow = () =>  { setShow(true)}

  
  const handleClosemodify = () => { setShowModify(false)}

  const handleShowModify = (post) => {
    setthisProduct(post)
    console.log(post)
    setTimeout(() => {
    setShowModify(true)
    },100)
  }

  const handleModify = (produit) => {
    setLoading(true)

    axios.put(`http://localhost:3000/Produits/${produit.id}`,config ).then(
      res => {
      },
      err => {
          setLoading(false)
          console.log( err)
      }
    )            
  }
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/produits/${id}/${user.id}`,config ).then(
      res => {
        forceUpdate()
      },
      err => {
          setLoading(false)
          console.log( err)
      }
    )  
  }

    return (
<div>
      <ModifyProduct show={showModify} thisProduct={thisProduct} reducerValue={reducerValue}
                  handleClose={ show => handleClosemodify()} update={() => handleUpdate()}
      ></ModifyProduct>

      <AddProduct show={show} thisProduct={thisProduct} 
                  handleClose={ show => handleClose()} update={() => handleUpdate()}
      ></AddProduct>

  <div className="content-wrapper page-container" >
    {/* Content Header (Page header) */}
    <div className="content-header ">
      <div className="container-fluid ">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">{t("Produit")}</h1>
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
          <table >
            <thead>
            <tr>
                <th className="col-xs-12 col-md-7" colSpan={3}>
                <input className="form-control form-control-navbar col-md-20" ref={inputEl} onChange={getSearchTerm} type="search" placeholder={t("nom de produit, category")} aria-label="Search" />
                </th>
                <th>
                <button
                    className="btn btn-outline-dark"
                    type="button"
                    disabled={Loading}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={!Loading ? handleUpdate : null}>
                    {Loading ?
                    <div>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        &nbsp; {t("Chargement")}
                    </div>
                    : <>{t("Rafraîchir")}</>}

                </button>
                </th>
                <th>&nbsp;</th>
                <th >
                <Button variant="primary" type="button" style={{ whiteSpace: 'nowrap' }} onClick={ () => handleShow() }>
                    {t("Ajouter un produit")}
                </Button>
                </th>
              </tr> 
            </thead>
          </table>
        </div>
        <div className="card-body">
          <table id="example2" className="table  ">
            <thead >           
              <tr >
                <th>{t("Type")}</th>
                <th>{t("Nom de produit")}</th>
                <th>{t("Catégorie")}</th>
                <th>{t("Quantité")}</th>
                <th>{t("Prix")}</th>
                <th>{t("Etat")}</th>
                <th>{t("Options")} </th>
              </tr>
            </thead>
            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="ml-5" ><center className="ml-5"> {t("Chargement")}  <Spinner animation="border " variant="primary" /></center></td>
                    <td colSpan={4}></td>
                  </tr>
                </tbody>

              : currentPosts.length == 0 ? 
              <tbody>
                <tr>
                  <td colSpan={9}><center><img src={No_Data}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} /></center></td>
                </tr>
              </tbody>
              : 
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id} >
                  <td>{t(post.type)} </td>             
                  <td>{post.name}</td>             
                  <td>{post.category}</td>             
                  <td>{post.amount}</td>             
                  <td>{post.prix} DT</td>             
                  <td>{post.etat
                    ?<div className="card-tools"><span className="badge badge-secondary">{t("Impayé")}</span></div>
                    :<div className="card-tools"><span className="badge badge-success">{t("Payé")}</span></div>}
                  </td>         
                  <td>
                    <DropdownButton id="dropdown-basic-button" title="Options">
                      <Dropdown.Item onClick={() => handleShowModify(post)} > {t("Modifier")}</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(post.id)} style={{ color: '#CE0000' }} >{t("Supprimer")}</Dropdown.Item>
                    </DropdownButton>
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
</div>

        )
}