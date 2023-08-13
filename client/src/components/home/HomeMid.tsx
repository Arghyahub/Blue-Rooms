import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil";
import PropagateLoader from "react-spinners/PropagateLoader";

import Home from "./Home";
import { jsonUser , newRoomType , fetchUserData } from "./HomeTypes";
import { userRooms , notificationCount } from "../../Atom";
const backend:string = "http://localhost:8000" ;

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


const NotFound = () => {
  const navigate = useNavigate() ;
  return (
    <div className="flcol h100 w100 jcen acen">
      <h1 style={{marginBottom: '2rem'}}>Account not logged in</h1>
      <p>If you have an account try <button onClick={()=> {
        localStorage.removeItem('jwt') ;
        navigate('/auth')
        }}>Login.. </button>
      </p>
      <p>Or create an account <button onClick={()=> {
        localStorage.removeItem('jwt') ;
        navigate('/auth')
        }}>Signup..</button> 
      </p>
    </div>
  )
}

const HomeMid = ():JSX.Element => {
  const [UserExist, setUserExist] = useState<boolean>(false) ;
  const [UserData, setUserData] = useRecoilState<jsonUser>(userRooms) ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [NotificationCount, setNotificationCount] = useRecoilState(notificationCount) ;
  const [Loading, setLoading] = useState(false) ;

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


  const getData = async ():Promise<void> => {
    setLoading(true) ;
    const token:string|null = localStorage.getItem('jwt') ;
    if (!token) {
      setUserExist(false) ;
      setLoading(false) ;
      return;
    }
    try{
      const resp:Response = await fetch(`${backend}/userData`,{
        method : 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      })

      const json:fetchUserData = await resp.json() ;

      if (json===null || json===undefined || json.token===false){
        setLoading(false) ;
        setState({ vertical: 'top', horizontal: 'center' , msg: 'Sever Error, try logging again', typeE: 'error' }) ;
        return; 
      }
      if (json.token===true && json.valid===false) {
        localStorage.removeItem('jwt') ;
        setLoading(false) ;
        setState({ vertical: 'top', horizontal: 'center' , msg: 'Data invalidated', typeE: 'error'}) ;
        return;
      }
      if (json.token && !json.valid) {
        setLoading(false) ;
        setState({ vertical: 'top', horizontal: 'center' , msg: 'User not find, Try logging in', typeE: 'error'}) ;
        return;
      }
      if (json.name && json.rooms){
        setState({ vertical: 'top', horizontal: 'center' , msg: 'User not find, Try logging in', typeE: 'success'}) ;
        setUserExist(true);
        json.rooms.sort((a,b) => b.roomUpdated - a.roomUpdated) ;
        const newRoom:newRoomType[] = [  ];

        let totalNotif:number = 0;
        json.rooms.forEach(elem => {
          const sel:boolean = elem.roomUpdated > elem.last_vis ;
          if (sel){
            totalNotif+=1;
          }
          newRoom.push({ roomid: elem.roomid , roomName: elem.roomName , notify: sel }) ;
        })
        
        setUserData({ name: json.name , rooms: newRoom }) ;
        setNotificationCount(totalNotif) ;
      }
    }
    catch(err) {
      console.log(err) ;
      setState({ vertical: 'top', horizontal: 'center' , msg: 'Check Internet and try again', typeE: 'error'}) ;
      setLoading(false) ;
      return;
    }
    setLoading(false) ;
  }

  useEffect(() => {
    getData() ;
  }, [])

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={6000}
      >
        <Alert onClose={handleClose} severity={typeE} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    {Loading? (
      <div className="w100 h100 flrow jcen acen">
        <PropagateLoader
        color={'#26E7FE'}
        loading={Loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
      </div>
    ): (
      UserExist? (
        <>
        <Home name={UserData.name} rooms={UserData.rooms} />
        </>
      ): (
        <NotFound />
      )
    )}

    </>
  )
}

export default HomeMid ;