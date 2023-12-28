import React, { useEffect, useRef } from 'react';
import LandingHeader from '../components/LandingHeader';
import MobileLandingHeader from '../components/MobileLandingHeader';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import blogsData from '../blogs.json';
import {
  BlogListContainer,
  BlogCard,
  BlogTitle,
  BlogExcerpt,
  BlogsPageContainer,
  BlogImage,
  TextContainer
} from '../styles/SelectBlog';

const importAll = (r) => {
  let images = {};
  Object.keys(r).forEach((item) => { images[item] = r[item].default; });
  return images;
};

const images = importAll(import.meta.globEager('../images/blogCovers/*.{png,jpg,jpeg,svg}'));

const Blogs = () => {
  const navigate = useNavigate();

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

  const handleSelectBlog = (blog) => {
    navigate(`/blog/${blog.urlName}`);
  };

  return (
    <>
      <div className='flex flex-col relative'>
        {isMobile ? <MobileLandingHeader /> : <LandingHeader />}
      </div>

      <BlogsPageContainer>
        <h1>Blogs</h1>
        <BlogListContainer>
          {blogsData.map((blog) => {
            return (
              <BlogCard key={blog.id} onClick={() => handleSelectBlog(blog)}>
                <BlogImage src={images[`../images/blogCovers/${blog.image}`]} isMobile={isMobile} />
                <TextContainer>
                  <BlogTitle>{blog.title}</BlogTitle>
                  <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
                </TextContainer>
              </BlogCard>
            );
          })}
        </BlogListContainer>
      </BlogsPageContainer>

      <Footer />
    </>
  );
};

export default Blogs