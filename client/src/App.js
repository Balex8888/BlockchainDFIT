import React, { useEffect, useState, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";

//components
import LendingHistory from "./components/LendingHistory";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
          // margin: "200 px"
        }}
      >
        First Part Second Part
      </div> */}
      <div className="App-grapharea">
        <h1>DeFi Interest Rates:</h1>
        <LendingHistory />
      </div>

      {/* <div class="row h-100">
        <div class="col-sm-12 my-auto">
          <div class="card card-block w-25">Card</div>
        </div>
      </div> */}
    </div>
  );
}

export default App;
