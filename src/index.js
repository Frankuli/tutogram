import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
  apiKey: 'AIzaSyCiTffAJ_bnZRmAL6A0BYiLgJ8xlHVa4WU',
  authDomain: 'tutogram-572ed.firebaseapp.com',
  databaseURL: 'https://tutogram-572ed.firebaseio.com',
  projectId: 'tutogram-572ed',
  storageBucket: 'tutogram-572ed.appspot.com',
  messagingSenderId: '781337219341',
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
