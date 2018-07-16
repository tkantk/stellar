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
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';

import axios from 'axios';
import * as Highcharts from "highcharts";

import {getCookie} from '../../Utils/Cookie';
import MySnackbarContent from '../Snackbar/Snackbar';
import ButtonAppBar from '../AppBar/AppBar';
import {getProjectsAssigned} from '../../Utils/Stellar';

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
    this.state={
      seriesCategories: ['count', 'avg', 'min', 'max'],
      startDate: "",
      endDate: "",
      error: [],
      monthInterval: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      projects: props.appContext.state.projects,
    }
  }

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
   let series= this.getSeries(response, xAxis);

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
   let responseArray = response.Metrics;
   responseArray.sort(this.date_sort_asc);
   for (let i = 0; i < responseArray.length; i++) {
    let resolvedOn = new Date(responseArray[i]["Resolved On"]);
    let resolvedOnMonth = this.state.monthInterval[resolvedOn.getMonth()];
    let resolvedYear = resolvedOn.getFullYear();
    let categoryObj = resolvedOnMonth+" - "+resolvedYear;
    if (categories.indexOf(categoryObj) === -1) {
      categories.push(categoryObj);
    }
   }
   xAxixObj = {
     "categories": categories,
     "crosshair": true
   };
   return xAxixObj;
   }

  date_sort_asc = function (obj1, obj2) {
    let obj1Date = new Date(obj1["Resolved On"]);
    let obj2Date = new Date(obj2["Resolved On"]);
    if (obj1Date > obj2Date) return 1;
    if (obj1Date < obj2Date) return -1;
    return 0;
  };

  getSeries(response, xAxis) {
    let series = [];
    let projects = this.state.projects;
    for (let i=0; i < projects.length; i++) {
      let name = projects[i];
      let data = [];
      for (let h = 0; h < xAxis.categories.length; h++) {
        let monthYear = xAxis.categories[h];
        let count = 0;
        for(let j=0;j<response.Metrics.length;j++) {
          let obj = response.Metrics[j];
          if (obj.Account === name) {
            let resolvedOn = new Date(obj["Resolved On"]);
            let resolvedOnMonth = this.state.monthInterval[resolvedOn.getMonth()];
            let resolvedYear = resolvedOn.getFullYear();
            let resolvedObj = resolvedOnMonth+" - "+resolvedYear;
            if ((resolvedObj === monthYear)) {
              count++;
            }
          }
        }
        data.push(count);
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
  /*if (this.checkFormData()) {*/
    this.callApi('Incident')
        .then(res => {
          this.createChart(res.data, 'Incident');
          this.setState({error:[]});
        })
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
    this.callApi('Service Request')
    .then(res => {
      this.createChart(res.data, 'Service_Request');
      this.setState({error:[]});
    })
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
  /*}*/
}
/*
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
*/
  render() {
    const { classes } = this.props;

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <ButtonAppBar heading = "Dashboard One" appContext={this.props.appContext}/>
        </MuiThemeProvider>
        <br/>
        <div className={classes.container}>
        <MuiThemeProvider theme={theme}>
        {this.state.error}
        <form autoComplete="off">
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
          </form>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-checkbox">Project</InputLabel>
            <Select
              multiple
              value={this.state.projects}
              onChange={this.handleChange('project')}
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
      </div>
    );
  }
};



Dasboard_1.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Dasboard_1);