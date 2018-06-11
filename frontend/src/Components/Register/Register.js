import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import axios from 'axios';

import Login from '../Login/Login';
import ButtonAppBar from '../AppBar/AppBar';

const theme = createMuiTheme();
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      first_name:'',
      last_name:'',
      user_name:'',
      email:'',
      password:''
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",nextProps);
  }
  handleClick(event,role){
    var apiBaseUrl = "http://localhost:5000/api/";
    var self = this;
    //To be done:check for empty values before hitting submit
    if(this.state.first_name.length>0 && this.state.last_name.length>0 && this.state.user_name.length>0 && this.state.email.length>0 && this.state.password.length>0){
      var payload={
      "firstName": this.state.first_name,
      "lastName":this.state.last_name,
      "realm": "Sapient",
      "email":this.state.email,
      "username":this.state.user_name,
      "password":this.state.password
      }
      axios.post(apiBaseUrl+'ApplicationUsers', payload)
     .then(function (response) {
       console.log(response);
       if(response.data.code === 200){
        //  console.log("registration successfull");
         var loginscreen=[];
         loginscreen.push(<Login parentContext={this} appContext={self.props.appContext}/>);
         var loginmessage = "Not Registered yet.Go to registration";
         self.props.parentContext.setState({loginscreen:loginscreen,
         loginmessage:loginmessage,
         buttonLabel:"Register",
         isLogin:true
          });
       }
       else{
         console.log("some error ocurred",response.data.code);
       }
     })
     .catch(function (error) {
       console.log(error);
     });
    }
    else{
      alert("Input field value is missing");
    }

  }
  render() {
   const { classes } = this.props;
    var userhintText,userLabel;
      userhintText = "Enter your Email Id",
      userLabel = "Email Id"
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading="Register" appContext={this.props.appContext}/>
        </MuiThemeProvider>
        <div>
          <MuiThemeProvider theme={theme}>
            <div>
            <TextField
              required
              id="required"
              label="Enter your First Name"
              placeholder="First Name"
              className={classes.textField}
              margin="normal"
              onChange = {(event,newValue) => this.setState({first_name:newValue})}
            />
            <br/>
            <TextField
              required
              id="required"
              label="Enter your Last Name"
              placeholder="Last Name"
              className={classes.textField}
              margin="normal"
              onChange = {(event,newValue) => this.setState({last_name:newValue})}
            />
            <br/>
            <TextField
              required
              id="required"
              label="Enter your User Name"
              placeholder="User Name"
              className={classes.textField}
              margin="normal"
              onChange = {(event,newValue) => this.setState({user_name:newValue})}
            />
            <br/>
            <TextField
              required
              id="required"
              label={userhintText}
              placeholder={userLabel}
              className={classes.textField}
              margin="normal"
              onChange = {(event,newValue) => this.setState({email:newValue})}
            />
            <br/>
            <TextField
              id="password-input"
              autoComplete="current-password"
              margin="normal"
              label="Enter your Password"
              type="password"
              className={classes.textField}
              onChange = {(event,newValue) => this.setState({password:newValue})}
              />
            <br/>
            <Button variant="raised" color="primary" label="Submit" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
              Submit
            </Button>
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
