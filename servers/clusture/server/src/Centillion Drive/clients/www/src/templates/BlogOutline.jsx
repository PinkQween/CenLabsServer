import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import blogsData from '../blogs.json';
import MobileLandingHeader from '../components/MobileLandingHeader';
import LandingHeader from '../components/LandingHeader';
import { isMobile } from 'react-device-detect';
import Footer from '../components/Footer';
import WhatIsCenDrive from '../blogs/WhatIsCenDrive';
import blogs from '../utils/getAllBlogs';

const BlogOutline = () => {
  const { blog: blogText } = useParams();
  const [BlogComponent, setBlogComponent] = useState(null);

  useEffect(() => {
    const blogName = `${blogsData.find((blog) => blog.urlName === blogText)?.jsxPath}`;

    setBlogComponent(blogs[blogName + '.jsx'])
  }, [blogText, setBlogComponent]);
  

  return (
    <>
      <div className='flex flex-col relative'>
        {isMobile ? <MobileLandingHeader /> : <LandingHeader />}
      </div>

      {BlogComponent ? (
        <Suspense fallback={<div>Loading...</div>}>
          {console.log(BlogComponent)}
          {console.log(typeof BlogComponent)}
          {console.log(React.createElement(WhatIsCenDrive))}
          <BlogComponent />
        </Suspense>
      ) : (
        <div>Loading...</div>
      )}

      <Footer />
    </>
  );
};

export default BlogOutline;
