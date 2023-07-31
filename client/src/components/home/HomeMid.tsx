import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Home from "./Home";
import { jsonUser } from "./HomeTypes";
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
  const [UserData, setUserData] = useState<jsonUser>({name: '' , rooms: [] }) ;

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

      const json:jsonUser = await resp.json() ;

      if (json===null || json===undefined || json.token===false){ return; }
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
        setUserData({ name: json.name , rooms: json.rooms }) ;
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