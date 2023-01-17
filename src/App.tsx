import React from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import Registerpage from './pages/Registerpage';
import { ProtectedRoutes }  from './ProtectedRoutes'
import ErrorPage from './pages/Error404';
import {UserProvider} from './ContextHandler'
import AdminPage from './pages/AdminPage';
 
function App() {

  
  return (
    <div className="app page-container">
      <div className="content-wrap">
      <UserProvider >
        <main className=" w-100 m-autos ">         
          <BrowserRouter>

            <Routes>
              <React.Fragment>

              <Route path="/" element={<Login />} />
              <Route path="/login/*" element={<Login />} />

              <Route element={<ProtectedRoutes allowedRoles={0}/>} >
                <Route path="/Admin/*" element={<AdminPage/>} />
              </Route>  
              
              <Route element={<ProtectedRoutes allowedRoles={1}/>} >
                <Route path="/home/*" element={<Home/>} />
              </Route>    

              </React.Fragment>
            </Routes> 
          </BrowserRouter>

        </main>    
      </UserProvider>

      </div>
    </div>
  );
}
export default App;
