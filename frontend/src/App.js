import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [note, setNote] = useState("");

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username: email.split('@')[0],
        email: email,
        interests: [interest]
      });
      setUser(res.data);
      alert("Joined Trellis!");
    } catch (err) {
      console.error(err);
      alert("Backend not connected, but UI is working!");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#2ecc71' }}>Trellis 🌿</h1>
      <p>Community-Based Learning Platform</p>
      
      {!user ? (
        <div style={{ marginTop: '20px' }}>
          <input 
            style={{ padding: '10px', margin: '5px' }} 
            placeholder="Email" 
            onChange={e => setEmail(e.target.value)} 
          />
          <br />
          <input 
            style={{ padding: '10px', margin: '5px' }} 
            placeholder="Topic (e.g. ECE)" 
            onChange={e => setInterest(e.target.value)} 
          />
          <br />
          <button 
            style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            onClick={login}
          >
            Join Community
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <h2>Welcome, {user.username}</h2>
          <textarea 
            style={{ width: '80%', height: '100px', padding: '10px' }} 
            placeholder="Paste notes here..." 
            onChange={e => setNote(e.target.value)} 
          />
          <br />
          <button style={{ padding: '10px', marginTop: '10px' }}>AI Summarize (Demo)</button>
        </div>
      )}
    </div>
  );
}

export default App;