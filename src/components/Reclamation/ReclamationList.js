import {useState,useEffect,useRef, useReducer, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import Footer from '../PageElement/Footer';
import Pagination from'../PageElement/Pagination'
import Button from 'react-bootstrap/Button';
import axios from 'axios'    
import Spinner from 'react-bootstrap/Spinner';
import "../../App.css"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {Link, Routes, Route} from 'react-router-dom'
import ReclamationDetails from './ReclamationDetails'
import UserContext from '../../ContextHandler'
import No_Data from "../../Images/NO-DATA.png"

function ReclamationList() {
  const inputEl = useRef("");
  const [ t, i18n ] = useTranslation()
  const [Loading, setLoading] = useState()
  const [reducerValue, forceUpdate] = useReducer(x => x+1, 0)
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
  const [messages , setMessages] = useState([])
  const [searchResults , setsearchResults] = useState([])
  const [switchResults , setswitchResults] = useState([])
  const [searchTerm , setSearchTerm] = useState([])
  const {user, setUser} = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(7)  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);
  const [etatSelected, setetatSelected] = useState(true)
    


  useEffect(()=> {
      getAllMessages()
  } ,[reducerValue])  
  
  const handleUpdate = () => {
    forceUpdate()
  }

  const getAllMessages = async () => {
    setLoading(true)
    axios.get(`http://localhost:3000/messages/${localStorage.getItem('id')}`,config ).then(
      res => {
        setTimeout(() => {
          const listreclamation = res.data.sort((a,b) =>   a.etat - b.etat )
          setMessages(listreclamation)
          setsearchResults(listreclamation) 
          console.log(messages) 
          setLoading(false)
        },400)
      },
      err => {
        setLoading(false)
        console.log(err)
      }
    )            
  }

  const handleSwitchbutton = () => {

    if (etatSelected == true){
      setetatSelected(false)
    }else if (etatSelected == false){
      setetatSelected(true)
    }
    searchHandler (searchTerm) 
  }

  const searchHandler = (term) => {
    setSearchTerm (term)
    let newList = messages
    setCurrentPage(1)
    console.log(etatSelected)
    if(searchTerm !== ""){
      if(etatSelected){
        newList = messages.filter((item) => {
          return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) && item.etat != etatSelected; });
      }else{
        newList = messages.filter((item) => {
          return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())  });
      }
    }else {
      if(etatSelected){
        newList = messages.filter((item) => {
          return messages.etat != etatSelected
        });
      }
    }
    setsearchResults(newList) 

/*
    if (etatSelected == true){
      let newList = searchResults.filter((item) => {
        if(item.etat == true){
          return item
        }
      })
      setsearchResults(newList) 
    }
*/
  };
    
  const Paginate = (PageNumber) => {
    setCurrentPage(PageNumber)
  }

  const getSearchTerm = () => {
      searchHandler(inputEl.current.value)
  }

  const deleteReclamation = (id) => {
    axios.delete(`http://localhost:3000/messages/${id}`,config ).then(
        res => {
          handleUpdate()
        },
        err => {
            setLoading(false)
            console.log( err)
        }
    )            
  }

  
