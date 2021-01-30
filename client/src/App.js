import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/header/header.component';
import MainPage from './pages/mainpage/mainpage.component';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Header />
        <MainPage />
      </div>
    </Router>
  );
};

export default App;
