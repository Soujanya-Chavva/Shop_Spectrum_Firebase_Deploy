const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const admin = require('firebase-admin');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Initialize Firebase Admin with your service account key
const serviceAccount = {
    "type": "service_account",
    "project_id": "shop-spectrum-website",
    "private_key_id": "1e43bbd7938fa4677cc566c3966909c4e0291420",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4wi8zBWxNkbhX\nKxTvWVyb3JfSCF5KamBZRqiEm6YTRE6RySFpETqxsRWmkqVDKqUHV5Zjo5lzTEMh\nRa1do0fQj3P4Kx2rScfb3rmKAeTa3x4jK9iHg9VzUJ1NnpPWS/jyHf9F7MMf4qCN\n6WhPtM6ifBAC+FfeHDAyhXFEDvFVlIAVb+FG+UHslh17N34oCmoIwqSrS6xtasOn\nlMKItlh0vR80IH3gX6tDEAwbUtTOrZeEhapHtG2bENxyyFp5hx9AtHUEV/WNUtf/\nSCCSHGtH8+QKMNLtmDl/Zv+yCAJVBVAWcgQ3klhFxXnXxvMTes+A2ydypmUctUqC\nUuqsK9TbAgMBAAECggEAHCdG7vTkGHvchbfkZEaPNJbsMY6h46ALF3+LXU2khGoT\nuOZXp31/HqWX4X6WHUKJzDEeEwfScb3Muuy1qr+fSVoat1XGmxvOjyQEzNFWEL4Q\nBxb+00OVCpHdrn68E1sXT7mfdQXLg/fSNF29TewE0sCp5fH23bsY4xHvfQnz33DT\nsNzhpcnOSQYJwSr4PuPTZtcvhmgZFC2VV0s0uy3Ebaj8y4fXVnUGl+fJX8EWCH7Y\ny7IBUKYs/763v/wtB9aLpBQQlu1UOeNtc4zvQsnw3+PrCnfBWhBaCtI/7bm3XEXo\ntItaHehAY1NmL7gDDgT5FhXXjbjE3JvhkRs6Skd6jQKBgQDiK/G2CVEPRP4cJtsT\n+CY4qT+ObRjlFZ/nTRHY9MPQhBNWkYdtwrtO77oq1Gt8V9dW0T0nA6mAyjmZAX1V\nqdfndcUavc2TjswySEdI3PaNm8UTOwzh7JXvaYKdYgfhi3OBQn81b0Laufg5en+p\nrHPTyM9qQPxguoPx2Doizx7KPwKBgQDRIAqbmxVi96sBkVpQogpa9gK2VCa3zSF0\nN1Og9UGi/IjBM12oevFTxzT7zsfsSLks9emm0SlS66LkXxTgy1Zhuk4/Zdr2FG1C\npoXt8+VxI9Z0dqEbZTjjbWNsOI3O77T6qg9flfEfMim6Wz+NBpbURAnM0RCNrD6y\njXFMtvN2ZQKBgGviJEj9xrGu6jtJeYTcAHdUnCF2/sH/f6fYRmQj1Oe4qHTJtDzx\n/2DWzwmxC5hjWi9qXW4nvAnX7IOEh2F+Q6N/tMZdtRrmqZZujbo+1EiV/fp/V1TJ\nAngR7yDdav72AuGsc3tsmAo3XSUlvpGT1ig2iGGZoAkPzvJkfs6t13UHAoGAUe/p\n+BoFgSdlG1ImPt2ejRFC8sl5+h4nc2+SFsjBlOi5dGl50t+I2rh8rATTFGNSGqmn\niLL/K/wjcLNIbON+zv++VNzFtBFA1hKE+zzKs0/FYRByA1ffuExN3kMyXNhS4rvr\nFhqbxQtUii3icpEYW8bkyBlKERhh4HfG4rX0InkCgYEAp53xdFqClUPbl+WsS9WA\n1gGhbixq62E4mg75aFhClz+Fo3GD8j0h+jBA3Y9ZcPlQViEcNi7/szPilUHrtWe5\nT+tDFvuKSa0STYlah2y1LilsNz2fZeUE6Cjhga357+y/Fqo4PnkuoIc4++KQAZ8/\n7f+VPHY0gSBfP6opcLa8c+8=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-umz0a@shop-spectrum-website.iam.gserviceaccount.com",
    "client_id": "110367213029177802748",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-umz0a%40shop-spectrum-website.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Define your GraphQL schema
const typeDefs = gql`
  type User {
    user_id: String!
    username: String!
    email: String!
    password: String!
    user_address: String!
  }

  type Review {
    review_id: String!
    product_id: String!
    review: String!
  }

  type Product {
    product_id: String!
    product_name: String!
    product_price: Float!
    product_description: String!
    image: String!
    category: String!
  }

  type CartItem {
    user_id: String!
    product_id: String!
    quantity: Int!
    order_id: String
    product: Product
  }

  type Order {
    order_id: String
    user_id: String
    order_status: String
    order_address: String
    order_total: Float
  }

  type Query {
    users: [User]
    products(category: String): [Product]
    getCartItems(user_id: String!): [CartItem]
    getCartTotal(user_id: String!): Float 
    getUser(user_id: String!): User
    getOrdersByUserId(user_id: String!): [Order] 
    checkUserExistence(email: String!, username: String!): Boolean 
    getProductReviews(product_id: String!): [Review]
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      user_address: String!
    ): User
    loginUser(email: String!, password: String!): String!
    addToCart(user_id: String!, product_id: String!, quantity: Int!): String
    placeOrder(
      user_id: String!,
      order_status: String!,
      order_address: String!, 
      order_total: Float!
    ): Order
    deleteCartItem(user_id: String!, product_id: String!): String
  }
`;







// Define your resolvers
const resolvers = {
  Query: {
    users: async () => {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.get();
      return snapshot.docs.map(doc => doc.data());
    },
    products: async (_, { category }) => {
      const productsRef = db.collection('products');
      let query = productsRef;
      if (category) {
        query = productsRef.where('category', '==', category);
      }
      const querySnapshot = await query.get();
      return querySnapshot.docs.map(doc => doc.data());
    },
    getCartItems: async (_, { user_id }) => {
      const cartItemsSnapshot = await db.collection('cart')
        .where('user_id', '==', user_id)
        .where('order_id', '==', null)
        .get();
      return cartItemsSnapshot.docs.map(doc => doc.data());
    },
    getCartTotal: async (_, { user_id }) => {     
      try {
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('order_id', '==', null)
          .get();
          
        if (cartItemsSnapshot.empty) {
          return 0;
        }
        
        let cartTotal = 0;
    
        // Iterate through cart items and fetch product prices from products collection
        for (const cartItemDoc of cartItemsSnapshot.docs) {
          const cartItem = cartItemDoc.data();
          const product_id = cartItem.product_id; // Get product_id from cartItem
        
          // Query products collection using product_id
          const productDoc = await db.collection('products').doc(product_id).get();
        
          if (productDoc.exists) {
            const productPrice = productDoc.data().product_price;
        
            // Calculate cartTotal using productPrice and quantity
            cartTotal += cartItem.quantity * productPrice;
          }
        }
        return cartTotal;
      } catch (error) {
        throw new Error('Failed to fetch cart total');
      }
    },
    getUser: async (_, { user_id }) => {
      try {
          const userDoc = await db.collection('users').doc(user_id).get();
          console.log(userDoc.exists)
          if (userDoc.exists) {
              const user = userDoc.data();
              return user;
          } else {
              throw new Error('User not found');
          }
      } catch (error) {
          throw new Error('Failed to fetch user');
      }
    },
    getOrdersByUserId: async (_, { user_id }) => {
      try {
        const ordersSnapshot = await db.collection('orders')
          .where('user_id', '==', user_id)
          .get();
    
        const orders = ordersSnapshot.docs.map(orderDoc => orderDoc.data());
        return orders;
      } catch (error) {
        throw new Error('Failed to fetch orders');
      }
    },
    checkUserExistence: async (_, { email, username }) => {
      try {
        const snapshot = await db.collection('users')
          .where('email', '==', email)
          .orWhere('username', '==', username)
          .get();
        return !snapshot.empty;
      } catch (error) {
        throw new Error('Failed to check user existence');
      }
    },
    getProductReviews: async (_, { product_id }) => {
      try {
        const snapshot = await db.collection('reviews')
          .where('product_id', '==', product_id)
          .get();
        
        const reviews = snapshot.docs.map(reviewDoc => reviewDoc.data());
        return reviews;
      } catch (error) {
        throw new Error('Failed to fetch product reviews');
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password, user_address }) => {
      try {
        const existingUser = await db.collection('users')
          .where('email', '==', email)
          .get();
  
        if (!existingUser.empty) {
          throw new Error('Email already registered');
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Use the provided user_id as the document ID
        const user_id = db.collection('users').doc().id; // Generate an ID
        const newUser = {
          username,
          user_id,
          email,
          password: hashedPassword,
          user_address,
        };
  
        // Explicitly set the document ID to user_id
        await db.collection('users').doc(user_id).set(newUser);
  
        return { ...newUser, user_id };
      } catch (error) {
        throw new Error('Failed to register user');
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const userQuerySnapshot = await db.collection('users')
          .where('email', '==', email.toLowerCase())
          .get();
    
        if (userQuerySnapshot.empty) {
          throw new Error('User not found');
        }
    
        const userData = userQuerySnapshot.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
    
        if (!passwordMatch) {
          throw new Error('Invalid password');
        }
    
        // Replace 'your-secret-key' with your actual secret key
        const token = jwt.sign({ user_id: userData.user_id }, 'your-actual-secret-key', {
          expiresIn: '1h',
        });
    
        return JSON.stringify({
          token,
          user_id: userData.user_id,
          username: userData.username
        });
      } catch (error) {
        throw new Error('Failed to login');
      }
    },
    addToCart: async (_, { user_id, product_id, quantity }) => {
      try {
        const existingCartItem = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('product_id', '==', product_id)
          .where('order_id', '==', null)
          .get();
  
        if (!existingCartItem.empty) {
          // Update existing cart item
          const cartItemRef = db.collection('cart').doc(existingCartItem.docs[0].id);
          await cartItemRef.update({ quantity: existingCartItem.docs[0].data().quantity + quantity });
        } else {
          // Insert new cart item
          await db.collection('cart').add({
            user_id,
            product_id,
            quantity,
            order_id: null,
          });
        }
  
        return 'Product added to cart';
      } catch (error) {
        throw new Error('Failed to add product to cart');
      }
    },
    placeOrder: async (_, { user_id, order_status, order_address, order_total }) => {
      try {
        const orderRef = await db.collection('orders').add({
          user_id,
          order_status,
          order_address,
          order_total,
        });
  
        const order_id = orderRef.id;
  
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('order_id', '==', null)
          .get();
  
        const cartItemUpdates = cartItemsSnapshot.docs.map(cartItemDoc => {
          return cartItemDoc.ref.update({ order_id });
        });
  
        await Promise.all(cartItemUpdates);
  
        return {
          user_id,
          order_id,
          order_status,
          order_address,
          order_total,
        };
      } catch (error) {
        throw new Error('Failed to place order');
      }
    },
    deleteCartItem: async (_, { user_id, product_id }) => {
      try {
        const cartItemsSnapshot = await db.collection('cart')
          .where('user_id', '==', user_id)
          .where('product_id', '==', product_id)
          .where('order_id', '==', null)
          .get();
  
        if (!cartItemsSnapshot.empty) {
          const cartItemRef = cartItemsSnapshot.docs[0].ref;
          await cartItemRef.delete();
          return 'Cart item deleted successfully';
        } else {
          throw new Error('Cart item not found');
        }
      } catch (error) {
        throw new Error('Failed to delete cart item');
      }
    },
  },
  CartItem: {
    product: async (parent) => {
      try {
        const productDoc = await db.collection('products').doc(parent.product_id).get();
        if (productDoc.exists) {
          return productDoc.data();
        }
        return null;
      } catch (error) {
        console.error('Error fetching product from Firestore:', error);
        throw new Error('Failed to fetch product');
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();

  const app = express();
  app.use(cors())
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();