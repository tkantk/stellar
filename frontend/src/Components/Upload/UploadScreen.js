import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import '../../Containers/App.css';
import {getCookie} from '../../Utils/Cookie';
import {logoutUser} from '../../Utils/Stellar';

class UploadData extends Component {

  state = {
    response : []
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => {
        console.log(err);
        if (err.response.status === 500 || err.response.data.error.statusCode === 401) {
          logoutUser();
        }
        });
  }

  callApi = async () => {
    let userId = getCookie('stellar_auth');
    const response = axios.get('/api/Metrics/getMetricsData', {
      params: {
        access_token: userId
      }
    })
    return response;
  };

  render() {
    let dataList = undefined;
    if (typeof this.state.response.data !== 'undefined' && this.state.response.data !== '') {
      dataList = this.state.response.data.Metrics;
    }
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
        <ReactTable
          data = {dataList}
          columns = {columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
    );
  }
}

export default UploadData;