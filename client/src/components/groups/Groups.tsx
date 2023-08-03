import {  useRecoilState } from 'recoil';

import { currOpenChat } from '../../Atom';
import './Groups.css'
import { roomProp, chatDatas } from './groupstypes'

const backend: string = 'http://localhost:8000';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Groups: React.FC<roomProp> = ({ rooms, name }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [OpenChat, setOpenChat] = useRecoilState(currOpenChat);

  const token = localStorage.getItem('jwt') as string;

  const handleCurrOpenChat = async (roomid:string , roomName:string): Promise<void> => {
    try {
      const res: Response = await fetch(`${backend}/getChatData`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomid })
      })

      const jsonData: chatDatas = await res.json();
      setOpenChat({ selected: true, _id: jsonData._id, group: jsonData.group, user_msg: jsonData.user_msg, name: roomName, members: jsonData.members ,latest_msg: jsonData.latest_msg  }) ;
    }
    catch (err) {
    console.log('error in getting chats', err);
  }
}

return (
  <div id='Groups' className='flcol'>
    {rooms.map((elem, ind) => (
      <div key={`chats${ind}`} className='chat-card curpoi' onClick={() => handleCurrOpenChat(elem.roomid , elem.roomName)}>
        <p>{elem.roomName}</p>
      </div>
    ))}
  </div>
)
}

export default Groups