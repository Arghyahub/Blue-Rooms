import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import './Chat.css'
import { currOpenChat } from '../../Atom'
import { chatProp } from './chatTypes'


const Chat:React.FC<chatProp> = ({name}):JSX.Element => {
  const selectedChat = useRecoilValue(currOpenChat) ;
  const chatBody = useRef(null) ;
  
  useEffect(() => {
    if (chatBody.current) {
      const divElem:HTMLDivElement = chatBody.current ;
      divElem.scrollTop = divElem.scrollHeight - divElem.clientHeight ;
    }
  }, [selectedChat])
  

  return (
    <div id="Chat" ref={chatBody} >
      {selectedChat.selected? (
        <div className="selected-chat flcol">
          <p className='head-name'>{selectedChat.name}</p>
          {selectedChat.user_msg.map((elem,ind) => (
            <div key={`chatO${ind}`} className={`flcol ${(elem.user===name)? 'myChat':''}`} >
              <p>{`${elem.user}`}</p>
              <p>{`${elem.msg}`}</p>
            </div>
          ))}
        </div>
      ): (
        <p>Start a chat by clicking on the chat</p>
      )}
    </div>
  )
}

export default Chat