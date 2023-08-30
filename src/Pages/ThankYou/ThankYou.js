import React, { useState,  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql,  } from '@apollo/client';
import Modal from 'react-modal';
import { BsCartCheck, BsFillBagCheckFill } from "react-icons/bs"
import './ThankYou.css'

const GET_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId($user_id: Int!) {
    getOrdersByUserId(user_id: $user_id) {
      order_id
      order_status
      order_address
      order_total
    }
  }
`;



const ThankYou = () => {
  const location = useLocation();
  const { user_id } = location.state || {};

  const [showOrderDetails, setShowOrderDetails] = useState(false);




  const { loading: orderLoading, data: orderData } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables: { user_id: user_id },
  });






  const handleShowOrderDetails = () => {

    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
  };

  const navigate = useNavigate();
  const navigateToLogout = () => {
    navigate("/")
  }

  const continueShopping = () =>{
    navigate("/products", { state: { user_id } });
  }






  let orderStatus = orderData?.getOrdersByUserId[0]?.order_status;
  

  return (
    <div>
      <nav class="navbar navbar-inverse navbar-dark bg-dark navbar-fixed-top"><h4 className='neon'>SHOP SPECTRUM</h4>
        <ul className="top-right-list">

          <BsCartCheck style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsCartCheck><li style={{ marginRight: "20px", cursor: "pointer" }}><span className="button" style={{ fontSize: "medium" }} onClick={() => navigate(`/orders?user_id=${user_id}`)}>Order Details</span></li>
          <BsFillBagCheckFill style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsFillBagCheckFill><li style={{ marginRight: "20px", cursor: "pointer" }}><span className="button" style={{ fontSize: "medium" }} onClick={continueShopping}>Continue Shopping</span></li>
          <li style={{ marginRight: "10px", cursor: "pointer" }}><span style={{ fontSize: "medium" }} className="link" onClick={navigateToLogout}>Logout</span></li>

        </ul>
      </nav>
      <h1 className='ThankYou'>Thank You for Your Order!</h1>




      {/* Modal for viewing the orders
      {showOrderDetails && (
        <Modal className="Modal" isOpen={true} onRequestClose={handleCloseOrderDetails}>
          <h2>Order Details</h2>
          {orderLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {orderData.getOrdersByUserId.length === 0 ? (
                <>
                  <p>No orders yet.</p>
                </>
              ) : (
                <ul style={{ listStyleType: "none" }}>
                  {orderData.getOrdersByUserId.map((order) => (
                    <div
                      style={{
                        border: "1px solid",
                        marginRight: "20px",
                        marginBottom: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#edebeb",
                      }}
                    >
                      <li style={{ textDecoration: "none" }} key={order.order_id}>
                        <p style={{ marginLeft: "10px" }}>Order ID: {order.order_id}</p>
                        <p style={{ marginLeft: "10px" }}>Status: {order.order_status}</p>
                        <p style={{ marginLeft: "10px" }}>Address: {order.order_address}</p>
                        <p style={{ marginLeft: "10px" }}>Total: {order.order_total}</p>
                        
                      </li>
                      
                    </div>
                  ))}
                </ul>
              )}
            </div>
          )}
          <button className="closeButton" onClick={handleCloseOrderDetails}>
            Close
          </button>
        </Modal>
      )} */}

    </div>
  );
};

export default ThankYou;