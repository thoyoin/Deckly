import React, { useState } from 'react';

function AuthPage({ onSubmit }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <form onSubmit={handleSubmit} className="p-5 border bg-white rounded-4 d-flex flex-column align-items-center w-25">
        <h4 className="mb-5 text-secondary-emphasis">Enter your nickname</h4>
        <input
          type="text"
          className="form-control mb-5 w-75"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit" className="btn btn-outline-warning w-75">Join</button>
      </form>
    </div>
  );
}

export default AuthPage;