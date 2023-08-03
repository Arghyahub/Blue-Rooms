import { useEffect } from 'react'
import { useRecoilState , useRecoilValue } from "recoil";
import { io } from 'socket.io-client'

import { jsonResp , sendChatProp } from "./sendChatTypes";
import "./SendChat.css"
import SendIcon from '@mui/icons-material/Send';
import { currOpenChat , userRooms } from "../../Atom";

const backend = "http://localhost:8000" ;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket:any;

const SendChat:React.FC<sendChatProp> = ({name}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currChat, setCurrChat] = useRecoilState(currOpenChat) ;
  const token = localStorage.getItem('jwt') as string ;
  const UserJoinedRooms = useRecoilValue(userRooms) ;

  useEffect(() => {
    socket = io(backend) ;
    socket.on('connect',() => {
      console.log(`you are connected`) ;
    })
    UserJoinedRooms.rooms.forEach((elem)=> {
      socket.emit('join',elem.roomid) ;
    })

    socket.on('recieved-msg',(chatId:string, sender:string, msg:string) => {
      console.log(chatId, sender, msg) ;
      if (sender===name) return;
      if (currChat._id===chatId) {
        setCurrChat(prevData => ({
          ...prevData,
          user_msg: [...prevData.user_msg, {_id:'', user: sender, msg: msg} ]
        }))
      }
      else{
        // Send Notification
      }
    })

    return () => {
      socket.off('recieved-msg'); // Remove the event listener when the component unmounts
    };
  },[])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChatSend = async (e:any) => {
    e.preventDefault() ;
    const { chatInput } = e.target ;
    try {
      const res:Response = await fetch(`${backend}/appendChat`, {
        method:"POST",
        headers:{
          'Content-type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({groupId: currChat._id, chatMsg: chatInput.value}) 
      })

      const json:jsonResp = await res.json() ;
      if (json.err){
        // allert the user
      }

      const newCurrChatMsg = [...currChat.user_msg] ;
      newCurrChatMsg.push({_id: '', user: name, msg: chatInput.value}) ;
      setCurrChat(prevState => ({
        ...prevState,
        user_msg: newCurrChatMsg
      }))

      socket.emit('new-chat',({chatId: currChat._id, sender: name, msg: chatInput.value})) ;
    }
    catch(err) {
      console.log("error : ",err) ;
    }
  }

  return (
    <form onSubmit={handleChatSend} id="SendChat" className="flrow">
      <input type="text" name="chatInput" className="chat-ip"/>
      <button type="submit" className="send-msg-btn flrow jcen acen">
        <SendIcon style={{color: "blue"}}/>
      </button>
    </form>
  )
}

export default SendChat