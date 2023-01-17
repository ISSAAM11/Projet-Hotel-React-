import React,{useContext} from 'react'
import Login from './pages/Login';
import { Outlet, Navigate ,useLocation} from 'react-router-dom';
import UserContext from './ContextHandler'

const useAuth = () => {
    const user = {loggedIn: false};
    return user && user.loggedIn;
}

export const ProtectedRoutes = ({allowedRoles}) => {
  const {user, setUser} = useContext(UserContext);
  const location = useLocation()
   return(
    localStorage.getItem('role') == allowedRoles
    ? <Outlet />
    : localStorage.getItem('role') 
      ? <Navigate to={-1} state={{ from: location }} replace/>
      : <Navigate to="/login/" state={{ from: location }} replace/>
   
    )
//    const isAuth = props.authorise;
//   console.log(props.authorise)
//  return isAuth ? <Outlet />: <Navigate to="/"/>
  
}
export default ProtectedRoutes