import React from 'react'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PhoneInput2 from 'react-phone-input-2'
import {useTranslation} from 'react-i18next'

function M_PhoneNumber(props) {
  const [ t, i18n ] = useTranslation()

  return (
    <Modal show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Modifier votre information")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>{t("Numéro de téléphone")}</Form.Label>

          <PhoneInput2
            country={null}
            value={props.telephone}
            onChange={props.settelephone}
            className="mb-3 "
            placeholder={t("Ecrire ici")}
            inputStyle={{width:'100%'}}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.handleClose}>
      {t("Cancel")}

      </Button>
      <Button variant="primary" onClick={() => props.modify("Numéro de téléphone")}>
      {t("Enregister")}

      </Button>
    </Modal.Footer>
  </Modal>

  )
}

export default M_PhoneNumber