  import React from 'react';
  import './App.css';
  import PropTypes from "prop-types";
  import clsx from 'clsx';
  import {Fab ,
    Chip,
    Paper,
    withStyles,
    Grid,
    Button,
    Card ,
    CardActions,
    CardContent,
    Typography,TextField,
  } from '@material-ui/core';
  import Dialog from '@material-ui/core/Dialog';
  import DialogActions from '@material-ui/core/DialogActions';
  import DialogContent from '@material-ui/core/DialogContent';
  import DialogTitle from '@material-ui/core/DialogTitle';
  import CircularProgress from '@material-ui/core/CircularProgress';
  import InputLabel from '@material-ui/core/InputLabel';
  import Select from '@material-ui/core/Select';
  import MenuItem from '@material-ui/core/MenuItem';

  import Icon from '@material-ui/core/Icon';
  import axios from 'axios'
  import {AccountCircle,Add  } from '@material-ui/icons'
  import SaveIcon from '@material-ui/icons/Save';
  import MySnackbar from './MySnackbar'

  const styles = () => ({
    root: {
      flexGrow: 1,
      margin:'20px 20px 10px 10px'
    },
    title:{
      // fontSize:''
    },
    paper: {
      padding: 2,
      textAlign: 'center',
      color: 'black',
    },
    taskCard:{
      margin:'5px 2px 2px 2px',
      textAlign: 'center',
      color: 'black',
    },
    inputTask:{
      marginLeft:2,
      marginRight:2
    },
    inputTaskDescription:{
      marginLeft:2,
      marginRight:2,
      minWidth:'150px',
      minHeight:'60px'
    },
    singleList:{
      minHeight:"270px",
      backgroundColor:'#ffffff'
    },
    AddTask:{
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
      textAlign:'center',
      margin:'2px auto'
    },
    buttons:{
      margin:'2px auto'
    }
  });

  class Dashboard extends React.Component {
    constructor(props){
      super(props);
      this.state ={
        isLoading:false,
        taskTitle:'',
        taskDesc:'',
        taskStatus:'todo',
        id:'',
        allTask:[],
        open:false,
        setOpen:false
      }
    }

    //getting all task from server while component is mount
    componentDidMount = async () =>{
      this.getAllTask();
    }

    //getting all task from server while component is updated
    componentDidUpdate = () =>{
      this.getAllTask();
    }
    //function for getting data from server
    getAllTask = () => {
      axios.get('/api/')
      .then(res=> {
        this.setState({ allTask: res.data});
      })
    }

    //function for addinga and updation of task into db
    handleNewtask =async () =>{
      if(!this.state.id){
        let newTask ={
          taskTitle: this.state.taskTitle,
          taskDesc: this.state.taskDesc,
          taskStatus:this.state.taskStatus
        }
        let route = "/api/addTask/";
        axios
        .post(route, newTask)
        .then(this.setState({ isLoading:true}))
        .then(res=>{
          this.child.handleSnackbar(res.data);
          this.setState({ isLoading:false})
        })
      }
      else{
        let updateTask ={
          taskTitle: this.state.taskTitle,
          taskDesc: this.state.taskDesc,
          taskStatus:this.state.taskStatus
        }
        let route = "/api/updateTask/";
        route += this.state.id;
        axios.post(route,updateTask)
        .then(this.setState({ isLoading:true}))
        .then( res=>{
          this.child.handleSnackbar(res.data);
          this.setState({ isLoading:false})
        })
      }
      this.handleClose();
      this.handleClear();
    }

    //function use to clear inputs
    handleClear = () =>{
      this.setState({
        id:'',
        taskStatus:'',
        taskTitle:'',
        taskDesc:'',
      })
    }

    //function use to get a single task detail and edit the task
    handleEdit = (id) => {
      // console.log(id+"edit");
      this.handleFormVisibility();
      let route = "/api/getTask/";
      route += id;
      axios
      .get(route)
      .then(this.setState({ isLoading:true}))
      .then(res=>{
        this.setState({
          taskTitle: res.data.taskTitle,
          taskDesc: res.data.taskDesc,
          taskStatus: res.data.taskStatus,
          id: res.data._id,
          isLoading:false
        })
      })
    }

    //function use to delete any task
    handleDelete = (id) => {
      let route = "/api/deleteTask/";
      route += id;
      axios
      .delete(route)
      .then(this.setState({ isLoading:true}))
      .then((res)=>  {
        this.child.handleSnackbar(res.data)
        this.setState({ isLoading:false})
      })
    }

    //function use to change task status via button associated with each card
    handleChangeStatus = (id,str) =>{
      let obj;
      if(str === 'todo'){
        //update status of that task
        obj = {
          taskStatus:'progress'
        }
      }
      else if( str === 'progress'){
        obj = {
          taskStatus:'complete'
        }
      }
      let route = '/api/updateTaskStatus/';
      route += id;
      axios.post(route,obj )
      .then(this.setState({ isLoading:true}))
      .then( res=> {
        this.child.handleSnackbar(res.data)
        this.setState({ isLoading:false})
      }
      );
    }

    //function for dialog form visibility control
    handleFormVisibility = () => {
      this.setState({ open: true})
    }

    //function use to close dialog
    handleClose = () =>{
      this.setState({ open: false})
    }

    render(){
      const { classes } = this.props;
      return (
        <div className={classes.root}>
        {/* loading progress showing */}
        {this.state.isLoading?(<CircularProgress  style ={{
          position:'fixed',
          left: '50%',
          top: '50%',
          width: '35px',
          height: '35px',
        }} />):""}
        {/* loading progress end */}
        {/* heading of the app */}
        <center>
        <Chip label="Weeks Planer" style={{
          margin:'5px auto 25px auto',
          fontSize:35,
          textAlign:'center',
        }} />
        </center>
        {/* end of heading of app */}

        {/* dialog form box start here */}
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add A new task</DialogTitle>
        <DialogContent>
        <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
        <AccountCircle />
        </Grid>
        <Grid item>
        <TextField
        ref={(ip) => this.myInp = ip}
        label="Title"
        value={this.state.taskTitle}
        onChange ={(e)=> this.setState({taskTitle: e.target.value})}
        placeholder="Enter Topic"
        className={classes.inputTask}
        margin="normal"
        />
        </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
        <AccountCircle />
        </Grid>
        <Grid item>
        <TextField
        label="Describe Your Task"
        multiline
        rows="4"
        value={this.state.taskDesc}
        onChange ={(e)=> this.setState({taskDesc: e.target.value})}
        className={classes.inputTaskDescription}
        margin="normal"
        variant="filled"
        />
        </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
        <AccountCircle />
        </Grid>
        <Grid item>
        <InputLabel htmlFor="taskStatus">Task Status</InputLabel>
        <Select
        value={this.state.taskStatus}
        onChange={(e)=> this.setState({ taskStatus:e.target.value})}
        inputProps={{
          name: 'taskStatus',
          id: 'taskStatus',
        }}
        >
        <MenuItem value={'todo'}>ToDo</MenuItem>
        <MenuItem value={'progress'}>Progressive</MenuItem>
        <MenuItem value={'completed'}>Completed</MenuItem>
        </Select>
        </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
        <Button variant="contained" size="medium" onClick={ this.handleNewtask} color="primary" className={classes.button}>
        <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
        {!this.state.id  ?"Save":"Update"}
        </Button>
        <Button variant="contained" size="medium" color="secondary" onClick={ this.handleClear} className={classes.button}>
        Clear
        </Button>

        </DialogActions>
        </Dialog>
        {/* dialog end here */}

        {/* noification bar starts */}
        <MySnackbar onRef={ref => (this.child = ref)} />
        {/* noification bar end */}

        {/* whole container starts here */}
        <Grid container spacing={3}>
        {/* alltask column start */}
        <Grid item xs className={classes.singleList}>
        <Paper className={classes.paper}>ALL</Paper>

        {/* here showing all the task in seperate cards of all status */}
        {this.state.allTask.map(data =>
          (<Paper className={classes.taskCard}>
            <Card className={classes.card}>
            <CardContent style={{textAlign:'center'}}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
            Task No:{data.taskNo}
            </Typography>
            <Typography variant="h5" component="h2">
            {data.taskTitle}
            </Typography>

            <Typography variant="body2" component="p">
            {data.taskDesc}
            </Typography>
            </CardContent>
            <CardActions>
            <Fab
            color="secondary"
            aria-label="Delete"
            size="small"
            onClick={()=> this.handleDelete(data._id)}
            >
            <Icon>delete_icon</Icon>
            </Fab>
            {(data.taskStatus !== 'complete')?

            (<div>
              <Fab
              color="secondary"
              className={classes.buttons}
              style={{marginRight:"7px"}}
              aria-label="Edit"
              size="small"
              onClick={()=> this.handleEdit(data._id)}
              >
              <Icon>edit_icon</Icon>
              </Fab>


              </div>)
              :(<Chip label="Completed" color="primary" style={{textAlign:'center'}} className={classes.chip} />)
            }
            </CardActions>
            </Card>
            </Paper>)
            )}
            </Grid>
            {/* alltask column end here */}
            <hr/>
            {/* todo task list start */}
            <Grid item xs>
            <Paper className={classes.paper}>To Do</Paper>
            {/* here showing all the task in seperate cards which is in todo status */}
            {this.state.allTask.map(data =>
              (data.taskStatus === 'todo')?
              (<Paper className={classes.taskCard}>
                <Card className={classes.card}>
                <CardContent style={{textAlign:'center'}}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                Task No:{data.taskNo}
                </Typography>
                <Typography variant="h5" component="h2">
                {data.taskTitle}
                </Typography>

                <Typography variant="body2" component="p">
                {data.taskDesc}
                </Typography>
                </CardContent>
                <CardActions>
                <Fab
                color="secondary"
                className={classes.buttons}
                aria-label="Edit"
                size="small"
                onClick={()=> this.handleEdit(data._id)}
                >
                <Icon>edit_icon</Icon>
                </Fab>

                <Fab
                color="secondary"
                className={classes.buttons}
                aria-label="Delete"
                size="small"
                onClick={()=> this.handleDelete(data._id)}
                >
                <Icon>delete_icon</Icon>
                </Fab>
                <Fab
                variant="extended"
                size="medium"
                aria-label="Delete"
                onClick={()=>this.handleChangeStatus(data._id, 'todo')}
                className={classes.fab}
                >
                <Icon className={classes.rightIcon}>send</Icon>
                send to progress
                </Fab>
                </CardActions>
                </Card>
                </Paper>):null
                )}
                </Grid>
                {/* todo task list end */}
                <hr/>
                {/* progress task list starts */}
                <Grid item xs>
                <Paper className={classes.paper}>Progress</Paper>
                {/* here showing all the task in seperate cards which is in progressive status */}
                {this.state.allTask.map(data =>
                  (data.taskStatus === 'progress')?
                  (<Paper className={classes.taskCard}>
                    <Card className={classes.card}>
                    <CardContent style={{textAlign:'center'}}>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Task No:{data.taskNo}
                    </Typography>
                    <Typography variant="h5" component="h2">
                    {data.taskTitle}
                    </Typography>

                    <Typography variant="body2" component="p">
                    {data.taskDesc}
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Fab
                    color="secondary"
                    className={classes.buttons}
                    aria-label="Edit"
                    size="small"
                    onClick={()=> this.handleEdit(data._id)}
                    >
                    <Icon>edit_icon</Icon>
                    </Fab>

                    <Fab
                    color="secondary"
                    className={classes.buttons}
                    aria-label="Delete"
                    size="small"
                    onClick={()=> this.handleDelete(data._id)}
                    >
                    <Icon>delete_icon</Icon>
                    </Fab>
                    <Fab
                    variant="extended"
                    onClick={()=>this.handleChangeStatus(data._id, 'progress')}
                    size="medium"
                    aria-label="Delete"
                    className={classes.fab}>
                    <Icon className={classes.rightIcon}>send</Icon>
                    send to done
                    </Fab>
                    </CardActions>
                    </Card>
                    </Paper>):null
                    )}
                    </Grid>
                    {/* progress tasklist end */}
                    <hr/>
                    {/* complet task list starts */}
                    <Grid item xs>
                    <Paper className={classes.paper}>Completed</Paper>
                    {/* here showing all the task in seperate cards which is in completed status */}
                    {this.state.allTask.map(data =>
                      (data.taskStatus === 'complete')?
                      (<Paper className={classes.taskCard}>
                        <Card className={classes.card}>
                        <CardContent style={{textAlign:'center'}}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Task No:{data.taskNo}
                        </Typography>
                        <Typography variant="h5" component="h2">
                        {data.taskTitle}
                        </Typography>

                        <Typography variant="body2" component="p">
                        {data.taskDesc}
                        </Typography>
                        </CardContent>
                        <Fab
                        color="secondary"
                        style={{marginRight:'7px'}}
                        aria-label="Delete"
                        size="small"
                        onClick={()=> this.handleDelete(data._id)}
                        >
                        <Icon>delete_icon</Icon>
                        </Fab>
                        <Chip label="Completed" color="primary" style={{textAlign:'center'}} className={classes.chip} />
                        <CardActions>

                        </CardActions>
                        </Card>
                        </Paper>):null
                        )}
                        </Grid>
                        {/* complete task list end */}
                        </Grid>
        {/* whole container end here */}

        {/* floating add form button starts */}
        <Fab
                        aria-label="addtask"
                        onClick = {this.handleFormVisibility}
                        variant="extended"
                        size="medium"
                        style={{
                          marginRight: "30px",
                          position: 'fixed',
                          right: 0,
                          top: '400px'
                        }}
                        color="primary">
                        <Add />
                        Add Task
                        </Fab>
        {/* floating add form button end */}
        </div>

      );
    }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
