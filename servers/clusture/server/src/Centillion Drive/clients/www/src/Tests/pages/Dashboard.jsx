import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/user';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { userData, logout, updateUser } = useUser();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    if (!userData) {
      const interval = setInterval(() => {
        if (userData) {
          clearInterval(interval);
        } else if (Date.now() - startTime >= 1000) {
          console.error('User data is not available');
          navigate('/testssss/login');
          clearInterval(interval);
        }
      }, 10);

      const startTime = Date.now();
      return () => clearInterval(interval);
    }

    // Set the user data when it becomes available
    setUser(userData);
  }, [navigate, userData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser(user); // Initialize editedUser with the current user data
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('https://auth.cendrive.com/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.status === 200) {
        updateUser(editedUser);
        setIsEditing(false);
      } else {
        console.error('Error updating user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          {user ? ( // Add a conditional check here
            <div>
              <p>Welcome, {user.name}!</p>
              <p>Email: {user.email}</p>
              {/* <button onClick={handleEditClick}>Edit</button> */}
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
