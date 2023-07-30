import { useEffect, useState } from 'react'

import './Groups.css'
import { roomProp , chatDatas , chatDataJson , userMsg } from './groupstypes'

const backend:string = 'http://localhost:8000' ;

const Groups:React.FC<roomProp> = ({rooms , name}):JSX.Element => {
  const [ChatData, setChatData] = useState<chatDatas[] | []>([]) ;
  
  useEffect(() => {
    const getChatData = async ():Promise<void> => {
      try {
        const allChats:chatDataJson[] = [] ;

        for (let i=0; i<rooms.length; i++) {
          const {roomid} = rooms[i] ;

          const token:string|null = localStorage.getItem('jwt') ;
          if (!token) {
            return;
          }
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
            allChats.push(jsonData) ; 
        }
        setChatData([...allChats]) ;
      }
      catch(err) {
        console.log('error in getting chats', err);
      }
    }
    getChatData() ;
  }, [])

  const nameResolve = (nameArr:string[]):string => {
    console.log(name,nameArr) ;
    if (nameArr.length==1) return nameArr[0] ;
    return ((nameArr[0]===name)? nameArr[1] : nameArr[0]) ;
  }

  const getLastMsg = (userMsg:userMsg[]) => {
    const size = userMsg.length ;
    return `${userMsg[size-1].user} : ${userMsg[size-1].msg.substring(0,10)}...`
  }


  return (
    <div id='Groups' className='flcol'>
      {ChatData.map((elem,ind) => (
        <div key={`chats${ind}`} className='chat-card' >
          <p>{`${nameResolve(elem.name)}`}</p>
          <p>{`${getLastMsg(elem.user_msg)}`}</p>
        </div>
      ))}
    </div>
  )
}

export default Groups