import { useState } from "react"

import './Navbar.css'
import { friendJson } from "./navbarTypes";

import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Popover from '@mui/material/Popover';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const backend:string = "http://localhost:8000" ;

const Navbar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [FriendData, setFriendData] = useState<friendJson>({name:'' , id:''}) ;

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFriendData({name:'' , id:''}) ;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchUser = async (e: any): Promise<void> => {
    e.preventDefault();
    const findUser = e.target.searchName.value;
    try {
      const resp:Response = await fetch(`${backend}/searchUser`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userName: findUser})
      })

      const json:friendJson = await resp.json() ;
      if (json.name && json.id) {
        setFriendData({name: json.name, id: json.id}) ;
      }
      console.log(json) ;
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div id='Navbar' className="flrow acen">
      <p>BlueRooms</p>

      <div className="options flrow f1 acen">
        {FriendData.name && (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            style={{
              left: "-1.3rem",
              top: "0.6rem"
            }}
          >
              <div className="flrow">
                <p>{FriendData.name}</p>
                <AddCircleIcon className="curpoi" style={{color: "aquamarine"}} />
              </div>
          </Popover>
        )}

        <form onSubmit={searchUser} className='flrow acen'>
          <TextField id="standard-basic" label="Search name..." variant="standard" name='searchName' />
          <button type='submit' className='search-btn curpoi' onClick={handleClick}>
            <SearchIcon />
          </button>
        </form>

        <Badge badgeContent={4} color="primary">
          <NotificationsIcon color="action" />
        </Badge>
        <PersonIcon />
      </div>

    </div>
  )
}

export default Navbar