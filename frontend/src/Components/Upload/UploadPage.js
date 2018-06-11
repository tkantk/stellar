import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

import UploadData from './UploadScreen';
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

class FileUploadForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {status : ''};
  
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        var formData = new FormData();
        var csvfile = document.querySelector('#file');
        formData.append("file", csvfile.files[0]);
        this.callApi(formData)
        event.preventDefault();
    }

    callApi = async (formData) => {
        axios.post('/api/metrics/uploadExcel', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            this.setState({status : res.data.message})
        }).catch(err => console.log(err))
    };
    
    render() {
      const uploadstatus = this.state.status;
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <ButtonAppBar heading = "Home" appContext={this.props.appContext}/>
          </MuiThemeProvider>
          <div>
            <MuiThemeProvider theme={theme}>
                  <form onSubmit={this.handleSubmit}>
                  <label>
                      Select CSV File:
                      <input type="file" id="file" onChange={this.handleChange} />
                  </label>
                  <input type="submit" value="Submit" />
                  </form>
                  <div>STATUS  :: {uploadstatus}</div>
                <UploadData />
            
            </MuiThemeProvider>
          </div>
        </div>
      );
    }
  }

  FileUploadForm.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(FileUploadForm);