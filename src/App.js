// App.js - Main Application Component
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase client - you'll need to replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members data from Supabase
  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        
        // Query member_details table
        const { data, error } = await supabase
          .from('member_details')
          .select('*')
          .order('member_state, member_full_name');
        
        if (error) throw error;
        
        setMembers(data);
        setFilteredMembers(data);
      } catch (error) {
        console.error('Error fetching member data:', error);
        setError('Failed to fetch member data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMembers();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredMembers(members);
      return;
    }
    
    // Filter members based on search term
    const filtered = members.filter(member => 
      member.member_full_name.toLowerCase().includes(term.toLowerCase()) ||
      (member.member_state && member.member_state.toLowerCase().includes(term.toLowerCase())) ||
      (member.member_district && member.member_district.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredMembers(filtered);
  };

  // Function to get headshot URL from Supabase storage
  const getHeadshotUrl = (filename) => {
    if (!filename) return '/placeholder-headshot.png';
    return `${supabaseUrl}/storage/v1/object/public/member-headshots/${filename}`;
  };

  // Display loading state
  if (loading) {
    return <div className="loading">Loading member data...</div>;
  }

  // Display error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Where's the money Lebowski?</h1>
        <h2>U.S. House of Representatives Tracker</h2>
        <p>Explore travel reports and member information</p>
      </header>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, state, or district..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <main className="members-container">
        <h2>House Members ({filteredMembers.length})</h2>
        
        {filteredMembers.length === 0 ? (
          <p className="no-results">No members found matching "{searchTerm}"</p>
        ) : (
          <div className="members-grid">
            {filteredMembers.map((member) => (
              <a 
                href={`/member/${member.internal_unique_id}`} 
                key={member.internal_unique_id}
                className="member-card"
              >
                <div className="member-image">
                  <img 
                    src={getHeadshotUrl(member.headshot_filename)} 
                    alt={`${member.member_full_name}`} 
                    onError={(e) => {e.target.src = '/placeholder-headshot.png'}} 
                  />
                </div>
                <div className="member-info">
                  <h3>{member.member_full_name}</h3>
                  <p>{member.member_state}{member.member_district ? ` - District ${member.member_district}` : ''}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>Data sourced from official House of Representatives travel reports</p>
        <p>Last updated: 4/25/25<span id="last-updated"></span></p>
      </footer>
    </div>
  );
}

export default App;