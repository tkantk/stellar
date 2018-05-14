import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import logo from './logo.svg';
import './App.css';
import FileUploadForm from './FileUploadForm';

class App extends Component {

  state = {
    response : [],
    fileupload : []
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = axios.get('/api/metrics')
    return response;
  };

  render() {
    //const {data} = this.state.response;
    const dataList = this.state.response.data
    const columns = [
      {
        Header: 'Business Unit',
        accessor: 'Business Unit'
      },{
        Header: 'Project',
        accessor: 'Project'
        },{
        Header: 'Account',
        accessor: 'Account'
        },{
        Header: 'Category',
        accessor: 'Category'
        },{
        Header: 'Priority',
        accessor: 'Priority'
        },{
        Header: 'TicketID',
        accessor: 'TicketID'
        },{
        Header: 'Ticket Description',
        accessor: 'Ticket Description'
        },{
        Header: 'Resolved On',
        accessor: 'Resolved On'
        },{
        Header: 'Response Time',
        accessor: 'Response Time'
        },{
        Header: 'Resolution Time',
        accessor: 'Resolution Time'
        }
    ]
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <div>
              <FileUploadForm />
          </div>
        <ReactTable
          data = {dataList}
          columns = {columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
      </div>
    );
  }
}


export default App;