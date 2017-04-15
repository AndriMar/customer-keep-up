import React, {PropTypes} from 'react';
import {render} from 'react-dom';

const LoggedIn = ({message}) => {
  return (
    <div>Hello {message}</div>
  );
};

// class HelloMessage extends React.Component {
//   render() {
//     return <div>Hello {this.props.name}</div>;
//   }
// }
//
//render(<HelloMessage name="Jansadasdase" />, document.body );
