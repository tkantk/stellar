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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import axios from 'axios';
import * as Highcharts from "highcharts";

import {getCookie} from '../../Utils/Cookie';
import MySnackbarContent from '../Snackbar/Snackbar';
import ButtonAppBar from '../AppBar/AppBar';
import * as STELLAR_CONST from '../../Constants/StellarConstant';
import {getXAxis, getLineSeries} from '../../Utils/seriesUtil';

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

class Dashboard_2 extends Component {
  constructor(props){
    super(props);
    const { classes } = props;
    this.callApi = this.callApi.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state={
    startDate: "",
    endDate: "",
    error: [],
    projects: this.props.appContext.state.projects,
  };

  getFilter() {
    let filter = {};
    let condition = {};
    let andCond = [];
    let projectsCond = {};
    projectsCond.inq = this.state.projects;
    andCond.push(projectsCond);
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

pad(n) {
    return n < 10 ? "0"+n : n;
}

callApi = async () => {
   let userId = getCookie('stellar_auth');
   let params = { };
   params.access_token = userId;
   params.filter = this.getFilter();
   const response = axios.get('/api/Metrics/getMetricsData', { params });
   return response;
 };

 handleSubmit(event) {
     debugger;
     let _this = this;
     let { classes } = _this.props;
     _this.callApi().then(res => {
        for (let i = 0; i < _this.state.projects.length; i++) {
            _this.createChart(res.data, _this.state.projects[i]);
        }
        _this.setState({error:[]});
     })
     .catch(err => {
        let call_error = [];
        call_error.push(<MySnackbarContent
          variant="error"
          className={classes.margin}
          message="Error Occurred while getting data"
        />)
        _this.setState({error:call_error});
        console.log(err);
      });
 }

createChart(response, project) {
    if (response !== undefined && response.Metrics !== undefined && response.Metrics.length > 0) {
      Highcharts.chart(project, this.createData(response, project));
    }
  }

  createData(response, project) {
    let chart = {
        type: 'line'
    };
    let title = {
       text: 'Metrics Calculated Data For '+project
    };
    let subtitle = {
       text: 'Source: UCW Projects'  
    };
    let xAxis = getXAxis(response, STELLAR_CONST.RESOLVED_ON);
    let yAxis = {
       title: {
          text: 'Data (nos)'         
       }      
    };
    let plotOptions = {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      };  
    let series = getLineSeries(response, xAxis, project);
    
    let json = {};   
    json.chart = chart; 
    json.title = title;   
    json.subtitle = subtitle; 
    json.xAxis = xAxis;
    json.yAxis = yAxis;  
    json.series = series;
    json.plotOptions = plotOptions;  
    return json;
   }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Dashboard Two" appContext={this.props.appContext}/>
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
          </form>
          <Button variant="raised" label="Submit" color="primary" primary={true} className={classes.button} onClick={this.handleSubmit}>
            Submit
          </Button>
        </MuiThemeProvider>
        {this.state.projects.map(project => (
          <div id={project} className = {classes.main}></div>
        ))}
      </div>
    );
  }
}

Dashboard_2.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
export default withStyles(styles, { withTheme: true })(Dashboard_2);
