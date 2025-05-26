
// src/App.js
import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser){
        loadFiles();
      } else {
        setFilesList([]);
      }
    });
  }, []);

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error.message));
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error.message));
  };

  const logout = () => {
    signOut(auth);
  };

  const uploadFile = () => {
    if(!file) return alert("Select a file first");
    const storageRef = ref(storage, `${user.uid}/${file.name}`);
    uploadBytes(storageRef, file)
    .then(() => {
      alert("File uploaded!");
      loadFiles();
    })
    .catch((err) => alert(err.message));
  };

  const loadFiles = () => {
    const listRef = ref(storage, `${user.uid}/`);
    listAll(listRef)
    .then((res) => {
      const promises = res.items.map(itemRef => getDownloadURL(itemRef).then(url => ({name: itemRef.name, url})));
      Promise.all(promises).then(files => setFilesList(files));
    })
    .catch(err => alert(err.message));
  };

  return (
    <div style={{maxWidth:'600px', margin:'auto', padding:'20px'}}>
      <h1>Storagebox</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
          <hr />
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button onClick={uploadFile}>Upload File</button>
          <h3>Your Files:</h3>
          <ul>
            {filesList.map(file => (
              <li key={file.name}>
                <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <br />
          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}

export default App;
