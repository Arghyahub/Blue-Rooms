import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil";

import Home from "./Home";
import { jsonUser , newRoomType , fetchUserData } from "./HomeTypes";
import { userRooms } from "../../Atom";
const backend:string = "http://localhost:8000" ;


const NotFound = () => {
  return (
    <div className="flcol h100 w100 jcen acen">
      <h1 style={{marginBottom: '2rem'}}>Account not logged in</h1>
      <p>If you have an account try <Link to={'/'} >Login..</Link></p>
      <p>Or create an account <Link to={'/'} >Signup..</Link> </p>
    </div>
  )
}

const HomeMid = ():JSX.Element => {
  const [UserExist, setUserExist] = useState<boolean>(false) ;
  const [UserData, setUserData] = useRecoilState<jsonUser>(userRooms) ;

  const getData = async ():Promise<void> => {
    const token:string|null = localStorage.getItem('jwt') ;
    if (!token) {
      setUserExist(false) ;
      return;
    }
    try{
      const resp:Response = await fetch(`${backend}/userData`,{
        method : 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      })

      const json:fetchUserData = await resp.json() ;

      if (json===null || json===undefined || json.token===false){  
        // some error occurred
        return; 
      }
      if (json.token===true && json.valid===false) {
        localStorage.removeItem('jwt') ;
        return;
      }
      if (json.token && json.valid) {
        alert("Some error occurred, check Internet") ;
        return;
      }
      if (json.name && json.rooms){
        setUserExist(true);
        // json.rooms.sort((a,b) => b.roomUpdated - a.roomUpdated) ;
        const newRoom:newRoomType[] = [  ];

        json.rooms.forEach(elem => {
          const sel:boolean = elem.roomUpdated > elem.last_vis ;
          console.log(elem.roomUpdated , elem.last_vis) ;
          newRoom.push({ roomid: elem.roomid , roomName: elem.roomName , notify: sel }) ;
        })
        
        setUserData({ name: json.name , rooms: newRoom }) ;
      }
    }
    catch(err) {
      console.log(err) ;
      console.log("Error occurred, check internet") ;
      return;
    }
  }

  useEffect(() => {
    getData() ;
  }, [])

  return (
    <>
    {UserExist? (
      <Home name={UserData.name} rooms={UserData.rooms} />
    ): (
      <NotFound />
    )}
    </>
  )
}

export default HomeMid ;