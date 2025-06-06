import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
        if (nickname.trim()) {
            localStorage.setItem('nickname', nickname.trim());
        }
    navigate('/editor');
    };

  return (
    <div className="d-flex flex-column vh-100 justify-content-start align-items-center bg-light">
        <div className='w-100 d-flex align-items-center justify-content-center p-5'>
            <h1 className='fw-bold'>Deckly</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-5 border bg-white rounded-4 d-flex flex-column align-items-center w-25 shadow p-3 my-5 bg-body-tertiary rounded">
            <h4 className="mb-5 text-secondary-emphasis fw-light">Enter your nickname</h4>
                <input
                type="text"
                className="form-control mb-5 w-75"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                />
            <button type="submit" className="btn btn-outline-danger w-75">Join</button>
        </form>
    </div>
  );
}

export default AuthPage;