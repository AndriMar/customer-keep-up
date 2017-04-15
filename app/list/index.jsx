import React, {ProtTypes} from 'react';
import style from './style.css';
import Customer from '../customer';
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
      customers: [
        {id:1,phone:"1212121",company:"sky9",contact:"Sisso",address:"USAUSAUSA",lastContact:"04.08.2016",days:4},
        {id:2,phone:"343434",company:"sky10",contact:"Snæja",address:"Danmark",lastContact:"04.08.2016",days:3},
        {id:3,phone:"5656565665",company:"sky11",contact:"Erla",address:"Berjarimi 24",lastContact:"04.08.2016",days:2},
        {id:4,phone:"7878787",company:"sky12",contact:"Gugga",address:"Kef",lastContact:"04.08.2016",days:1}]
    };
    this.editContact = this.editContact.bind(this);
  }
  componentDidMount() {
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
        <div>
            <div className={style.company+' '+style.listItem}>Company</div>
            <div className={style.contact+' '+style.listItem}>Contact</div>
            <div className={style.last+' '+style.listItem}>Last contact</div>
            <div className={style.days+' '+style.listItem}>Days</div>
            <div className={style.edit+' '+style.listItem}>Edit</div>
        </div>
          {this.state.customers.map(cust =>
            <Customer key={cust.id} editContact={this.editContact} customer={cust}></Customer>
          )}
          <Modal ref="modal"></Modal>
      </div>
    );
  }
}
