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

export default function ChoseHotel(props) {
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


  const handleEnable=()=>{}

return (
<div>
  <Modal size="lg" show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Choisir un hôtel")}</Modal.Title>
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
                <th> # </th>
                <th>{t("Nom de l'hôtel")}</th>
                <th>{t("Nom Admin")}</th>
                <th>{t("Administrateur")}</th>
                <th>{t("Créé à")} </th>
                <th>{t("Support pass général")} </th>
              </tr>
            </thead>
            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={2}></td>
                    <td ><center> {t("Chargement")}  <Spinner animation="border" variant="primary" /></center></td>
                    <td colSpan={3}></td>
                  </tr>
                </tbody>
                : 
            <tbody>
              {currentPosts.map((post) => (
            <tr key={post.id} >
            {props.SelectedHotel == post.id
                ?<td> <input type="radio" name="react-radio_btn" 
                          value={post.id} checked
                          onChange={ (e)=> {props.setSelectedRadio (e.target.value);console.log(e.target.value)}}
                    /> </td>
                :<td> <input type="radio" name="react-radio_btn" 
                    value={post.id}
                    onChange={ (e)=> {props.setSelectedRadio (e.target.value);console.log(e.target.value)}}
                    /> </td>
            }
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
                           
                <td>
                  <Form ><center>
                  {post.enable? 
                    <Form.Check  
                      center 
                      disabled
                      type="switch"
                      id="custom-switch"
                      defaultChecked={post.general_card}
                      />
                    :
                    <Form.Check  
                      center 
                      disabled
                      type="switch"
                      id="custom-switch"
                      defaultChecked={post.general_card}
                      />
                  }
                  </center></Form>
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
      <Button variant="success" onClick={() => props.getHotelDetails(props.SelectedHotel) }> {t("Choisir")} </Button>
    </Modal.Footer>
  </Modal>

 </div>

        )
}