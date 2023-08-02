import { useRecoilValue } from 'recoil';

import {homeProps} from './HomeTypes'
import { currOpenChat } from '../../Atom';

import Navbar from '../navbar/Navbar';
import Groups from '../groups/Groups';
import Chat from '../chat/Chat';
import SendChat from '../sendChat/SendChat';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Home:React.FC<homeProps> = ( {name , rooms} ) => {
  const selectedChat = useRecoilValue(currOpenChat) ;
  return (
    <div id="Home" className='flcol h100 w100'>
      
      <Navbar />

      <div className="group-chat flrow f1 w100">
        <Groups rooms={rooms} name={name} />

        <div className="chat-sec flcol f1">
          <Chat name={name} />
          {selectedChat.selected && (
            <SendChat />
          )}
        </div>
      </div>

    </div>
    
  )
}

export default Home