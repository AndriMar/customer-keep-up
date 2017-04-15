import React, {ProtTypes} from 'react';
import style from './style.css';
var editImage = require('../img/edit.png');
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
  editContact(contact) {
    this.parentEditContact(contact);
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
      <div className={style.container}>
          <div className={style.company+' '+style.listItem}>{cust.company}</div>
          <div className={style.contact+' '+style.listItem}>{cust.contact}</div>
          <div className={style.last+' '+style.listItem}>{cust.lastContact}</div>
          <div className={style.days+' '+style.listItem}>{cust.days}</div>
          <div className={style.edit+' '+style.listItem}><img onClick={this.editContact.bind(this,cust)} className={style.editImg} src={editImage}></img></div>
      </div>
    );
  }
}
