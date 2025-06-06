import React, {useState, useEffect} from 'react'
import Marquee from "react-fast-marquee";

const Home = () => {
    const [nickname, setNickname] = useState('')

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setNickname(storedNickname);
        }
    },[]);

  return (
    <div className='container-fluid bg-light vh-100 p-5'>
        <div className='container-xl shadow p-4 mb-5 bg-light rounded'>
            <h3 className='p-2'>Welcome, {nickname}!</h3>
        </div>
        <div className='d-flex flex-column align-items-center my-0'>
            <h2 className=''>Get Started</h2>
            <div className='d-flex flex-row column-gap-4 mt-5'>
                <button type="button" class="btn btn-outline-danger fs-5">
                    <i className="bi bi-plus-square-dotted me-2"></i>
                    Create new</button>
                <button type="button" class="btn btn-outline-danger fs-5">
                    <i class="bi bi-person-plus me-2"></i>
                    Join existing</button>
            </div>
        </div>
    </div>
  )
}

export default Home