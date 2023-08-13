import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil";
import PropagateLoader from "react-spinners/PropagateLoader";

import Home from "./Home";
import { jsonUser , newRoomType , fetchUserData } from "./HomeTypes";
import { userRooms , notificationCount } from "../../Atom";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [NotificationCount, setNotificationCount] = useRecoilState(notificationCount) ;

  const [Loading, setLoading] = useState(false) ;

  const getData = async ():Promise<void> => {
    setLoading(true) ;
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
        json.rooms.sort((a,b) => b.roomUpdated - a.roomUpdated) ;
        const newRoom:newRoomType[] = [  ];

        let totalNotif:number = 0;
        json.rooms.forEach(elem => {
          const sel:boolean = elem.roomUpdated > elem.last_vis ;
          if (sel){
            totalNotif+=1;
          }
          newRoom.push({ roomid: elem.roomid , roomName: elem.roomName , notify: sel }) ;
        })
        
        setUserData({ name: json.name , rooms: newRoom }) ;
        setNotificationCount(totalNotif) ;
      }
    }
    catch(err) {
      console.log(err) ;
      console.log("Error occurred, check internet") ;
      return;
    }
    setLoading(false) ;
  }

  useEffect(() => {
    getData() ;
  }, [])

  return (
    <>
    {Loading? (
      <div className="w100 h100 flrow jcen acen">
        <PropagateLoader
        color={'#26E7FE'}
        loading={Loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
      </div>
    ): (
      UserExist? (
        <Home name={UserData.name} rooms={UserData.rooms} />
      ): (
        <NotFound />
      )
    )}

    </>
  )
}

export default HomeMid ;