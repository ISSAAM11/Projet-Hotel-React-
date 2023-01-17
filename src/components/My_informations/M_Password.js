import React,{useState, useContext} from 'react'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from'axios'
import UserContext from '../../ContextHandler'
import {useTranslation} from 'react-i18next'

function M_Password(props) {
    const [ t, i18n ] = useTranslation()

    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [oldPassword, setoldPassword] = useState("")
    const {user, setUser} = useContext(UserContext);
    
    const [erroroldPassword, seterroroldPassword] = useState()
    const [errorpassword, seterrorpassword] = useState()
    const [errorconfirm, seterrorconfirm] = useState()


  const testError = (error_) => {
    if( oldPassword == "" || oldPassword == null ){
      seterroroldPassword("Your password actual is required")
      error_ = true
    }if(password == "" || password == null ){
      seterrorpassword("You must provide your new password")
      error_ = true
    } else if (password.length < 8){
      seterrorpassword("Password at least contains 8 characters")
      error_ = true
    }
    if(confirmPassword == "" || confirmPassword == null ){
      seterrorconfirm("You must confirme your new password")
      error_ = true
    }
    return error_
  }

  const handleModify = () =>{  
    let error_ = false
    error_ = testError(error_)
    if(error_ == false){
      const resetKey ="string"
      const keyAndPassword={ oldPassword, password, confirmPassword, resetKey }
      const config = { headers: { Authorization : 'Bearer ' +localStorage.getItem('token')} }
      axios.put(`http://localhost:3000/reset-new-password/${user.id}`,keyAndPassword ,{config}).then(
          res => {
            props.handleUpdate();
            props.handleClose();
            setpassword();
            setconfirmPassword()
            setoldPassword()
            alert("le mot de passe a été changé avec succès");
          },
          err => {
            alert(err.response.data.error.message);
          }
        )
        
      }
    }
    
  return (
    <Modal show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton className="mb-2">
      <Modal.Title>{t("Modifier votre Mot de passe")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
          <div>
            <Form.Label>{t("Mot de passe actuel")}</Form.Label>
            <Form.Control
              type = "password"
              placeholder={t("Ecrire ici")}
              autoFocus
              className="  "
              value={oldPassword}
              onChange={(e) => { setoldPassword(e.target.value); seterroroldPassword("") }}
            />
            <center>
              <p className="" style={{ color: "red", fontSize:"13px"}}>{erroroldPassword}</p>
            </center>
          </div>
          <Form.Label>{t("Nouveau mot de passe")}</Form.Label>
          <Form.Control
            type = "password"
            placeholder={t("Ecrire ici")}
            autoFocus
            className="  "
            value={password}
            onChange={(e) => { setpassword(e.target.value); seterrorpassword("") }}
          />
            <center>
              <p className="" style={{ color: "red", fontSize:"13px"}}>{errorpassword}</p>
            </center>

          <Form.Label>{t("Confirmer mot de passe")}</Form.Label>
          <Form.Control
            type = "password"
            placeholder={t("Ecrire ici")}
            autoFocus
            className=" "
            value={confirmPassword}
            onChange={(e) => { setconfirmPassword(e.target.value); seterrorconfirm("") }}
          />
            <center>  
              <p className="" style={{ color: "red", fontSize:"13px"}}>{errorconfirm}</p>
            </center>

        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.handleClose}>
        {t("Cancel")}
      </Button>
      <Button variant="primary" onClick={handleModify}>
        {t("Enregister")}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default M_Password