import { useRecoilValue } from "recoil";

import { jsonResp } from "./sendChatTypes";
import "./SendChat.css"
import SendIcon from '@mui/icons-material/Send';
import { currOpenChat } from "../../Atom";

const backend = "http://localhost:8000" ;

const SendChat = () => {
  const currChat = useRecoilValue(currOpenChat) ;
  const token = localStorage.getItem('jwt') as string ;

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