import logo from './logo.svg';
import './App.css';
import * as EgovNet from './util/util'

function App() {

  const signup = () => {
      const retrieveDetailURL = '/signup';
      const requestOptions = {
          method: "POST",
          headers: {
              'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: "email13@email.com", password: "pass"
          })
      };

      EgovNet.requestFetch(retrieveDetailURL,
          requestOptions,
          function (resp) {
              console.log(resp);
          }
      );
  }

  const login = () => {
      const retrieveDetailURL = '/login';
      const requestOptions = {
          method: "POST",
          headers: {
              'Content-type': 'application/json',
          },
          body: JSON.stringify({
              id: 1, email: "email@email.com"
          })
      };

      EgovNet.requestFetch(retrieveDetailURL,
          requestOptions,
          function (resp) {
              sessionStorage.setItem("token", resp.token);
              sessionStorage.setItem("refreshToken", resp.refreshToken);
              alert("로그인 완료");
          }
      );
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  }

  const list = () => {
      const retrieveDetailURL = '/list';
      const requestOptions = {
          method: "GET",
          headers: {
              'Content-type': 'application/json',
          }
      };

      EgovNet.requestFetch(retrieveDetailURL,
          requestOptions,
          function (resp) {
            console.log(resp);
          }
      );
  }

  const get = () => {
    const retrieveDetailURL = '/get';
    const requestOptions = {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
        }
    };

    EgovNet.requestFetch(retrieveDetailURL,
        requestOptions,
        function (resp) {
          console.log(resp);
        }
    );
}

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
        <button onClick={get}>get</button>
      </header>
    </div>
  );
}

export default App;
