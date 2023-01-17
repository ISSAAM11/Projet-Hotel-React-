import {createContext,useState, useMemo, useEffect} from 'react'
import axios from 'axios'
const UserContext = createContext({
    user: null,
    auth: false,
    setUser:()=>{},
    login:( )=> {}
});

export function UserProvider ({children}){
    const [user, setUser] = useState(null)

    useEffect(()=> {
        getCurrentUser()
    } ,[]) 

    const getCurrentUser = async () => {
        if( localStorage.getItem('token') ){
            const config = {headers: { Authorization : 'Bearer ' +localStorage.getItem('token')}}
            const data = await axios.get(`http://localhost:3000/users/${localStorage.getItem('id')}`, {config} )
            setUser(data.data)
            {localStorage.setItem('role', data.data.role)}
        }
    }

    return(
        <UserContext.Provider value= { {user, setUser} }>
            {children}
        </UserContext.Provider>
    )
}
export default UserContext