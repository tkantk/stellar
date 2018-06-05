import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';
import LoginScreen from '../Components/Login/Loginscreen';
import UploadPage from '../Components/Upload/UploadPage';
import Dashboard_1 from '../Components/Dashboard/Dashboard_1';

import {isUserloggedIn, getState} from '../Utils/Stellar';
import * as STELLAR_CONST from '../Constants/StellarConstant';
import {createCookie} from '../Utils/Cookie';


injectTapEventPlugin();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[],
      uploadScreen:[],
      dashboard_1:[],
    }
  }
  componentWillMount(){
   console.log("this"+isUserloggedIn());
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
                        loginPage:loginPage, uploadScreen:[], dashboard_1:[]
                          })
        } else if (state === STELLAR_CONST.UPLOAD_STATE) {
          var uploadScreen =[];
          uploadScreen.push(<UploadPage appContext={this}/>);
          createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.UPLOAD_STATE);
          this.setState({
                        loginPage:[], uploadScreen:uploadScreen, dashboard_1:[]
                          })
        } else if (state === STELLAR_CONST.DASHBOARD_1_STATE) {
          var dashboard_1 =[];
          dashboard_1.push(<Dashboard_1 appContext={this}/>);
          createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.DASHBOARD_1_STATE);
          this.setState({
                        loginPage:[], uploadScreen:[], dashboard_1:dashboard_1
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
      </div>
    );
  }
}

export default App;
