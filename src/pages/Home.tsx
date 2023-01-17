import {  useNavigate  } from "react-router-dom";
import { useEffect} from "react";
import Header from "../components/PageElement/Header";
import SideBar from "../components/PageElement/SideBar";
import Distributors from "../components/Distributors/Distributors";
import { Route, Routes } from "react-router-dom";
import My_information from "../components/My_informations/My_informations";
import HotelList from "../components/hotel/HotelList";
import Historique from "../components/hotel/Historique";
import Help from "../components/Help/Help";
import ImageCorp from "../components/My_informations/ImageCorp";
import Reclamation from "../components/Reclamation/Reclamation";
import ReclamationList from "../components/Reclamation/ReclamationList";
import ReclamationDetails from "../components/Reclamation/ReclamationDetails";
import Dashbord from "../components/Dashbord/Dashbord";
import WelcomeUser from "../components/Dashbord/WelcomeUser";
import Products from "../components/Products/Products";
import PurchaseOrder from "../components/purchaseOrder/purchaseOrder";
import AddPurchaiseOrder from "../components/purchaseOrder/AddPurchaiseOrder";
import DisplayPurchaseOrder from '../components/purchaseOrder/DisplayPurchaiseOrder'
const Home = () => {
    useEffect(()=> {
//        checkConnecxion()
      } ,[]) 
    
      let navigate = useNavigate();
    const checkConnecxion= ()=> {
        if( !localStorage.getItem('token') ){
            navigate("/")
        }  
    }
    return(
        <div>
        <Header />
        <SideBar/>
            <div>
            <Routes>
                <Route path="/Ditributors" element={<Distributors/>} /> 
                <Route path="/WelcomeUser" element={<WelcomeUser/>} /> 
                <Route path="/hotels/" element={<HotelList/>} />   
                <Route path="/Products/" element={<Products/>} />   
                <Route path="/hotels/historique" element={<Historique/>} />   
                <Route path="/My_information" element={<My_information/>} />   
                <Route path="/Help" element={<Help/>} />
                <Route path="/ImageCorp" element={<ImageCorp/>} />
                <Route path="/Reclamation" element={<Reclamation/>} />
                <Route path="/ReclamationList/*" element={<ReclamationList/>} />
                <Route path="/ReclamationList/:id" element={<ReclamationDetails/>} />
                <Route path="/Dashbord" element={<Dashbord/>} />
                <Route path="/PurchaseOrder/*" element={<PurchaseOrder/>} /> 
                <Route path="/PurchaseOrder/:id" element={<DisplayPurchaseOrder/>} />
                <Route path="/PurchaseOrder/AddPurchaseOrder" element={<AddPurchaiseOrder/>} /> 

            </Routes>
            </div>
        </div>

    )
}
export default Home;