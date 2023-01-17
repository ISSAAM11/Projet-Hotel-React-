import { useEffect, useState, useContext } from "react";
import hotelLogo from "../Images/Mascir.png"
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ForgotPassword from "../components/Login/ForgotPassword";
import Sign_in from "../components/Login/Sign_in";
import { Route, Routes , useNavigate } from "react-router-dom";
import Footer from "../components/PageElement/Footer_Login";
import {useTranslation} from 'react-i18next'
import background4 from '../Images/Background3.jpg'
import Button from 'react-bootstrap/Button';
import UserContext from '../ContextHandler'
 
import '../App.css'
import Contact_Us from "../components/Login/Contact_Us";
const Login = () => {
  const [ t, i18n ] = useTranslation()
  const [ contact_Us, setcontact_Us] = useState(false)
  const [selects, setSelects] = useState("Francais")  
//   const thisUser = useContext(loginContext);
    let navigate = useNavigate();
  const contactusPage = () => {
    setcontact_Us(true)
  }
  const BackcontactusPage = () => {
    setcontact_Us(false)
    console.log(contact_Us)
  }
    useEffect(()=> {
        if(i18n.changeLanguage("fr")){
          setSelects("Francais")
        }else if(i18n.changeLanguage("en")) {
          setSelects("Anglais")
        }
        checkConnecxion()
      } ,[]) 
    const {user, setUser} = useContext(UserContext);
    const checkConnecxion= ()=> {
        // if( localStorage.getItem('role') == 1){
        //     navigate("/home/hotels")
        // }else if(localStorage.getItem('role') == 0 ){
        //     navigate("/Admin/hotels")
        // }
    }
  const change_language = (word, language) => {
    setSelects(word)
//    localStorage.setItem(language)
    i18n.changeLanguage(language)
  }
    
    return(
<div>

    <Navbar style={{backgroundColor: "white", margin : "auto"}}>
      <Container >
        <Navbar.Brand >        
            <img src={hotelLogo}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} />
            <span style={{color:" #3C8CCF"}}> {t("Système fournisseur serrure")} </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">

        <Dropdown>
          <Dropdown.Toggle  variant="white" id="dropdown-basic">{selects}
          </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={e=>change_language("Francais","fr")}>
            <a type="button"className="nav-link active" aria-current="page" >Francais</a>
          </Dropdown.Item>

          <Dropdown.Item onClick={e=>change_language("Anglais","en")}>
            <a type="button"className="nav-link active" aria-current="page" >Anglais</a>
          </Dropdown.Item>

        </Dropdown.Menu>

      </Dropdown>
        <Button className="ml-5" variant="white" onClick={()=> contactusPage()}> Contact us </Button>


        </Navbar.Collapse>
      </Container>
    </Navbar>
 

    <section className="content  login-background"  
      style={{ backgroundImage: `url(${background4})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
      }}>
      
      {contact_Us
      ? <Contact_Us 
          BackcontactusPage={BackcontactusPage}
        />
        

      :  <div className="signin ">
            <div className="content-header signin_conntainer box-shadow " >
                <div className="container-fluid ">
                    
                <Routes>
                    <Route path="/" element={<Sign_in/>} /> 
                    <Route path="/login" element={<Sign_in/>} /> 
                    <Route path="/forgotpassword" element={<ForgotPassword/>} /> 
                </Routes>

                </div>
            </div>
        </div>
      }

    </section>
    <div ></div>
<Footer ></Footer>

</div>
    )
}
export default Login
