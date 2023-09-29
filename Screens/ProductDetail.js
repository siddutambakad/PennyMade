import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Search from '../assets/images/search.svg';
import {CategoriesContext} from './componet/AppContext';
import Dropdowns from './componet/Dropdowns';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import CheckBox from '../assets/images/checkbox.svg';
import Toast from 'react-native-toast-message';
import {LogBox} from 'react-native';
import Card from './componet/Card';
import Footer from './componet/Footer';
import Loader from './componet/Loader/Loader';

const ProductDetail = ({navigation, route}) => {
  const {sysid} = route.params;
  LogBox.ignoreAllLogs();
  const [particularItems, setParticularItems] = useState([]);
  const {
    contextCategories,
    getSubCatagories,
    selectedSubCatagories,
    cartItems,
    addToCart,
  } = useContext(CategoriesContext);
  const [page, setPage] = useState(1);
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  //   const [selectedCatagories, setSelectedCatagories] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    name: 'Newest Items',
    type: 'newlyUpdated',
  });
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('Whole Catalogue');
  const [selectedOption2, setSelectedOption2] = useState(false);
  const [selectedOption3, setSelectedOption3] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isReference, setIsReference] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [product_Detail, setProduct_Detail] = useState([]);
  const [relatableItems, setRelatableItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsSearched(true);
    setLoader(true);
    setIsReference(false);
    try {
      ///body for the post api

      const searchingData = {
        term: searchKeyword,
        adesc: selectedOption3 ? 1 : 0,
        category_number: selectedOption2 ? 1 : 0,
        sortby: selectedFilter.type,
        page: page,
      };
      // return
      const response = await axios.post(APIS.getSearchItems, searchingData);

      // Check if "searchresults" key exists in the response
      if (response?.data?.searchresults) {
        const searchData = response?.data; // Extract search results
        let _searchData = {...searchData, data: searchData.searchresults};
        setParticularItems(_searchData);
      }
    } catch (error) {
      console.log('responsce search error in productdetail', error.response);
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

  const nextImage = () => {
    setCurrentImageIndex(currentImageIndex + 1);
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    // Check if 'isSearched' is true. If true, execute the 'handleSearch' function.
    if (isSearched) {
      /////it will print the searched products when it is true
      handleSearch();
    } else if (isReference) {
      getSearchBySubCat(category, reference, page);
    }
  }, [page, category, reference]);

  useEffect(() => {
    getProductDetail(sysid);
  }, [sysid]);

  const getSearchBySubCat = async (category, reference, filtertype, page) => {
    setLoader(true);
    const url = `${APIS.getSearchByCat}/${category}/${reference}/${filtertype}/${page}/`;

    try {
      const response = await axios.get(url);
      setParticularItems(response?.data?.data);
    } catch (error) {
      console.log('Responce search sub cat Error', error);
    } finally {
      setLoader(false);
    }
  };

  const getProductDetail = async sysid => {
    setLoader(true);
    const res = `${APIS.getProductDetail}/${sysid}/`;
    try {
      const response = await axios.get(res);
      setProduct_Detail(response?.data.productdetail);
      setRelatableItems(response?.data.relateditems);
    } catch (error) {
      console.log('error======1', error);
    } finally {
      setLoader(false);
    }
  };

  const toggleDropdown = index => {
    setIsOpen(false);
    setIsClicked(false);
    if (index === openDropdown) {
      // Clicking on the currently open dropdown, close it
      setOpenDropdown(null);
    } else {
      // Clicking on a different dropdown, open it and close the previously open one
      setOpenDropdown(index);
    }
  };

  const handleCart = item => {
    addToCart(item);
  };

  const renderProductDetail = () => {
    return (
      <View
        style={{alignItems: 'center', alignSelf: 'center', marginVertical: 15}}>
        <View>
          {product_Detail.image && product_Detail.image.length > 0 ? (
            <Image
              source={
                product_Detail.image[currentImageIndex]
                  ? {uri: product_Detail.image[currentImageIndex]}
                  : null // Set source to null if the image source is invalid
              }
              style={{
                width: 180,
                height: 190,
              }}
            />
          ) : (
            <View
              style={{
                marginTop: 10,
              }}>
              <Image
                source={require('../assets/images/placeholderimage.png')}
                style={{width: 180, height: 190}}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const relatedItems = ({item, index}) => {
    return (
      <Card
        imgSource={item.image && item.image.length > 0 ? item.image[0] : null}
        author={item.author}
        price={item.price}
        title={item.title}
        isLoading={isLoading}
        description={item.description}
        handlePress={() => {
          handleCart(item.sysid);
        }}
        handlePressCard={() => {
          getProductDetail(item.sysid);
        }}
        cardIndex={index} 
      />
    );
  };

  /////when  we want to show the category id based on product detail
  // const getName = (category) => {
  //   ///so in product detail api we are getting category id .. so getting name based on category id
  //   if (category) {
  //     let data = contextCategories.filter(item => item.category == category);
  //     //   setSelectedCatagories({name});
  //     ///the data will come arrays
  //     return data[0].name;
  //   }
  // };

  const getName = category => {
    if (category && contextCategories) {
      const data = contextCategories.filter(item => item.category === category);
      if (data.length > 0) {
        return data[0].name;
      }
    }
    // Handle the case when category or contextCategories is undefined or no matching data is found.
    return 'Category Name Not Found';
  };
  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imageBacground}>
      {/* headers  */}
      <View style={styles.header}>
        <View style={{}}>
          <Logo width={180} height={25} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CartScreen')}
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
      <ScrollView style={{flexGrow: 1}}>
        {/* first dropdown */}
        {product_Detail && (
          <View style={{marginHorizontal: 15, zIndex: 8}}>
            <Dropdowns
              initialText={
                product_Detail?.category && getName(product_Detail?.category)
              }
              style={styles.firstDropdown}
              customOptionStyles={styles.firstDropdownOptions}
              isGradient={true}
              options={contextCategories}
              handleClick={async item => {
                setIsReference(false);
                setIsSearched(false);
                const id = item?.category;
                setCategory(id);

                if (id) {
                  await getSubCatagories(id);
                }
                navigation.navigate('CatalougePage', {
                  books: {
                    category: item.category,
                    name: getName(item.category),
                  },
                });
              }}
              setPage={setPage}
              isClicked={isOpen}
              setIsClicked={() => {
                setIsOpen(!isOpen);
                setOpenDropdown(null);
                setIsClicked(false);
              }}
            />
          </View>
        )}
        {/* second dropdown */}
        {product_Detail && (
          <View
            style={{
              marginHorizontal: 8,
              zIndex: 1,
              marginTop: isOpen ? -140 : 10,
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={selectedSubCatagories}
              renderItem={({item, index}) => (
                <View style={{marginHorizontal: 8}}>
                  <Dropdowns
                    initialText={item.name}
                    isGradient={true}
                    options={item.dropdownlist}
                    style={styles.secondDropdown}
                    customOptionStyles={styles.secondDropdownOptions}
                    handleClick={selectItem => {
                      setIsSearched(false);
                      setIsReference(true);
                      setReference(selectItem.reference);
                      setSelectedValue(selectItem.name);
                      navigation.navigate('CatalougePage', {
                        subDropdown: {
                          reference: selectItem.reference,
                          name: selectItem.name,
                          category: product_Detail.category,
                        },
                      });
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
            onPress={() => {
              handleSearch();
              navigation.navigate('CatalougePage', {
                searchingData: {
                  term: searchKeyword,
                  adesc: selectedOption3 ? 1 : 0,
                  category_number: selectedOption2 ? product_Detail?.category : 0,
                  sortby: selectedFilter.type,
                  page: page,
                  categoryname:getName(product_Detail?.category)
                },
              });
            }}
            activeOpacity={1}>
            <Search />
          </TouchableOpacity>
        </View>
        {/* whole catalouge and this category */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 15,
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
              setSelectedOption2(true);
              setSelectedOption1(false);
            }}>
            <View style={styles.circle}>
              {selectedOption2 && (
                <View style={styles.dotCircle}></View>
              )}
            </View>
            <Text style={styles.radioText2}>This Category</Text>
          </TouchableOpacity>
        </View>
        {/* search by category checkbox */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelectedOption3(!selectedOption3);
          }}
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <View style={styles.checkbox}>{selectedOption3 && <CheckBox />}</View>
          <Text style={styles.searchTexts}>Search by description</Text>
        </TouchableOpacity>
        {/* related items to display */}
        <FlatList
          scrollEnabled={false}
          data={relatableItems}
          keyExtractor={(item, index) => index}
          renderItem={relatedItems}
          ListHeaderComponent={(item, index) => {
            return (
              <View>
                {/* image caraousel */}
                {product_Detail && (
                  <View style={styles.imgCaraousel}>
                    <TouchableOpacity
                      onPress={previousImage}
                      disabled={
                        currentImageIndex === 0 ||
                        !product_Detail.image ||
                        product_Detail.image.length === 0
                      }
                      style={[
                        styles.backwardButton,
                        {
                          opacity:
                            currentImageIndex === 0 ||
                            !product_Detail.image ||
                            product_Detail.image.length === 0
                              ? 0
                              : 1,
                        },
                      ]}>
                      <Text style={styles.backwardText}>{'<'}</Text>
                    </TouchableOpacity>
                    {renderProductDetail()}
                    <TouchableOpacity
                      disabled={
                        !product_Detail.image ||
                        currentImageIndex === product_Detail.image.length - 1 ||
                        product_Detail.image.length === 0
                      }
                      onPress={nextImage}
                      style={[
                        styles.forwardButton,
                        {
                          opacity:
                            !product_Detail.image ||
                            currentImageIndex ===
                              product_Detail.image.length - 1 ||
                            product_Detail.image.length === 0
                              ? 0
                              : 1,
                        },
                      ]}>
                      <Text style={styles.forwardText}>{'>'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* product detail  */}
                {product_Detail && (
                  <View style={{paddingHorizontal: 18, marginTop: 20}}>
                    <View style={styles.productDetail}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.productAuthor}>
                        {product_Detail.author}
                      </Text>
                      {product_Detail.price !== undefined && (
                        <Text style={styles.productPrice}>
                          &pound; {product_Detail.price}
                        </Text>
                      )}
                    </View>
                    <Text
                      ellipsizeMode="tail"
                      // numberOfLines={1}
                      style={styles.productTitle}>
                      {product_Detail.title}
                    </Text>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={3}
                      style={styles.productDes}>
                      {product_Detail.description}
                    </Text>
                  </View>
                )}

                {/* add to cart button */}
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);
                    addToCart(product_Detail.sysid);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 2000);
                  }}
                  style={styles.Addtocartbutton}
                  activeOpacity={1}>
                  {isLoading ? (
                    <ActivityIndicator
                      size={30}
                      color={'white'}
                      animating={true}></ActivityIndicator>
                  ) : (
                    <Text style={styles.addtocarttext}>Add To Cart</Text>
                  )}
                </TouchableOpacity>
                {/* shipping address */}
                <View style={{paddingHorizontal: 18}}>
                  <Text style={styles.shippingHead}>Shipping</Text>
                  <Text style={styles.shippingAddress}>
                    US $74.99 eBay International Shipping. See details for
                    shipping
                  </Text>
                  <Text style={styles.shippingAdres1}>
                    Located in: Prospect, New York, United States This item may
                    be subject to duties and taxes upon delivery
                  </Text>
                  <Text style={styles.delivery}>Delivery</Text>
                  <Text style={styles.deliveryStatus}>
                    Estimated between Thu, Aug 24 and Mon, Sep 18 to 560001
                  </Text>
                  <Text style={styles.deliveryStatus2}>
                    Please note the delivery estimate is greater than 26
                    business days.
                  </Text>
                  <Text style={styles.deliveryStatus3}>
                    Seller ships within 1 day after receiving cleared payment.
                  </Text>
                </View>
                <Text style={styles.relatedText}>Related Items</Text>
              </View>
            );
          }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CatalougePage', {
              books: product_Detail?.category,
            });
          }}
          style={styles.Addtocartbutton}
          activeOpacity={1}>
          <Text style={styles.addtocarttext}>View All</Text>
        </TouchableOpacity>
        <Footer />
      </ScrollView>
      {loader && <Loader />}
    </ImageBackground>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  imageBacground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  pressableImage: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#873900',
    borderRadius: 50,
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
  circle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#873900',
    justifyContent: 'center',
    alignItems: 'center',
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
  relatedText: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    paddingHorizontal: 18,
    marginVertical: 18,
  },
  productPrice: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '700',
  },
  productAuthor: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 20,
    fontWeight: '700',
  },
  productTitle: {
    paddingVertical: 8,
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '700',
  },
  productDes: {
    color: 'black',
    paddingVertical: 8,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  Addtocartbutton: {
    width: 100,
    height: 40,
    backgroundColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 35,
    borderRadius: 5,
  },
  addtocarttext: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '600',
  },
  shippingHead: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 18,
    fontWeight: '600',
  },
  shippingAddress: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'justify',
  },
  shippingAdres1: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  delivery: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 18,
    fontWeight: '600',
  },
  deliveryStatus: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'justify',
  },
  deliveryStatus2: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'justify',
  },
  deliveryStatus3: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'justify',
  },
  backwardButton: {
    borderColor: '#873900',
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backwardText: {
    color: '#873900',
  },
  forwardButton: {
    borderColor: '#873900',
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forwardText: {
    color: '#873900',
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
  firstDropdownOptions: {
    width: 200,
    height: 150,
    top: 4,
    borderColor: '#873900',
    borderWidth: 1,
    // position: 'absolute',
    borderRadius: 3,
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
    top: 3,
    // position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
    borderRadius: 3,
  },
  imgCaraousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flex: 1,
  },
  productDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
