import {homeProps} from './HomeTypes'

import Navbar from '../navbar/Navbar';
import Groups from '../groups/Groups';
import Chat from '../chat/Chat';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Home:React.FC<homeProps> = ( {name , rooms} ) => {

  return (
    <div id="Home" className='flcol h100 w100'>
      
      <Navbar />

      <div className="group-chat flrow f1 w100">
        <Groups rooms={rooms} />
        <Chat />
      </div>

    </div>
    
  )
}

export default Home