import React, { useEffect, useState, useRef, useReducer,useContext } from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Pagination from '../PageElement/Pagination'
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import emailjs from '@emailjs/browser';
import Footer from '../PageElement/Footer';
import UserContext from '../../ContextHandler'
import {useTranslation} from 'react-i18next'
import PhoneInput2 from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import "../../App.css"
import No_Data from "../../Images/NO-DATA.png"

function Distributors() {
  const config = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }

  const {user, setUser} = useContext(UserContext);
  const [ t, i18n ] = useTranslation()

  const form = useRef();
  const inputEl = useRef("");
  const [Distributors, setDistributors] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState()
  const [searchResults, setsearchResults] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)

  const [show, setShow] = useState(false);
  const [ShowConfirmation, setShowConfirmation] = useState(false);

  const [modify, setModify] = useState(false);
  const [titleModal, setTitleModal] = useState(false);

  //user detailes   
  const [thisUser, setThisUser] = useState([])
  const [id, setId] = useState("");
  const [username, setUsername] = useState();
  const [contact, setContact] = useState("");
  const [telephone, setTelephone] = useState();
  const [email, setEmail] = useState();
  const [password, setpassword] = useState("");
  const [tokenRefreshedAt, settokenRefreshedAt] = useState();
  const [role, setrole] = useState();
  const [date, setdate] = useState("");
  const [hotelNumber, sethotelNumber] = useState();
  const [enable, setenable] = useState(true);
  const [subDistributor, setsubDistributor] = useState()
  const [imageURL, setimageURL] = useState()
  const [errorUsername , setErrorUsername] = useState()
  const [errorEmail , setErrorEmail] = useState()


  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:3000/usersList/${localStorage.getItem('id')}`, config).then(
      res => {
        setTimeout(() => {
          setDistributors(res.data)
          setsearchResults(res.data)
          console.log("one time")
          setLoading(false)
        }, 800)
      },
      err => {
        setLoading(false)
        console.log(err)
        console.log("one time error")
      }
    )
  }, [reducerValue])

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
    setSearchTerm(term)
    const HotelDistributors = Distributors.filter(
      (item) => item.role !== 2
    );
    setCurrentPage(1)

    if (searchTerm !== "") {
      const newList = HotelDistributors.filter((item) => {
        let search = [item.username,
        item.email,
        item.telephone,        
        item.contact,
        item.lockSupplier]

        return Object.values(search)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setsearchResults(newList)
    } else {
      setsearchResults(HotelDistributors)

      HotelDistributors.Foreach(function(Distributor){
        Distributor.idcreator.Foreach(function(idCreator){
          if(idCreator == user.id)
            HotelDistributors.push(Distributor) 
        })
      })

      HotelDistributors.Foreach(function(Distributor){
        if(Distributor.role >= user.role)
          HotelDistributors.splice(Distributor , 1)
      })

    }
  };

  const getSearchTerm = () => {
    searchHandler(inputEl.current.value)
  }

  const handleEnable = () => {
    const newpost = thisUser
    newpost.enable = !newpost.enable
    console.log(thisUser)
    axios.put(`http://localhost:3000/usersAttribute/${newpost.id}`, newpost, { config }).then(
      res => {
        forceUpdate();
        handleCloseConfirmation();
      },
      err => {
        console.log(err)
      }
    )
  }

  const handleClose = () => {
    setShow(false);
    setErrorUsername("")
    setErrorEmail("")

  }

  const handleOpenConfirmation = (post) => {
    setShowConfirmation(true);
    setenable(post.enable)
    setThisUser(post)
  }
  const handleCloseConfirmation = () => setShowConfirmation(false);

  const handleShowAdd = () => {
    setShow(true);
    setUsername("")
    setEmail("")
    setContact("")
    setTelephone()
    setpassword("")
    setimageURL("")
    setenable(true)
    settokenRefreshedAt(2)
    sethotelNumber(0)
    setsubDistributor(user.username)
    setrole(1)
    setTitleModal(t("Crée un distributeur"))
  }

  const handleAdd = async () => {
    let error = false
    
    if(username == null || username == ""){
      setErrorUsername(t("Nom d'utilisateur est nécessaire"))
      error = true
    }
    if(email == null|| email == "" ){
      setErrorEmail( t("L'e-mail est requis"))
      error = true
    }else{
      const emailRegPattern = /\S+@\S+\.\S+/;
      if ( !emailRegPattern.test(email) && email != ""  ) {
        setErrorEmail(t("L'adresse e-mail n'est pas valide"));
        error = true
      }
    }
    if(error == false ){    
      
      const tmp_date = new Date().toISOString().split("T")
      const date = `${tmp_date[0]}`
      const lockSupplier = (Date.now() % 100000000000).toString()
      const user = { username, contact, email, telephone, password, lockSupplier, tokenRefreshedAt, role, date, hotelNumber, subDistributor,imageURL ,enable }
      
      await axios.post(`http://localhost:3000/users/${localStorage.getItem('id')}`, user, { config }).then(
        res => {
          forceUpdate();
          setShow(false);
        },
        err => {
          console.log(err)
          alert(err.response.data.error.message)
        }
      )
    }
    
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/users/${id}`, config).then(
      res => {
        forceUpdate();
      },
      err => {
        console.log(err)
      }
    )
  }

  const handleModify = (post) => {
    setShow(true);
    setThisUser(post)
    console.log(post)
    setId(post.id)
    setUsername(post.username)
    setEmail(post.email)
    setContact(post.contact)
    setTelephone(post.telephone)
    setpassword(post.password)
    settokenRefreshedAt(post.tokenRefreshedAt)
    setrole(post.role)
    setdate(post.date)
    setimageURL(post.imageURL)
    sethotelNumber(post.hotelNumber)
    setsubDistributor(post.subDistributor)
    setenable(post.enable)
    setModify(true)
    setTitleModal("Modifer distributeur")
    console.log(post.email)
  }
  
  const test = () => {
    if (modify) { handlePut(); }
    else { handleAdd(); }
  }


  const handlePut = () => {
    let error = false
    
    if(username == null || username == ""){
      setErrorUsername("username is required")
      error = true
    }
    if(email == null || email == ""){
      setErrorEmail( "Email is required")
      error = true
    }else{
      const emailRegPattern = /\S+@\S+\.\S+/;
      if (!emailRegPattern.test(email)) {
        setErrorEmail('The email address is not valid');
        error = true

      }
    }
    if(error == false ){  
        const newpost = { id, username, contact, email, telephone, hotelNumber, enable , imageURL}
        axios.put(`http://localhost:3000/usersAttribute/${newpost.id}`, newpost, { config }).then(
          res => {
            forceUpdate();
            setShow(false)
            setModify(false)

            setId()
            setUsername("")
            setEmail("")
            setContact("")
            setTelephone()
            setpassword("")
            settokenRefreshedAt()
            setrole()
            setdate("")
            setimageURL("")
            sethotelNumber()
            setsubDistributor("")
            setenable(true)
          },
          err => {
            console.log(err.response)
          }
        )
    }   
  }
