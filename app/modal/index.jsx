import React, {ProtTypes} from 'react';
import style from './style.css';
import Modal from 'react-modal';
// import axios from 'axios';
// import Messageline from './messageline'
//
// let socket;
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    width                 : '300px',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
export default class List extends React.Component {
  constructor() {
      super();

      this.state = {
        modalIsOpen: false,
        customer: {}
      };

      this.openModal = this.openModal.bind(this);
      this.afterOpenModal = this.afterOpenModal.bind(this);
      this.closeModal = this.closeModal.bind(this);

      this.editCompany = this.editCompany.bind(this);
      this.editContact = this.editContact.bind(this);
      this.editPhone = this.editPhone.bind(this);
      this.editAddress = this.editAddress.bind(this);
      this.addUpdate = this.addUpdate.bind(this);
    }
    addUpdate(event) {
      event.preventDefault();
      console.log(this.state.customer)
    }
    openModal(customer) {
      this.setState({modalIsOpen: true, customer});
    }

    afterOpenModal() {
      // references are now sync'd and can be accessed.
      //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
      event.preventDefault();
      this.setState({modalIsOpen: false});
    }

    editCompany(event) {
      var customer = this.state.customer;
      customer.company = event.target.value;
      this.setState({customer})
    }

    editContact(event) {
      var customer = this.state.customer;
      customer.contact = event.target.value;
      this.setState({customer})
    }

    editPhone(event) {
      var customer = this.state.customer;
      customer.phone = event.target.value;
      this.setState({customer})
    }

    editAddress(event) {
      var customer = this.state.customer;
      customer.address = event.target.value;
      this.setState({customer})
    }
    render() {
      var customer = this.state.customer;
      return (
        <div className={style.container}>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Edit contact"
          >

            <h2 ref="subtitle">{customer.id?'Edit contact':'Add contact'}</h2>
            <form onSubmit={this.addUpdate}>
              <hidden name='id' value={customer.id}></hidden>
              <div className={style.inputContainer}>
                <lable className={style.lableStyle}>Company:</lable>
                <input type='text' className={style.inputStyle} value={customer.company} name='company' onChange={this.editCompany}></input>
              </div>
              <div className={style.inputContainer}>
                <lable className={style.lableStyle}>Contact:</lable>
                <input type='text' className={style.inputStyle} value={customer.contact} name='contact' onChange={this.editContact}></input>
              </div>
              <div className={style.inputContainer}>
                <lable className={style.lableStyle}>Phone:</lable>
                <input type='text' className={style.inputStyle} value={customer.phone} name='phone' onChange={this.editPhone}></input>
              </div>
              <div className={style.inputContainer}>
                <lable className={style.lableStyle}>Address:</lable>
                <input type='text' className={style.inputStyle} value={customer.address} name='address' onChange={this.editAddress}></input>
              </div>
              <button className={style.buttonStyle + ' '+ style.buttonSave}>Save</button>
              <button className={style.buttonStyle + ' '+ style.buttonCancel} onClick={this.closeModal}>Cancel</button>
            </form>
          </Modal>
        </div>
      );
    }
}
