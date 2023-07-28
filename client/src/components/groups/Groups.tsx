import './Groups.css'

import { roomProp } from './groupstypes'

const Groups:React.FC<roomProp> = ({rooms}):JSX.Element => {
  return (
    <div id='Groups' className='flcol'>Groups</div>
  )
}

export default Groups