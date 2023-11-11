import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://auth.cendrive.com/user-data', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          // Handle the case where the user is not authenticated
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
