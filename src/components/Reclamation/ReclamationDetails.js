import React ,{useState,useEffect,useContext,useReducer}from 'react'
import Footer from '../PageElement/Footer'
import "../../App.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './Reclamation.css'
import UserContext from '../../ContextHandler'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useTranslation} from 'react-i18next'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ReclamationDetails() {
  let { id } = useParams()
  const {user, setUser} = useContext(UserContext);
  const [reclamation, setReclamation] = useState()
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
  const [source,setsource] = useState("")
  const [date, setdate] = useState("")
  const [title, settitle] = useState("")
  const [content, setcontent] = useState("")
  const [etat, setetat] = useState("")
  const [type, settype] = useState("")
  const [email, setemail] = useState("")
  const [responseList, setresponseList] = useState([])
  const [responseDateList, setresponseDateList] = useState([])
  const [responseUserList, setresponseUserList] = useState([])
  const [ t, i18n ] = useTranslation()

  const [message, setmessage] = useState([])
  const [update, forceUpdate] = useReducer(x => x+1, 0)

  let navigate = useNavigate();

  useEffect( () =>  {
    axios.get(`http://localhost:3000/message/${id}`,config ).then(
    res  =>  {
      console.log(res.data) 
      setReclamation(res.data)
      setsource(res.data.source)
      setdate(res.data.date)
      setcontent(res.data.content)
      setetat(res.data.etat)
      settype(res.data.type)
      settitle(res.data.title)
      setemail(res.data.userEmail)
      setresponseList(res.data.response)
      setresponseDateList(res.data.responseDate)
      setresponseUserList(res.data.responseUser)
      setmessage(res.data)

      if(user){
          if ( user?.role == 0 ){
          axios.put(`http://localhost:3000/messagesOpen/${id}/true`,[],config )
        }else if(user?.role == 1 ){
          axios.put(`http://localhost:3000/messagesOpenUser/${id}/false`,[],config )
        }
      }
    },
    err => {
      console.log( err)
    }
  )
  }, [update])

  const handleNonLu = async () =>{
    {localStorage.getItem("role") == 0
    ? await axios.put(`http://localhost:3000/messagesOpen/${id}/false`,[] ,config )
    : await axios.put(`http://localhost:3000/messagesOpenUser/${id}/true`,[],config )
    }
    navigate(-1)
  }
  
  const handleReturn = () => {
    navigate(-1)
  }
  
  const [responseBool, setresponseBool] = useState(false)
  const [response, setresponse] = useState("")
  
  const TextArea = (res) => {
    let newResponse = !res
    setresponseBool(newResponse)
  }

  const ClaimResponse = async (response, message) => {
    if (response == "" || response == null){
      setresponseBool(false)
    }else{
      message.response.push(response)
      let tmp_date = new Date().toISOString().split(".")[0].toString()
      const date = tmp_date.split("T")[0] + " " + tmp_date.split("T")[1]
      message.responseDate.push(date)
      message.responseUser.push(user.username)
      {localStorage.getItem("role") == 0
        ? message.unreadbyuser = true
        : message.etat = false
      }
      setmessage(message)
      await axios.put(`http://localhost:3000/messages/${id}`,message ,config ).then(
        res => {
          console.log(res.data)
          setresponseBool(false)
          setresponse("")
          forceUpdate()
        },
        err => {
          console.log( err)
        }
      )
    }
  }

 
  const deleteResponse = async (index, message) => {
    message.response.splice(index,1)
    message.responseDate.splice(index,1)
    message.responseUser.splice(index,1)
    setmessage(message)
    await axios.put(`http://localhost:3000/messages/${id}`,message ,config ).then(
      res => {
        console.log(res.data)
        forceUpdate()
      },
      err => {
        console.log( err)
      }
    )
  }

  return (
    
    <div className="content-wrapper page-container" >
      <div className="content-header ">
        <div className="container-fluid ">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Reclamation / Details</h1>
            </div>{/* /.col */}
          </div>{/* /.row */}
          <hr></hr>
        </div>{/* /.container-fluid */}
      </div>
    <div>
      <section className="content ">
        <div className="container-fluid  " ><div className="row" > <div className="container-fluid " > <div className="row " > <div className="col-12">  <div className="card " style={{ backgroundColor: '#F8F8F8'}} > <div className="card-body  votre-information mt-2 mb-3">
        <h4 className="mb-5"> Detail reclamation </h4>

        <Container className="mb-5" >
            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}> Nom Distributeur:  </Col>
                <Col md={9}> {source} </Col>
            </Row><hr/>        
            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}>Titre:</Col>
                <Col md={9}> {title} </Col>
            </Row><hr/>        
            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}>Descriptif: </Col>
                <Col md={9}> {content} </Col>
            </Row><hr/>    

            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}>Email Distributeur:</Col>
                <Col md={9}>{email} </Col>
            </Row><hr/>    

            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}>Type:</Col>
                <Col md={9}>{type} </Col>
            </Row><hr/>    
            <Row className='mb-1'>
                <Col style={{fontWeight: "bold"}} md={3}>Date:</Col>
                <Col md={9}>{date} </Col>
            </Row><hr/>  
        </Container>
        {responseList?.length != 0 ? <h4 className="mt-4"> Réponse: </h4>:null}
          <div className="ml-5 mt-4">
            { responseList.map((post, index)=>  
              <div key={index}>
                <span style={{fontWeight: "bold"}}>{responseUserList[index]}</span>
                <t className="float-right">{responseDateList[index]}</t>
                <p className="mt-1 mb-4"> {post}                 
                  
                  { responseUserList[index] == user.username ?
                      <Button variant="danger"className=" float-right" onClick={ () => deleteResponse(index, message) }> 
                      <i className="fas fa-trash"></i>
                      </Button>
                    : null
                  } 
                </p><hr/>
              </div>
            )}
          </div>

        {responseBool == true ?
        <Form className='mt-3'>
          <Form.Label> Ajouter votre reponse: </Form.Label> 
          <Form.Control className=" ml-1" as="textarea" rows={5} value={response} onChange={(e) => setresponse(e.target.value)}/>
        </Form>
        : null }

        <div className="mt-4 mb-3">
          <button className="btn btn-outline-secondary mr-2" onClick={() => handleReturn()}> {t("Retour")} </button>
          <button className="btn btn-outline-danger" onClick={() => handleNonLu()} > Marquer non lu </button> 

          {responseBool? <>
          <button className="btn btn-outline-secondary ml-2" onClick={() => TextArea(responseBool)} > Annuler </button>
          <button className="btn btn-outline-primary ml-2 float-right" onClick={() => ClaimResponse(response, message)} > Envoyer </button> </>
          :
          <button className="btn btn-outline-primary ml-2" onClick={() => TextArea(responseBool)} > Répondre </button> 
          }

        </div>

        </div> </div> </div> </div> </div> </div> </div>
      </section>
    </div>
    <Footer ></Footer>
</div>
  )
}

export default ReclamationDetails