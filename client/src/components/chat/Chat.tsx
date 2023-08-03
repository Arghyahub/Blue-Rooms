import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
// import { io } from 'socket.io-client'

import './Chat.css'
import { currOpenChat } from '../../Atom'
import { chatProp } from './chatTypes'


// const backend = 'http://localhost:8000' ;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let socket;

const Chat:React.FC<chatProp> = ({name}):JSX.Element => {
  const selectedChat = useRecoilValue(currOpenChat) ;

  useEffect(() => {
    // socket = io(backend) ;
  }, [])
  

  const nameResolve = (nameArr:string[]):string => {
    if (nameArr.length==1) return nameArr[0] ;
    return ((nameArr[0]===name)? nameArr[1] : nameArr[0]) ;
  }

  return (
    <div id="Chat" className='f1'>
      {selectedChat.selected? (
        <div className="selected-chat flcol">
          <p className='head-name'>{`${nameResolve(selectedChat.name)}`}</p>
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