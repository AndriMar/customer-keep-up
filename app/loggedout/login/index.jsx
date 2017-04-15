import React, {ProtTypes} from 'react';
import style from './login.css';
export const Login = () => {
  return (
      <div className={style.container}>
        <div>
          <span>Username</span>
          <input type="text" />
        </div>
        <div>
          <span>Password</span>
          <input type="password" />
        </div>
        <button>Login</button>
      </div>
  );
};
