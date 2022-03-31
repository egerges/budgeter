// Importing modules
import './App.css';
import { 
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Login from './Login/Login';
import Register from './Register/Register';
import Reset from './Reset/Reset';
import Dashboard from './Dashboard/Dashboard';
import Income from './Income/Income';
import Expenses from './Expenses/Expenses';

function App() {
  return (
  <div className="App">
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/income" element={<Income />} />
        <Route exact path="/expenses" element={<Expenses />} />
      </Routes>
    </Router>
  </div>
  );
}

export default App;
