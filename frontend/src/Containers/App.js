import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

import './App.css';
import LoginScreen from '../Components/Login/Loginscreen';
import UploadPage from '../Components/Upload/UploadPage';
import Dashboard_1 from '../Components/Dashboard/Dashboard_1';
import ButtonAppBar from '../Components/AppBar/AppBar';

import {isUserloggedIn, getState} from '../Utils/Stellar';
import * as STELLAR_CONST from '../Constants/StellarConstant';
import {createCookie} from '../Utils/Cookie';


injectTapEventPlugin();
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
  main: {
    width: '100%',
    height: '100%',
  },
});

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      heading:"",
      loginPage:[],
      uploadScreen:[],
      dashboard_1:[],
    }
  }
  componentWillMount(){
    if (!isUserloggedIn()) {
      var loginPage =[];
      loginPage.push(<LoginScreen appContext={this}/>);
      this.setState({
                    loginPage:loginPage
                      })
    } else {
      var state = getState();
        if (state === STELLAR_CONST.LOGIN_STATE) {
          var loginPage =[];
          loginPage.push(<LoginScreen appContext={this}/>);
          this.setState({
                        loginPage:loginPage, uploadScreen:[], dashboard_1:[], heading:"Login"
                          })
        } else if (state === STELLAR_CONST.UPLOAD_STATE) {
          var uploadScreen =[];
          uploadScreen.push(<UploadPage appContext={this}/>);
          createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.UPLOAD_STATE);
          this.setState({
                        loginPage:[], uploadScreen:uploadScreen, dashboard_1:[], heading:"Home"
                          })
        } else if (state === STELLAR_CONST.DASHBOARD_1_STATE) {
          var dashboard_1 =[];
          dashboard_1.push(<Dashboard_1 appContext={this}/>);
          createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.DASHBOARD_1_STATE);
          this.setState({
                        loginPage:[], uploadScreen:[], dashboard_1:dashboard_1, heading:"Dashboard-One"
                          })
        }

    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        {this.state.loginPage}
        {this.state.uploadScreen}
        {this.state.dashboard_1}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
