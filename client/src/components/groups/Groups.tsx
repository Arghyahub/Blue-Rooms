import { useEffect, useState } from 'react'

import './Groups.css'
import { roomProp , chatDatas } from './groupstypes'

const backend:string = 'http://localhost:8000' ;

const Groups:React.FC<roomProp> = ({rooms}):JSX.Element => {
  const [ChatData, setChatData] = useState<chatDatas[] | []>([]) ;

  const getChatData = ():void => {
    try {
      rooms.forEach(async ({roomid}) => {
        const token:string|null = localStorage.getItem('jwt') ;
        if (!token) {
          return;
        }
        const res = await fetch(`${backend}/getChatData`,{
          method:'POST',
          headers: {
            Authorization : token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({roomid}) 
        })

        const jsonData = await res.json() ;
        if (jsonData.user_msg)
          setChatData([...ChatData,jsonData]) ;
      })
    }
    catch(err) {
      console.log('error in getting chats', err);
    }
  }

  useEffect(() => {
    getChatData() ;
  }, [])
  
  console.log(ChatData) ;

  return (
    <div id='Groups' className='flcol'>
      {ChatData.map((elem) => (
        <div>Hemlo</div>
      ))}
    </div>
  )
}

export default Groups