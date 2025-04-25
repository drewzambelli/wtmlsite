
// MemberDetail.js - Placeholder for member detail page
import React from 'react';
import { useParams, Link } from 'react-router-dom';

function MemberDetail() {
  const { id } = useParams();
  
  return (
    <div className="app">
      <header className="header">
        <h1>U.S. House of Representatives Travel Tracker</h1>
        <nav>
          <Link to="/" className="back-link">← Back to All Members</Link>
        </nav>
      </header>
      
      <main className="member-detail-container">
        <div className="loading">
          Member detail page for ID: {id} is under construction.
          <p>This page will display biographical information and travel reports for this member.</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>Data sourced from official House of Representatives travel reports</p>
        <p>Last updated: <span id="last-updated"></span></p>
      </footer>
    </div>
  );
}

export default MemberDetail;