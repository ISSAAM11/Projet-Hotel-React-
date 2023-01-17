import React,{useRef,useState} from 'react'
import Button from 'react-bootstrap/Button';
import "./../../App.css"
import emailjs from '@emailjs/browser';
import Form from 'react-bootstrap/Form';
import {useTranslation} from 'react-i18next'

function Contact_Us({BackcontactusPage}) {
    const [ t, i18n ] = useTranslation()

    const form = useRef();
    const [err,setErr] = useState("")

    const [name,setname] = useState("")
    const [mail,setmail] = useState("")
    const [sujet,setsujet] = useState("")
    const [content,setcontent] = useState("")
    const sendEmail = () => {
        let error = false
        if (name =="" || mail=="" || sujet=="" || content=="" ){
            error = true
            setErr("completer le formulaire")

        }else {
            const emailRegPattern = /\S+@\S+\.\S+/;
            if ( !emailRegPattern.test(mail)) {
                error = true
                setErr("Email format invalide")
            }
        }
        if (error == false){
        emailjs.sendForm('service_az2xq8w', 'template_ui567fk', form.current, 'ztrTnhG0BAYQaVBCq')
          .then((result) => {
            console.log(result.text);
            alert("Votre message a été envoyé avec succès")
            BackcontactusPage()
          }, (error) => {
            alert("Erreur")
            console.log(error.text);
          });
        }
      };
    
  return (
   <div className='ContactUs'>
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
{/*          <h1>Contact us</h1>*/}
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
{ /*           <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active">Contact us</li>*/}
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="card">
      <div className="card-body row">
        <div className="col-5 text-center d-flex align-items-center justify-content-center">
          <div className>
            <h2 >MAScIR</h2>
            <p className="lead mb-5">MAScIR, Rabat Design Center,<br />
              Rue Mohamed Al Jazouli <br />
              Madinat Al Irfane - Rabat 10 100 - Maroc<br />
              Tél : +212 5 30 27 98 75
            </p>
          </div>
        </div>
        <div className="col-7">
        <Form ref={form} onSubmit={sendEmail}>
            
        <h3 className="mb-3"><strong>Contact us</strong></h3>

            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">             
              <Form.Label> {t("Name")}</Form.Label>
              
              <Form.Control type="text"name="name"placeholder={t("Ecrire ici")}
              value={name} onChange={(e) => {setname(e.target.value); setErr(null)}}/>

              <Form.Label className="mt-3"> {t("E-Mail")}</Form.Label>
              <Form.Control placeholder={t("Ecrire ici")} type ="mail"name="email" className="mb-3" 
              value={mail} onChange={(e) => {setmail(e.target.value); setErr(null)}}/>
              
              <Form.Label> {t("Subject")}</Form.Label>
              <Form.Control placeholder={t("Ecrire ici")}   name="subject" className="mb-3"
              value={sujet} onChange={(e) => {setsujet(e.target.value); setErr(null)}}/>

              <Form.Label>Content</Form.Label>
              <Form.Control placeholder={t("Ecrire ici")} name="Message" as="textarea" rows={3} 
              value={content} onChange={(e) => {setcontent(e.target.value); setErr(null)}}/>
              {err?<center><p className="mb-1" style={{ padding: "2px" , color: "red", fontSize:"13px"}}> {err} </p></center>:null}
            </Form.Group>
          </Form>
          <div className="form-group">
            <input onClick={()=> sendEmail()} type="submit" className="btn btn-primary" defaultValue="Send message" />
            <Button onClick={()=> BackcontactusPage()} variant="secondary" className="float-sm-right"> Back</Button>

          </div>
        </div>
      </div>
    </div>
  </section>
</div>

  )
}

export default Contact_Us