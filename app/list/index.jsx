import React, {ProtTypes} from 'react';
import style from './style.css';
import Customer from '../customer';
import Modal from '../modal';
import $ from 'jquery'
import { Grid, Row, Col } from 'react-flexbox-grid';


// import axios from 'axios';
// import Messageline from './messageline'
//
// let socket;
export default class List extends React.Component {

  constructor(props) {
    super(props);
    // socket = props.socket
    this.state = {
      customers: []
    };
    this.editContact = this.editContact.bind(this);
  }
  componentDidMount() {
    $.ajax({
      url: '/customer',
      type: 'GET',
      success: function(customers) {
        console.log(customers)
        this.setState({customers})
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({error:'Error adding or changing customer'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    // socket.emit('user:join',{username:this.state.username});
		// socket.on('in:message', this.addNewMessage.bind(this));
		// socket.on('user:join', this.newUser.bind(this));
		// socket.on('user:left', this.userLeft.bind(this));
    // this.scrollDown();
  }
  editContact(contact) {
    console.log('Contact:',contact);
    this.refs.modal.openModal(contact)
  }

  render() {
    return (
      <div className={style.container}>
        <Grid fluid>
          <Row>
            <Col className={style.headder} xs={1} md={1} lg={1}>Contacted</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Company</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Contact</Col>
            <Col className={style.headder} xs={3} md={3} lg={3}>Last contact</Col>
            <Col className={style.headder} xs={1} md={1} lg={1}>Days</Col>
            <Col className={style.headder} xs={1} md={1} lg={1}>Edit</Col>
          </Row>
          {this.state.customers.map(cust =>
            <Customer key={cust.id} editContact={this.editContact} customer={cust}></Customer>
          )}
        </Grid>
          <Modal ref="modal"></Modal>
      </div>
    );
  }
}
