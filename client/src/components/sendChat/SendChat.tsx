import { useEffect } from 'react'
import { useRecoilState } from "recoil";
import { io } from 'socket.io-client'

import { jsonResp , sendChatProp } from "./sendChatTypes";
import "./SendChat.css"
import SendIcon from '@mui/icons-material/Send';
import { currOpenChat , userRooms } from "../../Atom";

const backend = "http://localhost:8000" ;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket:any;

const SendChat:React.FC<sendChatProp> = ({name}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currChat, setCurrChat] = useRecoilState(currOpenChat) ;
  const token = localStorage.getItem('jwt') as string ;
  const [UserJoinedRooms,setUserJoinedRooms] = useRecoilState(userRooms) ;

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

  useEffect(() => {
    socket = io(backend) ;
    socket.on('connect',() => {
      // console.log(`you are connected`) ;
    })
    UserJoinedRooms.rooms.forEach((elem)=> {
      socket.emit('join',elem.roomid) ;
    })

    // recieve msg

    return () => {
      socket.off('recieved-msg'); // Remove the event listener when the component unmounts
    };
  },[])

  useEffect(() => {
    socket.on('recieved-msg',(chatId:string, sender:string, msg:string) => {
      if (sender===name) return;
      // console.log(currChat._id, chatId) ;
      console.log(currChat) ;
      if (currChat._id===chatId) {
        // console.log("here") ;
        setCurrChat(prevData => ({
          ...prevData,
          user_msg: [...prevData.user_msg, {_id:'', user: sender, msg: msg} ]
        }))
      }
      else{
        const findRoom = UserJoinedRooms.rooms.findIndex((arr) => {
          return (arr.roomid === chatId)
        })
        if (findRoom!=-1) {
          const upRoom = UserJoinedRooms.rooms[findRoom] ;
          const shuffledRooom = [ {roomid: upRoom.roomid , roomName: upRoom.roomName , notify: true} , ...(UserJoinedRooms.rooms.slice(0,findRoom)) , ...(UserJoinedRooms.rooms.slice(findRoom+1)) ]
          setUserJoinedRooms({ name: UserJoinedRooms.name , rooms: [...shuffledRooom] }) ;
        }
      }
    })

    return () => {
      socket.off('recieved-msg'); // Remove the event listener when the component unmounts
    };
  }, [currChat])

  useEffect(() => {
    socket.on('joinRoom',(allUsers:string[],roomId:string) => {
      if (allUsers[0]===name) return;
      console.log("i joined ",roomId) ;
      const findIdx = allUsers.findIndex((usrs) => usrs===name) ;
      console.log(allUsers , roomId) ;
      if (findIdx!=-1) {
        socket.emit('join',roomId) ;
        console.log("prev room :") ;
        UserJoinedRooms.rooms.forEach(elem => console.log(elem)) ;

        const newRoom = [{roomid: roomId, roomName: allUsers[1-findIdx], notify: true} , ...(UserJoinedRooms.rooms)] ;
        console.log("new room :") ;
        newRoom.forEach(elem => console.log(elem)) ;
        setUserJoinedRooms({name: UserJoinedRooms.name , rooms: newRoom}) ;
      }
    })

    return () => {
      socket.off('joinRoom') ;
    }
  }, [UserJoinedRooms])
  
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChatSend = async (e:any) => {
    e.preventDefault() ;
    const { chatInput } = e.target ;
    const newChatMsg = chatInput.value ;
    chatInput.value = '' ;
    try {
      const res:Response = await fetch(`${backend}/appendChat`, {
        method:"POST",
        headers:{
          'Content-type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({groupId: currChat._id, chatMsg: newChatMsg}) 
      })

      const json:jsonResp = await res.json() ;
      if (json.err){
        // allert the user
        setState({ vertical: 'top', horizontal: 'center' , msg: json.err, typeE: 'error' , open: true}) ;
        return;
      }

      const newCurrChatMsg = [...currChat.user_msg] ;
      newCurrChatMsg.push({_id: '', user: name, msg: newChatMsg}) ;
      setCurrChat(prevState => ({
        ...prevState,
        user_msg: newCurrChatMsg
      }))

      socket.emit('new-chat',({chatId: currChat._id, sender: name, msg: newChatMsg})) ;
    }
    catch(err) {
      setState({ vertical: 'top', horizontal: 'center' , msg: 'Internal Error, Check internet', typeE: 'error' , open: true}) ;
      console.log("error : ",err) ;
    }
  }

  window.addEventListener('beforeunload', () => {
    if (currChat.selected) {
      const prevRoomId = currChat._id ;
      fetch(`${backend}/updateLastVis`,{
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name , roomId: prevRoomId})
      })
    }
  });

  return (
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
    {currChat.selected? (
      <form onSubmit={handleChatSend} id="SendChat" className="flrow">
        <input type="text" name="chatInput" className="chat-ip"/>
        <button type="submit" className="send-msg-btn flrow jcen acen">
          <SendIcon style={{color: "blue"}}/>
        </button>
      </form>

    ): (
      <></>
    )}
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export {socket} ;

export default SendChat ;