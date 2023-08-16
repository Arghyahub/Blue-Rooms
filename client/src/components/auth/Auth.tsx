import { useState } from 'react'
import './Auth.css'
import { useNavigate } from 'react-router-dom';

import {JsonMsg, loginParam, signupParam} from './AuthTypes'

//--------IMPORTANT-------
const bgURL = "/authImg/blue.jpg" ;
const iconURL = "/logo.png" ;
const backend = import.meta.env.VITE_BACKEND ;
// -----------------------

const Auth = ():JSX.Element => {
  const [newUser, setnewUser] = useState<boolean>(true);
  const [Pass, setPass] = useState<boolean>(true) ;
  const [PopWarn, setPopWarn] = useState<boolean>(false);
  const [Poptxt, setPoptxt] = useState<string>('') ;
  const navigate = useNavigate() ;

  const popAnim = (msg:string) => {
    setPoptxt(msg) ;
    setPopWarn(true) ;
    setTimeout(()=>{
      setPopWarn(false) ;
    },3000) ;
  }

  const signup = async (e:React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault() ;
    const { name, email, passwd } = e.currentTarget.elements as typeof e.currentTarget['elements'] & signupParam;

    try {
      const resp:Response = await fetch(`${backend}/signup`,{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({ name: name.value, email: email.value, passwd: passwd.value })
      })

      const json:JsonMsg = await resp.json() ;
      popAnim(json.msg) ;
      if (json.token) {
        localStorage.setItem('jwt', json.token ) ;
        navigate('/home');
      }
    }
    catch(err) {
      popAnim("Some error occurred") ;
      console.log("Some error occurred : ",err) ;
    }
  }

  const login = async (e:React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault() ;
    const {email, passwd} = e.target as typeof e.target & loginParam ;  // .value to access it
    try {
      const resp:Response = await fetch(`${backend}/login`,{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({ email: email.value, passwd: passwd.value })
      })

      const json:JsonMsg = await resp.json() ;
      popAnim(json.msg) ;
      if (json.token) {
        localStorage.setItem('jwt', json.token ) ;
        navigate('/home') ;
      }
    }
    catch(err) {
      popAnim("Some error occurred") ;
      console.log("Some error occurred : ",err) ;
    }
  }

  return (
    <div id='Auth' className='h100 flrow'>
      {PopWarn && (
        <p className={`popwarn ${PopWarn? "ana-pop":"dis-pop"}`}>{Poptxt}</p>
      )}

      <div className='h100 w50 img-div flrow'>
        <img className='auth-img' src={bgURL} alt="stockimg" />
        <div className="img-txt">Join blue rooms and start Chatting now!</div>
      </div>

      <div className='h100 w50 auth-div flcol  jcen acen'>
        <img src={iconURL} alt="icon" className="auth-icon" />
        <div className="auth-text">
          <h1>Get started</h1>
          <p className='auth-p'>Welcome to BlueRooms</p>

          {newUser ? (
            <>
            <form onSubmit={signup} className='flcol acen auth-form'>
              <div className="ip flrow jcen acen">
                <input type="text" name='email' placeholder='Email@' className='auth-ip'/>
                <img src="authImg/email.ico" alt="" />
              </div>
              <div className="ip flrow jcen acen">
                <input type={Pass? 'password' : 'text'} name='passwd' placeholder='Password' className='auth-ip'/>
                <button className='curpoi pass-btn' onClick={(e) => { e.preventDefault() ; setPass(!Pass) }}>
                  <img src={`authImg/${Pass? 'eyenot':'eye'}.ico`} alt="" />
                </button>
              </div>
              <div className="ip flrow jcen acen">
                <input type="text" name='name' placeholder='Name' className='auth-ip'/>
                <img src="authImg/name.ico" alt="" />
              </div>
              <button type="submit" className='curpoi auth-sub'>Sign up</button>
            </form>

            <p>Have an account? 
              <button className='curpoi swap-auth-btn' onClick={ () => setnewUser(false) }>Log in..</button>
            </p>
            </>
          ) : (
            <>
            <form onSubmit={login} className='flcol acen auth-form'>
              <div className="ip flrow jcen acen">
                <input type="text" name='email' placeholder='Email@' className='auth-ip'/>
                <img src="authImg/email.ico" alt="" />
              </div>
              <div className="ip flrow jcen acen">
                <input type={Pass? 'password' : 'text'} name='passwd' placeholder='Password' className='auth-ip'/>
                <button className='curpoi pass-btn' onClick={(e) => { e.preventDefault() ; setPass(!Pass) } }>
                  <img src={`authImg/${Pass? 'eyenot':'eye'}.ico`} alt="" />
                </button>
              </div>
              <button type="submit" className='curpoi auth-sub'>Log in</button>
            </form>

            <p>Dont you have an account?
              <button className='curpoi swap-auth-btn' onClick={ () => setnewUser(true) }>Sign up..</button>
            </p>
            </>
          )}

        </div>
      </div>

    </div>
  )
}

export default Auth