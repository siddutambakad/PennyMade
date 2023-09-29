import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Search from '../assets/images/search.svg';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Loader from './componet/Loader/Loader';
import {CategoriesContext} from './componet/AppContext';
import Dropdowns from './componet/Dropdowns';
import CheckBox from '../assets/images/checkbox.svg';
import Toast from 'react-native-toast-message';
import Filter from '../assets/images/filter.svg';
import Footer from './componet/Footer';
import Card from './componet/Card';

const CatalougePage = ({navigation, route}) => {
  const {books, subDropdown, searchingData} = route.params;
  const [particularItems, setParticularItems] = useState([]);
  const {
    contextCategories,
    getSubCatagories,
    selectedSubCatagories,
    addToCart,
    cartItems,
  } = useContext(CategoriesContext);
  const [page, setPage] = useState(1);
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCatagories, setSelectedCatagories] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('Whole Catalogue');
  const [selectedOption2, setSelectedOption2] = useState(false);
  const [selectedOption3, setSelectedOption3] = useState(false);
  const [contentData, setContentData] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isReference, setIsReference] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');

  const [selectedFilter, setSelectedFilter] = useState({
    name: 'Newest Items',
    type: 'newlyUpdated',
  });
  const items = [
    {name: 'Newest Items', type: 'newlyUpdated'},
    {name: 'Author', type: 'author'},
    {name: 'Title', type: 'title'},
    {name: 'Price-High', type: 'price_high'},
    {name: 'Price-Low', type: 'price_low'},
  ];
  const [loader, setLoader] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (searchingData) {
      setSelectedCatagories(
        searchingData.category_number == 0 ? '' : searchingData.categoryname,
      );
      setSearchKeyword(searchingData.term);
      const searchParams = {
        term: searchingData.term,
        adesc: searchingData.adesc,
        category_number: searchingData.category_number,
        sortby: searchingData.sortby,
        page: searchingData.page,
      };
      searchApi(searchParams);
    }
  }, [searchingData]);

  // This useEffect is triggered whenever the 'books' state changes.
  useEffect(() => {
    setSelectedCatagories({name: books?.name || selectedCatagories?.name});
    setCategory(books?.category);
  }, [books]);

  ///// this is trigger whenever the dropdown is clicked from the productdetail page
  useEffect(() => {
    if (subDropdown) {
      setIsSearched(false);
      setIsReference(true);
      // setCategory(subDropdown.category);
      getSubCatagories(subDropdown.category);
      setReference(subDropdown.reference);
      setSelectedValue(subDropdown.name);
    }
  }, [subDropdown, category]);

  useEffect(() => {
    // Check if 'isSearched' is true. If true, execute the 'handleSearch' function.
    if (isSearched) {
      /////it will print the searched products when it is true
      handleSearch();
    } else if (isReference) {
      getSearchBySubCat(category, reference, selectedFilter.type, page);
    } else {
      // If 'isSearched' is false, execute 'getPerticularCategories' function
      // with the specified parameters: 'selectedFilter.type', 'page', and 'category'.
      getPerticularCategories(selectedFilter.type, page, category);
    }
  }, [selectedFilter.type, page, category, reference]);

  const getPerticularCategories = async (filtertype, page, category) => {
    // Set the loader to true to indicate that data is being fetched.
    setLoader(true);

    // set the API URL based on the provided parameters.
    const apiUrls = `${APIS.getParticularItems}${category}/${filtertype}/${page}/`;

    try {
      // Send a GET request to the  API URL using axios.
      const response = await axios.get(apiUrls);

      // Set the 'particularItems' state with the data received from the API response.
      setParticularItems(response?.data?.data);
      setContentData(response?.data?.categorydescription[0] || null);
    } catch (error) {
      console.log('response', error);
    } finally {
      // Whether the request succeeds or fails, set the loader back to false
      // to indicate that data fetching is complete.
      setLoader(false);
    }
  };

  const getCategoryNumber = category => {
    if (category && contextCategories) {
      const data = contextCategories.filter(item => item.category === category);
      if (data.length > 0) {
        return data[0].category;
      }
    }
  };

  const searchApi = async searchParams => {
    setIsSearched(true);
    setLoader(true);
    setIsReference(false);
    try {
      const response = await axios.post(APIS.getSearchItems, searchParams);

      // Check if "searchresults" key exists in the response
      if (response?.data?.searchresults) {
        const searchData = response?.data; // Extract search results
        let _searchData = {...searchData, data: searchData.searchresults};
        // console.log('Search Response _searchData:', _searchData?.data);
        setParticularItems(_searchData);
        setDisplayTitle(`Showing results for '${searchKeyword}'`);
      } else {
        // Handle the case when "searchresults" key is not found
        setParticularItems([]);
      }
    } catch (error) {
      console.log('responsce search error in catalouge', error);
      Toast.show({
        type: 'tomatoToast',
        text1: 'No Data Found',
        visibilityTime: 2500,
        position: 'bottom',
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSearch = async () => {
    // setIsSearched(true);
    // setLoader(true);
    // setIsReference(false);
    const searchParams = {
      term: searchKeyword,
      adesc: selectedOption3 ? 1 : 0,
      category_number: selectedOption2
        ? getCategoryNumber(selectedCatagories)
        : 0,
      sortby: selectedFilter.type,
      page: page,
    };
    searchApi(searchParams);
    // try {
    //   ///body for the post api
    //   const searchParams = {
    //     term: searchKeyword,
    //     adesc: selectedOption3 ? 1 : 0,
    //     category_number: selectedOption2 ? getCategoryNumber(selectedCatagories) : 0,
    //     sortby: selectedFilter.type,
    //     page: page,
    //   };
    //   console.log("🚀 ~ file: CatalougePage.js:167 ~ handleSearch ~ searchParams:", searchParams)
    //   // return
    //   const response = await axios.post(APIS.getSearchItems, searchParams);
    //   console.log("🚀 ~ file: CatalougePage.js:169 ~ handleSearch ~ response:", response)

    //   // Check if "searchresults" key exists in the response
    //   if (response?.data?.searchresults) {
    //     const searchData = response?.data; // Extract search results
    //     let _searchData = {...searchData, data: searchData.searchresults};
    //     // console.log('Search Response _searchData:', _searchData?.data);
    //     setParticularItems(_searchData);
    //     setDisplayTitle(`Showing results for '${searchKeyword}'`);
    //   } else {
    //     // Handle the case when "searchresults" key is not found
    //     setParticularItems([]);
    //   }
    // } catch (error) {
    //   console.log('responsce search error in catalouge', error);
    //   Toast.show({
    //     type: 'tomatoToast',
    //     text1: 'No Data Found',
    //     visibilityTime: 2500,
    //     position: 'bottom',
    //   });
    // } finally {
    //   setLoader(false);
    // }
  };

  const getSearchBySubCat = async (category, reference, filtertype, page) => {
    setLoader(true);
    const url = `${APIS.getSearchByCat}/${category}/${reference}/${filtertype}/${page}/`;

    try {
      const response = await axios.get(url);
      setParticularItems(response?.data?.data);
    } catch (error) {
      console.log('Responce subcat dropdown', error);
    } finally {
      setLoader(false);
    }
  };

  const handleCart = item => {
    addToCart(item);
  };

  const renderBooksItem = ({item, index}) => {
    return (
      <Card
        imgSource={item.image && item.image.length > 0 ? item.image[0] : null}
        author={item.author}
        price={item.price}
        title={item.title}
        description={item.description}
        handlePress={() => {
          handleCart(item.sysid);
        }}
        handlePressCard={() => {
          navigation.navigate('ProductDetail', {sysid: item.sysid});
        }}
        cardIndex={index}
      />
    );
  };

  const getBackground = item => {
    if (item?.value === page) {
      return '#873900';
    } else {
      return '#FFF8F2';
    }
  };
  // page text color
  const getTextColor = item => {
    if (item?.value === page) {
      return '#FFF8F2';
    } else {
      return '#873900';
    }
  };

  // button pagination starts
  const renderButtons = () => {
    ///pagination buttons data
    let data = [
      {
        id: 1,
        value: page > Math.floor(particularItems.totalpages / 2) ? 1 : page,
      },
      {
        id: 2,
        value:
          page > Math.floor(particularItems.totalpages / 2)
            ? 2
            : page + 1 > particularItems.totalpages
            ? ''
            : page + 1,
      },
      {id: 3, value: particularItems.totalpages > 4 ? '---' : ''},
      {
        id: 4,
        value:
          page > Math.floor(particularItems.totalpages / 2)
            ? page - 1
            : particularItems.totalpages - 1 > 0
            ? particularItems.totalpages - 1
            : '',
      },
      {
        id: 5,
        value:
          page > Math.floor(particularItems.totalpages / 2)
            ? page
            : particularItems.totalpages,
      },
    ];
    ///static data if total pages are lessthen 5
    let data1 = [
      {
        id: 1,
        value: 1,
      },
      {
        id: 2,
        value: 2 > particularItems.totalpages ? '' : 2,
      },
      {
        id: 4,
        value: 3 > particularItems.totalpages ? '' : 3,
      },
      {
        id: 5,
        value: 4 > particularItems.totalpages ? '' : 4,
      },
    ];
    ///removing duplicate values from data
    let data3 = (particularItems.totalpages < 5 ? data1 : data).filter(
      item => item.value != '',
    );
    let data4 = [...new Map(data3.map(item => [item.value, item])).values()];
    return (
      <View style={styles.paginationFlex}>
        {particularItems.totalpages > 1 &&
          particularItems.totalpages >= 2 && ( /// display the backward button the page button should be greater then 1 && should not apear for only 1 total page
            <TouchableOpacity ///backward button for buttons
              onPress={() => {
                if (page > 1) {
                  setPage(parseInt(page - 1));
                }
              }}
              disabled={page <= 1 ? true : false}
              style={[styles.forwardButton, {opacity: page <= 1 ? 0 : 1}]}>
              <Text style={styles.forwardButtonText}>{'<'}</Text>
            </TouchableOpacity>
          )}
        {/* map the buttons to display  */}
        {data4.map(item => (
          <TouchableOpacity
            disabled={item.id === 3 ? true : false}
            key={item.id}
            style={[
              styles.paginationButton,
              {backgroundColor: getBackground(item)},
            ]}
            onPress={() => {
              setPage(parseInt(item.value));
            }}>
            <Text
              style={{
                color: getTextColor(item),
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              {item.value}
            </Text>
          </TouchableOpacity>
        ))}
        {particularItems.totalpages >= 2 && ( /// display the button if pages are more then 1 only
          <TouchableOpacity /// forward button for the page button pagination
            onPress={() => {
              if (page < particularItems.totalpages) {
                setPage(page + 1);
              }
            }}
            disabled={page === particularItems.totalpages}
            style={[
              styles.backwardButton,
              {
                opacity: page === particularItems.totalpages ? 0 : 1,
              },
            ]}>
            <Text style={{color: '#873900'}}>{'>'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  // page searching design
  const renderSearch = () => (
    <>
      <View style={styles.searcFlex}>
        <Text style={styles.searchText}>Go To Page</Text>
        <TextInput
          style={styles.inputText}
          keyboardType="phone-pad"
          maxLength={4}
          onChangeText={text => setInputSearch(text)}
          value={inputSearch}
        />
        <TouchableOpacity onPress={handleGoToPage}>
          <Text style={styles.goButton}>Go {'>'}</Text>
        </TouchableOpacity>
      </View>
      {error !== '' && <Text style={{color: 'red'}}>{error}</Text>}
    </>
  );
  /// page search functionality
  const handleGoToPage = () => {
    const enteredPage = parseInt(inputSearch); // Convert user's input to a number

    // Check if parsedPage is a valid number and within the allowed range
    if (enteredPage >= 1 && enteredPage <= particularItems.totalpages) {
      setPage(enteredPage); // Update the current page
      setError('');
      setInputSearch('');
    } else {
      setError('Page number should be in allowed range');
    }
  };

  const toggleDropdown = index => {
    setIsOpen(false);
    setIsClicked(false);
    if (index === openDropdown) {
      // Clicking on the currently open dropdown, close it
      setOpenDropdown(null);
      setSelectedValue('');
    } else {
      // Clicking on a different dropdown, open it and close the previously open one
      setOpenDropdown(index);
    }
  };
  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imagebackground}>
      <View style={styles.headers}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomePage')}
          style={{marginLeft: -8}}>
          <Logo width={180} height={25} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CartScreen');
            }}
            style={styles.pressableImage}>
            <Shoppingcart width={22} height={22} />
            {cartItems.length > 0 && (
              <View style={styles.cartItemCount}>
                <Text
                  style={{
                    ...styles.cartItemCountText,
                    fontSize: cartItems.length > 99 ? 10 : 12, // Adjust the font size as needed
                  }}>
                  {cartItems.length > 99 ? '99+' : cartItems.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingLeft: 10}}
            onPress={() => navigation.openDrawer()}>
            <Menu width={43} height={43} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* first category list dropdown */}
        {particularItems?.data && (
          <View
            style={{
              flex: 1,
              marginHorizontal: 15,
              zIndex: 5,
              marginBottom: 10,
            }}>
            <Dropdowns
              initialText={selectedCatagories?.name}
              style={styles.firstDropdown}
              customOptionStyles={styles.firstdropdownOptions}
              isGradient={true}
              options={contextCategories}
              handleClick={async item => {
                setIsReference(false);
                setIsSearched(false);
                const id = item?.category;
                setSelectedCatagories(item);
                setCategory(id);

                if (id) {
                  await getSubCatagories(id);
                }
              }}
              // setPage={setPage}
              isClicked={isOpen}
              setIsClicked={() => {
                setIsOpen(!isOpen);
                setOpenDropdown(null);
                setIsClicked(false);
              }}
            />
          </View>
        )}
        {/* subcategory dropdowns */}
        {particularItems?.data && (
          <View
            style={{
              marginHorizontal: 8,
              zIndex: 1,
              marginTop: isOpen ? -140 : 10,
            }}>
            <FlatList
              horizontal
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              data={selectedSubCatagories}
              renderItem={({item, index}) => (
                <View style={{marginHorizontal: 8}}>
                  <Dropdowns
                    initialText={item.name || subDropdown.name}
                    isGradient={true}
                    options={item.dropdownlist}
                    style={styles.secondDropdown}
                    customOptionStyles={styles.secondDropdownOptions}
                    handleClick={item => {
                      setIsSearched(false);
                      setIsReference(true);
                      setReference(item.reference);
                      setSelectedValue(item.name);
                    }}
                    isClicked={item === openDropdown}
                    setIsClicked={() => toggleDropdown(item)}
                    setPage={setPage}
                    key={item.name}
                  />
                </View>
              )}
              keyExtractor={item => item.name}
            />
          </View>
        )}
        {/* input field for the searchoptions */}
        <View
          style={{...styles.searchFlex, marginTop: openDropdown ? -150 : 10}}>
          <TextInput
            style={styles.inputsearch}
            onChangeText={text => {
              setSearchKeyword(text);
            }}
            placeholder="Enter Something......."
            placeholderTextColor={'#873900'}
            value={searchKeyword}
          />
          <TouchableOpacity
            style={styles.searchbutton}
            onPress={handleSearch}
            activeOpacity={1}>
            <Search />
          </TouchableOpacity>
        </View>

        {/* whole catalouge and this category */}
        <View style={styles.wholeAndCategory}>
          <TouchableOpacity
            style={styles.wholeCatalouge}
            activeOpacity={1}
            onPress={() => {
              setSelectedOption1('Whole Catalogue');
              setSelectedOption2(false);
            }}>
            <View style={styles.circle}>
              {selectedOption1 === 'Whole Catalogue' && (
                <View style={styles.dotCircle}></View>
              )}
            </View>
            <Text style={styles.radioText}>Whole Catalogue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            activeOpacity={1}
            onPress={() => {
              setSelectedOption2(true);
              setSelectedOption1(false);
            }}>
            <View style={styles.circle}>
              {selectedOption2 && <View style={styles.dotCircle}></View>}
            </View>
            <Text style={styles.radioText2}>This Category</Text>
          </TouchableOpacity>
        </View>

        {/* search by category */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelectedOption3(!selectedOption3);
          }}
          style={styles.searchCategory}>
          <View style={styles.checkbox}>{selectedOption3 && <CheckBox />}</View>
          <Text style={styles.searchTexts}>Search by description</Text>
        </TouchableOpacity>
        {/* displaying the text and description of book */}
        <View style={{}}>
          <Text style={styles.titlename}>
            {isSearched ? displayTitle : selectedCatagories.name}
          </Text>
          <Text style={styles.titledes}>
            {contentData
              ? contentData?.category_description
                  ?.replace(/<[^>]+>/g, '')
                  .replaceAll('&nbsp;', '')
              : ''}
          </Text>
        </View>
        {/* filter types starts */}
        {particularItems?.data && (
          <View style={styles.filterAnd}>
            <View style={styles.filterContent}>
              <Filter />
              <Text style={styles.filterText}>Filters</Text>
            </View>
            <Dropdowns
              initialText={selectedFilter?.name}
              options={items.filter(val => val)}
              style={styles.filterDropdown}
              customOptionStyles={styles.filterDropdownOptions}
              handleClick={item => {
                setSelectedFilter(item);
                setOpenDropdown(null);
                setPage(1);
              }}
              isGradient={false}
              setPage={setPage}
              isClicked={isClicked} // -1 indicates that it's the filter dropdown
              setIsClicked={() => {
                setIsClicked(!isClicked);
                setIsOpen(false);
                setOpenDropdown(null);
              }}
            />
          </View>
        )}
        {/* rendering the books  */}
        <FlatList
          // nestedScrollEnabled={true}
          scrollEnabled={false}
          data={particularItems?.data}
          // style={{marginTop: isClicked ? -145 : 15}}
          renderItem={renderBooksItem}
        />
        {/* rendering the pagination buttons  */}
        {particularItems?.data && (
          <View style={styles.paginationAndSearch}>
            {renderButtons()}
            {renderSearch()}
          </View>
        )}
        {/* footer content */}
        <Footer />
      </ScrollView>
      {loader && <Loader />}
    </ImageBackground>
  );
};

export default CatalougePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  imagebackground: {
    flex: 1,
  },
  pressableImage: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#873900',
    borderRadius: 50,
    // paddingRight: 10,
    marginRight: 7,
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 15,
  },
  shopingCartImg: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#873900',
  },
  dropDown: {
    flexDirection: 'row',
  },
  searchFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginVertical: 15,
    // backgroundColor: 'red',
  },
  inputsearch: {
    borderWidth: 1,
    width: '80%',
    height: 50,
    borderColor: '#873900',
    padding: 10,
    color: '#873900',
  },
  searchbutton: {
    borderWidth: 1,
    width: 42,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    padding: 10,
  },
  radioText: {
    color: '#873900',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  radioText2: {
    color: '#873900',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  searchTexts: {
    color: '#873900',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  titlename: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 22,
    fontWeight: '400',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  titledes: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    fontSize: 16,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  secondCard: {
    width: '85%',
    minHeight: 380,
    alignSelf: 'center',
    margin: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
    backgroundColor: '#FFF8F2',
    borderRadius: 5,
  },
  secondcardauthor: {
    padding: 10,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 17,
    fontWeight: '700',
  },
  secondcardtitle: {
    padding: 10,
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '700',
  },
  secondcardtext: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '700',
  },
  secondcarddes: {
    color: 'black',
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },

  Addtocartbutton: {
    width: 120,
    padding: 15,
    backgroundColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    borderRadius: 5,
  },
  addtocarttext: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '600',
  },
  footerContainer: {
    height: 380,
    backgroundColor: '#873900',
    marginTop: 20,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '30%',
    width: '100%',
    marginTop: 20,
    // borderWidth:3
  },
  footerText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#FFF8F2',
  },
  socialMediaImg: {
    width: 130,
    height: 70,
    resizeMode: 'stretch',
  },
  paginationAndSearch: {
    backgroundColor: '#FFF8F2',
    height: 180,
    flex: 1,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  paginationFlex: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
  },
  forwardButton: {
    borderWidth: 1,
    // margin: 5,
    // marginHorizontal: 8,
    marginLeft: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    borderRadius: 5,
    marginBottom: 5,
  },
  forwardButtonText: {
    color: '#873900',
  },
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 3,
    width: 40,
    height: 40,
    borderColor: '#873900',
    marginBottom: 10,
    borderRadius: 5,
  },
  backwardButton: {
    borderWidth: 1,
    // margin: 5,
    marginRight: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    borderRadius: 5,
    marginBottom: 5,
    // marginHorizontal: 5,
  },
  searcFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 15,
    paddingRight: 10,
  },
  inputText: {
    width: 40,
    height: 40,
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#873900',
    borderColor: '#873900',
    borderRadius: 5,
    padding: 5,
  },
  goButton: {
    color: 'black',
    paddingLeft: 20,
    textDecorationLine: 'underline',
    fontSize: 15,
    fontFamily: 'RobotoSlab-Regular',
  },
  dropdownselect: {
    position: 'relative',
  },
  circle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#873900',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: selectedOption && '#873900',
  },
  dotCircle: {
    width: 13,
    height: 13,
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: '#873900',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderColor: '#873900',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '28%',
    padding: 10,
  },
  filterText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    fontSize: 16,
    fontWeight: '600',
  },
  cartItemCount: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    borderWidth: 1,
    borderRadius: 50,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: '#873900',
  },
  cartItemCountText: {
    color: '#fff',
    // fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  firstDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
    alignItems: 'center',
    borderRadius: 5,
    width: 200,
  },
  firstdropdownOptions: {
    backgroundColor: 'white',
    width: 200,
    height: 150,
    borderWidth: 1,
    borderColor: '#873900',
    elevation: 10,
    zIndex: 10,
    // position: 'absolute',
    borderRadius: 3,
    top: 4,
  },
  secondDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
    alignItems: 'center',
    borderRadius: 5,
    width: 160,
  },
  secondDropdownOptions: {
    width: 160,
    height: 160,
    borderColor: '#873900',
    borderRadius: 3,
    zIndex: 5,
    backgroundColor: 'white',
    top: 3,
    // position: 'absolute',
    borderWidth: 1,
  },
  wholeAndCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  wholeCatalouge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchCategory: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
    marginHorizontal: 15,
    flex: 1,
  },
  filterAnd: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flex: 0.5,
    paddingHorizontal: 10,
    zIndex: 3,
    marginVertical: 10,
  },
  filterDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: 200,
    // flex: 1,
    borderWidth: 1,
    padding: 10,
    borderColor: '#873900',
  },
  filterDropdownOptions: {
    width: 200,
    top: 50,
    position: 'absolute',
    // backgroundColor: '#FFF8F2',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#873900',
    height: 150,
  },
});
