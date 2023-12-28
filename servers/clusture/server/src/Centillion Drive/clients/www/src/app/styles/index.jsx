import styled from 'styled-components'

export const Container = styled.div`
    min-height: 100vh;
`

export const SearchInput = styled.input`
    background-color: #353a3d;
    border-radius: 25px 0 0 25px;
    padding: 10px;
    padding-left: 15px;
    outline: none;
    border: none;
    height: 44px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
`

export const SearchButton = styled.button`
    background-color: #353a3d;
    border-radius:  0 25px 25px 0;
    padding: 16px;
    height: 44px;
    width: 44px;
    border-left: 1px solid #414e52;
    padding-left: 15px;
    outline: none;
`

export const Profile = styled.img`
    aspect-ratio: 1/1;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    margin: 12px;
    object-fit: cover;
`
export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 23vw);
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-column-gap: 13px;
    grid-row-gap: 12px;
    max-width: calc(100vw - 3rem);
`
export const Aligner = styled.div`
    /* display: flex;
    align-items: center;
    flex-direction: column;
    text-align: start; */
    margin: auto;
`

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  overflow-x: auto;

  span {
    cursor: pointer;
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }
  }
`;