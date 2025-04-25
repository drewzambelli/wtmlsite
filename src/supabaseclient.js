// supabaseClient.js - Supabase connection and utility functions
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all members
export async function fetchAllMembers() {
  const { data, error } = await supabase
    .from('member_details')
    .select('*')
    .order('member_state, member_full_name');
  
  if (error) throw error;
  return data;
}

// Fetch a single member by internal_unique_id
export async function fetchMemberById(id) {
  const { data, error } = await supabase
    .from('member_details')
    .select('*')
    .eq('internal_unique_id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Fetch travel reports for a specific member
export async function fetchMemberTravelReports(internalUniqueId) {
  const { data, error } = await supabase
    .from('house_travel_reports')
    .select('*')
    .eq('internal_unique_id', internalUniqueId)
    .order('departuredate', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Search members by name, state, or district
export async function searchMembers(searchTerm) {
  if (!searchTerm.trim()) {
    return fetchAllMembers();
  }
  
  const term = searchTerm.toLowerCase();
  
  const { data, error } = await supabase
    .from('member_details')
    .select('*')
    .or(`member_full_name.ilike.%${term}%,member_state.ilike.%${term}%,member_district.ilike.%${term}%`)
    .order('member_state, member_full_name');
  
  if (error) throw error;
  return data;
}

// Get headshot URL from Supabase storage
export function getHeadshotUrl(filename) {
  if (!filename) return '/placeholder-headshot.png';
  return `${supabaseUrl}/storage/v1/object/public/member-headshots/${filename}`;
}

// Get district map URL from Supabase storage
export function getDistrictMapUrl(filename) {
  if (!filename) return null;
  return `${supabaseUrl}/storage/v1/object/public/district-maps/${filename}`;
}

// Format date for display
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}