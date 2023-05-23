import './App.css';
import logo from './assets/Gameface_white.png'
import { pm } from 'postmessage-polyfill';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const originalInterval = window.setInterval;
window.setInterval = function(callback, delay = 0) {
    return originalInterval(callback, delay);
}

window.postMessage = function (message) {
    pm({
        type: message.type,
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit src/App.js and save to reload.
        </p>
        <h1
          className="App-greeting"
        >
          Hello from Coherent Labs
        </h1>
      </header>
    </div>
  );
}

export default App;
