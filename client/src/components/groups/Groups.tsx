// import { useEffect, useState } from 'react'

import './Groups.css'
import { roomProp } from './groupstypes'

const Groups:React.FC<roomProp> = ({rooms}):JSX.Element => {
  
  console.log(rooms)
  return (
    <div id='Groups' className='flcol'>
      { rooms.map((elem,ind)=> (
        <div key={`chat${ind}`} className='chat-card'>
          <p>{elem.roomid}</p>
        </div>
      )) }
    </div>
  )
}

export default Groups