import React, { useEffect, useRef } from 'react';
import LandingHeader from '../components/LandingHeader';

const Landing = () => {
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
      <LandingHeader />
      <div ref={backgroundRef} className="animated-background relative">
        <div className="absolute top-[50%] right-[20%] left-[20%] flex">
          <div className="card personal-use-card">
            <h1 className='text-2xl font-bold p-2'>Personal Use</h1>
            <p>Store files in a invisble hard drive for as cheap as $2/month for a hard drive that is infinetly big, looking for something cheaper? Then the ¢25/month for 5GB should be sutible for you at a unvelibly cheap cost.</p>
          </div>

          <div className="card professional-use-card">
            <h1 className='text-2xl font-bold p-2'>Professional Use</h1>
            <p>Get the same amazing specs of the personal use with the same seemless hard drive functionality, as well as if your using this profeshinally (or personlly) get easy file sharing between coworkers</p>
          </div>
        </div>
      </div>

      <div className='-mt-[100vw]'></div>
    </>
  );
};

export default Landing;