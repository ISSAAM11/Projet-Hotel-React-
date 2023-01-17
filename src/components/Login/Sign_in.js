import React from 'react'
import axios from "axios";
import {useContext, useEffect, useState } from "react";
import UserContext from '../../ContextHandler'
import {useNavigate , Link } from "react-router-dom";
import {useTranslation} from 'react-i18next'

function Sign_in() {
    const [ t, i18n ] = useTranslation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [token, setToken] = useState()
    const {user, setUser} = useContext(UserContext);
    const [error,seterror] = useState();
    let navigate = useNavigate();

    const submit = (e) => { 

        e.preventDefault();
        const data = {
            email,
            password
        }
        if(data.email == "" || data.email == null)
            seterror("Provide your email")
        else if( data.password == "" || data.password ==null)
            seterror("Provide your password")      
        else{
            axios.post("http://localhost:3000/users/loginHotel", data)
            .then(res => {
                if (res.data.role == 2 ){
                    alert("C'est un compte Forotel vous ne pouvez pas se connecter ici")
                    console.log("Role : " + res.data.role)
                }
                else if(res.data.enable){
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('id', res.data.id)
                    localStorage.setItem('role', res.data.role)
                    setRedirect(true);
                    setUser(res.data)
                    if(res.data.role == 1)
                    navigate("/home/WelcomeUser") 
                    else if (res.data.role == 0)
                    navigate("/Admin/Dashbord") 
                }
                
                else{
                    alert("Votre compte is désactivé vous ne pouvez pas vous connecter a notre plateforme")
                    console.log(res.data)
                }

            })
            .catch(err => {
                console.log(err) 
                alert("Email or password invalide")
                console.log(redirect)
            })
        }
    }

  return (
     <div className="row mb-3 form-signin" >
      <div className="col-sm-15">
    <form onSubmit={submit}   >
    {/*            <img className="img-responsive image-resize" src={hotelLogo} alt=""/> */}

        <h1 className="h9 mb-3 fw-normal " ></h1>
        <center><h1 className="h12 mb-4 fw-normal " >{t("S'identifier")} </h1>   </center>
            <input type="email" className="form-control" placeholder={t("compte")}
            onChange={e => {setEmail( e.target.value); seterror("")}} 
        />
        <input type="password" className="form-control" placeholder={t("mot de passe")}
            onChange={e => {setPassword( e.target.value); seterror("")}}
        />

        <center><p className="mb-2" style={{ color: "red", fontSize:"13px"}}>{error}</p></center>
        
        <div className="row">
            <div className="col-6"></div>

            <div className="col-6">
                <p className="">
                    <Link to="/login/forgotpassword" className="text-primary" > 
                        {t("Mot de passe oublié")}
                    </Link>                
                </p>
            </div>
        </div> 

        <button className="w-100 btn btn-lg btn-primary" type="submit">{t("S'identifier")}</button>
    </form>
    </div>
</div>
   )
}

export default Sign_in