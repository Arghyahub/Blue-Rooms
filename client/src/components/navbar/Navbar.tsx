import SearchIcon from '@mui/icons-material/Search';

import './Navbar.css'
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = ():JSX.Element => {
  return (
    <div id='Navbar' className="flrow acen">
        <p>BlueRooms</p>

        <div className="options flrow f1 acen">
            <TextField id="standard-basic" label="Search name..." variant="standard" />
            <SearchIcon className='curpoi' />

            <Badge badgeContent={4} color="primary">
                <NotificationsIcon color="action" />
            </Badge>
            <PersonIcon/>
        </div>
    </div>
  )
}

export default Navbar