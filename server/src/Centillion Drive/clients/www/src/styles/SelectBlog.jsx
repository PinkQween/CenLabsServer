import styled from 'styled-components';

export const BlogListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;

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

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BlogImage = styled.img`

`;

export const BlogTitle = styled.h3`
  margin-bottom: 8px;
`;

export const BlogExcerpt = styled.p`
  color: #555;
`;

export const BlogsPageContainer = styled.div`
  padding: 20px;

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