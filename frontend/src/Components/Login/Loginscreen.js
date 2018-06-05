import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Login from './Login';
import Register from '../Register/Register';

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
const theme = createMuiTheme();

class Loginscreen extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
    var loginButtons=[];
    loginButtons.push(
      <MuiThemeProvider theme={theme}>
        <div>
           <Button variant="raised" label={"Register Now"} color="primary"  primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
            Register Now
           </Button>
       </div>
       </MuiThemeProvider>
    )
    this.state={
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      loginButtons:loginButtons,
      registerbuttonLabel:'Register Now',
      isLogin:true
    }
  }
  componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login parentContext={this} appContext={this.props.appContext}/>);
    var loginmessage = "Not registered yet, Register Now";
    this.setState({
                  loginscreen:loginscreen,
                  loginmessage:loginmessage
                    })
  }
  handleClick(event){
    var loginmessage;
    const { classes } = this.props;
    if(this.state.isLogin){
      let loginscreen=[];
      loginscreen.push(<Register parentContext={this} appContext={this.props.appContext}/>);
      loginmessage = "Already registered.Go to Login";
      let loginButtons=[];
      loginButtons.push(
        <div key="login-button">
        <MuiThemeProvider theme={theme}>
          <div>
             <Button variant="raised" color="primary" label={"Login"} primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
              Login
             </Button>
         </div>
         </MuiThemeProvider>
        </div>
      )
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     loginButtons:loginButtons,
                     isLogin:false
                   })
    }
    else{
      let loginscreen=[],loginButtons=[];
      loginButtons.push(
        <MuiThemeProvider theme={theme}>
          <div>
             <Button variant="raised" label={"Register Now"} color="primary" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
              Register Now
             </Button>
         </div>
         </MuiThemeProvider>
      )
      loginscreen.push(<Login parentContext={this} appContext={this.props.appContext}/>);
      loginmessage = "Not Registered yet.Go to registration";
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     loginButtons:loginButtons,
                     isLogin:true
                   })
    }
  }
  render() {
    return (
      <div className="loginscreen" key="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          {this.state.loginButtons}
        </div>
      </div>
    );
  }
}

Loginscreen.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Loginscreen);
