import { useRecoilState } from "recoil";

import { jsonResp } from "./sendChatTypes";
import "./SendChat.css"
import SendIcon from '@mui/icons-material/Send';
import { currOpenChat , chatDataStore } from "../../Atom";

const backend = "http://localhost:8000" ;

const SendChat = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currChat, setCurrChat] = useRecoilState(currOpenChat) ;
  const token = localStorage.getItem('jwt') as string ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ChatData, setChatData] = useRecoilState(chatDataStore) ;  

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

      const chatRoomInd = ChatData.findIndex(chatRoom => chatRoom._id===currChat._id) ;
      if (chatRoomInd!=-1){
        const updatedChat ={ ...ChatData[chatRoomInd] , user_msg: [...(ChatData[chatRoomInd].user_msg) , { _id: 'some' ,user: 'shyam' , msg: chatInput.value }] } ;
        const newChatData = [
          updatedChat,
          ...ChatData.slice(0,chatRoomInd),
          ...ChatData.slice(chatRoomInd+1)
        ]
        setChatData([...newChatData]);
        setCurrChat({selected: true,...updatedChat}) ;
      }
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