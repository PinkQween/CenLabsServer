import React from 'react'
import { isMobile } from 'react-device-detect'
import SearchIcon from '@mui/icons-material/Search';
import {
    SearchInput,
    SearchButton,
    Profile
} from '../styles'

const Header = () => {
  return (
    <header className='h-20 flex border-b-[1px] border-[#313a3a] items-center flex-1'>
      <p className='text-3xl p-8 font-medium'>Centillion Drive</p>
      <div className='flex-1'></div>
      <div className='flex items-center'>
        {
          !isMobile && (
            <form className='flex' >
              <SearchInput type='text' placeholder='Search for files' />
              <SearchButton type="submit" className='flex align-middle items-center justify-center m-auto p-auto'>
                <SearchIcon />
              </SearchButton>
            </form>
          )
        }

        <Profile src={`https://cdn.hero.page/pfp/bea5e234-0959-4dc6-80ba-6a06db988e9a-close-up-of-anime-santa-girl-christmas-anime-pfp-3.png`} />
      </div>
    </header>
  )
}

export default Header
