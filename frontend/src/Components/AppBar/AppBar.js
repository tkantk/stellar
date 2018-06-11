import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import { isUserloggedIn, getState } from '../../Utils/Stellar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import {createCookie, deletCookie, getCookie} from '../../Utils/Cookie';
import {logoutUser} from '../../Utils/Stellar';

import LoginScreen from '../Login/Loginscreen';
import UploadPage from '../Upload/UploadPage';
import Dashboard_1 from '../Dashboard/Dashboard_1';

const theme = createMuiTheme();
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

class ButtonAppBar extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
    var localAppBarLinks = [];

    this.state={
      loginComponent:[],
      uploadScreen:[],
      dashboard_1:[],
      appBarLinks:localAppBarLinks,
      heading:"",
      left: false,
    }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      left: open,
    });
  };

  updateHeading(text) {
    this.setState({heading:text});
  }

  componentWillMount(){
    const { classes } = this.props;
    var localAppBarLinks=[];
    var rightText = isUserloggedIn() ? "Logout" : "Stellar";
    if (isUserloggedIn()) {
      if (getState() !== STELLAR_CONST.UPLOAD_STATE) {
        localAppBarLinks.push(<Button color="inherit"  onClick={(event) => this.handleRoute(event, STELLAR_CONST.UPLOAD_STATE)}>Upload Page</Button>
        )
      }
      if (getState() !== STELLAR_CONST.DASHBOARD_1_STATE) {
        localAppBarLinks.push(<Button color="inherit"  onClick={(event) => this.handleRoute(event, STELLAR_CONST.DASHBOARD_1_STATE)}>Dashboard One</Button>
        )
      }
    }
    localAppBarLinks.push(
      <Button color="inherit" onClick={(event) => this.handleLogout(event)}>{rightText}</Button>
    )
    this.state.appBarLinks.push(localAppBarLinks);
  }

  handleLogout(event) {
    if (isUserloggedIn()) {
      let userId = getCookie('stellar_auth');
      var payload={
        access_token: userId
      }
      axios.post('/api/ApplicationUsers/logout', payload)
     .then(function (response) {
       console.log(response);
       if(response.data.code === 204){
        console.log("Logout successfull");
        logoutUser();
       }
       else{
         console.log("some error ocurred",response.data.code);
         logoutUser();
       }
     })
     .catch(function (error) {
       console.log(error);
       logoutUser();
     });
    }
  }

  handleRoute(event, state) {
    var self = this;
    if (state === STELLAR_CONST.LOGIN_STATE) {
      var loginPage =[];
      loginPage.push(<LoginScreen appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.LOGIN_STATE);
      this.updateHeading("Login");
      self.props.appContext.setState({
                    loginPage:loginPage, uploadScreen:[], dashboard_1:[]
                      })
    } else if (state === STELLAR_CONST.UPLOAD_STATE) {
      var uploadScreen =[];
      uploadScreen.push(<UploadPage appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.UPLOAD_STATE);
      this.updateHeading("Home");
      self.props.appContext.setState({
                    loginPage:[], uploadScreen:uploadScreen, dashboard_1:[]
                      })
    } else if (state === STELLAR_CONST.DASHBOARD_1_STATE) {
      var dashboard_1 =[];
      dashboard_1.push(<Dashboard_1 appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.DASHBOARD_1_STATE);
      this.updateHeading("Dashboard One");
      self.props.appContext.setState({
                    loginPage:[], uploadScreen:[], dashboard_1:dashboard_1
                      })
    } 
  }

  render() {
    const { classes } = this.props;
    const sideList = (
      <div className={classes.list}>
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );

    const fullList = (
      <div className={classes.fullList}>
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );
   
    return (
      <div>
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" 
              onClick={this.toggleDrawer('left', true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                {this.props.heading}
              </Typography>
              {this.state.appBarLinks}
            </Toolbar>
          </AppBar>
        </div>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
