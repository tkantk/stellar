import React from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UploadData from './UploadScreen';

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
        console.log(this.state)
      return (
        <MuiThemeProvider>
          <div>
              <form onSubmit={this.handleSubmit}>
              <label>
                  Select CSV File:
                  <input type="file" id="file" onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
              </form>
              <div>STATUS  :: {uploadstatus}</div>
            <UploadData />
          </div>
        </MuiThemeProvider>
      );
    }
  }

  export default FileUploadForm;