
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ImageSlideshow from "./ImageSlideShow";



const Home = () => {

  const images = [
    require("./home1.jpg"),
    require("./home2.jpg"),
    require("./home3.jpg"),
  ];

  return (
    <>
      <nav class="navbar navbar-dark bg-dark navbar-fixed-top"><h4 className="neon">SHOP SPECTRUM</h4>
        <div className="home-container">
          <ul className="ul">
            <li className="li">
              <Link className="link" to="/login">Login</Link>
            </li>
            <li className="li">
              <Link className="link" to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </nav>
      <ImageSlideshow className="singleImage" images={images} />



    </>
  );
};

export default Home;