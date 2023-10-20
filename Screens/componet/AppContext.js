import React, {createContext, useContext, useState} from 'react';
import {APIS} from '../../src/configs/apiUrls';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Toast from 'react-native-toast-message';

export const CategoriesContext = createContext();

export const CategoriesProvider = ({children}) => {
  const [contextCategories, setContextCategories] = useState([]);
  const [selectedSubCatagories, setSelectedSubCatagories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [viewCollectible, setViewCollectible] = useState([]);

  // trigger and get search by data
  // const getSubCatagories = async category_Id => {
  //   // console.log('-------------selectedcatory', category_Id);
  //   try {
  //     const apiUrl = `${APIS.getSubCategories}/${category_Id}/`;
  //     const response = await axios.get(apiUrl);
  //     setSelectedSubCatagories(response.data?.data);
  //   } catch (error) {
  //     setSelectedSubCatagories([]);
  //     console.log('selectedcatgories', error);
  //   }
  // };

  const getSubCatagories = category_Id => {
    // console.log('-------------selectedcatory', category_Id);
    const apiUrl = `${APIS.getSubCategories}/${category_Id}/`;

    // Send a GET request to the API URL using axios and handle the response and errors.
    axios
      .get(apiUrl)
      .then(response => {
        setSelectedSubCatagories(response.data?.data);
      })
      .catch(error => {
        setSelectedSubCatagories([]);
        console.log('selectedcatgories', error);
      });
  };

  const getCollectibles = async () => {
    try {
      const apiUrl = `http://54.226.77.97:81/view/collectable_items/`;
      const response = await axios.get(apiUrl);
      setViewCollectible(response?.data?.collectableitems);
    } catch (error) {
      console.log('collectible error', error);
    }
  };

  const addToCart = sysid => {
    // Check if the product is already in the cart
    const existingProductIndex = cartItems.findIndex(
      item => item.sysid === sysid,
    );

    if (existingProductIndex !== -1) {
      // Product is already in the cart, so update its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].selectedQuantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Product is not in the cart, add it as a new entry
      setCartItems([...cartItems, {sysid, selectedQuantity: 1}]);
    }
  };

  const removeItem = sysid => {
    // Find the index of the item to be removed in the cartItems array
    const itemIndex = cartItems.findIndex(item => item.sysid === sysid);

    if (itemIndex !== -1) {
      // Create a new copy of the cartItems array without the selected item
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(itemIndex, 1);

      // Update the cartItems state with the updated array
      setCartItems(updatedCartItems);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        contextCategories,
        setContextCategories,
        getSubCatagories,
        selectedSubCatagories,
        cartItems,
        setCartItems,
        addToCart,
        removeItem,
        getCollectibles,
        viewCollectible,
      }}>
      {children}
    </CategoriesContext.Provider>
  );
};
