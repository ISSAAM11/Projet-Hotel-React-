import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/PageElement/Header";
import SideBar from "../components/PageElement/SideBar";
 
const Registerpage = () => {
    const [username, setusername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [redirect, setRedirect] = useState(false)

    const submit = async (e: SyntheticEvent) =>{
        e.preventDefault()
        const response = await fetch('http://localhost:3000/users',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
                email,
                
            })
        })
        const content = await response.json();

        console.log(content);
        setRedirect(true);
    }
    if(redirect){
        return (<Navigate to="/login" replace={true} />)
    }
    
    return(
        <>

        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please register</h1>

            <input className="form-control" placeholder="name"
                onChange={e => setusername(e.target.value)}
            />

            <input type="email" className="form-control" placeholder="name@example.com"
                   onChange={e => setEmail(e.target.value)}
            />
                
            <input type="password" className="form-control" placeholder="Password" 
                onChange={e => setPassword(e.target.value)}
            />

            <input type="number" className="form-control" placeholder="role" 
                onChange={e => setRole(e.target.value)}
            />

            <button className="w-100 btn btn-lg btn-primary" type="submit">register</button>
                
            </form>
        </>    
    )
}
export default Registerpage;