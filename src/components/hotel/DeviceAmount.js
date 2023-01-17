import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Serrure from '../../Images/Serrure.png'
import Reseau from '../../Images/Reseau.png'
import ModeEco from '../../Images/ModeEco.png'
import Ascenceur from '../../Images/Ascenceur.png'
import {useTranslation} from 'react-i18next'

export default function DeviceAmount(props) {
  const [ t, i18n ] = useTranslation()


  return ( 
    <Modal centered show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{t("Nombre de dispositifs")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <center> <h4 className='mb-4'> {props.Hotel.name} </h4></center>
      <Table   borderless  >
      <tbody>
        <tr>
          <td > 
            <center>
              <img src={Serrure}alt="AdminLTE Logo" className="brand-image mb-2 "  />
              <p ><a style={{color: '#808080'}}>{t("Serrure")}: </a>{props.Hotel.lockAmmount}</p>
            </center>
          </td>
          <td>
            <center>
              <img src={Reseau}alt="AdminLTE Logo" className="brand-image mb-2 "  />
              <p><a style={{color: '#808080'}}>{t("Dispositif réseau")}:</a> {props.Hotel.gatewayAmmount}</p>
            </center>
          </td>
        </tr>
        <tr>
          <td >
            <center>
              <img src={Ascenceur}alt="AdminLTE Logo" className="brand-image mb-2 " />
              <p><a style={{color: '#808080'}}>{t("Contrôleur d'ascenceur")}:</a> {props.Hotel.liftAmmount}</p>
            </center>
          </td>
          <td >
            <center>
              <img src={ModeEco}alt="AdminLTE Logo" className="brand-image mb-2 " />
                <p><a style={{color: '#808080'}}>{t("Mode éco")}:</a> {props.Hotel.energyAmmount}</p>
            </center>
          </td>
        </tr>
      </tbody>
      
      </Table>

    </Modal.Body>
  </Modal>

  )
}