import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';




import './Login.css'
import jwtDecode from 'jwt-decode';





const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;


const Login = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');


  const [loginUser] = useMutation(LOGIN_USER);


  const handleLogin = async () => {
    try {
      const result = await loginUser({ variables: { email: loginEmail, password: loginPassword } });
      const { token, user_id, username } = JSON.parse(result.data.loginUser);
      console.log(username)
      console.log(user_id)
  
      alert("Logged in successfully");
      navigate("/products", { state: { user_id } });
    } catch (err) {
      alert("Enter valid credentials");
      console.error('Login error:', err.message);
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
    height: "25px",

  };
  // Style for div having login, password, login button and register link
  const centerDivStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingTop: "100px"

  };

  const linkStyle = {
    color: 'blue',
    textDecoration: 'none',
    transition: 'color 0.3s',
  };

  const navigateToHome = () =>{
    navigate("/")
  }
  return (
    <>


      <nav class="navbar navbar-dark bg-dark navbar-fixed-top" >
        <h4 className="neon" onClick={navigateToHome}>SHOP SPECTRUM</h4>
      </nav>

      <section class="vh-100" >
        <div class="container-fluid h-custom" style={{ paddingTop: '50px' }}>
          <div class="row d-flex justify-content-center align-items-center h-100" >

            {/* Image */}
            <div class="col-md-9 col-lg-6 col-xl-5" >
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                class="img-fluid" alt="Sample image" style={styleImg} />
            </div>

            {/* Heading Login */}
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1" style={centerDivStyle} >
              <form>
                <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start" >
                  <p class="lead fw-normal mb-0 me-3" ><h2>LOGIN</h2></p>
                </div>

                {/* <!-- Email input --> */}
                <div class="form-outline mb-4">
                  <input type="email" id="form3Example3" class="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} />
                  <label class="form-label" for="form3Example3"></label>
                </div>

                {/* <!-- Password input --> */}
                <div class="form-outline mb-3">
                  <input type="password" id="form3Example4" class="form-control form-control-lg"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} />
                  <label class="form-label" for="form3Example4"></label>
                </div>

                {/* Login Button */}
                <div class="text-center text-lg-start mt-4 pt-2">
                  <button type="button" class="btn btn-primary btn-lg"
                    style={style1} onClick={handleLogin}>LOGIN</button>

                  {/* If not having an account link to register */}
                  <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                    class="link-danger">
                    <Link className="link" to="/Signup" style={linkStyle}>Register </Link></a></p>
                </div>

              </form>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
            {/* Footer */}
          <div class="text-white mb-3 mb-md-0" style={bottomDivStyle} >
            All rights reserved.
          </div>


        </div>
      </section>
    </>

  );
};

export default Login;