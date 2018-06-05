import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { isUserloggedIn, getState } from '../../Utils/Stellar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import {createCookie, deletCookie} from '../../Utils/Cookie';

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
    }
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
        localAppBarLinks.push(<Button color="inherit"  onClick={(event) => this.handleRoute(event, STELLAR_CONST.DASHBOARD_1_STATE)}>Dashboard 1</Button>
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
      deletCookie(STELLAR_CONST.LOGIN_COOKIE);
      deletCookie(STELLAR_CONST.STATE_COOKIE);
      window.location.reload();
    }
  }
  handleRoute(event, state) {
    var self = this;
    if (state === STELLAR_CONST.LOGIN_STATE) {
      var loginPage =[];
      loginPage.push(<LoginScreen appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.LOGIN_STATE);
      self.props.appContext.setState({
                    loginPage:loginPage, uploadScreen:[], dashboard_1:[]
                      })
    } else if (state === STELLAR_CONST.UPLOAD_STATE) {
      var uploadScreen =[];
      uploadScreen.push(<UploadPage appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.UPLOAD_STATE);
      self.props.appContext.setState({
                    loginPage:[], uploadScreen:uploadScreen, dashboard_1:[]
                      })
    } else if (state === STELLAR_CONST.DASHBOARD_1_STATE) {
      var dashboard_1 =[];
      dashboard_1.push(<Dashboard_1 appContext={self.props.appContext}/>);
      createCookie(STELLAR_CONST.STATE_COOKIE, STELLAR_CONST.DASHBOARD_1_STATE);
      self.props.appContext.setState({
                    loginPage:[], uploadScreen:[], dashboard_1:dashboard_1
                      })
    } 
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {this.props.heading}
            </Typography>
            {this.state.appBarLinks}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
