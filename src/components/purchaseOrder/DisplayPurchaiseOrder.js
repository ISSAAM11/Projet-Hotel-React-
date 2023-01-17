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
import {useTranslation} from 'react-i18next'

function AddPurchaseOrder() {
  let { id } = useParams()
  const [ t, i18n ] = useTranslation()

  const {user, setUser} = useContext(UserContext);
  const [reclamation, setReclamation] = useState()
  const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
  const [source,setsource] = useState("")
  const [date, setdate] = useState("")
  const [title, settitle] = useState("")
  const [content, setcontent] = useState("")
  const [etat, setetat] = useState("")
  const [type, settype] = useState("")
  const [email, setemail] = useState("")
  const [responseList, setresponseList] = useState([])
  const [responseDateList, setresponseDateList] = useState([])
  const [responseUserList, setresponseUserList] = useState([])

  const [message, setmessage] = useState([])
  const [update, forceUpdate] = useReducer(x => x+1, 0)

  let navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1)
  }
  
  const [showChoseHotel, setshowChoseHotel] = useState(false) 
  const openChoseHotel = () => { setshowChoseHotel(true) }
  const closeChoseHotel = () => { setshowChoseHotel(false) }

  const [showChoseProduct, setshowChoseProduct] = useState(false) 
  const openChoseProduct = () => { setshowChoseProduct(true) }
  const closeChoseProduct = () => { setshowChoseProduct(false) }


  const [SelectedHotel, setSelectedHotel] = useState()
  const [hotel, sethotel] = useState()

  const [purshaiseOrder, setpurshaiseOrder] = useState()

  const SelectThisHotel = (value) => {setSelectedHotel(value);}  
  
  useEffect(()=> {
    getHotelDetails()
  } ,[])  
  const getHotelDetails = () => {
    axios.get(`http://localhost:3000/purchase-orders/${id}`,config ).then(
      res => {
        setpurshaiseOrder(res.data)
        sethotel(res.data.hotel)
        console.log(res.data.hotel)
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
/*
  const GetProducts = (selectedProduct)=> {
    let quantityList =[]
    let Products = []
    selectedProduct.forEach(element => {
      axios.get(`http://localhost:3000/produits/${element}` ,config ).then(
      res => {
        res.data.amount = 0
        res.data.TVA = 19
        Products.push(res.data)
        quantityList.push(0)
      },
      err => console.log(err)
    )
    });
    setTimeout(() => {
      setProductList(Products)
      closeChoseProduct()
    },100)
  }*/
  const [Loading, setLoading] = useState(false)

  const supprimerProduct = (idProduct) => {
    setLoading(true)
    let idList = ProductList
    const index = ProductList.indexOf(idProduct);
    idList.splice(index, 1);
    console.log(ProductList)  
    setTimeout(() => {
      setProductList(idList)
      setLoading(false)
    },1)
  }

  const updateQuantity = (value, i) => {

    ProductList.quantity[i] = value
    setquantity(ProductList)
    console.log(ProductList)
  }

  const onInputChange = (id,invoicee) => {
    const newInvioces = [...ProductList]
    const index = newInvioces.findIndex(r => r.id === id)
    newInvioces[index] = invoicee
    setProductList(newInvioces)
  };


  function handleInvoiceDelete(id){
    setProductList(ProductList.filter(Product => Product.id !== id))
  }



  const handleOpenPDF = () => {
    ReactPDF.renderToStream(<PDFfile />);
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
    />

        <div className="content-header ">
          <div className="container-fluid ">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">{t("Détail Commande")} </h1>
              </div>{/* /.col */}
            </div>{/* /.row */}
            <hr></hr>
          </div>{/* /.container-fluid */}
        </div>
      <div>
      <section className="content ">
        <div className="container-fluid  " ><div className="row" > <div className="container-fluid " > <div className="row " > <div className="col-12">  <div className="card " style={{ backgroundColor: '#F8F8F8'}} > <div className="card-body  votre-information mt-2 mb-3">
        <h4 className="mb-5  "> {t("Information Hôtel")} </h4>

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
 
        <Table className='mb-5'>
            <thead style={{backgroundColor: "#00a9ff"}}>
                <th style={{color: "white"}}> {t("Nom de produit")} </th>
                <th style={{color: "white"}}> {t("Catégorie")} </th>
                <th style={{color: "white"}}> {t("Prix unitaire")} </th>
                <th style={{color: "white"}}> {t("Quantité")} </th>
                <th style={{color: "white"}}> {t("TVA")} %</th>
                <th style={{color: "white"}}> Total HT </th>
            </thead>
            <tbody>
              {Loading
              ?null 
              :purshaiseOrder?.ProductList?.map((post,index) => (
                  <ProductElements product={post} index={index}
                  onInputChange={onInputChange}
                  handleInvoiceDelete={handleInvoiceDelete}
                  unModified={true}
                  ></ProductElements>
                ))
              }
            </tbody>
        </Table>
        
        <Container className='mb-5' >
            <Row className='mb-3' >
                <Col style={{whiteSpace: 'nowrap',}} md={{ span: 2, offset: 8 }}><b>Total HT</b> </Col>
                <Col md={2}>{purshaiseOrder?.totalHT} DT</Col>
            </Row>
            <Row className='mb-3'>
                <Col style={{whiteSpace: 'nowrap',}} md={{ span: 2, offset: 8 }}><b>Total TVA </b> </Col>
                <Col md={2}>{purshaiseOrder?.totalTVA} DT</Col>
            </Row>
            <Row className='mb-2'>
                <Col style={{whiteSpace: 'nowrap', fontSize: "1.7em", color: "#00a9ff",backgroundColor: "#e8edf0"}} md={{ span: 2, offset: 8 }}><b> Total TTC </b> </Col>
                <Col style={{whiteSpace: 'nowrap', fontSize: "1.7em", color: "#00a9ff",backgroundColor: "#e8edf0"}} md={2}>{purshaiseOrder?.totalTTC} DT</Col>
            </Row>
            
        </Container>
        <hr/>
        <div className="mt-5 mb-3">
          <button className="btn btn-outline-secondary mr-2" onClick={() => handleReturn()}> {t("Retour")} </button>

{/*
          <Button variant="success" className="btn mr-2" onClick={() => handleOpenPDF()}> Ouvrir d PDF </Button>
          <Button variant="success" className="btn mr-2" onClick={() => handlePrint()}> Imprimer PDF </Button>


          <Button variant="primary" className="btn mr-2 float-right" onClick={() => handleSave(hotel, ProductList)}> Enregistrer </Button>
*/}          <PDFDownloadLink document={ <PDFfile purshaiseOrder={purshaiseOrder}></PDFfile>} fileName="Facture.pdf">
            <Button variant="success" className="btn mr-3 float-right" >  {t("Télécharger PDF")} </Button>
          </PDFDownloadLink>
        </div>
{/*       
        <PDFViewer width="800px" height ="600px">
          <PDFfile purshaiseOrder={purshaiseOrder}></PDFfile>  
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