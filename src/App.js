import React, { Component } from 'react';
import firebase from 'firebase';

import './App.css';
import FileUpload from './fileUpload.js';

class App extends Component {

  constructor () {
      super();
      this.state = {
        user: null,
        pictures: [],
        uploadValue: 0
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
    const storageRef = firebase.storage().ref('fotos/');
    var uploadTask = storageRef.child(`${file.name}`).put(file);

    //var uploadTask = storageRef.child('images/rivers.jpg').put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  let self = this;
  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    self.setState({
      uploadValue: progress
    })
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
    });
  });

  }

  renderLoginButton () {
    // si el user esta logeado
    //console.log(this.state.user);
    if ( this.state.user ) {
      return (
        <div>
          <img width="100px" height="100px" src= { this.state.user.photoURL }/>
          <p> Hola {this.state.user.displayName}! </p>
          <button onClick= { this.handleLogout }>Salir</button>

          <FileUpload onUpload={ this.handleUpload } onChange = {this.state.uploadValue}/>

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
