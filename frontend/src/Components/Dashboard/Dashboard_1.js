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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import axios from 'axios';
import * as Highcharts from "highcharts";

import {getCookie} from '../../Utils/Cookie';
import MySnackbarContent from '../Snackbar/Snackbar';
import ButtonAppBar from '../AppBar/AppBar';
import {logoutUser} from '../../Utils/Stellar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import {getCountSeries, getAvgSeries, getXAxis} from '../../Utils/seriesUtil';

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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Dasboard_1 extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
  }

  state={
    startDate: "",
    endDate: "",
    error: [],
    projects: this.props.appContext.state.projects,
    selectedGroup: "",
    filter: "Resolved On",
    [`metricsData${STELLAR_CONST.INCIDENT}`]: [],
    [`metricsData${STELLAR_CONST.SERVICE_REQUEST}`]:  [],
    priority: "0",
  };

   pad(n) {
     return n < 10 ? "0"+n : n;
    }

  callApi = async (type) => {
    let userId = getCookie('stellar_auth');
    let params = { };
    params.access_token = userId;
    params.filter = this.getFilter(type);
    const response = axios.get('/api/Metrics/getMetricsData', { params });
    return response;
  };

   getFilter(type) {
    let filter = {};
    let condition = {};
    let andCond = [];
    let projectsCond = {};
    projectsCond.inq = this.state.projects;
    andCond.push(projectsCond);
    let category = {
      Category: type,
    };
    andCond.push(category);
    let startDate = new Date(this.state.startDate);
    let endDate = new Date(this.state.endDate);
    if (startDate instanceof Date && !isNaN(startDate) && endDate instanceof Date && !isNaN(endDate)) {
      let resolvedOn = {};
      let dateArray = [];
      dateArray.push(startDate.getFullYear()+"-"+this.pad(startDate.getMonth()+1)+"-"+this.pad(startDate.getDate()));
      dateArray.push(endDate.getFullYear()+"-"+this.pad(endDate.getMonth()+1)+"-"+this.pad(endDate.getDate()));
      resolvedOn.between = dateArray;
      andCond.push(resolvedOn);
    }
    condition.and = andCond;
    filter.where = condition;
    return filter; 
  };

  createChart(response, type) {
    if (response !== undefined && response.Metrics !== undefined && response.Metrics.length > 0) {
      Highcharts.chart(type, this.createData(response, type));
    }
  }

  createData(response, type) {

   let chart = {
      type: 'column'
   };
   let title = {
      text: 'Metrics Calculated Data For '+type
   };
   let subtitle = {
      text: 'Source: UCW Projects'  
   };
   let xAxis = getXAxis(response, this.state.filter);

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
   let series= [];
   let resKey = "metricsData"+type;
   if (this.state.selectedGroup === STELLAR_CONST.COUNT) {
    series = getCountSeries(this.state[resKey], xAxis, this.state.filter, this.state.projects, this.state.priority);
   } else if (this.state.selectedGroup === STELLAR_CONST.AVG) {
    series = getAvgSeries(this.state[resKey], xAxis, this.state.filter, this.state.projects, this.state.priority);
   }
   
   let json = {};   
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

handleChange = name => event => {
  this.setState({
    [name]: event.target.value,
  });
}

changeGroup = event => {
  this.setState({
    selectedGroup: event.target.value}, () => {
      let incidentResKey = "metricsData"+STELLAR_CONST.INCIDENT;
      if (this.state[incidentResKey] !== undefined && this.state[incidentResKey].Metrics.length > 0) {
        this.createChart(this.state[incidentResKey], STELLAR_CONST.INCIDENT);
      }
      let serviceReqResKey = "metricsData"+STELLAR_CONST.SERVICE_REQUEST;
      if (this.state[serviceReqResKey] !== undefined && this.state[serviceReqResKey].Metrics.length > 0) {
        this.createChart(this.state[serviceReqResKey], STELLAR_CONST.SERVICE_REQUEST);
      }
    });
}

changePriority = event => {
  this.setState({
    priority: event.target.value}, () => {
      let incidentResKey = "metricsData"+STELLAR_CONST.INCIDENT;
      if (this.state[incidentResKey] !== undefined && this.state[incidentResKey].Metrics.length > 0) {
        this.createChart(this.state[incidentResKey], STELLAR_CONST.INCIDENT);
      }
      let serviceReqResKey = "metricsData"+STELLAR_CONST.SERVICE_REQUEST;
      if (this.state[serviceReqResKey] !== undefined && this.state[serviceReqResKey].Metrics.length > 0) {
        this.createChart(this.state[serviceReqResKey], STELLAR_CONST.SERVICE_REQUEST);
      }
  });
}

handleClick(event) {
  const { classes } = this.props;
  if (this.state.selectedGroup === "") {
    this.setState({
      selectedGroup: STELLAR_CONST.COUNT,
    });
  }
    this.callApi(STELLAR_CONST.INCIDENT)
        .then(res => {
          let incidentResKey = "metricsData"+STELLAR_CONST.INCIDENT;
          this.setState({
            [incidentResKey]: res.data
          });
          this.createChart(res.data, STELLAR_CONST.INCIDENT);
          this.setState({error:[]});
        })
        .catch(err => {
          if (err.response.status === 500 || err.response.data.error.statusCode === 401) {
            logoutUser();
          } else {
            let call_error = [];
            call_error.push(<MySnackbarContent
              variant="error"
              className={classes.margin}
              message="Error Occurred while getting data"
            />)
            this.setState({error:call_error});
          }
          console.log(err);
        });
    this.callApi('Service Request')
      .then(res => {
        let serviceReqResKey = "metricsData"+STELLAR_CONST.SERVICE_REQUEST;
            this.setState({
              [serviceReqResKey]: res.data
            });
        this.createChart(res.data, STELLAR_CONST.SERVICE_REQUEST);
        this.setState({error:[]});
      })
      .catch(err => {
        if (err.response.status === 500 || err.response.data.error.statusCode === 401) {
            logoutUser();
        } else {
          let call_error = [];
          call_error.push(<MySnackbarContent
            variant="error"
            className={classes.margin}
            message="Error Occurred while getting data"
          />)
          this.setState({error:call_error});
        }
        console.log(err);
      });
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Metrics Summary" appContext={this.props.appContext}/>
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
            <InputLabel htmlFor="select-multiple-checkbox">Project</InputLabel>
            <Select
              multiple
              value={this.state.projects}
              onChange={this.handleChange('projects')}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {this.props.appContext.state.projects.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={this.state.projects.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='project-drop'>Select Project</InputLabel>
            <NativeSelect 
              defaultValue={STELLAR_CONST.COUNT} 
              onChange={(event) => { this.changeGroup(event)}}
              input={<Input id="project-drop" />}
            >
            {STELLAR_CONST.GROUPS.map(group => (
                <option value={group}>{group}</option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor='priority'>Priority</InputLabel>
            <NativeSelect 
              defaultValue={STELLAR_CONST.COUNT} 
              onChange={(event) => { this.changePriority(event)}}
              input={<Input id="priority" />}
            >
            <option value='0'>ALL</option>
            <option value='1'>P1</option>
            <option value='2'>P2</option>
            <option value='3'>P3</option>
            <option value='4'>P4</option>
            <option value='5'>P5</option>
            </NativeSelect>
          </FormControl>
          </form>
          <Button variant="raised" label="Submit" color="primary" primary={true} className={classes.button} onClick={(event) => this.handleClick(event)}>
            Submit
          </Button>
        </MuiThemeProvider>
        <div id = "Incident" className = {classes.main}>
          
        </div>
        <br/>
        <div id = "Service_Request" className = {classes.main}>
          
        </div>
      </div>
    );
  }
};



Dasboard_1.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Dasboard_1);