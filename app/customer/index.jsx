import React, {ProtTypes} from 'react';
import style from './style.css';
var editImage = require('../img/edit.png');
var contact = require('../img/contact.png');
import $ from 'jquery';
import { Row, Col } from 'react-flexbox-grid';
var dateFormat = require('dateformat');

// import axios from 'axios';
// import Messageline from './messageline'
//
// let socket;
export default class List extends React.Component {

  constructor(props) {
    super(props);
    // socket = props.socket
    this.state = {
      customer: props.customer,
      modalIsOpen: false,
      customerEdit:{}
    };
    this.parentEditContact = props.editContact;
  }
  contacted(contact) {
    var urlContacted = '/customer/contact/' + contact.id
    $.ajax({
      url: urlContacted,
      type: 'PUT',
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        console.log('Contacted');
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({error:'Error adding or changing customer'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  editContact(contact) {
    this.parentEditContact(contact);
  }
  getClass(days) {
    if(days == 0){
      return style.green
    } else if(days == 1){
      return style.yellow
    }
    return style.red
  }
  formatDate(d) {
    if(d){
      var theDate = Date(d);
      return dateFormat(theDate, "dddd, mmmm dS, yyyy");
    }
    return "Never";
  }
  componentDidMount() {
    // socket.emit('user:join',{username:this.state.username});
		// socket.on('in:message', this.addNewMessage.bind(this));
		// socket.on('user:join', this.newUser.bind(this));
		// socket.on('user:left', this.userLeft.bind(this));
    // this.scrollDown();
  }

  render() {
    const cust = this.state.customer
    return (
      <Row className={style.row + ' ' + this.getClass(cust.days)}>
        <Col xs={6} md={1}><div className={style.imgContainer}><img onClick={this.contacted.bind(this,cust)} className={style.contactedImg} src={contact}></img></div></Col>
        <Col xs={6} md={3}>{cust.company}</Col>
        <Col xs={6} md={3}>{cust.contact}</Col>
        <Col xs={6} md={3}>{cust.lastContacted}</Col>
        <Col xs={6} md={1}>{cust.days}</Col>
        <Col xs={6} md={1}><div className={style.imgContainer}><img onClick={this.editContact.bind(this,cust)} className={style.editImg} src={editImage}></img></div></Col>
      </Row>
    );
  }
}
