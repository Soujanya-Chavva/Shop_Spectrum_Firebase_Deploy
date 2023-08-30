import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useLocation, } from 'react-router-dom';
import { useNavigate, } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { BsFillCartFill, BsFillTrashFill } from 'react-icons/bs';
import './Cart.css'

const GET_CART_ITEMS = gql`
  query getCartItems($user_id: String!) {
    getCartItems(user_id: $user_id) {
        user_id
        product_id
        quantity
        product {
            product_name
            product_price
      }
    }
  }
`;

const GET_CART_TOTAL = gql`
  query getCartTotal($user_id: String!) {
    getCartTotal(user_id: $user_id)
  }
`;

const PLACE_ORDER = gql`
  mutation placeOrder(
    $user_id: String!
    $order_total: Float!
    $order_status: String!
    $order_address: String!
    
  ) {
    placeOrder(
        user_id: $user_id
        order_total: $order_total
        order_status: $order_status
        order_address: $order_address
    ){
        user_id
        order_id
        order_status
        order_address
        order_total
    }
  }
`;

const DELETE_CART_ITEM = gql`
  mutation deleteCartItem($user_id: String!, $product_id: String!) {
    deleteCartItem(user_id: $user_id, product_id: $product_id)
  }
`;




const Cart = () => {

 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = (searchParams.get('user_id'));




  const { loading, error, data } = useQuery(GET_CART_ITEMS, {
    variables: { user_id },
  });

  const { data: totalData, error:totalError, refetch: refetchCartTotal } = useQuery(GET_CART_TOTAL, {
    variables: { user_id },
  });


  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);

  const [orderAddress, setOrderAddress] = useState('');



  const [placeOrder] = useMutation(PLACE_ORDER);

  const navigate = useNavigate();

  const { loading: itemsLoading, error: itemsError, data: itemsData, refetch: refetchCartItems } = useQuery(GET_CART_ITEMS, {
    variables: { user_id },
  });
  const cartTotal = totalData ? totalData.getCartTotal : 0;
  


  if (totalError) return <p>Error: {totalError.message}</p>;


  const handleDeleteItem = (product_id) => {
    deleteCartItem({
      variables: {
        user_id: user_id,
        product_id: product_id,
      },
    })
      .then(() => {
        refetchCartItems();
        refetchCartTotal();
      })
      .catch((error) => {
        console.error('Error deleting cart item:', error);
      });
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  if (itemsLoading) return <p>Loading...</p>;
  if (itemsError) return <p>Error: {error.message}</p>;

  const navigateToProductsPage = () => {
    
    navigate("/products", { state: { user_id } });
  }




  

  const cartItems = data.getCartItems;
  if (cartItems.length === 0) {
    return (
      <div>

        <nav class="navbar navbar-dark bg-dark navbar-fixed-top">
          <h4 className="neon" onClick = {navigateToProductsPage}> SHOP SPECTRUM</h4>

        </nav>


        <br />
        <br />
        <h2 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>CART</h2>
        <p>Your cart is empty. Please add items to your cart.</p>

        <button onClick={navigateToProductsPage}>Go Back</button>

      </div>
    );
  }



  const handlePlaceOrder = () => {


    if (!orderAddress) {
      alert('Please enter a valid address before placing the order.');
      return;
    }

    if (cartTotal === 0) {
      alert("Your cart is empty. Please add items to your cart before placing the order.");
      return;
    }


    placeOrder({
      variables: {
        user_id,
        order_status: 'Placed',
        order_address: orderAddress,
        order_total: cartTotal,
      },
    }).then(() => {
      alert("Order placed Successfully");
      navigate('/thankyou', { state: { user_id } });

    }).catch((error) => {
      alert(error);
    })


  };



  return (

    <div>


      <nav class="navbar navbar-dark bg-dark navbar-fixed-top" >
        <h4 className="neon">SHOP SPECTRUM</h4>
      </nav>


      <br></br>
      <br></br>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 'bold', textDecoration: "underline" }}>CART</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <h1>{user_id}</h1> */}
        </div>
      </div>

      <ul style={{ listStyleType: 'none' }}>

        {/* Function to map the cart items based on the user_id */}

        {cartItems.map((cartItem) => (
          <div >
            <li style={{ marginBottom: "10px" }} key={cartItem.product_id} >

              <div style={{ border: "1px solid", marginRight: "20px", borderRadius: "10px", backgroundColor: "#edebeb" }}>
                <strong style={{ marginLeft: "10px", textDecoration: "underline" }}>{cartItem.product.product_name}</strong>
                <br></br>
                <br></br>
                <p style={{ marginLeft: "10px" }}>Quantity: {cartItem.quantity}</p>
                <p style={{ marginLeft: "10px" }}>Price: {cartItem.product.product_price}</p>
                <button style={{ marginBottom: "10px", marginLeft: "10px", height: "35px", borderRadius: "10px" }} onClick={() => handleDeleteItem(cartItem.product_id)}>Delete</button>
                {/* <BsFillTrashFill style={{ fontSize: '1.5rem', cursor: "pointer", width: "20px", height: "20px", marginLeft: "10px", marginTop: "20px" }} onClick={() => handleDeleteItem(cartItem.product_id)} /> */}
              </div>
            </li>
          </div>
        ))}
      </ul>
      
        <p>Total: {cartTotal}</p>

      {/* Input for entering the address */}
      <label>
        Order Address:
        <input
          type="text"
          value={orderAddress}
          onChange={(e) => setOrderAddress(e.target.value)}
        />
      </label>


      {/* Button to place the order */}
      <button onClick={handlePlaceOrder}>Place Order</button>

      <button onClick={navigateToProductsPage}>Go Back</button>


    </div>
  );
};

export default Cart;