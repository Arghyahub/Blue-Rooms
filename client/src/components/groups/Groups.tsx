import { useEffect, useState } from 'react'
import { useRecoilValue , useRecoilState } from 'recoil';

import { userAdded , currOpenChat } from '../../Atom';
import './Groups.css'
import { roomProp , chatDatas , chatDataJson , userMsg } from './groupstypes'

const backend:string = 'http://localhost:8000' ;

const Groups:React.FC<roomProp> = ({rooms , name}):JSX.Element => {
  const [ChatData, setChatData] = useState<chatDatas[] | []>([]) ;  
  const newGroup = useRecoilValue<string>(userAdded) ;
  const [OpenChat, setOpenChat] = useRecoilState(currOpenChat) ;

  const token = localStorage.getItem('jwt') as string ;
  
  useEffect(() => {
    const getChatData = async ():Promise<void> => {
      try {
        const allChats:chatDataJson[] = [] ;
  
        for (let i=0; i<rooms.length; i++) {
          const {roomid} = rooms[i] ;
  
          const res:Response = await fetch(`${backend}/getChatData`,{
            method:'POST',
            headers: {
              Authorization : token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomid}) 
          })
  
          const jsonData:chatDataJson = await res.json() ;
          if (jsonData.user_msg)
            allChats.unshift(jsonData) ; 
        }
        setChatData([...allChats]) ;
      }
      catch(err) {
        console.log('error in getting chats', err);
      }
    }
    getChatData() ;
  }, [rooms])

  useEffect(() => {
    const insertNewGroup =async () => {
      const groupId = newGroup ;
      if (!groupId || groupId==='') return;
      const res:Response = await fetch(`${backend}/getChatData`,{
        method:'POST',
        headers: {
          Authorization : token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({roomid: groupId}) 
      })
      const jsonData:chatDataJson = await res.json() ;
      console.log(jsonData) ;
      setChatData([jsonData,...ChatData]) ;
    }
    insertNewGroup();
  }, [newGroup])

  const nameResolve = (nameArr:string[]):string => {
    if (nameArr.length==1) return nameArr[0] ;
    return ((nameArr[0]===name)? nameArr[1] : nameArr[0]) ;
  }

  const getLastMsg = (userMsg:userMsg[]) => {
    const size = userMsg.length ;
    if (size===0) return "Start Chat...";
    return `${userMsg[size-1].user} : ${userMsg[size-1].msg.substring(0,10)}...`
  }


  return (
    <div id='Groups' className='flcol'>
      {ChatData.map((elem,ind) => (
        // <div key={`chats${ind}`} className='chat-card curpoi' onClick={() => setOpenChat()} >
        <div key={`chats${ind}`} className='chat-card curpoi'>
          <p>{`${nameResolve(elem.name)}`}</p>
          <p>{`${getLastMsg(elem.user_msg)}`}</p>
        </div>
      ))}
    </div>
  )
}

export default Groups