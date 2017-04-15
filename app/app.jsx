import React, {ProtTypes} from 'react';
import style from './style.css';
import List from './list';
import Head from './head';
export const App = () => {
  return (
    <div className={style.container}>
      <Head />
      <div>
        <List />
      </div>
    </div>
  );
};
