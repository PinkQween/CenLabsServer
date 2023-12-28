import React, { useEffect, useRef } from 'react';
import LandingHeader from '../components/LandingHeader';
import MobileLandingHeader from '../components/MobileLandingHeader';
import { osName, browserName, isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import LandingFeatureTemplate from '../components/LandingFeatureTemplate'
import Footer from '../components/Footer'

const Landing = () => {
  const navigate = useNavigate()

  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        const distanceY = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;

        if (distanceY > headerHeight) {
          backgroundRef.current.classList.add('show');
        } else {
          backgroundRef.current.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className='h-screen flex flex-col relative'>
        {isMobile ? (
          <MobileLandingHeader />
        ) : (
          <LandingHeader />
        )}
        <div ref={backgroundRef} className={'animated-background justify-center align-middle items-center flex space-between ' + (isMobile ? '-mt-[5.5rem]' : '-mt-12')}>
          <div className="flex">
            <div className="card personal-use-card">
              {/* <h1 className='text-2xl font-bold p-2'>Personal Use</h1>
              <p>Store files in a invisible hard drive for as cheap as $2/month for a hard drive that is infinitely big, looking for something cheaper? Then the ¢25/month for 5GB should be suitable for you at a unbelievably cheap cost.</p> */}
              <button className='bg-white rounded-lg text-black text-xl p-6 font-bold border-solid border-black border-2'>Download for {osName}</button>
            </div>

            <div className="card professional-use-card">
              {/* <h1 className='text-2xl font-bold p-2'>Professional Use</h1>
              <p>Get the same amazing specs of the personal use with the same seamless hard drive functionality, as well as if your using this professionally (or personally) get easy file sharing between coworkers</p> */}
              <button className='bg-white rounded-lg text-black text-xl p-6 font-bold border-solid border-black border-2' onClick={() => navigate('/app')}>Open in {browserName}</button>
            </div>
          </div>
        </div>
      </div>

      <div className='h-screen bg-black -mt-[100vh]'>
        {/* <LandingFeatureTemplate
          imageSrc="path/to/your/image.jpg"
          text="Your text goes here."
          imageOnLeft={true}
        /> */}
      </div>
      <Footer />
    </>
  );
};

export default Landing;