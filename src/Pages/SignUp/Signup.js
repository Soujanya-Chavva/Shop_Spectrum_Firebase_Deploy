import React, { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

import './Signup.css'




const REGISTER_USER = gql`
mutation RegisterUser($username: String!, $email: String!, $password: String!, $user_address: String!) {
  registerUser(username: $username, email: $email, password: $password, user_address: $user_address) {
    username
    email
    password
    user_address
  }
}
`;

const CHECK_USER_EXISTENCE = gql`
  query CheckUserExistence($email: String!, $username: String!) {
    checkUserExistence(email: $email, username: $username)
  }
`;


const Register = () => {
  const navigate = useNavigate();

  const [registerUser] = useMutation(REGISTER_USER)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_address, setAddress] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');


  const { data } = useQuery(CHECK_USER_EXISTENCE, {
    variables: { email, username },
    skip: !email || !username,
  });

  const userExists = data?.checkUserExistence;


  const handleRegister = async () => {
    if (userExists) {
      alert("User already exists");
      console.log('User already exists');
      return;
    }

    if (password !== passwordConfirmation) {
      alert('Passwords do not match');
      return;
    }

    if (!/^.+@.+\..+$/.test(email)) {
      alert('Enter valid Email');
      return;
    }


    try {
      console.log(username, email, password, user_address);
      const result = await registerUser({ variables: { username, email, password, user_address } });
      console.log('Registered user:', result.data.registerUser);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error('Registration error:', err.message);
    }
  };


  const style1 =
  {
    width: '100px',
    height: '40px',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '5px',
  }

  const styleImg = {
    maxWidth: "100%",
    height: "auto"
  }

  const bottomDivStyle = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    background: 'black',
    padding: '10px',
    textAlign: 'left',
    height: "30px",


  };

  const centerDivStyle = {
    display: 'flex',
    alignItems: 'center',

  };

  const linkStyle = {
    color: 'blue',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontSize: 'medium'
  };



  const navigateToHome = () => {
    navigate("/")
  }


  return (
    <>


      <nav class="navbar navbar-dark bg-dark navbar-fixed-top" >
        <h4 className="neon" onClick={navigateToHome}>SHOP SPECTRUM</h4>
      </nav>

      <section class="vh-100">
        <div class="container-fluid h-custom" style={{ paddingTop: '50px' }}>
          <div class="row d-flex justify-content-center align-items-center h-100">

            {/* Display Image for registration */}
            <div class="col-md-9 col-lg-6 col-xl-5">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                class="img-fluid" alt="Shop Spectrum" style={styleImg} />
            </div>
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1" style={centerDivStyle}>
              <form>

                {/* Register heading */}
                <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p class="lead fw-normal mb-0 me-3" ><h2>REGISTER</h2></p>
                </div>

                {/*  Username input  */}
                <div class="form-outline mb-4">
                  <input type="email" class="form-control form-control-lg"
                    placeholder="Enter a Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                  <label class="form-label" for="form3Example3"></label>
                </div>


                {/*  Email input  */}
                <div class="form-outline mb-4">
                  <input type="email" class="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                  <label class="form-label" for="form3Example3"></label>
                </div>



                {/*  Password input  */}
                <div class="form-outline mb-3">
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                  <label class="form-label" for="form3Example4"></label>
                </div>

                {/* Confirm password input */}
                <div class="form-outline mb-3" style={{ paddingBottom: "20px" }}>
                  <input
                    type="password"
                    class="form-control form-control-lg"
                    placeholder="Confirm password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>


                {/* Address Input */}
                <div class="form-outline mb-4">
                  <input type="email" id="form3Example3" class="form-control form-control-lg"
                    placeholder="Enter address"
                    value={user_address}
                    onChange={(e) => setAddress(e.target.value)} />
                  <label class="form-label" for="form3Example3"></label>
                </div>

                {/* Register Button */}
                <div class="text-center text-lg-start mt-4 pt-2">
                  <button type="button" class="btn btn-primary btn-lg"
                    style={style1} onClick={handleRegister}>REGISTER</button>
                  <p class="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="#!"
                    class="link-danger">
                    <Link to="/login" style={linkStyle}>Login</Link></a></p>
                </div>

              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">

          <div class="text-white mb-3 mb-md-0" style={bottomDivStyle} >
            All rights reserved.
          </div>


        </div>
      </section>
    </>


  );
};

export default Register;
