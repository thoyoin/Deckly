import React, {useState, useEffect} from 'react'
import Marquee from "react-fast-marquee";

const Home = () => {
    const [nickname, setNickname] = useState('')

    const images = [
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
        "/images/4.png",
        "/images/5.png"
      ];

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setNickname(storedNickname);
        }
    },[]);

  return (
    <div className='container-fluid bg-light vh-100 m-0 px-0 d-flex flex-row justify-content-center'>
        <div className='w-100 d-flex align-items-center justify-content-start p-5'>
            <h1 className='fw-bold'>Welcome, {nickname}</h1>
        </div>
        <div className='d-flex w-100 flex-column align-items-center justify-content-center'>
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
            <div className='container-fluid p-0'>
                <Marquee speed={50} gradient={false} pauseOnHover={false} direction='down'>
                    {images.map((src, idx) => (
                        <img
                        key={idx}
                        src={src}
                        alt={`image-${idx}`}
                        style={{
                            width: '450px',
                            height: '250px',
                            marginTop: '530px',
                            marginRight: '-100px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                        />
                    ))}
                </Marquee>
            </div>
    </div>
  )
}

export default Home