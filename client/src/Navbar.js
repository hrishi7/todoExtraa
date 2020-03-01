//import react from react
import React,{useEffect,useState} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);



const Navbar = (props) => {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    let isAuthenticated = localStorage.getItem('token');
    setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated])

  /*
  * clear localStorage Token and redirect to login
  * as user choose to logout
  */

  const handleLogout = async () =>{
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
            ToDo
          </Typography>
 <div>
        {!isAuthenticated ?(
          <div>
        <Button color="inherit" href="/login">Login</Button>
        <Button color="inherit" href="/register">Register</Button>
        </div>
        ):(<Button color="inherit" onClick={handleLogout}>Logout</Button>)
        }
    </div>
      </Toolbar>
    </AppBar>
  </div>

  )
}

export default Navbar
