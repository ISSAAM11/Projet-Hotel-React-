import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import {useTranslation} from 'react-i18next'
import { Redirect } from 'react-router-dom';

function ForgotPassword() {
    const [ t, i18n ] = useTranslation()

    const [lockSupplier, setlockSupplier] = useState()
    const [resetKey, setresetKey] = useState()
    const [password, setpassword] = useState()
    const [confirmPassword, setconfirmPassword] = useState()
    const [error, setError] = useState([])

    let navigate = useNavigate();
    const sendVerificationCode = (e) => { 
        let resetPasswordInit  = {lockSupplier: lockSupplier}
        if(resetPasswordInit.lockSupplier == "" || resetPasswordInit.lockSupplier == null ){
            setError({lockSupplier :"lock supplier required" })   
        }else{
            setError({lockSupplier :"" })
            axios.post(`http://localhost:3000/reset-password/init`, resetPasswordInit)
            .then(res =>{  
                console.log(res)
                alert("Le code de vérification a éte envoyer via email et SMS")
            }
            ).catch(
                err => {
                    console.log(err)
                    alert(err.response.data.error.message)
                }
            )
        }
    }


    const RestPassword = (e) => {   
        let resetPasswordInit  = {resetKey: resetKey,lockSupplier: lockSupplier, password:password }
        if(resetPasswordInit.lockSupplier == "" || resetPasswordInit.lockSupplier == null ){
            setError({lockSupplier :"Write lock supplier first" })   
        }else if(resetPasswordInit.resetKey == "" || resetPasswordInit.resetKey == null ){
            setError({resetKey :"Reset key required" })   
        }else if(resetPasswordInit.password == "" || resetPasswordInit.password == null ){
            setError({password :"Password required" })   
        }else if(password.length < 8){
            setError({password :"Minimum password length 8 characters" })   
        }else{

            let keyAndPassword  = { resetKey: resetKey, password: password, confirmPassword: confirmPassword} 
            axios.put(`http://localhost:3000/reset-password/finish`, keyAndPassword)
            .then(res =>{  
                console.log(res)
                alert("Le mot de passe a été changer avec succés")
                navigate("/login") 
            }).catch(
                err => {
                    console.log(err)
                    alert(err.response.data.error.message)
                }
            )
        }
    }

    return (

<div className="row" >
  <div className="col-sm-15">
        <h1 className="h8 mb-3 fw-normal " ></h1>
                <center  className=" mb-4">
                    <h1 className="h10 mb-4 fw-normal " > {t('Mot de passe oublié')} </h1>
                </center>
        <div>
            
            <div className="input-group mb-2">
                <input onChange={(e) => {setlockSupplier(e.target.value); setError({lockSupplier:""}); }} className="form-control" placeholder={t("Enter le code fournisseur")} />
            </div>
            <center><p className="mb-2" style={{ color: "red", fontSize:"13px"}}>{error.lockSupplier}</p></center>

            <div className="input-group mb-2">
                <input  className="form-control" onChange={(e) => {setresetKey(e.target.value); setError({resetKey:""})}}  placeholder={t("Enter code de vérification")} />
                <button onClick={() => sendVerificationCode() } className="input-group-text">{t("Obtenir code")}</button>
            </div>
            <center><p className="mb-2" style={{ color: "red", fontSize:"13px"}}>{error.resetKey}</p></center>

            <div className="input-group mb-2">
                <input className="form-control" onChange={(e) => setpassword(e.target.value)} type="password" placeholder={t("Entrer le nouveau mot de passe")} />
            </div>
            <center><p className="mb-2" style={{ color: "red", fontSize:"13px"}}>{error.password}</p></center>

            <div className="input-group mb-4">
                <input className="form-control" onChange={(e) => setconfirmPassword(e.target.value)} type="password" placeholder={t("Confirmer nouveau mot de passe")} />
            </div>
        </div>
        
        <button onClick={()=> RestPassword()} className="w-100 btn btn-lg btn-primary mb-3" type="submit">{t("Soumettre")}</button>

        <div className="row">
            <div className="col-9"></div>
            <div className="col-3">
                <p className="">
                    <Link to="/login/" className="text-primary" > 
                    {t("Retour")}
                    </Link>                
                </p>
            </div>
        </div> 
  </div>
</div>
  )
}

export default ForgotPassword