import React, {useState} from 'react'
import Marquee from "react-fast-marquee";
import NicknameOverlay from './NicknameOverlay';

const Home = () => {
    const [nickname, setNickname] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinId, setJoinId] = useState('');

    const images = [
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
        "/images/4.png",
        "/images/5.png"
      ];


  return (
    <>
        {!nickname && <NicknameOverlay onSubmit={(nickname) => setNickname(nickname)} />}
        {showJoinModal && (
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (joinId.trim()) {
                        window.location.href = `/presentation/${joinId.trim()}`;
                    }
                }} 
                style={{width:'300px'}} 
                className="p-4 bg-white rounded shadow d-flex flex-column align-items-center">
                  <h4 className="mb-4 fw-bold">Enter the room ID</h4>
                  <input
                        type="text"
                        className="form-control mb-4 w-75"
                        placeholder="ID"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                  />
                  <div className='d-flex flex-row gap-3'>
                      <button style={{width:'80px'}} type="submit" className="btn btn-outline-danger">Join</button>
                      <button style={{width:'80px'}} type="button" className="btn btn-outline-danger"
                            onClick={() => setShowJoinModal(false)}
                      >Cancel</button>
                  </div>
                </form>
              </div>
        )}

        <div className='container-fluid bg-light vh-100 m-0 px-0 d-flex flex-column justify-content-center' style={{ filter: !nickname ? 'blur(5px)' : 'none' }}>
            <div style={{top:'0px'}} className='m-0 p-1 d-flex justify-content-between align-items-center position-fixed w-100' >
                <img style={{width:'60px'}} src='/images/logo.png'></img>
                <div className='dropdown'>
                    <button 
                    className='btn btn-outline-danger rounded-3 p-0 d-flex justify-content-center align-items-center me-3' 
                    style={{width:'40px', height:'40px'}}
                    type='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    >
                        <i class="bi bi-person-circle fs-2"></i>
                    </button>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        <li>
                            <h5 className='p-1 text-center fw-bolder'>{nickname}</h5>
                            <button
                                className='btn btn-outline-danger dropdown-item'
                                onClick={()=> {
                                    localStorage.removeItem('nickname');
                                    window.location.reload();
                                }}
                            >
                                Change nickname
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
                <div className='w-100 d-flex align-items-center justify-content-center p-5'>
                    <h1 className='fw-bolder'>Create with Deckly!</h1>
                </div>
                <div className='d-flex w-100 flex-column align-items-center justify-content-center' style={{zIndex:'2'}}>
                    <h2 className='fw-light'>Get Started</h2>
                    <div className='d-flex flex-row column-gap-4 mt-5'>
                        <button
                            type="button"
                            className="btn btn-outline-danger fs-5 fw-lighter"
                            onClick={() => {
                                const newId = Math.random().toString(36).substring(2, 8);
                              window.location.href = `/presentation/${newId}`;
                            }}
                        >
                            <i className="bi bi-plus-square-dotted me-2"></i>
                            Create new
                        </button>
                        <button 
                            type="button" 
                            class="btn btn-outline-danger fs-5 fw-lighter"
                            onClick={() => setShowJoinModal(true)}
                            >
                            <i class="bi bi-person-plus me-2"></i>
                            Join existing</button>
                    </div>
                </div>
                    <div className='container-fluid p-0' >
                        <Marquee speed={50} gradient={false} pauseOnHover={false} gradientColor='#f8f9fa' gradientWidth={10} direction='left'>
                            {images.map((src, idx) => (
                                <img
                                key={idx}
                                src={src}
                                alt={`image-${idx}`}
                                style={{
                                    width: '350px',
                                    height: '200px',
                                    marginTop: '150px',
                                    marginRight: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                                />
                            ))}
                        </Marquee>
                    </div>
        </div>
    </>
  )
}

export default Home