import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

import UploadPage from '../Upload/UploadPage';
import {createCookie} from '../../Utils/Cookie';
import ButtonAppBar from '../AppBar/AppBar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import MySnackbarContent from '../Snackbar/Snackbar';

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
  progress: {
    margin: theme.spacing.unit * 2,
  },
  margin: {
    marginTop: theme.spacing.unit,
    margin: 'auto',
  },
});

class Login extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
    var localloginComponent=[];
    localloginComponent.push(
      <MuiThemeProvider theme={theme}>
        <div>
          <TextField
            required
            id="required"
            label="Enter your User Id"
            placeholder="User Id"
            className={classes.textField}
            margin="normal"
            onChange={this.handleChange('username')}
           />
         <br/>
           <TextField
             id="password-input"
             autoComplete="current-password"
             margin="normal"
             label="Enter your Password"
             type="password"
             className={classes.textField}
             onChange={this.handleChange('password')}
             />
           <br/>
           <Button variant="raised" label="Submit" color="primary" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
            Submit
          </Button>
       </div>
       </MuiThemeProvider>
    )
    this.state={
      username:'',
      password:'',
      loginComponent:localloginComponent,
      isLoggedIn:false,
      isLoginFailure:false,
      loginMessage:'',
      error: [],
    }
  }
  componentWillMount(){
    const { classes } = this.props;
      var localloginComponent=[];
      localloginComponent.push(
        <MuiThemeProvider theme={theme}>
          <div>
           <TextField
              required
              id="required"
              label="Enter your User Id"
              placeholder="User Id"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange('username')}
           />
           <br/>
            <TextField
             id="password-input"
             autoComplete="current-password"
             margin="normal"
             label="Enter your Password"
             type="password"
             className={classes.textField}
             onChange={this.handleChange('password')}
             />
             <br/>
             <Button variant="raised" label="Submit" color="primary" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
              Submit
             </Button>
         </div>
         </MuiThemeProvider>
      )
      this.setState({menuValue:1,loginComponent:localloginComponent})
  }
  handleClick(event){
    var self = this;
    var apiBaseUrl = "http://localhost:5000/api/";
    var payload={
      "username":this.state.username,
	    "password":this.state.password
    }
    const { classes } = this.props;
    axios.post(apiBaseUrl+'ApplicationUsers/login', payload)
   .then(function (response) {
     console.log(response.data.userId);
     if(response.status === 200){
       console.log("Login successfull");
       let auth_cookie_value = response.data.id;
       createCookie(STELLAR_CONST.LOGIN_COOKIE, auth_cookie_value);
       createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.UPLOAD_STATE);
       var uploadScreen=[];
       uploadScreen.push(<UploadPage appContext={self.props.appContext}/>)
       self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen, dashboard:[]})
     }
     else if(response.status === 401){
       console.log("Username password do not match");
     }
     else{
       console.log("Username does not exists");
     }
   })
   .catch(function (error) {
     if (error.response.data.error.statusCode === 401) {
       let error_401 = [];
       error_401.push(<MySnackbarContent
        variant="error"
        className={classes.margin}
        message="Username password do not match"
      />)
      self.setState({error:error_401});
      console.log("Username password do not match");
     } else {
      let error_gen = [];
      error_gen.push(<MySnackbarContent
       variant="error"
       className={classes.margin}
       message="Username does not exists"
     />)
     self.setState({error:error_gen});
     }
   });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Login" appContext={this.props.appContext}/>
        </MuiThemeProvider>
        <div>
          {this.state.error}
          {this.state.loginComponent}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
