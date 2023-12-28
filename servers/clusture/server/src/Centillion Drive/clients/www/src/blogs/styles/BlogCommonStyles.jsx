import styled from 'styled-components';

export const BlogHeader = styled.img`
    height: 100vh;
    width: 100vw;
    object-fit: cover;
    padding: 0;
    margin: 0;
    margin-top: ${({ isMobile }) => (isMobile ? '-5.5rem' : '-3rem')};
`;