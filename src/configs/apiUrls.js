const BASE_URL= "http://54.226.77.97:81"

// export default GET_CAT_DATA = `${BASE_URL}view/allCategoryData/`
export const APIS={
    getCategories:`${BASE_URL}/view/categories/`,
    getCollectableItems:`${BASE_URL}/view/allCategoryData/`,
    getParticularItems:`${BASE_URL}/view/category/`,
    getSearchItems: `${BASE_URL}/view/search-keyword/`,
    getSubCategories: `${BASE_URL}/view/getsubcat_dropdownlist/`,
    getSearchByCat: `${BASE_URL}/view/search-by-subcat`,
    // const url = 'http://54.226.77.97:81/view/search-by-subcat/1/239/new/1/';

}