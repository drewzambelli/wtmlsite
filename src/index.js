// index.js - Main entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import MemberDetail from './MemberDetail';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/member/:id" element={<MemberDetail />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);









// // index.js - Main entry point
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { HashRouter, Routes, Route } from 'react-router-dom'; // Change to HashRouter

// import './index.css';
// import App from './App';
// import MemberDetail from './MemberDetail';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/member/:id" element={<MemberDetail />} />
//       </Routes>
//     </HashRouter>
//   </React.StrictMode>
// );



