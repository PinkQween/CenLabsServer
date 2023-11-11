import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Retrieve user data from local storage on component initialization
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []); // Empty dependency array ensures this effect runs only once when the component initializes

    const updateUser = (data) => {
        setUserData(data);
        // Store user data in local storage
        localStorage.setItem('userData', JSON.stringify(data));
    };

    const logout = () => {
        setUserData(null);
        // Remove user data from local storage
        localStorage.removeItem('userData');
    };

    return (
        <UserContext.Provider value={{ userData, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
