import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from 'axios';
import * as Highcharts from "highcharts";

import {getCookie} from '../../Utils/Cookie';
import MySnackbarContent from '../Snackbar/Snackbar';
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
  main: {
    width: '100%',
    height: '100%',
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    margin: 'auto',
  },
});

class Dasboard_1 extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
    this.state={
      seriesCategories: ['count', 'avg', 'min', 'max'],
      project: 'MGM',
      startDate: "",
      endDate: "",
      error: [],
    }
  }

   pad(n) {
     return n < 10 ? "0"+n : n;
    }

  callApi = async () => {
    let userId = getCookie('stellar_auth');
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);
    const response = axios.get('/api/Metrics/calcMetrics', {
      params: {
        startDate: startDate.getFullYear()+"-"+this.pad(startDate.getMonth()+1)+"-"+this.pad(startDate.getDate()),
        endDate: endDate.getFullYear()+"-"+this.pad(endDate.getMonth()+1)+"-"+this.pad(endDate.getDate()),
        proj: this.state.project,
        access_token: userId
      }
    })
    return response;
  };

  createChart(response) {
    Highcharts.chart("Charts", this.createData(response));
  }

  createData(response) {

   let chart = {
      type: 'column'
   };
   let title = {
      text: 'Metrics Calculated Data'   
   };
   let subtitle = {
      text: 'Source: UCW Projects'  
   };
   let xAxis = this.getXAxis(response);

   let yAxis = {
      min: 0,
      title: {
         text: 'Data (nos)'         
      }      
   };
   let tooltip = {
      headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
         '<td style = "padding:0"><b>{point.y:.1f} nos</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
   };
   let plotOptions = {
      column: {
         pointPadding: 0.2,
         borderWidth: 0
      }
   };  
   let credits = {
      enabled: false
   };
   let series= this.getSeries(response);

   var json = {};   
   json.chart = chart; 
   json.title = title;   
   json.subtitle = subtitle; 
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;  
   json.series = series;
   json.plotOptions = plotOptions;  
   json.credits = credits;
    return json;
  }

  getXAxis(response) {

   let xAxixObj = {};
   let categories = [];
   for (let i = 0; i < response.Metrics.length; i++) {
      categories.push(response.Metrics[i]._id.priority);
   }
   xAxixObj = {
     "categories": categories,
     "crosshair": true
   };
   return xAxixObj;
   }

   getSeries(response) {
    let series = [];
    for (let i=0;i<this.state.seriesCategories.length;i++) {
      let name = this.state.seriesCategories[i];
      let data = [];
      for(let j=0;j<response.Metrics.length;j++) {
        let obj = response.Metrics[j];
        data.push(obj[name]);
      }
      let seriesData = {
        "name": name,
        "data": data
      };
      series.push(seriesData);
    }
    return series;
}

handleChange = name => event => {
  this.setState({
    [name]: event.target.value,
  });
};

handleClick(event){
  const { classes } = this.props;
  if (this.checkFormData()) {
    this.callApi()
        .then(res => this.createChart(res.data))
        .catch(err => {
          let call_error = [];
          call_error.push(<MySnackbarContent
            variant="error"
            className={classes.margin}
            message="Error Occurred while getting data"
          />)
          this.setState({error:call_error});
          console.log(err);
        });
  }
}

checkFormData() {
  const { classes } = this.props;
  if (this.state.startDate !== "" && this.state.endDate !== "") {
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);
    if (startDate < endDate) {
      return true;
    } else {
      let date_error = [];
      date_error.push(<MySnackbarContent
        variant="error"
        className={classes.margin}
        message="Start Date cannot be before End Date"
      />)
      this.setState({error:date_error});
    }
  } else {
    let mand_error = [];
    mand_error.push(<MySnackbarContent
        variant="error"
        className={classes.margin}
        message="All fields are mandatory"
      />)
      this.setState({error:mand_error});
  }
  return false;
}

  render() {
    const { classes } = this.props;

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Dashboard One" appContext={this.props.appContext}/>
        </MuiThemeProvider>
        <br/>
        <MuiThemeProvider theme={theme}>
        {this.state.error}
        <form className={classes.container} autoComplete="off">
          <TextField
            id="startDate"
            label="Start Date"
            type="date"
            className={classes.textField}
            onChange={this.handleChange('startDate')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="endDate"
            label="End Date"
            type="date"
            className={classes.textField}
            onChange={this.handleChange('endDate')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='project-drop'>Select Project</InputLabel>
            <NativeSelect defaultValue='MGM' onChange={this.handleChange('project')} input={<Input id="project-drop" />}>
            <option value='MGM'>MGM</option>
            <option value='LAKC'>Lord Abbett</option>
            <option value='Michelin'>Michelin</option>
          </NativeSelect>
          </FormControl>
        </form>
        <Button variant="raised" label="Submit" color="primary" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
           Submit
        </Button>
        </MuiThemeProvider>
        <div id = "Charts" className = {classes.main}>
          
        </div>
      </div>
    );
  }
};



Dasboard_1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dasboard_1);