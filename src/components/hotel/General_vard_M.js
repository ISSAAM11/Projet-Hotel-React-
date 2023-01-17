import React from 'react'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const General_vard_M = (props) => {
  return (
    <Modal show={ props.show } onHide={props.handleClose }>
    <Modal.Body>
    
      <Form>
        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
            <Form.Label> Continuer à désactiver le general carte</Form.Label>
        </Form.Group>
      </Form>
    
    </Modal.Body>
    <Modal.Footer>

      <Button variant="secondary"onClick={() => props.handleClose()}> Close </Button>
      <Button variant="primary"  onClick={() => props.handleClose()}> Activer </Button>
    
    </Modal.Footer>
  </Modal>  )
}
