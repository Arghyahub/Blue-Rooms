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
    <div id="Chat">
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
        <h1>Hemlo</h1>
      )}
    </div>
  )
}

export default Chat


/**
interface userMsg {
    _id: string,
    user: string,
    msg: string
}

interface chatType {
    selected: boolean,
    _id: string,
    group: boolean,
    user_msg: [] | userMsg[] ,
    name: [] | string[],
    latest_msg: number,
}
 */