import React, {ProtTypes} from 'react';
import style from './style.css';
import Customer from '../customer';
import Modal from '../modal';
import $ from 'jquery'
import { Grid, Row, Col } from 'react-flexbox-grid';
var io = require("socket.io-client")("/");




// import axios from 'axios';
// import Messageline from './messageline'
//
// let socket;
export default class List extends React.Component {

  constructor(props) {
    super(props);
    // socket = props.socket
    this.state = {
      customers: [],
      filterText:''
    };
    this.editContact = this.editContact.bind(this);
    this.editFilter = this.editFilter.bind(this);
  }
  componentDidMount() {
    $.ajax({
      url: '/customer',
      type: 'GET',
      success: function(customers) {
        this.setState({customers});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({error:'Error adding or changing customer'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    io.on('customerList', (customers) => {
      this.setState({customers:[]},function () {
        this.setState({customers})
      });
    });
  }

  editContact(contact) {
    this.refs.modal.openModal(contact)
  }

  editFilter(event) {
    var filterText = event.target.value;
    this.setState({filterText})
  }

  render() {
    var that = this;
    var customersDisplay = this.state.customers.map(function(cust) {
      var lowCase = cust.company.toLowerCase();
      var lowSearch = that.state.filterText.toLowerCase();
      var regEx = '.*'+lowSearch+'.*';
      if (that.state.filterText === '' || lowCase.toLowerCase().match(regEx)) {
        return <Customer key={cust.id} editContact={that.editContact} customer={cust}></Customer>
      }
    })
    return (
      <div className={style.container}>
        <input type="text" autoComplete='false' placeholder='Search...' className={style.search} value={this.state.filterText} name='company' onChange={this.editFilter}/>
        <Grid fluid>
          <Row>
            <Col className={style.headder} xs={1} md={1} lg={1}>Contacted</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Company</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Contact</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Last contact</Col>
            <Col className={style.headder} xs={1} md={1} lg={1}>Days</Col>
            <Col className={style.headder} xs={1} md={1} lg={1}>Edit</Col>
          </Row>
          {customersDisplay}
        </Grid>
          <Modal ref="modal"></Modal>
      </div>
    );
  }
}
