import {  useRecoilState } from 'recoil';

import { currOpenChat , userRooms , notificationCount , smallScreenChatOpen , loadingChat } from '../../Atom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import './Groups.css'
import { roomProp, chatDatas } from './groupstypes'

const backend: string = import.meta.env.VITE_BACKEND;

import * as React from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type AlertColor = 'success' | 'info' | 'warning' | 'error';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
interface State extends SnackbarOrigin {
  open?: boolean;
  msg: string;
  typeE: AlertColor | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Groups: React.FC<roomProp> = ({ rooms, name }): JSX.Element => {
  const [OpenChat, setOpenChat] = useRecoilState(currOpenChat);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UserRooms, setUserRooms] = useRecoilState(userRooms) ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [NotificationCount,setNotificationCount] = useRecoilState(notificationCount) ;
  const [SmallScreenChat,setSmallScreenChat] = useRecoilState(smallScreenChatOpen) ;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [LoadChat, setLoadChat] = useRecoilState(loadingChat) ;

  const token = localStorage.getItem('jwt') as string;

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    msg: '',
    typeE: 'success'
    // error warning info success
  });
  const { vertical, horizontal, open , msg , typeE } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClick = (newState: State) => () => {
    setState({ ...newState, open: true });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleCurrOpenChat = async (roomid:string , roomName:string , notify:boolean): Promise<void> => {
    setSmallScreenChat(true) ;
    setLoadChat(true) ;
    try {
      if (OpenChat.selected) { // send a last visit die request
        const prevRoomId = OpenChat._id ;
        // console.log(`sending req for ${prevRoomId}`);
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
      setOpenChat({selected: true, _id: jsonData._id, group: jsonData.group, user_msg: jsonData.user_msg, name: roomName, members: jsonData.members, latest_msg: jsonData.latest_msg}) ;

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
      setState({ vertical: 'top', horizontal: 'center' , msg: 'Sever Error, Check connection', typeE: 'error' , open: true}) ;
    console.log('error in getting chats', err);
    }
    setLoadChat(false) ;
  }

return (
  <div id='Groups' className={`flcol groups ${SmallScreenChat? 'hide-groups':'show-full'}`}>
    <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={4000}
      >
        <Alert onClose={handleClose} severity={typeE} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    {rooms.map((elem, ind) => (
      <div key={`chats${ind}`} className='chat-card curpoi' onClick={() => handleCurrOpenChat(elem.roomid , elem.roomName , elem.notify)}>
        <p className='group-name'>{elem.roomName}</p>
        {elem.notify && (
          <NotificationsActiveIcon/>
        )}
      </div>
    ))}
  </div>
)
}

export default Groups