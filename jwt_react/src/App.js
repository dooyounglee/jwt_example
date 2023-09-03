import { useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

  const signup = () => {
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: 1, email: "email@email.com", password: "pass"
      }),
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))
    .catch(e => console.error(e))
    .finally(() => console.log("finally"));
  }

  const login = () => {
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: 1, email: "email@email.com"
      }),
    })
    .then(resp => resp.json())
    .then(resp => {
      sessionStorage.setItem("token", resp.token);
      sessionStorage.setItem("refreshToken", resp.refreshToken);
    })
    .catch(e => console.error(e))
    .finally(() => console.log("finally"));
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  }

  const list = () => {
    fetch("http://localhost:8080/list", {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("token"),
      },
    })
    .then(resp => {
      console.log(resp)
      if (resp.status === 401) {
        console.log("401 뜸")
        fetch("http://localhost:8080/refreshToken", {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            token: sessionStorage.getItem("token"),
            refreshToken: sessionStorage.getItem("refreshToken")
          })
        })
        .then(resp => resp.json())
        .then(resp => {
          console.log(resp)
          sessionStorage.setItem("token", resp.token);
          fetch("http://localhost:8080/list", {
            method: "GET",
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("token"),
            },
          })
          .then(resp => console.log(resp))
          .catch(e => console.error(e))
          .finally(() => console.log("finally"));
        })
        .catch(e => console.error(e))
        .finally(() => console.log("refresh finally"));
      } else {
        return resp.json();
      }
    })
    .then(resp => console.log(resp))
    .catch(e => console.error(e))
    .finally(() => console.log("finally"));
  }

  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={signup}>signup</button>
        <button onClick={login}>login</button>
        <button onClick={logout}>logout</button>
        <button onClick={list}>list</button>
      </header>
    </div>
  );
}

export default App;
