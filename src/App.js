import React, { Component } from 'react';
import firebase from 'firebase';

import './App.css';
import FileUpload from './fileUpload.js';

class App extends Component {

  constructor () {
      super();
      this.state = {
        user: null
      };
      this.handleAuth = this.handleAuth.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged( user => {
      this.setState({ user });
    });
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider(); //provedor para Google
    firebase.auth().signInWithPopup(provider)
      .them(result => console.log(`${result.user.email} ha inisiado sesion`))
      .catch(error => console.log(`Error ${error.code}: ${error.massage}`));
  }

  handleLogout () {
    firebase.auth().signOut()
      .them(result => console.log(`${result.user.email} ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.massage}`));
  }

  renderLoginButton () {
    // si el user esta logeado
    if ( this.state.user ) {
      return (
        <div>
          <img width="100px" height="100px" src= { this.state.user.photoURL}/>
          <p> Hola {this.state.user.displayName}! </p>
          <button onClick= { this.handleLogout }>Salir</button>
          <FileUpload/>
        </div>
      );
    }else {
      return( <button onClick={ this.handleAuth }>Login con Google</button> );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
          { this.renderLoginButton() }
      </div>
    );
  }
}

export default App;
