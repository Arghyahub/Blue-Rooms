import {homeProps} from './HomeTypes'

const Home:React.FC<homeProps> = ( {name , rooms} ) => {
  console.log(rooms) ;
  return (
    <div>{name}</div> 
  )
}

export default Home