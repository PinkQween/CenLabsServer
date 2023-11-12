import React, { useEffect, useState } from 'react';
import { Element, scroller } from 'react-scroll';

const LandingFeatureTemplate = ({ imageSrc, text, imageOnLeft }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setVisible(offset > 100); // Adjust the offset as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToElement = () => {
    scroller.scrollTo('scroll-to-element', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <Element name="scroll-to-element">
      <div className={`scrolling-image-text ${visible ? 'visible' : ''}`}>
        <div className={`container ${imageOnLeft ? 'image-left' : 'image-right'}`}>
          <img src={imageSrc} alt="Side Image" />
          <div className="text">{text}</div>
        </div>
        <button onClick={scrollToElement}>Scroll</button>
      </div>
    </Element>
  );
};

export default LandingFeatureTemplate;
