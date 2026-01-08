import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Hero/Hero'; 
import Admin from './pages/Admin';
import Login from './pages/Login';
import RequireAuth from './pages/RequireAuth';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        
          <Route path="/admin" element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
            
            } />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;