import React, { useState } from 'react';

const NicknameOverlay = ({ onSubmit = () => {} }) => {
    const [nickname, setNickname] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const trimmed = nickname.trim();
      if (trimmed) {
        if (typeof onSubmit === 'function') {
          onSubmit(trimmed);
        } 
      }
    };
  
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow d-flex flex-column align-items-center">
          <h4 className="mb-4 fw-bold">Deckly</h4>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-danger w-100">Join</button>
        </form>
      </div>
    );
  };
  
  export default NicknameOverlay;