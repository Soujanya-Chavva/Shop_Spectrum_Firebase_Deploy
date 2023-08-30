import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      user_id
      username
      email
      password
      user_address
    }
  }
`;

function ConnectionTest() {  // Renamed function to start with uppercase letter
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
        <p>hi</p>
      {data.users.map(user => (
        <div key={user.id}>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default ConnectionTest;