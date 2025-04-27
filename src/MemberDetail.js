// MemberDetail.js - Member Biographical Information Component
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './MemberDetail.css';

// Initialize Supabase client - you'll need to replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function MemberDetail() {
  const { id } = useParams(); // Get the member ID from the URL
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch member data from Supabase
  useEffect(() => {
    async function fetchMemberDetails() {
      try {
        setLoading(true);
        
        // Query member_details table for the specific member
        const { data, error } = await supabase
          .from('member_details')
          .select('*')
          .eq('internal_unique_id', id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          throw new Error('Member not found');
        }
        
        setMember(data);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to fetch member details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMemberDetails();
  }, [id]);

  // Function to get headshot URL from Supabase storage
  const getHeadshotUrl = (filename) => {
    if (!filename) return '/placeholder-headshot.png';
    return `${supabaseUrl}/storage/v1/object/public/member-headshots/${filename}`;
  };

  // Format hometown with state (minus last 4 characters of state)
  const formatHometown = () => {
    if (!member || !member.member_hometown) return null;
    
    let hometown = member.member_hometown;
    if (member.member_state && member.member_state.length >= 4) {
      // Concatenate hometown with state minus last 4 characters
      const stateAbbrev = member.member_state.slice(0, -4);
      hometown = `${hometown}, ${stateAbbrev}`;
    }
    
    return hometown;
  };

  // Display loading state
  if (loading) {
    return <div className="loading">Loading member details...</div>;
  }

  // Display error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Display not found state
  if (!member) {
    return <div className="not-found">Member not found</div>;
  }

  return (
    <div className="member-detail-page">
      <header className="member-detail-header">
        <Link to="/" className="back-button">← Back to Members</Link>
        <h1>Member Details</h1>
      </header>
      
      <div className="member-profile">
        <div className="member-header">
          <div className="member-headshot">
            <img 
              src={getHeadshotUrl(member.headshot_filename)} 
              alt={`${member.member_full_name}`} 
              onError={(e) => {e.target.src = '/placeholder-headshot.png'}} 
            />
          </div>
          
          <div className="member-bio">
            <h2>{member.member_full_name}</h2>
            <div className="member-info-grid">
              <div className="info-label">State:</div>
              <div className="info-value">{member.member_state}</div>
              
              {member.member_district && (
                <>
                  <div className="info-label">District:</div>
                  <div className="info-value">{member.member_district}</div>
                </>
              )}
              
              {member.member_hometown && (
                <>
                  <div className="info-label">Hometown:</div>
                  <div className="info-value">{formatHometown()}</div>
                </>
              )}
              
              {member.member_contact && (
                <>
                  <div className="info-label">Contact:</div>
                  <div className="info-value">{member.member_contact}</div>
                </>
              )}
              
              {member.member_phone && (
                <>
                  <div className="info-label">Phone:</div>
                  <div className="info-value">{member.member_phone}</div>
                </>
              )}
              
              {member.member_website && (
                <>
                  <div className="info-label">Website:</div>
                  <div className="info-value">
                    <a href={member.member_website} target="_blank" rel="noopener noreferrer">
                      {member.member_website}
                    </a>
                  </div>
                </>
              )}
              
              {member.member_email && (
                <>
                  <div className="info-label">Email:</div>
                  <div className="info-value">
                    <a href={`mailto:${member.member_email}`}>
                      {member.member_email}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="member-detail-footer">
        <p>Data sourced from official House of Representatives records</p>
        <p>Last updated: 4/25/25<span id="last-updated"></span></p>
      </footer>
    </div>
  );
}

export default MemberDetail;