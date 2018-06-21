import React, { Component } from 'react';
import firebase from 'firebase';

import './App.css';
import FileUpload from './fileUpload.js';

class App extends Component {

  constructor () {
      super();
      this.state = {
        user: null,
        pictures: []
      };

      this.handleAuth = this.handleAuth.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged( user => {
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload (event) {
    const file =  event.target.files[0];
    const storageRef = firebase.storage().ref('/fotos/');
    var task = storageRef.child(`${file.name}`).put(file);

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        uploadValue: percentage
      })
    }, (error) => {
      console.error(error.message)
    }, () => {/*
      console.log(task.snapshot);
      storageRef.child(file.name).getDownloadURL().then((url) => {
        this.setState({
          picture: url
        })
      })*/
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }
      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });

  }﻿

  renderLoginButton () {
    // si el user esta logeado
    if ( this.state.user ) {
      return (
        <div>
          <img width="100px" height="100px" src= { this.state.user.photoURL}/>
          <p> Hola {this.state.user.displayName}! </p>
          <button onClick= { this.handleLogout }>Salir</button>


          <FileUpload onUpload={ this.handleUpload }/>

          {
            this.state.pictures.map(picture => {
              <div >
                <img src={ picture.image } /><br/>
                <img src={ picture.photoURL }/><br/>
              <span>{ picture.displayName}</span>
              </div>
            })
          }
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