/*    
  var date = Date(post.date)
  var year = date.getFullYear()
  var mounth = date.getMount() + 1
  var day = date.getDate()
  var fdate = day + "/" + mounth + "/" + year
*/
 
      //dbstrzwhl
      //Hotel website
      //https://api.cloudinary.com/v1_1/
  const [file, setFile] = useState(null)
  const postImg = async () => {
    
      console.log(file)
      const form = new FormData()
      form.append('file',file)
      form.append('upload_preset','Hotel website')
      await axios.post("https://api.cloudinary.com/v1_1/dbstrzwhl/upload", form)
  }

  const postImage = async (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    const form = new FormData()
    form.append('file',file)
    form.append('upload_preset','Hotel website')
    await axios.post("https://api.cloudinary.com/v1_1/dbstrzwhl/upload", form).then(
      res => {
        console.log (res.data.secure_url)
        setimageURL(res.data.secure_url)
      }
    )
  }

  return (
    <div>
      <div className="content-wrapper page-container">
        {/* Content Header (Page header) */}
        <div className="content-header ">
          <div className="container-fluid ">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Distributeur</h1> 

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
                        <div className="input-group input-group-sm">
                          <div className="input-group-append">

                            <table >
                              <thead>
                                <tr>
                                  <th className="col-xs-12 col-md-7" colSpan={4}>
                                    <input className="form-control form-control-navbar col-md-20" ref={inputEl} onChange={getSearchTerm} type="search" placeholder={t("placeholder recherche Distriuteur")} aria-label="Search" />
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
                                    <Button variant="primary" type="button" onClick={() => handleShowAdd()} style={{ whiteSpace: 'nowrap' }}>
                                      {t("Crée un distributeur")}
                                    </Button>
                                  </th>
                                </tr>
                              </thead>
                            </table>

                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <table id="example2" className="table ">
                          <thead >
                            <tr >
                              <th>{t("Nombre")}</th>
                              <th>{t("Nom distributeur")}</th>
                              <th>{t("Contact")}</th>
                              <th>{t("Téléphone")}</th>
                              <th>{t("Email")}</th>
                              <th>{t("Créé à")}</th>
                              <th>{t("Nombre d'hôtels")}</th>
                              <th>{t("Distributeur subordonné")}</th>
                              <th>{t("Options")}</th>
                            </tr>
                          </thead>
                          {Loading ?
                            <tbody>
                              <tr>
                                <td colSpan={5}></td>
                                <td colSpan={9}> {t("Chargement")}  <Spinner animation="border" variant="primary" /></td>
                                <td colSpan={3}></td>
                              </tr>
                            </tbody>

                            : currentPosts.length == 0 ? 
                              <tbody>
                                <tr>
                                  <td colSpan={9}><center><img src={No_Data}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} /></center></td>
                                </tr>
                              </tbody>

                            :<tbody>
                              {
                                currentPosts.map((post) => ( 

                                  <tr key={post.id} >
                                    

                                    {post.enable ? <td>{post.lockSupplier}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.lockSupplier}</td>}

                                    {post.enable ? <td>{post.username}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.username}</td>}

                                    {post.enable ? <td>{post.contact}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.contact}</td>}

                                    {post.enable ? <td>{post.telephone}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.telephone}</td>}

                                    {post.enable ? <td>{post.email}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.email}</td>}

                                    {post.enable ? <td>{post.date}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.date}</td>}

                                    {post.enable ? <td>{post.hotelNumber}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.hotelNumber}</td>}

                                    {post.enable ? <td>{post.subDistributor}</td>
                                      : <td style={{ color: '#CE0000' }}>{post.subDistributor}</td>}


                                    <td>
                                      <center>
                                        <Dropdown>
                                          {post.enable ?
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            </Dropdown.Toggle>
                                            :
                                            <Dropdown.Toggle variant="danger" id="dropdown-basic">
                                            </Dropdown.Toggle>
                                          }

                                          <Dropdown.Menu >
                                            {post.enable ? <Dropdown.Item onClick={() => handleOpenConfirmation(post)} href="" style={{ color: '#CE0000' }}> Disable </Dropdown.Item>
                                              : <Dropdown.Item onClick={() => handleOpenConfirmation(post)} href="" style={{ color: '#0073CE' }}> Enable </Dropdown.Item>}
                                            <Dropdown.Item href="" onClick={() => handleModify(post)}> Modifier </Dropdown.Item>
                                            <Dropdown.Item href="" style={{ color: '#CE0000' }} onClick={() => handleDelete(post.id)}> Delete </Dropdown.Item>

                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </center>

                                    </td>
                                  </tr>
                                

                                ))}
                              {/* :<h4 className='center'> No Distributors available </h4>*/}
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
        <Footer></Footer>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{titleModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={form} >
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
              <center>
                <div className="photo-pic-div">
                  {imageURL? <img id="photo" src={imageURL}  ></img> :
                  <img id="photo" src="https://res.cloudinary.com/dbstrzwhl/image/upload/v1663343011/rjqidl113aqwzb6tgzyx.jpg" ></img>  }
                  <input type="file" id="file" accept="image/*" onChange={postImage}/>
                  <label for="file" id="uploadBtn"> modify </label>
                </div>
              </center>
              
              <Form.Label> {t("Entrer nom distributeur")}</Form.Label>
              <div className="mb-3">
                <Form.Control
                  type="text"
                  name="to_name"
                  placeholder={t("Ecrire ici")}
                  autoFocus
                  className=""
                  value={username}
                  onChange={(e) => {setUsername(e.target.value); setErrorUsername("") }}
                />
                <center>
                  <p className="mb-1" style={{ padding: "2px" , color: "red", fontSize:"13px"}}>{errorUsername}</p>
                </center>
              </div>


              


              <Form.Label> {t("Contact")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("Ecrire ici")}
                name="contact"
                autoFocus
                className="mb-3"
                value={contact}
                onChange={(e) => setContact(e.target.value)}

              />
              <Form.Label> {t("Téléphone")}</Form.Label>
                  
              <PhoneInput2
                country={null}
                value={telephone}
                onChange={telephone => {setTelephone(telephone);}}
                className="mb-3 "
                placeholder={t("Ecrire ici")}
                inputStyle={{width:'100%'}}
              />

              <div>
                <Form.Label> {t("Email")}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder={t("Ecrire ici")}
                  autoFocus
                  className="mb-1" 
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); setErrorEmail("")}}
                />
                <center><p className="mb-1" style={{ color: "red", fontSize:"13px"}}>{errorEmail}</p></center>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={() => test()}>
            {t("Enregister")}
          </Button>
        </Modal.Footer>
      </Modal>




      <Modal show={ShowConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {enable ?
                <Form.Label> Continuer à bloquer ce compte ? Il ne pourra pas se connecter au système du fournisseur </Form.Label>
                : <Form.Label> continuer à activer ce compte ? </Form.Label>
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
            : <Button variant="primary" onClick={() => handleEnable()}> Enable</Button>
          }
        </Modal.Footer>
      </Modal>

    </div>
  )

}
export default Distributors