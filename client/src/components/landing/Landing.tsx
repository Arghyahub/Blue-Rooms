import { useEffect } from "react";
import "./Landing.css"

import { Link , NavigateFunction, useNavigate } from "react-router-dom"
import { socials , jsonUser } from "./LandingTypes";

// -----------IMP-------------
const bgURL:string = "https://picsum.photos/seed/picsum/2400/1080" ;
const iconURL:string = "https://loremicon.com/ngon/128/128/939346400536/jpg" ;
const backend:string = "http://localhost:8000" ;
// -------------------------

const Navbar = ():JSX.Element => {
    return (
      <div className="home-nav flrow acen">
        <img src={iconURL} alt="Icon" className='home-icon' />
        <h4>Recruit</h4>
{/*         
        <div className='navlog flrow'>
          <Link to="/hire" className="nav-btn">Hire</Link>
          <Link to="/apply" className="nav-btn">Get hired</Link>
          <a href="#about" className="nav-btn">About us</a>
        </div>
         */}
      </div>
    )
}

const Contact = ():JSX.Element => {
    const Socials:socials[] = [
      { icon: "contactImg/instagram.png" , name: "Instagram" , link: "https://www.instagram.com/argho_das_/" },
      { icon: "contactImg/linkedin.png" , name: "LinkedIn" , link: "https://www.linkedin.com/in/arghya-das-045702222/" },
      { icon: "contactImg/twitter.png" , name: "Twitter" , link: "https://twitter.com/ArghyaDas04" },
    ];

    return (
      <div id="contact" className="flcol jcen acen">
        <p className="cont-head">Contact us</p>
        <div className="flrow">
            {Socials.map((elem,ind) => (
              <a href={elem.link} key={`social${ind}`} className="socials flrow acen">
                <img src={elem.icon} alt="icon" />
                <p>{elem.name}</p>
              </a>
            ))}
        </div>
      </div>
    )
}


const Landing = ():JSX.Element => {
  const navigate:NavigateFunction = useNavigate() ;

  const getData = async ():Promise<jsonUser | null> => {
    const token:string|null = localStorage.getItem('jwt') ;
    if (!token) {
      return null;
    }
    try{
      const resp:Response = await fetch(`${backend}/userData`,{
        method : 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      })

      const json:jsonUser = await resp.json() ;
      if (json){
        return json;
      }
    }
    catch(err) {
      console.log(err) ;
      console.log("Error occurred, check internet") ;
      return null;
    }
    return null;
  }

  useEffect(() => {
    const handleLogged = async ():Promise<void> => {
      const data = await getData() ;
      // console.log('Landing' + data) ;
      if (data===null || data.token===false){ return; }
      if (data.token===true && data.valid===false) {
        localStorage.removeItem('jwt') ;
        return;
      }
      if (data.token && data.valid) {
        alert("Some error occurred, check Internet") ;
        return;
      }

      navigate('/home') ;
    }
    handleLogged() ;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  


  return (
    <div id="Home" className="h100">

      <Navbar />
      
      <div className="flcol homebg-div jcen acen">
        <img src={bgURL} alt="Home" className="homebg abs"/>
        <h1 className="home-head">Welcome to Blue Rooms</h1>
        <p className="home-txt">Your personal chat and fun rooms</p>

        <div className="flrow join-opt acen">
          <Link to={'/auth'} className="homejoin-btn grsha">Signup</Link>
          Or
          <Link to={'/auth'} className="homejoin-btn grsha">Login</Link>
        </div>
      </div>

      <div id="about" className="product flcol jcen acen">
        <h1>Out Platform</h1>
        <p className="prod-txt">Our motive is to build an app that brings people together, makes chatting together much more fun and work with each other</p>
        <p className="prod-txt">Engaging rooms, games and many more interesting features</p>
        <p className="prod-about">Join today and be a part of the the most fun platform</p>
      </div>

      <Contact />

    </div>
  )
}

export default Landing