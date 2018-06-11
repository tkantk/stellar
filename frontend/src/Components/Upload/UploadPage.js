import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/FileUpload';

import UploadData from './UploadScreen';
import ButtonAppBar from '../AppBar/AppBar';
import MySnackbarContent from '../Snackbar/Snackbar';
import {getCookie} from '../../Utils/Cookie';
import typographyStyle from '../../assets/jss/material-kit-react/views/componentsSections/typographyStyle.jsx';

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
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    margin: {
      marginTop: theme.spacing.unit,
      margin: 'auto',
    },
  });

class FileUploadForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status : '',
        uploadError: '',
        uploadSuccess: '',
    };
  
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
      const { classes } = this.props;
      let userId = getCookie('stellar_auth');
        axios.post('/api/metrics/uploadExcel?access_token='+userId, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            this.setState({status : res.data.message});
            let success = [];
            success.push(<MySnackbarContent
              variant="success"
              className={classes.margin}
              message="File Upload Successfull"
            />)
            this.setState({uploadSuccess:success});
        }).catch(err => {
          console.log(err);
          let error = [];
          error.push(<MySnackbarContent
            variant="error"
            className={classes.margin}
            message="File Upload Error"
          />)
          this.setState({uploadSuccess:error});
        })
    };
    
    render() {
      const { classes } = this.props;
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <ButtonAppBar heading = "Home" appContext={this.props.appContext}/>
          </MuiThemeProvider>
          <div>
            <MuiThemeProvider theme={theme}>
              <div className={classes.typo}>
                <h2 className={classes.title}>Upload your Excel below</h2>
              </div>
              {this.state.uploadError}
              {this.state.uploadSuccess}
              <form onSubmit={this.handleSubmit}>
                <div className={classes.typo}>
                  <h4 className={classes.note}>Select CSV File: 
                    <input 
                      type="file" 
                      id="file" 
                      onChange={this.handleChange} />
                  <Button type="submit" variant="raised" color="primary" className={classes.button}>
                    Upload
                    <FileUpload className={classes.rightIcon} />
                  </Button>
                </h4>
                </div>
              </form>
            </MuiThemeProvider>
              <div>
                <UploadData />
              </div>
          </div>
        </div>
      );
    }
  }

  FileUploadForm.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles, typographyStyle)(FileUploadForm);