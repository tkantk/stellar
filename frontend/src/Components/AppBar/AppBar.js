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
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import { isUserloggedIn, getState } from '../../Utils/Stellar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import {createCookie, deletCookie, getCookie} from '../../Utils/Cookie';
import {logoutUser} from '../../Utils/Stellar';
import { defaultFont } from "../../assets/jss/material-kit-react.jsx";
import LoginScreen from '../Login/Loginscreen';
import UploadPage from '../Upload/UploadPage';
import Dashboard_1 from '../Dashboard/Dashboard_1';
import CustomDropdown from '../CustomDropdown/CustomDropdown.jsx';

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
  fullList: {
    width: 'auto',
  },
  list: {
    ...defaultFont,
    fontSize: "14px",
    margin: 0,
    paddingLeft: "0",
    listStyle: "none",
    paddingTop: "0",
    paddingBottom: "0",
    color: "inherit",
  },
  listItem: {
    float: "left",
    color: "inherit",
    position: "relative",
    display: "block",
    width: "auto",
    margin: "0",
    padding: "0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "&:after": {
        width: "calc(100% - 30px)",
        content: '""',
        display: "block",
        height: "1px",
        marginLeft: "15px",
        backgroundColor: "#e5e5e5"
      }
    }
  },
  listItemText: {
    padding: "0 !important"
  },
  navLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)"
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start"
      }
    }
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
      axios.post('/api/ApplicationUsers/logout?access_token='+userId, payload, {
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }
      }).then(function (response) {
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
    let leftBar = null;
    if (isUserloggedIn()) {
      leftBar = (
        <List>
          <ListItem className={classes.listItem}>
            <CustomDropdown
              buttonText="MENU"
              dropdownHeader="MENU"
              buttonProps={{
                className: classes.navLink,
                color: "transparent"
              }}
              dropdownList={[
                "Action",
                "Another action",
                "Something else here",
                { divider: true },
                "Separated link",
                { divider: true },
                "One more separated link"
              ]}
            />
            </ListItem>
        </List>
      );
    } else {
      leftBar = (
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" >
          <MenuIcon />
        </IconButton>
      );
    }
    return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              {leftBar}
              <Typography variant="title" color="inherit" className={classes.flex}>
                {this.props.heading}
              </Typography>
              <Button color="inherit">Stellar</Button>
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
