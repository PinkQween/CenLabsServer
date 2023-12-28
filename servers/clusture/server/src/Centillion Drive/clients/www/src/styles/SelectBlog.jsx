import styled from 'styled-components';

export const BlogListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const BlogCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  max-width: 24rem;
  align-items: center;

  &:hover {
    transform: scale(1.05);
  }
`;

export const BlogImage = styled.img`
  object-fit: cover;
  aspect-ratio: 16 / 9;
  max-height: ${({ isMobile }) => (isMobile ? '8rem' : '13rem')};
  max-width: ${({ isMobile }) => (isMobile ? '14.22rem' : '23.11rem')};
  border-radius: 15px;
  margin: 8px;
  margin-top: 0;
`;

export const BlogTitle = styled.h3`
  margin-bottom: 8px;
  font-weight: bold;
`;

export const BlogExcerpt = styled.p`
  color: #cccccc;
  display: flex;
`;

export const BlogsPageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 16px;
  }

  p {
    line-height: 1.6;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  overflow: hidden;
  align-self: flex-start;
`