import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {  useLocation, useNavigate } from 'react-router-dom';
import { BsCart, BsCurrencyRupee, BsFilePerson, BsPersonCircle, BsSearch, BsCartCheck } from "react-icons/bs";
import Modal from 'react-modal';
import "./Products.css"




const GET_PRODUCTS = gql`
  query {
    products {
      product_id
      product_name
      product_price
      product_description
      image
      category
    }
  }
`;

const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($product_id: String!) {
    getProductReviews(product_id: $product_id) {
      review_id
      review
    }
  }
`;

const ADD_TO_CART = gql`
  mutation addToCart($user_id: String!, $product_id: String!, $quantity: Int!) {
    addToCart(user_id: $user_id, product_id: $product_id, quantity: $quantity)
  }
`;


const GET_USER_DETAILS = gql`
  query GetUserDetails($user_id: String!) {
    getUser(user_id: $user_id) {
      
      username
      email
      password
      user_address
    }
  }
`;


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








const Products = () => {

  const location = useLocation();
  const { user_id } = location.state;
  // Mutation for inserting a product into the cart Accordion. to user_id
  const [addToCart] = useMutation(ADD_TO_CART);

  // for quantity updation
  const [quantity, setQuantity] = useState({});

  // useState for userDetails
  const [showPopup, setShowPopup] = useState(false);


  // useState for showing order details popup
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // useState for showing the product details when the product name is selected
  const [showProductDetails, setShowProductDetails] = useState(false);

  // useState when a user clicks on a product name to set the selected product name to display the details
  const [selectedProduct, setSelectedProduct] = useState(null);


  // useState for showing the product reviews
  const [selectedProductReviews, setSelectedProductReviews] = useState([]);



  // useState for searching a pdt
  const [searchQuery, setSearchQuery] = useState('');

  // useState for the products to sort them low-to-high
  const [priceSort, setPriceSort] = useState("low-to-high");

  // use State for selected price range
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // useState for setExpanded product
  const [expandedProduct, setExpandedProduct] = useState(null);

  // use state for selecting a category
  const [selectedCategory, setSelectedCategory] = useState('')


  // useState for displaying the review by default the reviews are not displayed until the user clicks the button
  const [showReviews, setShowReviews] = useState(false);

  // Create a new useQuery for fetching product reviews
  const { loading: reviewsLoading, data: reviewsData } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { product_id: selectedProduct ? selectedProduct.product_id : 0 },
  });

  // When the selected product changes, update the reviews
  useEffect(() => {
    if (reviewsData && reviewsData.getProductReviews) {
      console.log("reviews")
      setSelectedProductReviews(reviewsData.getProductReviews);
    }
  }, [reviewsData]);





  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { category: selectedCategory },
  });



  const navigate = useNavigate();


  const { loading: userLoading, data: userData } = useQuery(GET_USER_DETAILS, {
    variables: { user_id: user_id },
  });


  const { loading: orderLoading, data: orderData } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables: { user_id: user_id },
  });






  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (reviewsLoading) return <p>Loading...</p>;
 

  const handleShowDetails = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };










  // Function for incrementing the quantity when the user clicks + button
  const incrementQuantity = (product_id) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [product_id]: (prevQuantity[product_id] || 0) + 1,
    }));
  };


  // Function for decrementing the quantity when the user clicks - button
  const decrementQuantity = (product_id) => {
    if (quantity[product_id] > 1) {
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [product_id]: prevQuantity[product_id] - 1,
      }));
    }
  };




  // Funtion which handles when the add to cart button is clicked
  const handleAddToCart = async (product_id) => {
    console.log("Inside add to cart", user_id, product_id, quantity[product_id])
    try {
      await addToCart({
        variables: { user_id: user_id, product_id, quantity: quantity[product_id] || 1 },
      });
      alert('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };




  // Function when the product name is clicked
  const handleShowProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    setShowReviews(false);
  };

  // Function when the close button for product details is clicked
  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
    setShowProductDetails(false);
  };






  const sortedProducts = [...data.products];

  if (priceSort === "low-to-high") {
    sortedProducts.sort((a, b) => a.product_price - b.product_price);
  } else if (priceSort === "high-to-low") {
    sortedProducts.sort((a, b) => b.product_price - a.product_price);
  }

  

  const filteredProducts = sortedProducts.filter(product => {
    if (!selectedCategory || selectedCategory === 'All Categories') {
      return true;
    } else {
      return product.category === selectedCategory;
    }
  }).filter(product =>
    (selectedPriceRange === 'all' ||
      (selectedPriceRange === 'low-to-high' && product.product_price <= 100) ||
      (selectedPriceRange === 'high-to-low' && product.product_price > 100)
    ) &&
    (searchQuery === '' || product.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const navigateToProductsPage = () => {
    navigate("/products", { state: { user_id } });
    
  }


  const navigateTocartPage = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    navigate(`/cart?user_id=${user_id}`);

    window.location.reload();
    
    
  }


  const navigateToLogout = () => {
    navigate("/")
  }


 
  


  return (
    <div>

      <nav class="navbar navbar-inverse navbar-dark bg-dark navbar-fixed-top"><h4 className='neon' onClick = {navigateToProductsPage}>SHOP SPECTRUM</h4>
        <ul className="top-right-list">
          <BsPersonCircle style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsPersonCircle><li style={{ marginRight: "20px", cursor: "pointer" }}><span className="button" style={{ fontSize: "medium" }} onClick={handleShowDetails}>{userData && userData.getUser.username}</span></li>
          {/* <BsCartCheck style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsCartCheck><li style={{ marginRight: "20px", cursor: "pointer" }}><span className="button" style={{ fontSize: "medium" }} onClick={handleShowOrderDetails}>Order Details</span></li> */}
          <BsCartCheck style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsCartCheck><li style={{ marginRight: "20px", cursor: "pointer" }}><span className="button" style={{ fontSize: "medium" }} onClick={() => navigate(`/orders?user_id=${user_id}`)}>Order Details</span></li>
          <BsCart style={{ marginRight: "5px", marginTop: "1px", fontSize: "2rem" }}></BsCart>  <li style={{ marginRight: "20px", cursor: "pointer" }}><span style={{ fontSize: "medium" }} className="link" onClick={navigateTocartPage} >View Cart</span></li>
          <li style={{ marginRight: "10px", cursor: "pointer" }}><span style={{ fontSize: "medium" }} className="link" onClick={navigateToLogout}>Logout</span></li>

        </ul>
      </nav>



      <div class="container-fluid h-custom" style={{ paddingTop: '40px', marginTop: "10px", height: "10px" }}>
        <div class="container" style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", height: "25px" }}>
          {/* Drop down for selecting a category and viewing the products accordingly */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="women's wear">Women's Wear</option>
            <option value="men's wear">Men's Wear</option>
            <option value="kid's wear">Kid's Wear</option>
            <option value="furniture">Furniture</option>


          </select>

          {/* Drop down for filtering the products according to the price */}
          <label style={{ marginTop: "2px" }} htmlFor="sort-price">Sort by Price:</label>
          <select
            id="sort-price"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>

          {/* Input feild for searching a product */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /><BsSearch style={{ marginTop: "4px" }}></BsSearch>
        </div>





        <div className="top-right-link">

        </div>




        <h2 className="products_name">PRODUCTS</h2>




        {/* Modal for viewing user details */}
        {showPopup && (
          <Modal className="Modal" isOpen={true} onRequestClose={handleClosePopup}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
              <h2 style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "50px" }}>USER DETAILS</h2>
              <BsFilePerson style={{ width: "150px", height: "150px", marginRight: "10px" }}></BsFilePerson>
              {userLoading ? (
                <p>Loading...</p>
              ) : (
                <div style={{ fontSize: "25px" }}>

                  <p>Username: {userData.getUser.username}</p>
                  <p>Email: {userData.getUser.email}</p>
                  <p>Address: {userData.getUser.user_address}</p>
                </div>
              )}
              <button className="closeButton" onClick={handleClosePopup}>Close</button>
            </div>
          </Modal>
        )}

        {/* Displaying all the products */}
        <div className="products-grid">
          {filteredProducts.map(product => (
             
            <div className="product-card" key={product.product_id}>
              
              <h4 className="productName" onClick={() => handleShowProductDetails(product)}>
                {expandedProduct === product.product_id
                  ? product.product_name
                  : product.product_name.slice(0, 20) + (product.product_name.length > 20 ? '...' : '') // Truncate the name otherwise
                }</h4>
              <div className='image-container'>
                <img className="positoned-img"
                  src={require(`./images/` + product.image + `.jpg`)}

                  alt={product.product_name}
                />
              </div>
              <br></br>
              <strong>Price:</strong><BsCurrencyRupee className="icon"></BsCurrencyRupee>{product.product_price}<br />
              
              <strong>Description:</strong> {expandedProduct === product.product_id
                ? product.product_description
                : product.product_description.slice(0, 50) + '...' // Truncate the description otherwise
              }
              


              <div className='product-controls'>
                <button onClick={() => decrementQuantity(product.product_id)}>-</button>
                <input
                  type="number"
                  value={quantity[product.product_id] || 0}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setQuantity((prevQuantity) => ({
                      ...prevQuantity,
                      [product.product_id]: newQuantity,
                    }));

                  }}

                />
                <button onClick={() => incrementQuantity(product.product_id)}>+</button>
              </div>

              <br></br>


              <button className='add-to-cart-container ' onClick={() => handleAddToCart(product.product_id)}>Add to Cart</button>
            </div>

          ))}

        </div>


        {/* Modal for showing the product details in detail if the product name is selected */}
        {selectedProduct && showProductDetails && (
          <Modal className="Modal" isOpen={true} onRequestClose={handleCloseProductDetails}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: "80px" }}>
              <div>
                <img style={{ width: '400px', height: '400px', border: "1px solid black", marginLeft:"10px" }} src={require(`./images/` + selectedProduct.image + `.jpg`)} alt={selectedProduct.product_name} />
              </div>


              <div style={{ marginLeft: '20px' }}>
                <h2 style={{ textDecoration: "underline" }}>Product Details</h2>
                <p style={{ fontWeight: 'bold', fontSize: 'medium' }}>Product Name: {selectedProduct.product_name}</p>
                <p style={{ fontSize: 'medium' }}>Price: <BsCurrencyRupee className="icon"></BsCurrencyRupee>{selectedProduct.product_price}</p>
                <p style={{ fontSize: 'medium' }}>Description: {selectedProduct.product_description}</p>

                {/* Display reviews */}
                <button className="closeButton" style={{ marginRight: "10px" }} onClick={() => setShowReviews(!showReviews)}>
                  {showReviews ? "Hide Reviews" : "Show Reviews"}
                </button>
                {/* Display reviews or "No reviews yet" */}
                {showReviews ? (
                  selectedProductReviews.length > 0 ? (
                    selectedProductReviews.map(review => (
                      <div key={review.review_id}>
                        <p>Review: {review.review}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )
                ) : null}
                <button className="closeButton" onClick={handleCloseProductDetails}>Close</button>
              </div>
            </div>
          </Modal>
        )}



      </div>
    </div>
  );
};

export default Products;