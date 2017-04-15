import React, {ProtTypes} from 'react';
import style from './style.css';
var editImage = require('../img/add.png');
import Modal from '../modal';
// import axios from 'axios';
// import Messageline from './messageline'
//
// let socket;
export default class List extends React.Component {

  constructor(props) {
    super(props);
    // socket = props.socket
    this.state = {
    };
  }
  addContact() {
    var contact = {
      company:'',
      contact:'',
      phone:'',
      address:''}
    this.refs.modal.openModal(contact)
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
        <div className={style.head}>Icemark</div>
          <img onClick={this.addContact.bind(this)} className={style.addImg} src={editImage}></img>
          <Modal ref="modal"></Modal>
      </div>
    );
  }
}
