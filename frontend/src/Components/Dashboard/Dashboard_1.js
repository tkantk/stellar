import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

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

class Dasboard_1 extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
  }

  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Dashboard_1" appContext={this.props.appContext}/>
        </MuiThemeProvider>
      </div>
    );
  }
};



Dasboard_1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dasboard_1);