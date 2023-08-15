import { useEffect , useState } from "react";
import "./Landing.css"

import { Link , NavigateFunction, useNavigate } from "react-router-dom"
import { socials , jsonUser } from "./LandingTypes";
import PropagateLoader from "react-spinners/PropagateLoader";

// -----------IMP-------------
const bgURL:string = "/blue-min.jpg" ;
const iconURL:string = "/logo.png" ;
const backend:string = "http://localhost:8000" ;
// -------------------------


import * as React from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type AlertColor = 'success' | 'info' | 'warning' | 'error';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
interface State extends SnackbarOrigin {
  open?: boolean;
  msg: string;
  typeE: AlertColor | undefined;
}

const Navbar = ():JSX.Element => {
    return (
      <div className="home-nav flrow acen">
        <img src={iconURL} alt="Icon" className='home-icon' />
        <h4>BlueRooms</h4>
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
  const [Loading, setLoading] = useState<boolean>(false) ;

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    msg: '',
    typeE: 'success'
    // error warning info success
  });
  const { vertical, horizontal, open , msg , typeE } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClick = (newState: State) => () => {
    setState({ ...newState, open: true });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

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
      setLoading(true) ;
      const data = await getData() ;
      setLoading(false) ;
      // console.log('Landing' + data) ;
      if (data===null || data.token===false){ return; }
      if (data.token===true && data.valid===false) {
        setState({ vertical: 'top', horizontal: 'center' , msg: 'Data invalidated', typeE: 'error' , open: true}) ;
        localStorage.removeItem('jwt') ;
        return;
      }
      if (data.token && !data.valid) {
        setState({ vertical: 'top', horizontal: 'center' , msg: 'Server Error, try logging again', typeE: 'error' , open: true}) ;
        return;
      }

      navigate('/home') ;
    }

    handleLogged() ;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  


  return (
    <div id="Home" className="h100">
      {Loading? (
        <div className="h100 w100 flrow jcen acen">
          <PropagateLoader
          color={'#26E7FE'}
          loading={Loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
          />
        </div>
      ): (
        <>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={4000}
        >
          <Alert onClose={handleClose} severity={typeE} sx={{ width: '100%' }}>
            {msg}
          </Alert>
        </Snackbar>
        <Navbar />
  
        {/* <button onClick={handleClick({ vertical: 'top', horizontal: 'center' , msg: 'Data invalidated', typeE: 'error' })}>Click Try</button> */}
        
        <div className="flcol homebg-div jcen acen">
          <img src={bgURL} alt="Home" className="homebg abs"/>
          <h1 className="home-head">Welcome to Blue Rooms</h1>
          <p className="home-txt">Your personal chat and fun rooms</p>
  
          <div className="flrow join-opt acen">
            <Link to={'/auth'} onClick={() => localStorage.removeItem('jwt')} className="homejoin-btn grsha">Signup</Link>
            Or
            <Link to={'/auth'} onClick={() => localStorage.removeItem('jwt')} className="homejoin-btn grsha">Login</Link>
          </div>
        </div>
  
        <div id="about" className="product flcol jcen acen">
          <h1>Out Platform</h1>
          <p className="prod-txt">Our motive is to build an app that brings people together, makes chatting together much more fun and work with each other</p>
          <p className="prod-txt">With engaging rooms, games and many more interesting features</p>
          <p className="prod-about">Join today and be a part of the the most fun platform</p>
        </div>
  
        <Contact />
        </>
      )}

    </div>
  )
}

export default Landing