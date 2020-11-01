import React, { useEffect, useState } from 'react'
import './App.css';
import DriverProfile from './components/DriverProfile';
import Season from './components/Season';


function App() {
  return (
    <div className="App">
    <Season />
    <DriverProfile />
    </div>
  );
}

export default App;
