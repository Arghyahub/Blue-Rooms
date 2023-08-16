import { useState } from "react"
import { useRecoilState , useRecoilValue } from "recoil";

import { userRooms , notificationCount } from "../../Atom";
import './Navbar.css'
import { friendJson , addFriendValid } from "./navbarTypes";
import { socket } from "../sendChat/SendChat";

import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Popover from '@mui/material/Popover';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const backend:string = import.meta.env.VITE_BACKEND ;
const iconURL:string = "/logo.png" ;

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
  openSn?: boolean;
  msg: string;
  typeE: AlertColor | undefined;
}

const Navbar = (): JSX.Element => {
  const [UserData, setUserData] = useRecoilState(userRooms) ;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [FriendData, setFriendData] = useState<friendJson>({name:'' , id:''}) ;
  const NotificationCount = useRecoilValue(notificationCount) ;

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // if (FriendData.name && FriendData.id){
      setAnchorEl(event.currentTarget);
    // }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFriendData({name:'' , id:''}) ;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchUser = async (e: any): Promise<void> => {
    e.preventDefault();
    const findUser = e.target.searchName.value;
    try {
      const resp:Response = await fetch(`${backend}/searchUser`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userName: findUser})
      })

      const json:friendJson = await resp.json() ;
      if (json.name && json.id) {
        setFriendData({name: json.name, id: json.id}) ;
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addFriend = async (e:any):Promise<void> => {
    e.preventDefault() ;
    const friendName = FriendData.name ;
    const token = localStorage.getItem('jwt') ;
    if (!friendName || friendName==='' || !token) return;
    try {
      const resp:Response = await fetch(`${backend}/addFriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({friendName})
      }) 
      const json:addFriendValid = await resp.json() ;
      if (json.success && json.roomId){
        const newData = [{roomid: json.roomId, roomName: friendName, notify: false } ,...UserData.rooms];

        setUserData({name: UserData.name, rooms: newData}) ;
        // handle socket connection to add other users
        socket.emit('join',json.roomId) ;
        console.log('i joined ',json.roomId);
        socket.emit('addFriends',json.allUsers,json.roomId) ;
      }
      if (json.err) {
        // Display error
        setState({ vertical: 'top', horizontal: 'center' , msg: json.err, typeE: 'error' , openSn: true}) ;
        alert(json.err) ;
      }
    }
    catch(err) {
      setState({ vertical: 'top', horizontal: 'center' , msg: "Server Error", typeE: 'error' , openSn: true}) ;
      console.log(err) ;
    }
  }

  const [state, setState] = React.useState<State>({
    openSn: false,
    vertical: 'top',
    horizontal: 'center',
    msg: '',
    typeE: 'success'
    // error warning info success
  });
  const { vertical, horizontal, openSn , msg , typeE } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const snackClick = (newState: State) => () => {
    setState({ ...newState, openSn: true });
  };
  const snackClose = () => {
    setState({ ...state, openSn: false });
  };

  return (
    <div id='Navbar' className="flrow acen">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSn}
        onClose={snackClose}
        key={vertical + horizontal}
        autoHideDuration={4000}
      >
        <Alert onClose={snackClose} severity={typeE} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>

      <p className="flrow acen nav-home"><img src={iconURL} alt="Icon" className="bg-icons" /> BlueRooms</p>

      <div className="options flrow f1 acen">
        {FriendData.name && (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            style={{
              left: "-60px",
              top: "10px"
            }}
          >
              <form onSubmit={addFriend} className="findFriend flrow">
                <p>{FriendData.name}</p>
                <button type="submit" className="addf-btn">
                  <AddCircleIcon className="curpoi" style={{color: "aquamarine"}} />
                </button>
              </form>
          </Popover>
        )}

        <form onSubmit={searchUser} className='flrow acen'>
          <TextField id="standard-basic" label="Search name..." variant="standard" name='searchName'/>
          <button type='submit' className='search-btn curpoi' onClick={handleClick}>
            <SearchIcon />
          </button>
        </form>

        <Badge badgeContent={NotificationCount} color="primary" >
          <NotificationsIcon color="action" style={{color: '#212426'}} />
        </Badge>
        <PersonIcon />
      </div>

    </div>
  )
}

export default Navbar