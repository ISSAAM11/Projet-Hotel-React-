import axios from 'axios'
import React, {useContext, useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import './Dashbord.css'
import '../../App.css'
import { use } from 'i18next';
import ClaimesDashbord from './ClaimesDashbord'
import ChartCountry from './ChartCountry';
import {Bar, Line, Doughnut  } from "react-chartjs-2"
import {Chart as ChartJS} from 'chart.js/auto'
import {set} from 'date-fns';
import Footer from '../PageElement/Footer';
import Dropdown from 'react-bootstrap/Dropdown';
import My_information from '../My_informations/My_informations';
import UserContext from '../../ContextHandler'

export default function Dashbord() { 
  
    const [hotelsNumber , sethotelsNumber]= useState()
    const [usersNumber , setusersNumber]= useState()
    const [newClaimNumber , setnewClaimNumber]= useState()
    const [LastestHotels, setLastestHotels ] = useState([])
    const [distributors, setDistributors ] = useState()
    const [ t, i18n ] = useTranslation()
    const [ messages, setMessages] = useState()
    const [ messagesClos, setMessagesClos] = useState()
    const [ countryList, setCountryList] = useState([])
    const [ countryNumberList, setCountryNumberList] = useState([])
    const [ datahotel, setDatahotel] = useState([])
    const [ monthList, setMonthList] = useState([])
    const [ yearList, setyearList] = useState([])
    const [ dateNumberList, setdateNumberList] = useState([])
    const [ sortBy, setsortBy] = useState("Sort by: serrure")
    const [ CountryNumLastMonthList, setCountryNumLastMonthList] = useState([])
    const [ hotels, sethotels] = useState()
    const [ OrdersList , setOrdersList] = useState()
    const [ sumOrders , setsumOrders] = useState(0)
    
    const [ MonthsList, setMonthsList] = useState(["Jan", "Feb", "Mar", "Apr" , "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    const [ DateNumberList, setDateNumberList] = useState([0,0,0,0,0,0,0,0,0,0,0,0])
    const {user, setUser} = useContext(UserContext);
    const thisYear = new Date().toISOString().split("-")[0]

    let linkReclamationlist = "/home/ReclamationList"
    let linkhotels = "/home/hotels"
    let linkDistributors = "/Admin/Ditributors"
    let linkCommandes = "/Admin/PurchaseOrder"
    if (user?.role == 0){
      linkReclamationlist = "/admin/ReclamationList"
      linkhotels = "/admin/hotels"
      linkDistributors = "/Admin/Ditributors"
      linkCommandes = "/Admin/PurchaseOrder"
    }

    const [ totalRevenue, settotalRevenue] = useState({
      labels: ["test1", ],
      datasets: [{ 
        label: "H??tels by country",
        data: [1,],
        backgroundColor: ["#dc3545","#ffc107",]
      }]
    })
    const [ dataBestClient, setdataBestClient] = useState({
      labels: ["test1", ],
      datasets: [{ 
        label: "H??tels by country",
        data: [1,],
        backgroundColor: ["#dc3545","#ffc107",]
      }]
    })    
    const [ datahotelDate, setDataHotelDate] = useState({
      labels: ["test1", ],
      datasets: [{ 
        label: "H??tels by country",
        data: [1,],
        backgroundColor: ["#dc3545","#ffc107",]
      }]
    })
    const [hotelsData, sethotelsData] = useState({
      labels: ["test1", ],
      datasets: [{ 
        label: "H??tels by country",
        data: [1,],
        backgroundColor: ["#dc3545","#ffc107",]
      }]
    })  
    const [ dataBestUsers, setdataBestUsers] = useState({
      labels: ["test1", ],
      datasets: [{ 
        label: "H??tels by country",
        data: [1,],
        backgroundColor: ["#dc3545",]
      }]
    })
    const config = {headers: {Authorization : 'Bearer ' +localStorage.getItem('token')}}
    
    useEffect(()=> {
        getAllMessages()
        getAllHotels()
        gethotelcount()
        getuserscount()
        getmessagescount()
        getAllUsers()
        getPurchaseOrders()
    },[])

    const [MonthsListRevenue, setMonthsListRevenue] = useState([])
    const getPurchaseOrders = () => {
      axios.get(`http://localhost:3000/my-purchase-orders-list/${localStorage.getItem('id')}` ,config).then(
        res => {
          setOrdersList(res.data)
          let sum = 0
          res.data.forEach( x => sum += x.totalTTC)
          const formatted = sum.toLocaleString('en-US');
          setsumOrders(formatted)
          
          let dateSumList = []
        
          
          let monthList = []
          let yearList = []
          let i 
          res.data.sort().reverse().map((data)=>{
            if (monthList.length == 0){
              const date = data.date.split("-")
              const month = `${date[1]}`
              const year = `${date[0]}`
              monthList.push(month)
              yearList.push(year)
            }else{
              let test = false
  
              for( i=0 ; i < monthList.length; i++ ){
                const month = data.date.split("-")[1]
                const year = data.date.split("-")[0]
                if(monthList[i] == month && yearList[i] == year){
                  test = true
                }
              }
  
              if(test == false ){
                const date = data.date.split("-")
                const month = `${date[1]}`
                const year = `${date[0]}`
                monthList.push(month)   
                yearList.push(year)
              }
            }
          }) 

            for(let i=0; i < monthList.length; i++ ){
              let sum = 0
              res.data.sort().reverse().forEach((data)=> {
    
                const monthHotel = data.date.split("-")[1]
                const yearHotel = data.date.split("-")[0]
                if(monthList[i] == monthHotel &&  yearHotel == 2022){
                  sum += data.totalTTC  
                }
              })   
              if (sum!=0)
              dateSumList[monthList[i]-1] = sum
            }

            setMonthsListRevenue(dateSumList)

          settotalRevenue({ 
            labels: MonthsList,
            datasets: [{ 
              label: "H??tels amount by month",
              data: dateSumList,
              backgroundColor: ["#0d6efd"]
            }]  
          })

          console.log("dateSumList :")
          console.log(dateSumList)
        }
      )
    }

    const changeYear2 = (year) => {
      setselectedYear(year)
      let dateRevenueList = [];
      for( let i = 0; i < monthList.length; i++ ){
        let sum = 0
        OrdersList.sort().reverse().forEach((data)=> {
  
          const monthHotel = data.date.split("-")[1]
          const yearHotel = data.date.split("-")[0]
          if(monthList[i] == monthHotel && yearHotel == year){
            sum += data.totalTTC  
          }
        })
        if (sum!=0)
        dateRevenueList[monthList[i]-1] = sum
      }
      setMonthsListRevenue(dateRevenueList)

      settotalRevenue({
        labels: MonthsList ,
        datasets: [{ 
          label: "H??tels amount by month",
          data: dateRevenueList,
          backgroundColor: ["#0d6efd"]
        }]
      })
    }

  const getuserscount=()=> {
    axios.get(`http://localhost:3000/users/count` ,config).then(
    res => {
      setusersNumber(res.data.count)
      }
    )
  }
  const getmessagescount=()=> {
      axios.get(`http://localhost:3000/messages/count` ,config).then(
      res => {
          setnewClaimNumber(res.data.count)
          }
      )
  }
  const gethotelcount=()=> {
      axios.get(`http://localhost:3000/hotels/count` ,config).then(
      res => {
          sethotelsNumber(res.data.count)
          }
      )
  }
  const getAllHotels =  () => {
      axios.get(`http://localhost:3000/hotelsList/${localStorage.getItem('id')}?filter[where][history]=false&filter[order]=date`,config ).then(
      res => {
        let data = res.data.sort().reverse()   
        sethotels(res.data)
        let Hotels=data
        setLastestHotels(data.slice(0, 6))

        Hotels.sort((a,b) =>  b.lockAmmount - a.lockAmmount )
        setDatahotel(Hotels)

        setdataBestClient({
          labels: Hotels.map((element)=> element.name).slice(0, 10),
          datasets: [{ 
            label: "Best client",
            data: Hotels.map((element)=> element.lockAmmount),
            backgroundColor: ["#dc3545"]
          }]
        })


        let countryList = []
        res.data.map((data)=>{
            if (countryList.length == 0){
              countryList.push(data.country)
            }else{
              let test = false
                countryList.forEach((element)=> {
                  if(element == data.country) {
                    test = true
                  }
                })  
              if(test == false ){
                countryList.push(data.country)
              }
            }
        })
         
        setCountryList(countryList)
        let countryNumberList = []
        let countryNumLastMonthList = []
        let month = new Date().getMonth() + 1;

        let i = 0
        countryList.forEach((country)=> {
          let x = 0
          let y = 0
          res.data.forEach((hotel)=> {
            if(country == hotel.country){
              x++
              if(hotel.date != month)
                y++
              }
          })
          countryNumberList[i] = x
          countryNumLastMonthList[i] = y

          i += 1
        })
        setCountryNumberList(countryNumberList)
        setCountryNumLastMonthList(countryNumLastMonthList)

        for( var j=0; j<countryNumberList.length;j++){
          var top = j
          for(var k=j+1;k<countryNumberList.length;k++)
          if(countryNumberList[k] > countryNumberList[top]){

            top = k; 
            }
            var tmp = countryNumberList[j];
            countryNumberList[j] = countryNumberList[top];
            countryNumberList[top] = tmp;
            var tmp = countryList[j]
            countryList[j] = countryList[top];
            countryList[top] = tmp;            
        }
        countryList = countryList.slice(0, 5)
        countryNumberList = countryNumberList.slice(0, 5)

        sethotelsData({
          labels: countryList,
          datasets: [{ 
            label: "H??tels by country",
            data: countryNumberList,
            backgroundColor: ["#dc3545","#198754","#ffc107","#0dcaf0","#0d6efd"]
          }]
        })

        let monthList = []
        let yearList = []

        res.data.sort().reverse().map((data)=>{
          if (monthList.length == 0){
            const date = data.date.split("-")
            const month = `${date[1]}`
            const year = `${date[0]}`
            monthList.push(month)
            yearList.push(year)
          }else{
            let test = false

            for( i=0 ; i < monthList.length; i++ ){
              const month = data.date.split("-")[1]
              const year = data.date.split("-")[0]
              if(monthList[i] == month && yearList[i] == year){
                test = true
              }
            }

            if(test == false ){
              const date = data.date.split("-")
              const month = `${date[1]}`
              const year = `${date[0]}`
              monthList.push(month)   
              yearList.push(year)
            }
          }
        }) 
        setMonthList(monthList)
        setyearList(yearList)
          //  if egal to year add

        let dateNumberList = []
        
        for( i=0; i < monthList.length; i++ ){
          let x = 0
          res.data.sort().reverse().forEach((data)=> {

            const monthHotel = data.date.split("-")[1]
            const yearHotel = data.date.split("-")[0]
            if(monthList[i] == monthHotel &&  yearHotel == thisYear){
              x++
            }
          })
          if (x!=0)
          dateNumberList[monthList[i]-1] = x
        }
/*          
        monthList.forEach((month)=> {
          let x = 0
          res.data.sort().reverse().forEach((data)=> {
            const monthHotel = data.date.split("-")[1]
            const yearHotel = data.date.split("-")[0]
              if(month == monthHotel )
              x++
          })
          dateNumberList[month-1] = x
        })
*/         

        setDateNumberList (dateNumberList)          
        
        setDataHotelDate({
          labels: MonthsList,
          datasets: [{ 
            label: "H??tels amount by month",
            data: dateNumberList,
            backgroundColor: ["#0d6efd"]
          }]
        })
      
      },
      err => {
        console.log(err)
      }
    )            
  }

  const [ selectedYear, setselectedYear] = useState("2022")


  const changeYear = (year) => {
    setselectedYear(year)
    let dateNumberList = [];
    for( let i = 0; i < monthList.length; i++ ){
      let x = 0
      hotels.sort().reverse().forEach((data)=> {

        const monthHotel = data.date.split("-")[1]
        const yearHotel = data.date.split("-")[0]
        if(monthList[i] == monthHotel && yearHotel == year){
          x++
        }
      })
      if (x!=0)
      dateNumberList[monthList[i]-1] = x
    }

    setDataHotelDate({
      labels: MonthsList,
      datasets: [{ 
        label: "H??tels amount by month",
        data: dateNumberList,
        backgroundColor: ["#0d6efd"]
      }]
    })
  }
  const getAllUsers = () => {
      axios.get(`http://localhost:3000/usersList/${localStorage.getItem('id')}?filter[order]=date`, config).then(
      res => {
        let users = res.data
        setusersNumber(users.length)
        setDistributors(res.data.sort().reverse().slice(0, 8) )

        res.data.sort((a,b) =>  b.hotelNumber - a.hotelNumber )

        setdataBestUsers({
          labels: res.data.map((data) => data.username),
          datasets: [{ 
            label: "Hotel number",
            data: res.data.map((data) => data.hotelNumber),
            backgroundColor: ["#dc3545",]
          }]
        })
      },
      err => {
        console.log(err)
      }
    )
  }
  const getAllMessages = async () => {
    axios.get(`http://localhost:3000/messages/${localStorage.getItem('id')}?filter[order]=date`,config ).then(
      res => {
          const listreclamation = res.data.sort((a,b) =>   a.etat - b.etat ).slice(0, 5)
          setMessages(listreclamation)
          setMessagesClos(res.data.filter(post => post.etat==false).length)
      },
      err => {
        console.log( err)
      }
    )            
  }
  const DeviceAmountChart = (Device)=>{
    if(Device == "all"){
      const data = datahotel.sort((a,b) =>  (b.lockAmmount+b.gatewayAmmount+b.liftAmmount+b.energyAmmount) - (a.lockAmmount+a.gatewayAmmount+a.liftAmmount+a.energyAmmount) )
      setdataBestClient({
        labels: data.map((element)=> element.name).slice(0, 10),
        datasets: [{ 
          label: "Best client",
          data: data.map((element)=> element.lockAmmount+element.gatewayAmmount+element.liftAmmount+element.energyAmmount),
          backgroundColor: ["#dc3545"]
        }]
      })
      setsortBy("Sort by: Tout")
    }else if(Device == "lock"){
      const data = datahotel.sort((a,b) =>  b.lockAmmount - a.lockAmmount )
      setdataBestClient({
        labels: data.map((element)=> element.name).slice(0, 10),
        datasets: [{ 
          label: "Best client",
          data: data.map((element)=> element.lockAmmount),
          backgroundColor: ["#dc3545"]
        }]
      })
      setsortBy("Sort by: serrure")

    }else if (Device == "gateway"){
      const data = datahotel.sort((a,b) =>  b.gatewayAmmount - a.gatewayAmmount )

      setdataBestClient({
        labels: data.map((element)=> element.name).slice(0, 10),
        datasets: [{ 
          label: "Best client",
          data: data.map((element)=> element.gatewayAmmount),
          backgroundColor: ["#dc3545"]
        }]
      })
      setsortBy("Sort by: Dis r??seau ")
    }else if (Device == "lift"){
      const data = datahotel.sort((a,b) =>  b.liftAmmount - a.liftAmmount )

      setdataBestClient({
        labels: data.map((element)=> element.name).slice(0, 10),
        datasets: [{ 
          label: "Best client",
          data: data.map((element)=> element.liftAmmount),
          backgroundColor: ["#dc3545"]
        }]
      })
      setsortBy("Sort by: Dis ascenseur ")

    }else if (Device == "energy"){
      const data = datahotel.sort((a,b) =>  b.energyAmmount - a.energyAmmount )
      setdataBestClient({
        labels: data.map((element)=> element.name).slice(0, 10),
        datasets: [{ 
          label: "Best client",
          data: data.map((element)=> element.energyAmmount),
          backgroundColor: ["#dc3545"]
        }]
      })
      setsortBy("Sort by: mode ??co")

    }
  }

  const [ CountryListDropdown, setCountryListDropdown ] = useState()
  const [ regionList, setregionList ] = useState([])
  const [ regionListNumber, setregionListNumber ] = useState([])

  const DropdownCountryList = (Country) => {
    setCountryListDropdown(Country)
    const newregionList = []
    const ListNumber = []

    datahotel.map((element)=> {
      if(element.country == Country){
        if(newregionList.length == 0){
          newregionList.push(element.Region)
        }
        else {
          let test = false
          newregionList.forEach((region)=> {
          if(region == element.Region) {
              test = true
            }
          })  
          if(test == false ){
            newregionList.push(element.Region)
          }
        }

      }
    })

    let i = 0
    newregionList.map((region) => {
      let x = 0
      datahotel.forEach((post) => {
        if (post.Region == region ){
          x++
        }
      })
      ListNumber[i] = x 
      i++
    })

    setregionList(newregionList)
    setregionListNumber(ListNumber)
    console.log(newregionList)
    console.log(ListNumber)

  }

  
  return (
    
<div className="content-wrapper page-container">

  <div className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="m-0">{t("Tableau de bord")}</h1>
        </div>

      </div>  <hr></hr>
    </div>
  </div>

  <section className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>{hotelsNumber}</h3>
              <p>Hotels</p>
            </div>
            <div className="icon">
              <i className="ion ion-home" />
            </div>
            <Link to={linkhotels} className="small-box-footer">{t("Plus d'information")} <i className="fas fa-arrow-circle-right" /></Link>
          </div>
        </div>
        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              {/*<h3>53<sup style={{fontSize: 20}}>%</sup></h3>*/}
              <h3 > {sumOrders} <sup style={{fontSize: 20}}>DT</sup></h3>
              <p>{t("Revenu total")}</p>
            </div>
            <div className="icon">
              <i className="ion ion-earth" />
            </div>
            <Link to={linkCommandes} className="small-box-footer">{t("Plus d'information")} <i className="fas fa-arrow-circle-right" /></Link>
          </div>
        </div>
        
        <div className="col-lg-3 col-6">
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>{usersNumber}</h3>
              <p>{t("Distributeurs")} </p>
            </div>
            <div className="icon">
              <i className="ion ion-person-add" />
            </div>
            <Link to={linkDistributors} className="small-box-footer">{t("Plus d'information")} <i className="fas fa-arrow-circle-right" /></Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="small-box bg-danger">
            <div className="inner">
              <h3>{newClaimNumber}</h3>
              <p>{t("Reclamation")} </p>
            </div>
            <div className="icon">
              <i className="ion ion-email" />
            </div>
            <Link to={linkReclamationlist} className="small-box-footer">{t("Plus d'information")} <i className="fas fa-arrow-circle-right" /></Link>
          </div>
        </div>
      </div>
      
      <div className="row">
        <section className="col-lg-7 connectedSortable">
          
<div className="card">
  <div className="card-header border-transparent">
    <h3 className="card-title">{t("Derniers h??tels")}</h3>

  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table m-0">
        <thead>
          <tr>
          <th>{t("Nom de l'h??tel")}</th>
          <th>{t("Nom createur")}</th>
          <th>{t("Date creation")}</th>
          <th>{t("Pays")}</th>
          <th>{t("Region")}</th>
          </tr>
        </thead>
        <tbody>
          {LastestHotels.map((post) => (
              <tr key={post.id} >
                <td><a>{post.name}</a></td>
                <td><a>{post.Created_By}</a></td>
                <td><a>{post.date}</a></td>
                <td><a>{post.country}</a></td>
                <td><a>{post.Region}</a></td>
              </tr>
          ))} 

        </tbody>


      </table>
    </div>
  </div>
  <div className="card-footer clearfix">
{/*    <a href="javascript:void(0)" className="btn btn-sm btn-success float-left">{t("Cr??e un hotel")}</a>*/}
    <Link to={linkhotels} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
      {t("Plus d'information")} &nbsp;
        <i className="fas fa-arrow-circle-right" />
      </a>
    </Link>
  </div>
</div>


<div className="card">
  <div className="card-header">
    <h3 className="card-title mt-2">{t("Montant des h??tels par mois")}</h3>

     <Dropdown className="float-right">
        <Dropdown.Toggle  variant="white" id="dropdown-basic"> {t("Ann??e")}: {selectedYear} </Dropdown.Toggle>
        
        <Dropdown.Menu>
          <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page" onClick={()=>changeYear(2021)}>2021</a></Dropdown.Item>
          <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page" onClick={()=>changeYear(2022)}>2022</a></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
  </div>

  <div className="card-body p-0">
    <ul className="users-list clearfix ml-3 mr-3 mt-3">
    <Line data={datahotelDate} 
      options = {{  
        plugins:{
          legend:{
            display: false
          }
        }   ,     
        scales: {
            y: {
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
        }}}
    />   

    </ul>

  </div>
  <div className="card-footer text-center">
    <Link to={linkhotels} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
      {t("Plus d'information")} 
        <i className="fas fa-arrow-circle-right ml-1" />
      </a>
    </Link>
    </div>
</div>

<div className="card">
  <div className="card-header">
    <h3 className="card-title mt-2">{t("Revenu total par mois")}</h3>

     <Dropdown className="float-right">
        <Dropdown.Toggle  variant="white" id="dropdown-basic"> {t("Ann??e")}: {selectedYear} </Dropdown.Toggle>
        
        <Dropdown.Menu>
          <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page" onClick={()=>changeYear2(2021)}>2021</a></Dropdown.Item>
          <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page" onClick={()=>changeYear2(2022)}>2022</a></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
  </div>

  <div className="card-body p-0">
    <ul className="users-list clearfix ml-3 mr-3 mt-3">
    <Line data={totalRevenue} 
      options = {{  
        plugins:{
          legend:{
            display: false
          }
        }   ,     
        scales: {
            y: {
                min: 0,
                ticks: {
                    stepSize: 1
                }
            } 
        }}}
    />    
    </ul>
    
  </div>
  <div className="card-footer text-center">
    <Link to={linkCommandes} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
      {t("Plus d'information")} 
        <i className="fas fa-arrow-circle-right ml-1" />
      </a>
    </Link>
    </div>
</div>





<div className="card">
  <div className="card-header">
    <h3 className="card-title mt-2">{t("Meilleur client")}</h3>
   
        <Dropdown className="float-right">
          <Dropdown.Toggle  variant="white" id="dropdown-basic"> {sortBy}
          </Dropdown.Toggle>
          
          <Dropdown.Menu>
{/*         <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page"onClick={()=>DeviceAmountChart("all")} >Tout</a></Dropdown.Item>*/}          
            <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page"onClick={()=>DeviceAmountChart("lock")} >{t("Serrure")}</a></Dropdown.Item>
            <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page"onClick={()=>DeviceAmountChart("gateway")} >{t("Dispositif r??seau")}</a></Dropdown.Item>
            <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page" onClick={()=>DeviceAmountChart("lift")} >{t("Dispositif ascenceur")}</a></Dropdown.Item>
            <Dropdown.Item ><a type="button"className="nav-link active" aria-current="page"onClick={()=>DeviceAmountChart("energy")} >{t("Mode ??co")}</a></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
  </div>

  <div className="card-body p-0">
    <ul className="users-list clearfix ml-3 mr-3 mt-3">
    <Bar data={dataBestClient} 
        options={{
          legend: {display:false, }
        }}
    />  
    </ul>
  </div>

  <div className="card-footer text-center">
    <Link to={linkDistributors} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
      {t("Plus d'information")}  
        <i className="fas fa-arrow-circle-right ml-1" />
      </a>
    </Link>
    </div>
</div>

        </section>
        <section className="col-lg-5 connectedSortable">

<div className="card">
  <div className="card-header">
    <h3 className="card-title">{t("Derniers membres")}</h3>
  </div>
  <div className="card-body p-0">
    
    <ul className="users-list clearfix">
      {distributors?
        distributors.map((post) => (
          <li key={post.id}>
              <div className="photoHandler">
                <img src={post.imageURL} id="photodashBord"/>
              </div>
              
              <span style={{fontWeight: "bold"}}className="users-list-name" >{post.username}</span>
              <span className="users-list-date">{post.date}</span>
          </li>
        ))
        :
        null
      }
    </ul>
  </div>
  <div className="card-footer text-center">

    <Link to={linkDistributors} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
      {t("Plus d'information")}  &nbsp;
        <i className="fas fa-arrow-circle-right" />
      </a>
    </Link>
    </div>
</div>

<div className="card">
  <div className="card-header">
    <h3 className="card-title">{t("Meilleurs distributeurs")}</h3>
  </div>

  <div className="card-body p-0">
    <ul className="users-list clearfix ml-3 mr-3 mt-3">
    <Bar data={dataBestUsers} 
        options={{
          legend: {display:false, }
          
        }}
    />  
    </ul>
  </div>

  <div className="card-footer text-center">
    <Link to={linkDistributors} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
        {t("Plus d'information")}  
        <i className="fas fa-arrow-circle-right ml-1" />
      </a>
    </Link>
    </div>
</div>

<ClaimesDashbord messages={messages} messagesClos={messagesClos}></ClaimesDashbord>


<div className="card">
  <div className="card-header">
    <h3 className="card-title">Hotels {t("pays/region")}</h3>

        <Dropdown className="float-right">
          <Dropdown.Toggle  variant="white" id="dropdown-basic"> {t("Pays")} : {CountryListDropdown}</Dropdown.Toggle>

          <Dropdown.Menu>

            {countryList.map((post) => ( 
              <Dropdown.Item key={post}>
                <a type="button"className="nav-link active" aria-current="page" onClick={()=>DropdownCountryList(post)}>{post}</a>
              </Dropdown.Item>
            ))}
            
          </Dropdown.Menu>
        </Dropdown>

  </div>
  <div className="card-body">
    <div className="row">
      <div className="col-md-8">
        <div className="chart-responsive " style={{margin:"auto auto",width:"300px"}}> 
        <Doughnut data={hotelsData} 
            options = {{ 
              plugins:{ 
                legend:{  
                  display: false
                } 
              }
            }}
        />
        </div>
      </div>
      <div className="col-md-4 mt-2">
        <ul className="chart-legend clearfix">

          { countryList[0] ? <li> <i className="far fa-circle text-danger" />  {countryList[0]} </li> : null }
          { countryList[1] ? <li> <i className="far fa-circle text-success" /> {countryList[1]} </li> : null }
          { countryList[2] ? <li> <i className="far fa-circle text-warning" /> {countryList[2]} </li> : null }
          { countryList[3] ? <li> <i className="far fa-circle text-info" />    {countryList[3]} </li> : null }
          { countryList[4] ? <li> <i className="far fa-circle text-primary"/>  {countryList[4]} </li> : null }

        </ul>
      </div>
    </div>
  </div>
  <div className="card-footer p-0">
    <ul className="nav nav-pills flex-column">

    {regionList[0] && regionListNumber[0] ?
    <li className="nav-item">
      <a className="nav-link">{regionList[0]}
        <span className="float-right "> {regionListNumber[0] }</span>
      </a>  
    </li> : null }

    {regionList[1] && regionListNumber[1] ?
    <li className="nav-item">
      <a className="nav-link">{regionList[1]}
        <span className="float-right "> {regionListNumber[1] }</span>
      </a>  
    </li> : null }

    {regionList[2] && regionListNumber[2] ?
    <li className="nav-item">
      <a className="nav-link">{regionList[2]}
        <span className="float-right "> {regionListNumber[2] }</span>
      </a>  
    </li> : null }

    {regionList[3] && regionListNumber[3] ?
    <li className="nav-item">
      <a className="nav-link">{regionList[3]}
        <span className="float-right "> {regionListNumber[3] }</span>
      </a>  
    </li> : null }

    {regionList[4] && regionListNumber[4] ?
    <li className="nav-item">
      <a className="nav-link">{regionList[4]}
        <span className="float-right "> {regionListNumber[4] }</span>
      </a>  
    </li> : null }

{/* 
      <li className="nav-item">
        <a className="nav-link">
        {countryList[0]}
        {countryNumberList[0] - CountryNumLastMonthList[0] > 0 ?
            <span className="float-right text-success">
              <i className="fas fa-arrow-up text-sm"></i> {countryNumberList[0] - CountryNumLastMonthList[0]}
            </span>
            : 
            countryNumberList[0] - CountryNumLastMonthList[0] == 0 ?
            <span className="float-right text-warning">
            <i className="fas fa-arrow-left text-sm"></i> {countryNumberList[0] - CountryNumLastMonthList[0]}
            </span>
            :
            <span className="float-right text-danger">
              <i className="fas fa-arrow-down text-sm"></i> {countryNumberList[0] - CountryNumLastMonthList[0]}
            </span>
          }
        </a>
      </li>
      <li className="nav-item">
        <a  className="nav-link">
        {countryList[1]}
        {countryNumberList[1] - CountryNumLastMonthList[1] > 0 ?
            <span className="float-right text-success">
              <i className="fas fa-arrow-up text-sm"></i> {countryNumberList[1] - CountryNumLastMonthList[1]}
            </span>
            : 
            countryNumberList[1] - CountryNumLastMonthList[1] == 0 ?
            <span className="float-right text-warning">
            <i className="fas fa-arrow-left text-sm"></i> {countryNumberList[1] - CountryNumLastMonthList[1]}
            </span>
            :
            <span className="float-right text-danger">
              <i className="fas fa-arrow-down text-sm"></i> {countryNumberList[1] - CountryNumLastMonthList[1]}
            </span>
          }
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link">
          {countryList[2]}  
          {countryNumberList[2] - CountryNumLastMonthList[2] > 0 ?
            <span className="float-right text-success">
              <i className="fas fa-arrow-up text-sm"></i> {countryNumberList[2] - CountryNumLastMonthList[2]}
            </span>
            : 
            countryNumberList[2] - CountryNumLastMonthList[2] == 0 ?
            <span className="float-right text-warning">
            <i className="fas fa-arrow-left text-sm"></i> {countryNumberList[2] - CountryNumLastMonthList[2]}
            </span>
            :
            <span className="float-right text-danger">
              <i className="fas fa-arrow-down text-sm"></i> {countryNumberList[2] - CountryNumLastMonthList[2]}
            </span>
          }

        </a>
      </li>
*/}
    </ul>
  </div>
</div>
        </section>
      </div>
    </div>

    
  </section>
  <Footer></Footer>

</div>

 
  )
}
