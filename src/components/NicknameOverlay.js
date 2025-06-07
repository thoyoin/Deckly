import React, { useState, useEffect } from 'react';

const NicknameOverlay = ({ onSubmit = () => {} }) => {
    const [nickname, setNickname] = useState('');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setVisible(false);
            onSubmit(storedNickname);
        }
      }, [onSubmit]);
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = nickname.trim();
        if (trimmed) {
            localStorage.setItem('nickname', trimmed); 
            setVisible(false); 
            onSubmit(trimmed);
        }
    };

    if (!visible) return null;
  
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
        <form onSubmit={handleSubmit} style={{width:'300px'}} className="p-4 bg-white rounded shadow d-flex flex-column align-items-center">
          <h4 className="mb-4 fw-bold">Deckly</h4>
          <input
            type="text"
            className="form-control mb-4 w-75"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-danger w-25">Join</button>
        </form>
      </div>
    );
  };
  
  export default NicknameOverlay;