import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from './pages'

const index = () => {
    return (
        <Routes>
            <Route path='/' element={<App />} />
        </Routes>
    )
}

export default index
