import React ,{useState,useEffect,useContext,useReducer}from 'react'
import Footer from '../PageElement/Footer'
import "../../App.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../../ContextHandler'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Table } from 'semantic-ui-react'
import ChoseHotel from './ChoseHotel'
import ChoseProduct from './ChoseProduct'
import ProductElements from './ProductElements'
import PDFfile from './PDFfile'
import ReactPDF, { PDFDownloadLink, PDFViewer }  from '@react-pdf/renderer'
import No_Data from "../../Images/NO-DATA.png"
import {useTranslation} from 'react-i18next'

function AddPurchaseOrder() {
  const {user, setUser} = useContext(UserContext);
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
  const [ t, i18n ] = useTranslation()


  let navigate = useNavigate();

  
  const handleReturn = () => {
    navigate(-1)
  }
  
  const [showChoseHotel, setshowChoseHotel] = useState(false) 
  const openChoseHotel = () => { setshowChoseHotel(true) }
  const closeChoseHotel = () => { setshowChoseHotel(false) }

  const [showChoseProduct, setshowChoseProduct] = useState(false) 
  
  const openChoseProduct = () => { 
    setshowChoseProduct(true) 
  }

  const closeChoseProduct = () => { 
    setshowChoseProduct(false) }

   
  const [SelectedHotel, setSelectedHotel] = useState()
  const [hotel, sethotel] = useState()

  const SelectThisHotel = (value) => {setSelectedHotel(value);}  

  const getHotelDetails = (SelectedHotel) => {
    axios.get(`http://localhost:3000/hotels/${SelectedHotel}`,config ).then(
      res => {
        sethotel(res.data)
        closeChoseHotel()
        if(errorMessage == 'Choisir un hôtel')
          seterrorMessage("")
      },
      err => console.log( err)
    )
  }

  const [selectedProduct, setselectedProduct] = useState([])

  const handleChangeProduct= (id)=>{
    const idList = selectedProduct
    const index = idList.indexOf(id);
    if(index==-1){
      idList.push(id)
    }else{
      idList.splice(index, 1);
    }
    setselectedProduct(idList)
  }

  const [ProductList, setProductList] = useState([])
  const [quantity, setquantity] = useState([])

  const GetProducts = (selectedProduct)=> {
    let Products = []
    selectedProduct.forEach(element => {
      axios.get(`http://localhost:3000/produits/${element}` ,config ).then(
      res => {
//       res.data.amount = 0
        res.data.TVA = 19
        const listId = ProductList.map((e)=> e.id)
        const index = listId.indexOf(res.data.id);
        if (index == -1 ){
          Products.push(res.data)
        }else {
          Products.push(ProductList[index])
        }
        Products.sort()
      },
      err => console.log(err)
    )
    })
    setTimeout(() => {
      setProductList(Products)
      closeChoseProduct()
      if (errorMessage == "Vous devez choisir des produits")
        seterrorMessage("")
    },100)
  }
  const [Loading, setLoading] = useState(false)

  const supprimerProduct = (idProduct) => {
    setLoading(true)
    let idList = ProductList
    const index = ProductList.indexOf(idProduct);
    idList.splice(index, 1);
    setTimeout(() => {
      setProductList(idList)
      setLoading(false)
    },1)
  }

  const updateQuantity = (value, i) => {

    ProductList.quantity[i] = value
    setquantity(ProductList)
  }

  const onInputChange = (id,invoicee) => {
    const newInvioces = [...ProductList]
    const index = newInvioces.findIndex(r => r.id === id)
    newInvioces[index] = invoicee
    setProductList(newInvioces)
  };

  function handleInvoiceDelete(id){
    setProductList(ProductList.filter(Product => Product.id !== id))
    const newlist = selectedProduct.filter((Product) => Product !== id);
    setselectedProduct( newlist);
  }

  const [purchaseOrder, setpurchaseOrder] = useState("")
  const [errorMessage, seterrorMessage] = useState("")
  
  const handleSave = (thisHotel, thisProductList) => {
    
    let error = false
    let purchaseorder ={}
    purchaseorder.hotel = thisHotel
    purchaseorder.ProductList = thisProductList

    
    let modeEco   = 0 
    let Ascenceur = 0 
    let Reseau    = 0 
    let Serrure   = 0 
    
    thisProductList.forEach((element) => {
      if(element.type == "Mode économique" ){
        modeEco += Number(element.amount)
      }
      if(element.type == "Contrôleur d'ascenceur" ){
        Ascenceur += Number(element.amount)
      }
      if(element.type == "Dispositif réseau" ){
        Reseau += Number(element.amount)
      }
      if(element.type == "Serrure" ){
        Serrure += Number(element.amount)
      }
    }) 

    console.log("modeEco : " + modeEco)
    console.log("Ascenceur : " + Ascenceur)
    console.log("Reseau : " + Reseau)
    console.log("Serrure : " + Serrure)
    
    purchaseorder.totalHT = (ProductList.reduce((prev, prod) => (prev + (  prod.amount * prod.prix  )), 0)).toFixed(2) * 1
    purchaseorder.totalTVA = (ProductList.reduce((prev, prod) => (  prev   + ((prod.amount * prod.prix)*prod.TVA/100)   ), 0)).toFixed(2) * 1
    purchaseorder.totalTTC = (ProductList.reduce((prev, prod) => (prev + ((prod.amount * prod.prix)* prod.TVA / 100) + (prod.amount * prod.prix)), 0)).toFixed(2) * 1
    const tmp_date = new Date().toISOString().split("T")
    const tmp = `${tmp_date[0]}`
    purchaseorder.date = tmp

  
    thisProductList.forEach((element)=> {
      if(element.amount == 0) {
        error = true
        seterrorMessage(`Produit de quantité 0 Vous devez le (les) modifier`)
      }
    })
    
    if(purchaseorder.hotel == null){
      error = true
      seterrorMessage("Vous devez choisir un hôtel")
    }else if(purchaseorder.ProductList.length == 0){
      error = true
      seterrorMessage("Vous devez choisir des produits")
    }

    if(error == false){


      axios.post(`http://localhost:3000/purchase-orders/${localStorage.getItem("id")}`, purchaseorder , config ).then(
        res => {
          console.log(res.data)
          seterrorMessage('')
          setpurchaseOrder(res.data)
        }
        ,err => {console.log(err)}
      ).then(
        res => {
          thisHotel.energyAmmount += modeEco
          thisHotel.lockAmmount += Serrure
          thisHotel.gatewayAmmount += Reseau
          thisHotel.liftAmmount += Ascenceur

          axios.put(`http://localhost:3000/hotels/${thisHotel.id}`,thisHotel ,config)
        }
      )
    }
  
  
  }



  return (
    
    <div className="content-wrapper page-container" >
    <ChoseHotel
      show={showChoseHotel}
      handleClose={closeChoseHotel}
      setSelectedRadio={SelectThisHotel}
      SelectedHotel={SelectedHotel}
      getHotelDetails={getHotelDetails}
    />

    <ChoseProduct
      show={showChoseProduct}
      handleClose={closeChoseProduct}
      handleChange={handleChangeProduct}
      selectedProduct={selectedProduct}
      GetProducts={GetProducts}
      setup={true}
    />

        <div className="content-header ">
          <div className="container-fluid ">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">{t("Ajouter Commande")} </h1>
              </div>{/* /.col */}
            </div>{/* /.row */}
            <hr></hr>
          </div>{/* /.container-fluid */}
        </div>
      <div>
      <section className="content ">
        <div className="container-fluid  " ><div className="row" > <div className="container-fluid " > <div className="row " > <div className="col-12">  <div className="card " style={{ backgroundColor: '#F8F8F8'}} > <div className="card-body  votre-information mt-2 mb-3">
        <h4 className="mb-4  "> {t("Information hôtel")} </h4>
        {purchaseOrder 
          ?<Button style={{backgroundColor: "#00a9ff"}}className='mb-4' disabled> {t("Choisir Hôtel")}</Button>
          :<Button style={{backgroundColor: "#00a9ff"}}className='mb-4' onClick={()=> openChoseHotel()}> {t("Choisir Hôtel")}</Button> 
        } <br/>
        <Container style={{backgroundColor: "#f0f3f5"}}>
            <Row className='mb-1'>
                <Col md={3}> {t("Nom de l'hotel")} </Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.name} disabled/></Col>
            </Row>
            <Row className='mb-1'>
                <Col md={3}>{t("Pays")}</Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.country} disabled/></Col>
            </Row>
            <Row className='mb-1'>
                <Col md={3}>{t("ville")}</Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.Region} disabled/></Col>
            </Row>
            <Row className='mb-1'>
                <Col md={3}>Adresse</Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.adress} disabled/></Col>
            </Row>
            <Row className='mb-1'>
                <Col md={3}>{t("Télephone")}</Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.phone} disabled/></Col>
            </Row>            
            <Row className='mb-1'>
                <Col md={3}>Email</Col>
                <Col  md={3}><Form.Control type="text" value={hotel?.account} disabled/></Col>
            </Row>
        </Container>
        <hr className='mb-5'/>
        <h4 className="mb-4  "> {t("Information Produit")} </h4>
        {purchaseOrder 
          ?<Button style={{backgroundColor: "#00a9ff"}} className='mb-4' onClick={()=> openChoseProduct()} disabled> {t("Choisir produit")}</Button> 
          :<Button style={{backgroundColor: "#00a9ff"}} className='mb-4' onClick={()=> openChoseProduct() } > {t("Choisir produit")}</Button> 
        }<br/>
        <Table className='mb-5'>
            <thead style={{backgroundColor: "#00a9ff"}}>
              <tr>
                <th style={{color: "white"}}> {t("Nom de produit")} </th>
                <th style={{color: "white"}}> {t("Catégorie")} </th>
                <th style={{color: "white"}}> {t("Prix unitaire")} </th>
                <th style={{color: "white"}}> {t("Quantité")} </th>
                <th style={{color: "white"}}> {t("TVA")} %</th>
                <th style={{color: "white"}}> Total HT </th>
                <th style={{color: "white"}}> {t("Supprimer")} </th>
              </tr>
            </thead>
            <tbody>
              {Loading
              ?null 
                :ProductList.length == 0 
                  ?<tr>
                    <td colSpan={7}> <center>
                      <img src={No_Data}alt="AdminLTE Logo" className="brand-image  " style={{width: "100px"}} /></center>
                    </td>
                  </tr>
                  :ProductList.map((post,index) => (
                      <ProductElements product={post} index={index}
                      onInputChange={onInputChange}
                      handleInvoiceDelete={handleInvoiceDelete}
                      ></ProductElements>
                    ))
              }
            </tbody>
        </Table>
        <Container className='mb-5'>
            <Row className='mb-2'>
                <Col style={{whiteSpace: 'nowrap' , fontSize: "1.3em"}} md={{ span: 2, offset: 8 }}><b>Total HT</b> </Col>
                <Col style={{whiteSpace: 'nowrap' , fontSize: "1.3em"}} md={2}>{(ProductList.reduce((prev, prod) => (prev + (  prod.amount * prod.prix  )), 0)).toFixed(2)} DT
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col style={{whiteSpace: 'nowrap', fontSize: "1.3em"}} md={{ span: 2, offset: 8 }}><b>Total TVA </b> </Col>
                <Col style={{whiteSpace: 'nowrap' , fontSize: "1.3em"}} md={2}>{(ProductList.reduce((prev, prod) => (  prev   + ((prod.amount * prod.prix)*prod.TVA/100)   ), 0)).toFixed(2)} DT
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col style={{whiteSpace: 'nowrap', fontSize: "1.8em", color: "#00a9ff",backgroundColor: "#e8edf0"}} md={{ span: 2, offset: 8 }}><b> Total TTC </b> </Col>
                <Col style={{whiteSpace: 'nowrap', fontSize: "1.8em", color: "#00a9ff",backgroundColor: "#e8edf0"}} md={2}>{(ProductList.reduce((prev, prod) => (prev + ((prod.amount * prod.prix)* prod.TVA / 100) + (prod.amount * prod.prix)), 0)).toFixed(2)} DT
                </Col>
            </Row>
        </Container>
        {
          <div className="button mb-2">
          <center>
            <p className="mb-1" style={{ color: "red", fontSize:"15px"}}>{errorMessage}</p>
          </center>
        </div>
        }
        <div className="mt-5 mb-4">
          <button className="btn btn-outline-secondary mr-2" onClick={() => handleReturn()}> {t("Retour")} </button>

          
            {purchaseOrder
              ?
              <div className="float-right ">
                <PDFDownloadLink document={ <PDFfile  purshaiseOrder={purchaseOrder}></PDFfile>} fileName="Facture.pdf">
                  <Button variant="success" className="btn mr-3 " > {t("Télécharger PDF")} </Button>
                </PDFDownloadLink>
                <Button style={{backgroundColor: "#00a9ff"}} className="btn mr-2 float-right" disabled> {t("Enregistrer")} </Button>

              </div>
              :
              <div className="float-right ">
                <Button variant="success" className="btn mr-3 " disabled> {t("Télécharger PDF")} </Button>
                <Button style={{backgroundColor: "#00a9ff"}} className="btn mr-2 float-right" onClick={() => handleSave(hotel, ProductList)}> {t("Enregistrer")} </Button>

              </div>
            }
            
        </div>
        {/*
        <PDFViewer width="800px" height ="600px">
          <PDFfile test={100000}></PDFfile>  
        </PDFViewer>
          */}
        </div> </div> </div> </div> </div> </div> </div>
      </section>
    </div>
    <Footer ></Footer>

</div>
  )
}

export default AddPurchaseOrder