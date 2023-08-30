import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Signup from './Pages/SignUp/Signup';
import Home from './Pages/Home/Home';
import Products from './Pages/Products/Products';
import Cart from './Pages/Cart/Cart';
import Orders from './Pages/Orders/Orders';
import ThankYou from './Pages/ThankYou/ThankYou';
import ConnectionTest from './Pages/connectionTest';




const App = () => {
  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <Router>
      <Routes>
      <Route path="/" element= { <Home/>}/>
      <Route path =  "/c" element = {<ConnectionTest/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
          <Route path = "/cart" element={<Cart/>}></Route>
          <Route path = "/orders" element={<Orders/>}></Route>
          
          <Route path = "/thankyou" element={<ThankYou/>}></Route>
        <Route path = '/logout' element = {<Home/>}></Route>

      </Routes>
    </Router>
    </>
  );
};

export default App;