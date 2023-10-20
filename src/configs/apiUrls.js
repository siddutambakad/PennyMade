const BASE_URL = 'http://54.226.77.97:81';

export const APIS = {
  getCategories: `${BASE_URL}/view/categories/`,
  getCollectableItems: `${BASE_URL}/view/allCategoryData/`,
  getParticularItems: `${BASE_URL}/view/category/`,
  getSearchItems: `${BASE_URL}/view/search-keyword/`,
  getSubCategories: `${BASE_URL}/view/getsubcat_dropdownlist/`,
  getSearchByCat: `${BASE_URL}/view/search-by-subcat`,
  getProductDetail: `${BASE_URL}/view/product_detail`,
  getContactDetails: `${BASE_URL}/cms/getcontactpage_content/`,
  getCollectibleCartItems: `${BASE_URL}/view/collectable_items/`,
  getCountryList: `${BASE_URL}/view/countries/`,
  getOrderSummary: `${BASE_URL}/view/orderSummary`,
  getEmailvalue: `${BASE_URL}/view/verifyemail/`,
  getVerifyOtp: `${BASE_URL}/view/verifyotp/`,
  getTrackByEmail: `${BASE_URL}/view/getOrderdetailbyEmail`,
};
