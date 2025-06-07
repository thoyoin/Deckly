import React, {useState} from 'react'
import Marquee from "react-fast-marquee";
import NicknameOverlay from './NicknameOverlay';

const Home = () => {
    const [nickname, setNickname] = useState(null);

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
        <div className='container-fluid bg-light vh-100 m-0 px-0 d-flex flex-column justify-content-center' style={{ filter: !nickname ? 'blur(5px)' : 'none' }}>
            <div style={{top:'0px'}} className='m-0 p-1 text-center position-fixed w-100 border border-danger border-end-0 border-start-0' >
                <img style={{width:'60px'}} src='/images/logo.png'></img>
            </div>
                <div className='w-100 d-flex align-items-center justify-content-start p-5'>
                    <h1 className='fw-bolder'>Welcome, {nickname}</h1>
                </div>
                <div className='d-flex w-100 flex-column align-items-center justify-content-center' style={{zIndex:'2'}}>
                    <h2 className='fw-light'>Get Started</h2>
                    <div className='d-flex flex-row column-gap-4 mt-5'>
                        <button type="button" class="btn btn-outline-danger fs-5 fw-lighter">
                            <i className="bi bi-plus-square-dotted me-2"></i>
                            Create new</button>
                        <button type="button" class="btn btn-outline-danger fs-5 fw-lighter">
                            <i class="bi bi-person-plus me-2"></i>
                            Join existing</button>
                    </div>
                </div>
                    <div className='container-fluid p-0' >
                        <Marquee speed={50} gradient={true} pauseOnHover={false} gradientColor='#f8f9fa' gradientWidth={10} direction='left'>
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