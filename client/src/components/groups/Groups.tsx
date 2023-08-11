import {  useRecoilState } from 'recoil';

import { currOpenChat , userRooms , notificationCount } from '../../Atom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import './Groups.css'
import { roomProp, chatDatas } from './groupstypes'

const backend: string = 'http://localhost:8000';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Groups: React.FC<roomProp> = ({ rooms, name }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [OpenChat, setOpenChat] = useRecoilState(currOpenChat);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UserRooms, setUserRooms] = useRecoilState(userRooms) ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [NotificationCount,setNotificationCount] = useRecoilState(notificationCount) ;

  const token = localStorage.getItem('jwt') as string;

  const handleCurrOpenChat = async (roomid:string , roomName:string , notify:boolean): Promise<void> => {
    try {
      if (OpenChat.selected) { // send a last visit die request
        const prevRoomId = OpenChat._id ;
        console.log(`sending req for ${prevRoomId}`);
        fetch(`${backend}/updateLastVis`,{
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: name , roomId: prevRoomId})
        })
      }

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

      if (notify) {
        const updatedRooms = UserRooms.rooms.map(room => {
          if (room.roomid === roomid) {
            return { ...room, notify: false };  // update notify property
          }
          return room;  // keep other rooms unchanged
        });
        setUserRooms({name: UserRooms.name , rooms: updatedRooms}) ;
        // Decrement the notification 
        if (NotificationCount>0)
          setNotificationCount(NotificationCount-1) ;
      }
    }
    catch (err) {
    console.log('error in getting chats', err);
  }
}

return (
  <div id='Groups' className='flcol'>
    {rooms.map((elem, ind) => (
      <div key={`chats${ind}`} className='chat-card curpoi' onClick={() => handleCurrOpenChat(elem.roomid , elem.roomName , elem.notify)}>
        <p>{elem.roomName}</p>
        {elem.notify && (
          <NotificationsActiveIcon/>
        )}
      </div>
    ))}
  </div>
)
}

export default Groups