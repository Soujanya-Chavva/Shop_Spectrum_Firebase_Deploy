import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { BsCurrencyRupee } from "react-icons/bs";

const GET_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId($user_id: String!) {
    getOrdersByUserId(user_id: $user_id) {
      order_id
      order_status
      order_address
      order_total
    }
  }
`;

const Orders = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = (searchParams.get('user_id'));
  console.log(user_id)
  const navigate = useNavigate();

  const { loading: orderLoading, error, data: orderData } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables: { user_id },
  });

  if (orderLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCloseOrderDetails = () => {

    navigateToProductsPage();
  };

  const navigateToProductsPage = () => {
    navigate("/products", { state: { user_id } });
    }

  const navigateToLogout = () => {
    navigate("/")
  }

  return (
    <div>
        <nav class="navbar navbar-inverse navbar-dark bg-dark navbar-fixed-top"><h4 className='neon' onClick = {navigateToProductsPage}>SHOP SPECTRUM</h4>
        <ul className="top-right-list">
          
          
          <li style={{ marginRight: "10px", cursor: "pointer" }}><span style={{ fontSize: "medium" }} className="link" onClick={navigateToLogout}>Logout</span></li>

        </ul>
      </nav>
    
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
                          <p style={{ marginLeft: "10px" }}>Total: <BsCurrencyRupee className="icon"></BsCurrencyRupee>{order.order_total}</p>
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
    </div>
  );
};

export default Orders;