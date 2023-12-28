import React, { useEffect, useState } from 'react';
import getBlog from './utils/getBlogJson'
import { useParams } from 'react-router-dom';
import allBlogImages from './utils/importBlogImage'
import * as Common from './styles/BlogCommonStyles'
import { isMobile } from 'react-device-detect';

const WhatIsCenDrive = () => () => {
    const { blog: blogUrl } = useParams();

    return (
        <>
            <Common.BlogHeader src={allBlogImages[getBlog(blogUrl)?.image]} isMobile={isMobile} />
            <div className='text-align self-center p-14 pt-8'>
                <h1 className='text-3xl bold'>Who am I?</h1>
                My name is Hanna Skairipa, I am a full-stack developer coding using mainly JavaScript. I also enjoy a long list of other programming languages.
                <h1 className='text-3xl bold'>The beginning of Centillion Drive:</h1>
                Centillion Drive is a product of Centillion Labs, where we create suits such as a cloud drive, search engine, document creation tools, presentation creation tools, and spreadsheet tools. More about Centillion Drive; it is a cloud drive that easily integrates with any operating system giving you full access to your user folder while also easily being able to share folders/files with no complicated URI and being done securely with end-to-end encryption. We use various technologies, such as Node.js, Express.js, Passport.js, React.js, Discord.js, Vite, Linux, and a lot more. It was started with just 1 developer, me (Hanna Skairipa) and I have written over 1 million lines of code which is really shocking but after doing some checks. It is still calculated currently at 1,661,504 lines.
            </div>
        </>
    );
}

export default WhatIsCenDrive;