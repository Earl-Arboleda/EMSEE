// ExampleComponent.js

import React, { useEffect, useState } from 'react';

function ExampleComponent() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');

  // Fetch all users when the component mounts
  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Function to handle adding a new user
  const handleAddUser = () => {
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newUserName }) // Assuming the new user has a 'name' field
    })
      .then(response => response.json())
      .then(newUser => {
        setUsers(prevUsers => [...prevUsers, newUser]);
        setNewUserName('');
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newUserName}
        onChange={e => setNewUserName(e.target.value)}
        placeholder="Enter new user name"
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}

export default ExampleComponent;
