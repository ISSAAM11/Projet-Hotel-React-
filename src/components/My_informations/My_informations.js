import { useEffect,useState,useReducer  } from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'    
import Table from 'react-bootstrap/Table';
import 'react-phone-number-input/style.css'
import {useTranslation} from 'react-i18next'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import M_PhoneNumber from './M_PhoneNumber';
import M_Password from './M_Password';
import Footer from '../PageElement/Footer';
import '../../App.css'
import './My_informations.css'
import ImageCorp from './ImageCorp'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function My_information() {
  const [ t, i18n ] = useTranslation()

  const [user, setUser] = useState([])
  const [show, setShow] = useState(false);
  const [nomBabel, setnomBabel] = useState("test");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [reducerValue, forceUpdate] = useReducer(y => y+1, 0)
  
//user
  const [id, setId] = useState("");
  const [username, setusername] = useState("")
  const [contact, setcontact] = useState("")
  const [telephone, settelephone] = useState("")
  const [email, setemail] = useState("")
  const [hotelNumber, sethotelNumber] = useState();
  const [enable, setenable] = useState(true);
  const [password, setpassword] = useState("")
  const [file, setFile] = useState(null)
  const [imageURL, setImageURL] = useState("")

  const [error, seterror] = useState("")
  const config = { headers: { Authorization : 'Bearer ' +localStorage.getItem('token')} }

  useEffect(()=> {
      getUser()

  },[reducerValue])

  const handleUpdate = () => forceUpdate();
  
  const getUser = () => {

     axios.get(`http://localhost:3000/users/${localStorage.getItem('id')}`,config ).then(
      res => {
        setUser(res.data)
        setId(res.data.id)
        setusername(res.data.username)
        setemail(res.data.email)
        setcontact(res.data.contact)
        settelephone(res.data.telephone)
        setpassword(res.data.password)
        sethotelNumber(res.data.hotelNumber)
        setenable(res.data.enable)  
        setImageURL(res.data.imageURL)
        console.log(res.data)

      },
      err => {
        console.log( err.response)
      }
    )
       
  }
  const handleClose = () => {
    setShow(false)
    ClosePhoneNumber()
    seterror("")
  };
   
  const handleShow = (nomBabel,type,value) => {
      setShow(true);
      setnomBabel(nomBabel)
      setType(type)
      setValue(value)
  }

  const handleModify = async (nomBabel) =>{
    let error = false
    const newUser = {id, username, contact,  email, telephone, hotelNumber, enable , imageURL}
    if(nomBabel === t("Nom")){
      newUser.username = value
      if(newUser.username == null || newUser.username == ""){
        seterror("Username is required")
        error = true
      }
    }
    else if(nomBabel === "Contact")
      newUser.contact = value
    else if(nomBabel === "imageURL"){
      postImg()
      newUser.imageURL = value
    }
    else if(nomBabel === "Numéro de téléphone")
      newUser.telephone = value
    else if(nomBabel === "Email"){
      newUser.email = value
      const emailRegPattern = /\S+@\S+\.\S+/;
   
      if(newUser.email == null || newUser.email == "" ){
          seterror("Email adress is required")
          error = true
      } else if (!emailRegPattern.test(newUser.email)) {
          seterror('The email address is not valid');
          error = true
      }
    }
    else if(nomBabel === "Password")
      newUser.username = value
    
    if(error == false ){
    await  axios.put(`http://localhost:3000/usersAttribute/${newUser.id}`,newUser ,{config}).then(
        res => {
          handleUpdate();
          handleClose()
        },
        err => {
          console.log(err.response.data.error)
        }
      )
    }
  }
    const [showPassword, setshowPassword] = useState(false)
    const handleClosePassword = () => {setshowPassword(false)}
    const handleOpenPassword = () => {setshowPassword(true)}
    
    const [showPhoneNumber, setshowPhoneNumber] = useState(false)
    const ClosePhoneNumber = () => {setshowPhoneNumber(false)}
    const OpenPhoneNumber = () => {setshowPhoneNumber(true)}

    const [showImageCorp, setShowImageCorp] = useState(false)
    const CloseImageCorp = () => {setShowImageCorp(false)}
    const OpenImageCorp = () => {setShowImageCorp(true)}

      //dbstrzwhl
      //Hotel website
      //https://api.cloudinary.com/v1_1/

const openModalImage= () => {
  OpenImageCorp()
  console.log(showImageCorp)
}
  const getImage = (e) => {

  }
  const postImg = async (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    setimage(e.target.files[0])
    console.log (image)
    const form = new FormData()
    form.append('file',file)
    form.append('upload_preset','Hotel website')
    await axios.post("https://api.cloudinary.com/v1_1/dbstrzwhl/upload", form).then(
      res => {
        console.log (res.data.secure_url)
        setImageURL(res.data.secure_url)
        setValue(res.data.secure_url)
        const imageURL = res.data.secure_url
        const newUser = {id, username, contact,  email, telephone, hotelNumber, enable , imageURL}
          axios.put(`http://localhost:3000/usersAttribute/${newUser.id}`,newUser ,{config}).then(
          res => {
            handleUpdate();
            handleClose();
            
          }) 
      }
    )
  }
  const [crop, setCrop] = useState ({ unit: '%', // 'px' or '%'
  x: 15,
  y: 25,
  width: 50,
  height: 50,
  })
  const [image, setimage] = useState(null)
  const [result, setResult] = useState(null)
 
  function getCroppedImage() {
    try {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      var image1 = document.getElementById("source");

      ctx.drawImage(
        image1,      
        100,
        100,
        100,
        100,
        0,
        0,
        100,
        100,
      );
/*      
      return new Promise (( resolve, reject) => {
        canvas.toBlob( blob => {
          blob.name = image;
          setResult(true);
          resolve(blob);
        }, 'image/jpeg',1)
      })
*/
      const base64Image = canvas.toDataURL("image/png",1)      
      setResult(base64Image);
      console.log(base64Image)

    } catch (e) {
        console.log(e);
    }
  }

  
   return (
<div>
  <div className="content-wrapper page-container" >
    {/* Content Header (Page header) */}
    <div className="content-header ">
      <div className="container-fluid ">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">{t("Information de base")}
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
        <label className="mt-2">{t('Votre information')}:</label>
          <center></center>         
              <div>


                <Container className="mb-5" >
                  <Row className='mb-4'>
                      <Col md={5}> </Col>
                      <Col md={5}>
                        <div className="photo-pic-div ">
                          <img id="photo" src={user.imageURL} ></img>    
                          <input type="file" id="file" accept="image/*" onChange={postImg}/>
                          <label for="file" id="uploadBtn"> modify </label>
                        </div>
                      </Col>
                      <Col > </Col>
                  </Row>
                  <Row className='mb-4'>
                      <Col style={{fontWeight: "bold"}} md={5} > {t('Nom')} </Col>
                      <Col md={5} className="ml-4"> {user.username} </Col>
                      <Col ><div className="text-primary" type="button" onClick={() => handleShow(t("Nom"),"text",user.username, )} > <a>{t('Modifier')}</a></div></Col>
                  </Row>       
                  <Row className='mb-4'>
                      <Col style={{fontWeight: "bold"}} md={5}>Contact</Col>
                      <Col md={5} className="ml-4"> {user.contact} </Col>
                      <Col > <div className="text-primary" type="button" onClick={() => handleShow("Contact","text",user.contact)} ><a>{t("Modifier")}</a></div> </Col>
                  </Row>   
                  <Row className='mb-4'>
                      <Col style={{fontWeight: "bold"}} md={5}>{t("Numéro de téléphone")}</Col>
                      <Col md={5} className="ml-4"> {user.telephone} </Col>
                      <Col ><div className="text-primary" type="button" onClick={() => OpenPhoneNumber()} ><a>{t("Modifier")}</a></div></Col>
                  </Row>   
                  <Row className='mb-4'>
                      <Col style={{fontWeight: "bold"}} md={5}>{t("Contact e-mail")}</Col>
                      <Col md={5} className="ml-4"> {user.email} </Col>
                      <Col ><div className="text-primary" type="button" onClick={() => handleShow("Email","email",user.email)} ><a>{t("Modifier")}</a></div></Col>
                  </Row>   
                  <Row className='mb-4'>
                      <Col style={{fontWeight: "bold"}} md={5}>{t("Mot de passe")}</Col>
                      <Col md={5} className="ml-4"> ******** </Col>
                      <Col ><div className="text-primary" type="button" onClick={() => handleOpenPassword()} ><a>{t("Modifier")}</a></div></Col>
                  </Row>   
                </Container>
              </div>

        </div>
      </div>
    </div>
  </div>
          </div>
        </div>
      </div>
    </section>
{/* localStorage.getItem("role") == 1 ?
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
        <div className="card-header col-12 votre-information">

            <Table  borderless>
            <thead>
                <tr>
                    <td >
                        <label>{t('information de profile')}:</label>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div className="" type=""  >
                            {t('Nom')}
                        </div>
                    </td>
                    <td>
                        <div className="" type=""  >
                            {user.username}
                        </div>
                    </td>
                    <td>
                        <div className="text-primary" type="button" onClick={() => handleShow(t("nom"),"text",user.username, )} >
                            <a>{t('Modifier')}</a>
                        </div>
                    </td>
                </tr>    
            </tbody>    
            </Table>
  
        </div>
      </div>
    </div>
  </div>
          </div>
        </div>
      </div>
    </section>
    : null
                    */}
    <Footer></Footer>

  </div> 
    <Modal show={showImageCorp} onHide={CloseImageCorp}>
      <Modal.Header closeButton >
        <Modal.Title>{t("Modifier votre image")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
            <Form.Label className="mb-3">Crop your image</Form.Label>

          <ReactCrop 
            crop={crop} 
            onImageLoaded={setimage}
            onChange={setCrop}
            aspect={1 / 1}
          >
            <img src={imageURL} id="source" />
          </ReactCrop>
          <div  className="text-primary" type="button" onClick={() => getCroppedImage()} >
              <a>{t('Modifier')}</a>
          </div>
            
          {result && (
            <center><div >
                <img src={result} alt="cropped image"/>
            </div></center>
          )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={CloseImageCorp}>
          {t("Cancel")}
        </Button>
        <Button variant="primary" >
          {t("Enregister")}
        </Button>
      </Modal.Footer>
    </Modal>



      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier votre information")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <div className=''>
                <Form.Label>{nomBabel}</Form.Label>
                <Form.Control
                  type= {`${type}`}
                  placeholder={t("Ecrire ici")}
                  autoFocus
                  value={value}
                  onChange={(e) => { setValue(e.target.value); seterror("") }}
                />
                <center>
                  <p className="mb-" style={{ color: "red", fontSize:"13px"}}>{error}</p>
                </center>

              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={() => handleModify(nomBabel)}>
            {t("Enregister")}
          </Button>
        </Modal.Footer>
      </Modal>

      <M_Password
        handleClose={handleClosePassword}
        show={showPassword}
        modify={handleModify}
        password={user.password}
        setpassword= {setpassword}
        handleUpdate={handleUpdate}
        ></M_Password>

      <M_PhoneNumber 
        handleClose={ClosePhoneNumber} 
        show={showPhoneNumber} 
        modify={handleModify} 
        telephone={user.telephone} 
        settelephone= {setValue}
      ></M_PhoneNumber>

 

</div>

  )  
}
export default My_information