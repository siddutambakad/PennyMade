import React, {createContext, useContext, useState} from 'react';
import {APIS} from '../../src/configs/apiUrls';
import axios from 'axios';

export const CategoriesContext = createContext();

// export const useCategories = () => {
//   return useContext(CategoriesContext);
// };

export const CategoriesProvider = props => {
  const [contextCategories, setContextCategories] = useState([]);
  const [selectedSubCatagories, setSelectedSubCatagories] = useState([]);
  
  // const  [dropDownData, setDropDownData] = useState([])
  // console.log('============', selectedSubCatagories);

  // trigger and get search by data
  const getSubCatagories = async category_Id => {
    // console.log('-------------selectedcatory', category_Id);
    try {
      const apiUrl = `${APIS.getSubCategories}/${category_Id}/`;
      const response = await axios.get(apiUrl);
      setSelectedSubCatagories(response.data?.data);
    } catch (error) {
      setSelectedSubCatagories([])
      console.log('selectedcatgories', error);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        contextCategories,
        setContextCategories,
        getSubCatagories,
        selectedSubCatagories,
      }}>
      {props.children}
    </CategoriesContext.Provider>
  );
};

