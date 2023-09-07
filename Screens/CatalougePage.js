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
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Search from '../assets/images/search.svg';
import CustomDropdown from '../Screens/componet/CustomDropdown';
import DropdownSelector from '../Screens/componet/DropDown';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Loader from './componet/Loader/Loader';
import {CategoriesContext} from './componet/AppContext';
import Dropdowns from './componet/Dropdowns';
import CheckBox from '../assets/images/checkbox.svg';
import Toast, {ErrorToast} from 'react-native-toast-message';

const CatalougePage = ({navigation, route}) => {
  const {books} = route.params;
  const [particularItems, setParticularItems] = useState([]);
  // console.log("particularItems",particularItems);
  const {contextCategories, getSubCatagories, selectedSubCatagories} =
    useContext(CategoriesContext);
  const [page, setPage] = useState(1);
  const [reference, setReference] = useState('');
  // console.log("sdada,reference",reference);
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

  // const [searchByCatagory, setSearchByCatagory] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState({
    itemName: 'Newest Items',
    type: 'newlyUpdated',
  });
  const items = [
    {itemName: 'Newest Items', type: 'newlyUpdated'},
    {itemName: 'Author', type: 'author'},
    {itemName: 'Title', type: 'title'},
    {itemName: 'Price-High', type: 'price_high'},
    {itemName: 'Price-Low', type: 'price_low'},
  ];
  const [loader, setLoader] = useState(true);

  const handleDropdowndata = data => {
    // Create an empty array to store the modified data
    let drpData = data.map(item => {
      item = {...item, itemName: item.name};
      return item;
    });
    return drpData;
  };

  // This useEffect is triggered whenever the 'books' state changes.
  useEffect(() => {
    setSelectedCatagories({itemName: books.name});
    setCategory(books.category);
  }, [books]);

  // This useEffect is triggered whenever any of the dependencies change:
  // 'selectedFilter.type', 'page', and 'category'.
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

  const handleSearch = async () => {
    setIsSearched(true);
    setLoader(true);
    setIsReference(false);
    try {
      ///body for the post api

      const searchParams = {
        term: searchKeyword,
        adesc: selectedOption3 ? 1 : 0,
        category_number: selectedOption2 ? 1 : 0,
        sortby: selectedFilter.type,
        page: page,
      };
      console.log(
        '🚀 ~ file: CatalougePage.js:124 ~ handleSearch ~ api:',
        searchParams,
      );
      // return
      const response = await axios.post(APIS.getSearchItems, searchParams);

      // Check if "searchresults" key exists in the response
      if (response?.data?.searchresults) {
        const searchData = response?.data; // Extract search results
        let _searchData = {...searchData, data: searchData.searchresults};
        // console.log('Search Response _searchData:', _searchData?.data);
        setParticularItems(_searchData);
      } else {
        // Handle the case when "searchresults" key is not found
        setParticularItems([]);
      }
    } catch (error) {
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

  const getSearchBySubCat = async (category, reference, filtertype, page) => {
    setLoader(true);
    const url = `${APIS.getSearchByCat}/${category}/${reference}/${filtertype}/${page}/`;

    // console.log(
    //   '🚀 ~ file: CatalougePage.js:169 ~ getSearchBySubCat ~ url:',
    //   url,
    // );
    try {
      const response = await axios.get(url);
      setParticularItems(response?.data?.data);
      // console.log(
      //   '🚀 ~ file: CatalougePage.js:166 ~ getSearchBySubCat ~ response?.data.data:',
      //   response.data,
      // );
    } catch (error) {
      console.log('Responce search sub cat Error', error);
    } finally {
      setLoader(false);
    }
  };

  const renderBooksItem = ({item}) => (
    <View style={styles.secondCard}>
      <View style={{alignItems: 'center', padding: 10}}>
        {item.image && item.image.length > 0 && (
          <Image
            source={{uri: item.image[0].url}} // Display the first image if available
            style={{
              width: '65%',
              height: 200,
              marginTop: 10,
            }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.secondcardauthor} ellipsizeMode="tail">
          {item.author}
        </Text>
        <Text style={styles.secondcardtext}>€ {item.price}</Text>
      </View>
      <Text
        style={styles.secondcardtitle}
        ellipsizeMode="tail"
        numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.secondcarddes} ellipsizeMode="tail" numberOfLines={3}>
        {item.description}
      </Text>
      <TouchableOpacity style={styles.Addtocartbutton} activeOpacity={1}>
        <Text style={styles.addtocarttext}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );

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

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = index => {
    if (index === openDropdownIndex) {
      // Clicking on the currently open dropdown, close it
      setOpenDropdownIndex(null);
    } else {
      // Clicking on a different dropdown, open it and close the previously open one
      setOpenDropdownIndex(index);
    }
  };
  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imagebackground}>
      <View style={styles.headerContainer}>
        <View>
          <Logo />
        </View>
        <TouchableOpacity style={styles.shopingCartImg}>
          <Shoppingcart width={22} height={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu width={43} height={43} />
        </TouchableOpacity>
      </View>
      <View style={{marginLeft: 15, marginBottom: 10}}>
        <CustomDropdown
          options={handleDropdowndata(contextCategories)}
          setSelectedValue={async item => {
            setIsReference(false);
            setIsSearched(false);
            const id = item?.category;
            setSelectedCatagories(item);
            setCategory(id);

            if (id) {
              await getSubCatagories(id);
            }
          }}
          selectedValue={selectedCatagories}
          selectedCategoryName={selectedCatagories.itemName}
        />
      </View>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
      
      <View
        style={{
          justifyContent: 'center',
          paddingBottom: 25,
          marginHorizontal: 8,
        }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={selectedSubCatagories}
          renderItem={({item, index}) => (
            <Dropdowns
              initialText={item.name}
              options={item.dropdownlist}
              handleClick={item => {
                setIsSearched(false);
                setIsReference(true);
                setReference(item.reference);
                setSelectedValue(item.name);
              }}
              isClicked={index === openDropdownIndex}
              setIsClicked={() => toggleDropdown(index)}
              key={item.name}
            />
          )}
          keyExtractor={item => item.name}
        />
      </View>
      {/* </ScrollView> */}
      <View style={styles.searchFlex}>
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* whole catalouge and this category */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 15,
            marginTop: 15,
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
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
              setSelectedOption2('This category');
              setSelectedOption1(false);
            }}>
            <View style={styles.circle}>
              {selectedOption2 === 'This category' && (
                <View style={styles.dotCircle}></View>
              )}
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
          style={{
            flexDirection: 'row',
            marginTop: 15,
            alignItems: 'center',
            marginHorizontal: 15,
            flex: 1,
          }}>
          <View style={styles.checkbox}>{selectedOption3 && <CheckBox />}</View>
          <Text style={styles.searchTexts}>Search by description</Text>
        </TouchableOpacity>
        <View style={{marginBottom: 15}}>
          <Text style={styles.titlename}>{selectedCatagories.itemName}</Text>
          <Text style={styles.titledes}>
            {contentData
              ? contentData?.category_footer
                  ?.replace(/<[^>]+>/g, '')
                  .replaceAll('&nbsp;', '')
              : ''}
          </Text>
        </View>
        {particularItems && (
          <DropdownSelector
            items={items.filter(val => val)}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setPage={setPage}
            style={styles.dropdownselect}
          />
        )}
        <FlatList
          scrollEnabled={false}
          data={particularItems?.data}
          renderItem={renderBooksItem}
        />
        {particularItems && (
          <View style={styles.paginationAndSearch}>
            {renderButtons()}
            {renderSearch()}
          </View>
        )}
        {/* footer content */}
        <View style={styles.footerContainer}>
          <View style={styles.footerContent}>
            <Image
              source={require('../assets/images/Payment1.png')}
              style={{height: '100%', width: '47%', resizeMode: 'stretch'}}
            />
            <Image
              source={require('../assets/images/Reviews1.png')}
              style={{width: '47%', height: '100%', resizeMode: 'stretch'}}
            />
          </View>
          <View style={{marginTop: 50}}>
            <Image
              source={require('../assets/images/socialmedia.png')}
              style={styles.socialMediaImg}
            />
          </View>
          <Text style={styles.footerText}>
            Copyright © 2023, Pemmymead | All Rights Reserved | Terms &
            Conditions | Privacy Policy
          </Text>
        </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
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
    marginTop: 10,
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
    marginVertical: 15,
  },
  titledes: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 15,
    marginVertical: 15,
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
    marginTop: 30,
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
    // alignSelf: 'center',
    justifyContent: 'space-around',
    width: '92%',
  },
  forwardButton: {
    borderWidth: 1,
    // margin: 5,
    marginHorizontal: 5,
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
    margin: 5,
    // flex: 1,
    // paddingBottom: 15,
    width: 45,
    height: 45,
    borderColor: '#873900',
    marginBottom: 10,
    borderRadius: 5,
  },
  backwardButton: {
    borderWidth: 1,
    // margin: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    borderRadius: 5,
    marginBottom: 5,
    marginHorizontal: 5,
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
});
