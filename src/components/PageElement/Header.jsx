import {useState,useEffect} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import axios from 'axios';
import {useTranslation} from 'react-i18next'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
 

 export default function () {
  const [selects, setSelects] = useState("Francais")  
  const [user, setUser] = useState([])
  const [ t, i18n ] = useTranslation()

  const [ nonlu, setnonLu ] = useState(false)
  const [ MessagesClos, setMessagesClos ] = useState(0)
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}


  useEffect(()=> {
    getUser()
},[])

const getUser = async () => {
  const data = await axios.get(`http://localhost:3000/users/${localStorage.getItem('id')}`,localStorage.getItem('id') , {config} )
  setUser(data.data)
}

const Deconnexion = ()=> {
  localStorage.removeItem("token");
  localStorage.removeItem("id");  
  localStorage.removeItem("role");  
}
const change_language = (word, language) => {
  setSelects(word)
  i18n.changeLanguage(language)
}

const countClaim = async () => {
  const data = await axios.get(`http://localhost:3000/users/${localStorage.getItem('id')}`,localStorage.getItem('id') , {config} )
  setUser(data.data)
}

let color = "#FFFFFF"
if (user.role == 0) {
  color = "#EBEBEB"
}

  useEffect(()=> {
    axios.get(`http://localhost:3000/messages/${localStorage.getItem('id')}/`,config ).then(
      res => {
        setMessagesClos(res.data.filter(post => post.unreadbyuser==true).length)
      },
      err => {
        console.log( err)
      }
    ).then(
      res => {if (MessagesClos > 0) {
        setnonLu(true)
      }else{setnonLu(false)}
    })       
  })

  return (
    <header className="">       
        <nav  style={{backgroundColor: `${color}` }}className=" headerBanner main-header navbar navbar-expand navbar-white navbar-light" >
    {/* Left navbar links */}
    <ul className="headerBanner navbar-nav">
      <li className="nav-item d-none d-sm-inline-block">      
        <t className="text-primary ml-2 mr-2"> {user.username}</t>
        <a >{t('code fournisseur')}：{user.lockSupplier}</a>
      </li>
    </ul>
    {/* Right navbar links */}
    <ul className="navbar-nav ml-auto">
    
      <li className="nav-item mr-2">
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
      </li>
      <li className="nav-item mt-2 mr-2">
        <a >{user.contact}</a>
      </li>
      <li className="nav-item mr-2">
      <img id="photo-header" src={user.imageURL}/>
      </li>
      {/* Notifications Dropdown Menu */}
      <li className="nav-item  dropdown globe mr-1">
 

      <Dropdown>     
      
      {localStorage.getItem("role") == 1 ?
      <div >
        <NotificationBadge count={MessagesClos} effect={Effect.ROTATE_Y}/>
      </div>
      : null} 
        <Dropdown.Toggle bsPrefix="none" variant="white" id="dropdown-button-drop-up" ><i className="fas fa-bars"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="">
            <Link to="My_information" className="nav-link active" aria-current="page"  >{t("Information de base")}</Link>
          </Dropdown.Item>
          {localStorage.getItem("role") == 1 ?
          <Dropdown.Item href="">
            <Link to="ReclamationList" className="nav-link active" aria-current="page"  >{t("reclamation")} 
            {nonlu == false || MessagesClos.length == 0
              ?null
              :<span className="ml-2 badge badge-danger">{MessagesClos}</span>
            }            
            </Link>

          </Dropdown.Item>: null}
          <Dropdown.Item href="">
            <Link to="Help" className="nav-link active" aria-current="page"  >{t("Aide")}</Link>
          </Dropdown.Item>
          <Dropdown.Item href="">
          <Link to="/login" className="nav-link active" aria-current="page" onClick={()=>Deconnexion()}>{t("Déconnexion")}</Link>
            </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      </li>

    </ul>
  </nav>

</header>

        
  )
}
