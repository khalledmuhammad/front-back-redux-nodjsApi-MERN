import React from 'react'
import "./Header.css"
import {Navbar } from "react-bootstrap"
import {Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {  useHistory  } from 'react-router-dom'
import {LogOutUser} from "../../store/userStore"

 
function Header() {
    const loggedIn = useSelector((state) => state.App.loggedIn);
    const dispatch = useDispatch()
    const history= useHistory()

    console.log(loggedIn)
    return (
        <>
           <Navbar   collapseOnSelect expand="lg" bg="#b060d9" className="navbar">
               <div className="leftNav">
            <h1>  KHALEDS </h1>
               </div>
           <Navbar.Toggle aria-controls="responsive-navbar-nav" />
               <Navbar.Collapse id="responsive-navbar-nav">
               <div className="middle">
       {        
             loggedIn ? 
             <>
      <Link  to="/Aboutme">AboutMe</Link>
      <Link to="/pojects">MyProjects</Link>
       <Link to="/contactme">ContactMe</Link>
      
       <button  className="btn btn-dark" onClick={()=>{dispatch(LogOutUser())
       history.replace("/Auth")}}>
           logOut
           </button>
       </>
       :
       <Link to="/Auth">Authenticate</Link> 


    
    }


     
  
               </div>
               <div className="rightNav">
             <a rel="noreferrer" href="https://www.linkedin.com/in/khaled-mohamed-398619182/" target="_blank"  >  <img alt="socialmediaIcon" src="https://img.icons8.com/color/30/000000/linkedin.png"/>     </a>  
             <a  rel="noreferrer" href="https://www.facebook.com/khaled.muhammad.35574" target="_blank" > <img alt="socialmediaIcon" src="https://img.icons8.com/color/30/000000/facebook-new.png"/></a>  
             <a rel="noreferrer" href="https://github.com/khalledmuhammad" target="_blank" > <img alt="socialmediaIcon" src="https://img.icons8.com/ios-glyphs/30/000000/github.png"/>    </a>   
             <a rel="noreferrer" href="https://www.instagram.com/khaaledmohamad/" target="_blank" > <img alt="socialmediaIcon" src="https://img.icons8.com/fluency/30/000000/instagram-new.png"/></a>  
             <a rel="noreferrer" href="https://twitter.com/KhaledM50926178" target="_blank" > <img alt="socialmediaIcon" src="https://img.icons8.com/color/30/000000/twitter--v1.png"/></a>  
               </div>
  </Navbar.Collapse>
           </Navbar >
        </>
    )
}

export default Header