return (

    <div className="content-wrapper page-container" >
    {/* Content Header (Page header) */}
    <div className="content-header ">
      <div className="container-fluid ">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">{t("Reclamation")} </h1>
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
                    <div className=" input-group-sm">
                      <div className="">

  <table >
    <thead>
      <tr>
        <th className="col-xs-12 " colSpan={2}>
           <input ref ={inputEl} onChange={getSearchTerm}className="form-control form-control-navbar" type="search" placeholder={t('placeholder recherche')} aria-label="Search"/>
        </th>
        <th>&nbsp;
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
          </button>&nbsp;
        </th>

        <th> 
{/*          <BootstrapSwitchButton 
          onChange={()=> handleSwitchbutton()} 
          offlabel={t("Tous")}
          onlabel="Clos"  
          width={100} 
              onstyle="primary" offstyle="secondary" />*/}
        </th>
        <th>
          {user ? 
              user.role == 1?
              <Link to="/home/Reclamation"><Button data-testid="Test-btn" className="ml-1">{t("Crée reclamation")}</Button></Link>
              :null
          :null}
        </th>
        </tr>
    </thead>    
  </table>
           </div>
          </div>   
        </div>
        <div className="card-body">
          <table id="example2" className="table  ">
            <thead >           
              <tr >
                <th> </th>
                <th>{t("Date")} </th>
                <th>{t("Type")}</th>
                <th>{t("Nom")}</th>
                <th>{t("Email Distributeur")}</th>
                <th>{t("Titre")}</th>
                <th>{t("Options")} </th>

              </tr>
            </thead>

            {Loading ?
                <tbody>
                  <tr>
                    <td colSpan={7}><center> {t("Chargement")}  <Spinner animation="border" variant="primary" /></center></td>
                  </tr>
                </tbody>
                : currentPosts.length == 0 ? 
                <tbody>
                  <tr>
                    <td colSpan={7}><center><img src={No_Data}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} /></center></td>
                  </tr>
                </tbody>
                : 
                <tbody>
                
                {localStorage.getItem("role") == 1  ?  
                
                  currentPosts.map((post) => (
                  post.unreadbyuser ?
                    <tr key={post.id} style={{backgroundColor:'#FFEFEF'}}>
                        <td>
                            {post.unreadbyuser? <div className="card-tools"><span className="badge badge-danger">Clos</span></div>
                            : null}
                        </td>
                        <td>{post.date}</td>
                        <td>{t(post.type)}</td>
                        <td>{post.source}</td>
                        <td>{post.userEmail}</td>
                        <td>{post.title}</td>
                        <td>
                          <Link to={`${post.id}`}><Button> {t("Afficher")} </Button></Link>
                        </td>
                        <td>
                            <Button variant="danger" onClick={() =>deleteReclamation(post.id)}> {t("Supprimer")}</Button>
                        </td>
                    </tr>
                    : 
                    <tr key={post.id} >
                      <td></td>
                      <td>{post.date}</td>
                      <td>{t(post.type)}</td>
                      <td>{post.source}</td>
                      <td>{post.userEmail}</td>
                      <td>{post.title}</td>
                      <td>
                        <Link to={`${post.id}`}>
                            <Button>  {t("Afficher")} </Button>
                        </Link>
                      </td>
                      <td>
                          <Button variant="danger" onClick={() =>deleteReclamation(post.id)}>{t("Supprimer")}</Button>
                      </td>
                    </tr>
                  )) 
                : 
                currentPosts.map((post) => (
                  !post.etat ?
                    <tr key={post.id} style={{backgroundColor:'#FFEFEF'}}>
                        <td>
                            {!post.etat? <div className="card-tools"><span className="badge badge-danger">Clos</span></div>
                            : null}
                        </td>
                        <td>{post.date}</td>
                        <td>{t(post.type)}</td>
                        <td>{post.source}</td>
                        <td>{post.userEmail}</td>
                        <td>{post.title}</td>
                        <td>
                          <Link to={`${post.id}`}><Button> {t("Afficher")} </Button></Link>
                        </td>
                        <td>
                            <Button variant="danger" onClick={() =>deleteReclamation(post.id)}> {t("Supprimer")}</Button>
                        </td>
                    </tr>
                    : 
                    <tr key={post.id} >
                      <td></td>
                      <td>{post.date}</td>
                      <td>{t(post.type)}</td>
                      <td>{post.source}</td>
                      <td>{post.userEmail}</td>
                      <td>{post.title}</td>
                      <td>
                        <Link to={`${post.id}`}>
                            <Button>  {t("Afficher")} </Button>
                        </Link>
                      </td>
                      <td>
                          <Button variant="danger" onClick={() =>deleteReclamation(post.id)}>{t("Supprimer")}</Button>
                      </td>
                    </tr>
                  )) 
                
                }

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

  <Routes>
    <Route path="/:id" element={<ReclamationDetails/>} />
  </Routes>
</div>

  )
}

export default ReclamationList