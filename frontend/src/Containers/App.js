import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PropTypes from 'prop-types';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';

import './App.css';
import LoginScreen from '../Components/Login/Loginscreen';
import UploadPage from '../Components/Upload/UploadPage';
import Dashboard_1 from '../Components/Dashboard/Dashboard_1';
import Dashboard_2 from '../Components/Dashboard/Dashboard_2';

import {isUserloggedIn, getState} from '../Utils/Stellar';
import {LOGIN_STATE, UPLOAD_STATE, DASHBOARD_1_STATE, DASHBOARD_2_STATE, STATE_COOKIE, PROJECT_COOKIE} from '../Constants/StellarConstant';
import {createCookie, getProjectCookie} from '../Utils/Cookie';


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
      dashboard_2:[],
      projects:[],
    }
  }
  componentWillMount(){
    if (!isUserloggedIn()) {
      let loginPage =[];
      loginPage.push(<LoginScreen appContext={this}/>);
      this.setState({
                    loginPage:loginPage
                      })
    } else {
      let state = getState();
      let projectsCookie = getProjectCookie(PROJECT_COOKIE);
      if ((state.projects === undefined || state.projects.length === 0) && (projectsCookie !== undefined && projectsCookie.length > 0 ))  {
        this.setState({
          projects: projectsCookie,
        }); 
      }
        if (state === LOGIN_STATE) {
          let loginPage =[];
          loginPage.push(<LoginScreen appContext={this}/>);
          this.setState({
                        loginPage:loginPage, uploadScreen:[], dashboard_1:[], dashboard_2:[], heading:"Login"
                          })
        } else if (state === UPLOAD_STATE) {
          let uploadScreen =[];
          uploadScreen.push(<UploadPage appContext={this}/>);
          createCookie(STATE_COOKIE, UPLOAD_STATE);
          this.setState({
                        loginPage:[], uploadScreen:uploadScreen, dashboard_1:[], dashboard_2:[], heading:"Home"
                          })
        } else if (state === DASHBOARD_1_STATE) {
          let dashboard_1 =[];
          dashboard_1.push(<Dashboard_1 appContext={this}/>);
          createCookie(STATE_COOKIE, DASHBOARD_1_STATE);
          this.setState({
                        loginPage:[], uploadScreen:[], dashboard_1:dashboard_1, dashboard_2:[], heading:"Dashboard-One"
                          })
        } else if (state === DASHBOARD_2_STATE) {
          let dashboard_2 =[];
          dashboard_2.push(<Dashboard_2 appContext={this}/>);
          createCookie(STATE_COOKIE, DASHBOARD_2_STATE);
          this.setState({
                        loginPage:[], uploadScreen:[], dashboard_1:[], dashboard_2:dashboard_2, heading:"Dashboard-Two"
                          })
        }

    }
  }
  render() {
    return (
      <div className="App">
        {this.state.loginPage}
        {this.state.uploadScreen}
        {this.state.dashboard_1}
        {this.state.dashboard_2}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
