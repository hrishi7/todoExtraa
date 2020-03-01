//import required react and other hook methods
import React,{useState,useEffect} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }),
);

// functional component login which is used for login
const Register = (props) => {

    const classes = useStyles();

  //getting redux state
    let state = localStorage.getItem('token');

    //use to initailize the required state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //use to change to form data along with typing
    const handleChange = (event) =>{
        event.target.name === 'email'?setEmail(event.target.value) :setPassword(event.target.value)
    }

    // lifecycle method equivalent to componentDidMount of calss component
    useEffect(()=>{
      //checking if the token is present in localStorage or not
        if(state != undefined){
          props.history.push('/');
        }

    },[state])


    //use to submit the form data and call backend server with the data
    const handleRegister = async(event) =>{
      event.preventDefault();
      if(email == '' | password == ''){
        alert('Please fill out details');
      }else{
      let user = {email, password};
        let result = await axios.post('http://localhost:5000/api/auth/register', user);
        console.log(result);
        if(!result.data.success){
          alert(result.data.message);
        } else{
          localStorage.setItem('token',result.data.token);
          window.location.href = '/';
        }

      }
    }
  return (
    <div className="form">
      <center><h2>Register</h2></center>
      <center>
       <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={12}>
           <TextField
              type="email"
              name="email"
              id="standard-basic"
              label="Email"
              value={email}
              onChange={handleChange}
              />
        </Grid>
        <Grid item xs={12}>
           <TextField
            name="password"
            id="standard-basic"
            label="Password"
            value={password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
           <Button color="inherit" onClick={(e)=>handleRegister(e)}>Register</Button>
        </Grid>
      </Grid>
      </form>
      </center>
    </div>
  )
}

export default Register;
