import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import auth from '../../config/firebase'
import { useEffect,useState} from 'react'
import { signOut } from 'firebase/auth'
function Navbar() {
    const navigate = useNavigate()
    const [log,setLog] =useState(false)
   

    useEffect(()=>{
      auth.onAuthStateChanged(function(user){
        if(user)
        {
          setLog(true)
          console.log("user logged in")
        }
        else{
          setLog(false)
          console.log("user logged out")
        }
      })
    }, []);

    function logout()
    {
      
      signOut(auth)
    }

    
  return (
    <div className='py-5 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-blue-900'>Blog Portfolio</h2>
        <div className='flex items-center'>
            <Link className='list-none px-5' to={"/home"}>Home</Link>
            <Link className='list-none px-5' to={"/blogs"}>Blogs</Link>
            <Link className='list-none px-5' to={"/about"}>About</Link>
            <Link className='list-none px-5' to={"/contact"}>Contact</Link>

            {
              log?<button className='button-style hidden md:block' onClick={logout}>Logout</button>: <button className='button-style hidden md:block' onClick={()=>navigate("/login")}>Login</button>
            }
            
        </div>
    </div>
  )
}

export default Navbar