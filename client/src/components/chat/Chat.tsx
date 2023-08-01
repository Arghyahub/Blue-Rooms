import { useRecoilValue } from 'recoil'

import './Chat.css'
import { currOpenChat } from '../../Atom'
import { chatProp } from './chatTypes'

const Chat:React.FC<chatProp> = ({name}):JSX.Element => {
  const selectedChat = useRecoilValue(currOpenChat) ;

  const nameResolve = (nameArr:string[]):string => {
    if (nameArr.length==1) return nameArr[0] ;
    return ((nameArr[0]===name)? nameArr[1] : nameArr[0]) ;
  }

  return (
    <div id="Chat" className='f1'>
      {selectedChat.selected? (
        <div className="selected-chat flcol">
          <p>{`${nameResolve(selectedChat.name)}`}</p>
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