import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import {CategoriesContext} from './componet/AppContext';
import Dropdowns from './componet/Dropdowns';
import Footer from './componet/Footer';
import CheckBox from '../assets/images/checkbox.svg';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Card from './componet/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';
import Loader from './componet/Loader/Loader';
import EmptyIcon from '../assets/images/emptycarticon.svg';
import Trash from '../assets/images/trashicon.svg';

const CartScreen = ({navigation}) => {
  const {
    contextCategories,
    cartItems,
    addToCart,
    removeItem,
    setCartItems,
    // getCollectibles,
    // viewCollectible,
  } = useContext(CategoriesContext);

  // LogBox.ignoreAllLogs();
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedOption1, setSelectedOption1] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState(false);
  const [viewBasket, setViewBasket] = useState([]);
  const [viewCollectible, setViewCollectible] = useState('');
  // console.log("🚀 ~ file: CartScreen.js:48 ~ CartScreen ~ viewCollectible:", viewCollectible)
  const [countriesList, setCountriesList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [visible, setVisible] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [quantity, setQuantity] = useState('');

  const [userDetails, setUserDetails] = useState({
    PhoneNumber: '',
    name: '',
    Address1: '',
    Address2: '',
    email: '',
    country: '',
    postal: '',
    payment: '',
    termsAndCondition: '',
    county: '',
  });

  const [errorMsg, setErrorMsg] = useState({
    PhoneNumber: '',
    name: '',
    Address1: '',
    Address2: '',
    email: '',
    country: '',
    postal: '',
    payment: '',
    termsAndCondition: '',
    county: '',
  });

  const [showError, setShowError] = useState({
    PhoneNumber: false,
    name: false,
    Address1: false,
    Address2: false,
    email: false,
    country: false,
    postal: false,
    payment: false,
    termsAndCondition: false,
    county: false,
  });
  const data = [
    {
      name: 1,
    },
    {
      name: 2,
    },
    {
      name: 3,
    },
    {
      name: 4,
    },
    {
      name: 5,
    },
    {
      name: 6,
    },
    {
      name: 7,
    },
  ];

  const items = [
    {
      name: 'Credit/Debit Card',
    },
    {
      name: 'Bank transfer',
    },
    {
      name: 'Sterling cheque',
    },
    {
      name: 'Cash',
    },
    {
      name: 'Other',
    },
  ];

  const toggleDropdown = index => {
    // setIsOpen(false);
    // setIsClicked(false);
    if (index === visible) {
      // Clicking on the currently open dropdown, close it
      setVisible(null);
    } else {
      // Clicking on a different dropdown, open it and close the previously open one
      setVisible(index);
    }
  };

  const updateSelectedQuantity = (sysid, quantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.sysid === sysid) {
        return {...item, selectedQuantity: quantity};
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  useEffect(() => {
    getStoredItems();
  }, []);

  useEffect(() => {
    getCountryLists();
    viewBasketItems();
  }, [cartItems]);
  ///////////////variable for sysid which it has been sent from the add to cart to cart
  const Sysid = cartItems.map(item => {
    return item.sysid;
  });

  const viewBasketItems = async () => {
    setLoader(true);
    try {
      // Define the API endpoint and request body
      const apiUrl = 'http://54.226.77.97:81/view/viewbasket/';
      const requestBody = {
        basketItems: Sysid, // Replace with the sysid you want to send
      };

      // Make a POST request to the API
      const response = await axios.post(apiUrl, requestBody);

      let _response = response?.data?.result || [];
      // Assuming the response contains the cart data, you can access it here
      if (_response.length > 0) {
        const mergedArray = _response.map(item1 => {
          const matchingItem = cartItems.find(
            item2 => item2.sysid === item1.sysid,
          );
          return {...item1, ...matchingItem};
        });

        setViewBasket(mergedArray);
      }

      // console.log("vewbasket==========>>>>>", response.data.result)
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error('Error fetching cart data:', error);
      setViewBasket([]);
    } finally {
      setLoader(false);
    }
  };

  const getStoredItems = async () => {
    let storedItems = await AsyncStorage.getItem('viewCollectible');
    storedItems = JSON.parse(storedItems);
    setViewCollectible(storedItems);
    // console.log('retrived items', storedItems);
  };
  // const getCollectibles = async () => {
  //   try {
  //     const apiUrl = `http://54.226.77.97:81/view/collectable_items/`;
  //     const response = await axios.get(apiUrl)
  //     console.log('collectible response', response?.data?.collectableitems);
  //     setViewCollectible(response?.data?.collectableitems);
  //   } catch (error) {
  //     console.log('collectible error', error);
  //   }
  // }

  const getCountryLists = async () => {
    setLoader(true);
    const url = `${APIS.getCountryList}`;
    try {
      const responce = await axios.get(url);
      setCountriesList(responce?.data?.data);
      // console.log('responce country datas', responce?.data?.data);
    } catch (error) {
      console.log('responce country error', error);
      setLoader(false);
    }
  };

  const renderViewBasket = ({item, index}) => {
    return (
      <View style={styles.mainCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // borderWidth: 1,
          }}>
          <View>
            {item.image && item.image.length > 0 ? (
              <Image
                source={{uri: item.image[0]}}
                style={styles.productImage}
              />
            ) : (
              <Image
                source={require('../assets/images/placeholderimage.png')} // Display the first image if available
                style={{width: 90, height: 100}}
              />
            )}
          </View>
          <View style={{flexDirection: 'column', flex: 1, marginLeft: 7}}>
            <View style={styles.viewContent}>
              <Text style={styles.authorText}>{item.author}</Text>
              <Text style={styles.priceText}>&pound; {item.price}</Text>
            </View>
            <View style={styles.titleAndDes}>
              <Text numberOfLines={2} style={styles.titleText}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.desText}>
                {item.description}
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          <Dropdowns
            isGradient={false}
            style={styles.viewBasketDropdown}
            customOptionStyles={styles.viewBasketDropdownOptions}
            initialText={item.selectedQuantity}
            options={data}
            isClicked={item === visible}
            setIsClicked={() => toggleDropdown(item)}
            handleClick={data => {
              const {name} = data;
              setQuantity(name);
              updateSelectedQuantity(item.sysid, name);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => removeItem(item.sysid)}
          style={{...styles.deleteButton}}>
          <Trash width={28} height={28} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCollectibleItem = ({item, index}) => {
    return (
      <Card
        imgSource={item.image && item.image.length > 0 ? item.image[0] : null}
        author={item.author}
        price={item.price}
        title={item.title}
        description={item.description}
        handlePressCard={() => {
          navigation.navigate('ProductDetail', {sysid: item.sysid});
        }}
        handlePress={() => {
          addToCart(item.sysid);
        }}
        cardIndex={index} // Pass the index of the card
      />
    );
  };

  const phoneNumberRegex = /^\d{10}$/;
  const nameRegex = /^[A-Z a-z]+$/;
  const emailRegex = /^\S+@\S+\.\S{2,3}$/;
  const countryRegex = /^[A-Za-z\s'-]+$/;
  const postalRegex = /^[0-9A-Za-z]+$/;

  const countryNames = countriesList.map(item => {
    item = {name: item?.printable_name};
    return item;
  });

  const getSysidAndPrice = viewBasket.map(item => ({
    sysid: item.sysid,
    pricePerItem: parseFloat(item.price), // Convert price to a floating-point number
  }));

  // const filterdCountries = countriesList.map(country => country.printable_name);

  const postOrderSummary = () => {
    const apiData = {
      name: userDetails.name,
      email: userDetails.email,
      address1: userDetails.Address1,
      address2: userDetails.Address2,
      hphone: userDetails.PhoneNumber,
      county: userDetails.country,
      postcode: userDetails.postal,
      country: selectedCountry,
      payment: selectedPayment, // You can change this if needed
      message: 'buyer message', // You can change this if needed
      promotional_emails: 0, // You can change this if needed
      items: getSysidAndPrice,
    };
    orderPlacingApi(apiData);
  };
  const orderPlacingApi = async apiData => {
    setLoader(true);
    try {
      const response = await axios.post(
        `http://54.226.77.97:81/view/orderplacing/`,
        apiData,
      );
      console.log('API Response:', response.data);
      navigation.navigate('OrderSummary', {summary: response.data});
    } catch (error) {
      if (error.response) {
        console.log('Server responded with:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleButtonClick = () => {
    const newErrorMsg = {}; // Initialize a new error message object
    // Check each field and set an error message if it's empty
    if (userDetails.email === '') {
      newErrorMsg.email = 'Email is required';
    }
    if (userDetails.name === '') {
      newErrorMsg.name = 'Name is required';
    }
    if (userDetails.Address1 === '') {
      newErrorMsg.Address1 = 'Address 1 is required';
    }
    if (userDetails.postal === '') {
      newErrorMsg.postal = 'Postal is required';
    }
    if (userDetails.country === '') {
      newErrorMsg.country = 'Country is required';
    }
    if (userDetails.PhoneNumber === '') {
      newErrorMsg.PhoneNumber = 'Phone Number is required';
    }
    if (!selectedPayment) {
      newErrorMsg.payment = 'Select the payment';
    }
    if (!selectedOption2) {
      newErrorMsg.termsAndCondition = 'Check the terms and condition checkbox';
    }
    if (!selectedCountry) {
      newErrorMsg.county = 'Select the country';
    }

    // Check if there are any error messages
    if (Object.keys(newErrorMsg).length > 0) {
      // There are errors, update the error messages and show errors
      setErrorMsg(newErrorMsg);
      setShowError({
        ...showError,
        email: 'email' in newErrorMsg,
        name: 'name' in newErrorMsg,
        Address1: 'Address1' in newErrorMsg,
        Address2: 'Address2' in newErrorMsg,
        country: 'country' in newErrorMsg,
        PhoneNumber: 'PhoneNumber' in newErrorMsg,
        postal: 'postal' in newErrorMsg,
        payment: 'payment' in newErrorMsg,
        termsAndCondition: 'termsAndCondition' in newErrorMsg,
        county: 'county' in newErrorMsg,
      });
    } else if (!nameRegex.test(userDetails.name)) {
      setErrorMsg({...errorMsg, name: 'Enter valid name'});
      setShowError({...showError, name: true});
    } else if (!emailRegex.test(userDetails.email)) {
      setErrorMsg({...errorMsg, email: 'Enter valid email'});
      setShowError({...showError, email: true});
    } else if (!phoneNumberRegex.test(userDetails.PhoneNumber)) {
      setErrorMsg({...errorMsg, PhoneNumber: 'Enter valid PhoneNumber'});
      setShowError({...showError, PhoneNumber: true});
    } else if (!postalRegex.test(userDetails.postal)) {
      setErrorMsg({...errorMsg, postal: 'Enter valid PostCode'});
      setShowError({...showError, postal: true});
    } else {
      setShowError({
        ...showError,
        PhoneNumber: false,
        email: false,
        name: false,
        country: false,
        postal: false,
        payment: false,
        termsAndCondition: false,
        county: false,
      });
      postOrderSummary();
    }
  };

  /////when  we want to show the category id based on product detail
  const getName = category => {
    ///so in product detail api we are getting category id .. so getting name based on category id
    if (category) {
      let data = contextCategories.filter(item => item.category == category);
      //   setSelectedCatagories({name});
      ///the data will come arrays
      return data[0].name;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imageBacground}>
      {/* headers  */}
      <View style={styles.header}>
        <View style={{marginLeft: -8}}>
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
      <View style={{marginHorizontal: 15, zIndex: 2, marginVertical: 10}}>
        <Dropdowns
          initialText={'Choose Collectible'}
          style={styles.firstDropdownCollect}
          customOptionStyles={styles.firstDropdownOptionCollect}
          isGradient={true}
          // setPage={setPage}
          options={contextCategories}
          handleClick={item => {
            navigation.navigate('CatalougePage', {
              books: {category: item.category, name: getName(item.category)},
            });
          }}
          isClicked={isOpen}
          setIsClicked={() => {
            setIsOpen(!isOpen);
          }}
        />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        scrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}
        style={{marginTop: isOpen ? -140 : 10}}>
        {viewBasket.length > 0 ? (
          <>
            <Text style={styles.checkoutText}>Check out</Text>
            {/* cart items to display */}
            <FlatList
              scrollEnabled={false}
              nestedScrollEnabled={true}
              data={viewBasket}
              renderItem={renderViewBasket}
              keyExtractor={(item, index) => item.sysid}
              key={item => item.sysid}
            />
            {/* contact form */}
            <View style={styles.contactFormCard}>
              <Text style={styles.yourdetailtext}>Your details</Text>
              <Text style={styles.emailText}>Email</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  style={styles.emailInput}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      email: e,
                    });
                    setShowError({
                      ...showError,
                      email: false,
                    });
                  }}
                  onBlur={() => {
                    if (!emailRegex.test(userDetails.email)) {
                      setErrorMsg({
                        ...errorMsg,
                        email: 'Enter valid email',
                      });
                      setShowError({
                        ...showError,
                        email: true,
                      });
                    }
                  }}
                />
              </View>
              {showError.email && (
                <Text style={styles.errorText}>{errorMsg.email}</Text>
              )}
              <Text style={styles.NameText}>Name</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  style={styles.name}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      name: e,
                    });
                    setShowError({
                      ...showError,
                      name: false,
                    });
                  }}
                  onBlur={() => {
                    if (!nameRegex.test(userDetails.name)) {
                      setErrorMsg({
                        ...errorMsg,
                        name: 'Enter valid name',
                      });
                      setShowError({
                        ...showError,
                        name: true,
                      });
                    }
                  }}
                  // onPressIn={() => {
                  //   setShowError({
                  //     ...showError,
                  //     name: false,
                  //   });
                  // }}
                />
              </View>
              {showError.name && (
                <Text style={styles.errorText}>{errorMsg.name}</Text>
              )}
              <Text style={styles.Address1Text}>Address 1</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  style={styles.Address1Input}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      Address1: e,
                    });
                    setShowError({
                      ...showError,
                      Address1: false,
                    });
                  }}
                  // onPressIn={() => {
                  //   setShowError({
                  //     ...showError,
                  //     Address1: false,
                  //   });
                  // }}
                />
              </View>
              {showError.Address1 && (
                <Text style={styles.errorText}>{errorMsg.Address1}</Text>
              )}
              <Text style={styles.address_2Text}>Address 2</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput style={styles.address2Input} />
              </View>

              <Text style={styles.phonenumText}>Phone number</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  maxLength={10}
                  keyboardType="numeric"
                  style={styles.phoneNumber}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      PhoneNumber: e,
                    });
                    setShowError({
                      ...showError,
                      PhoneNumber: false,
                    });
                  }}
                  onBlur={() => {
                    if (!phoneNumberRegex.test(userDetails.PhoneNumber)) {
                      setErrorMsg({
                        ...errorMsg,
                        PhoneNumber: 'Enter valid PhoneNumber',
                      });
                      setShowError({
                        ...showError,
                        PhoneNumber: true,
                      });
                    }
                  }}
                  // onPressIn={() => {
                  //   setShowError({
                  //     ...showError,
                  //     PhoneNumber: false,
                  //   });
                  // }}
                />
              </View>
              {showError.PhoneNumber && (
                <Text style={styles.errorText}>{errorMsg.PhoneNumber}</Text>
              )}
              <Text style={styles.countrystateText}>County/ State</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  style={styles.countryInput}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      country: e,
                    });
                    setShowError({
                      ...showError,
                      country: false,
                    });
                  }}
                  onBlur={() => {
                    if (!countryRegex.test(userDetails.country)) {
                      setErrorMsg({
                        ...errorMsg,
                        country: 'Enter valid country',
                      });
                      setShowError({
                        ...showError,
                        country: true,
                      });
                    }
                  }}
                  // onPressIn={() => {
                  //   setShowError({
                  //     ...showError,
                  //     country: false,
                  //   });
                  // }}
                />
              </View>
              {showError.country && (
                <Text style={styles.errorText}>{errorMsg.country}</Text>
              )}
              <Text style={styles.postalText}>Postal/ Zip code</Text>
              <View style={{alignItems: 'center'}}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.postalInput}
                  onChangeText={e => {
                    setUserDetails({
                      ...userDetails,
                      postal: e,
                    });
                    setShowError({
                      ...showError,
                      postal: false,
                    });
                  }}
                  onBlur={() => {
                    if (!postalRegex.test(userDetails.postal)) {
                      setErrorMsg({
                        ...errorMsg,
                        postal: 'Enter valid PostCode',
                      });
                      setShowError({
                        ...showError,
                        postal: true,
                      });
                    }
                  }}
                  // onPressIn={() => {
                  //   setShowError({
                  //     ...showError,
                  //     postal: false,
                  //   });
                  // }}
                />
              </View>
              {showError.postal && (
                <Text style={styles.errorText}>{errorMsg.postal}</Text>
              )}
              {/* first country dropdown */}
              <Text style={styles.countryText}>Country</Text>
              <View
                style={{
                  alignItems: 'center',
                  zIndex: 5,
                  marginBottom: 10,
                  position: 'relative',
                }}>
                <Dropdowns
                  initialText={'Choose Country'}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    height: 45,
                    borderColor: '#873900',
                    alignItems: 'center',
                    width: Dimensions.get('window').width - 60,
                  }}
                  customOptionStyles={{
                    width: Dimensions.get('window').width - 60,
                    top: 4,
                    // position: 'absolute',
                    backgroundColor: '#FFF8F2',
                    borderWidth: 1,
                    borderColor: '#873900',
                    maxHeight: 120,
                  }}
                  isGradient={false}
                  options={countryNames}
                  handleClick={selected => {
                    setSelectedCountry(selected?.name);
                    setShowError({
                      ...showError,
                      county: false,
                    });
                  }}
                  isClicked={openDropdown}
                  setIsClicked={() => {
                    setOpenDropdown(!openDropdown);
                    setIsClicked(false);
                  }}
                />
                {showError.county && (
                  <Text
                    style={{
                      ...styles.errortext,
                      position: 'absolute',
                      top: 35,
                    }}>
                    {errorMsg.county}
                  </Text>
                )}
              </View>

              {/* first payment method dropdown */}
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                  zIndex: 2,
                  marginTop: openDropdown ? -112 : 0,
                  top: showError.county ? 8 : 0,
                }}>
                <Text style={styles.paymentText}>Payment method</Text>
                <Dropdowns
                  initialText={'Choose PaymentMode'}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    height: 45,
                    borderColor: '#873900',
                    alignItems: 'center',
                    width: Dimensions.get('window').width - 60,
                  }}
                  customOptionStyles={{
                    width: Dimensions.get('window').width - 60,
                    top: 50,
                    position: 'absolute',
                    backgroundColor: '#FFF8F2',
                    borderWidth: 1,
                    borderColor: '#873900',
                    height: 150,
                  }}
                  isGradient={false}
                  options={items}
                  handleClick={item => {
                    setSelectedPayment(item?.name);
                    setShowError({
                      ...showError,
                      payment: false,
                    });
                  }}
                  isClicked={isClicked}
                  setIsClicked={() => {
                    setIsClicked(!isClicked);
                    setOpenDropdown(false);
                  }}
                />
              </View>
              {showError.payment && (
                <Text style={styles.errorText}>{errorMsg.payment}</Text>
              )}
              <View
                style={{
                  alignItems: 'center',
                  // marginTop: isClicked ? -160 : 0,
                }}>
                <Text style={styles.notesText}>Notes</Text>
                <TextInput
                  placeholderTextColor={'#873900'}
                  style={styles.notesInput}
                />
              </View>
              <View style={{marginVertical: 15, marginHorizontal: 15}}>
                {/* checkbox 1*/}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedOption1(!selectedOption1);
                    // setSelectedOption2(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}>
                  <View style={styles.checkbox}>
                    {selectedOption1 && <CheckBox />}
                  </View>
                  <Text style={styles.checkboxText}>
                    Receive promotional emails not more than one per month.
                  </Text>
                </TouchableOpacity>

                {/* checkbox 2*/}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedOption2(!selectedOption2);
                    setShowError({
                      ...showError,
                      termsAndCondition: false,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}>
                  <View style={styles.checkbox}>
                    {selectedOption2 && <CheckBox />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I have read and accepted the terms and conditions
                  </Text>
                </TouchableOpacity>
                {showError.termsAndCondition && (
                  <Text style={styles.errorText}>
                    {errorMsg.termsAndCondition}
                  </Text>
                )}
              </View>
              {/* continue button */}
              <TouchableOpacity
                onPress={handleButtonClick}
                style={styles.continueButton}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
            {/* )} */}
            <View>
              <Text style={styles.headerText}>Collectable items</Text>
              <FlatList
                  scrollEnabled={false}
                  data={viewCollectible}
                  renderItem={renderCollectibleItem}
                />
            </View>
          </>
        ) : (
          <View style={styles.addToCartIcon}>
            <EmptyIcon width={100} height={100} />
            <Text style={styles.addToCartText}>
              Your shopping basket is empty.
            </Text>
          </View>
        )}
        <Footer />
      </ScrollView>
      {loader && <Loader />}
    </ImageBackground>
  );
};

export default CartScreen;

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
  chexkoutText: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 22,
    color: '#454545',
    fontWeight: '600',
    marginHorizontal: 15,
    marginVertical: 20,
  },
  productImage: {
    width: 90,
    height: 100,
    resizeMode: 'stretch',
  },
  mainCard: {
    marginTop: 30,
    height: 260,
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    marginBottom: 20,
    elevation: 10,
    backgroundColor: '#FFF8F2',
    borderRadius: 5,
  },
  yourdetailtext: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '600',
    fontSize: 20,
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  checkoutText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '600',
    fontSize: 26,
    marginVertical: 16,
    paddingHorizontal: 18,
  },
  emailInput: {
    // width: '95%',
    color: 'black',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    // marginBottom: 10,
    height: 45,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  emailText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    // marginVertical: 16,
    paddingHorizontal: 11,
  },
  NameText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  name: {
    // width: '90%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  Address1Text: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  Address1Input: {
    // width: '90%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  address_2Text: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  address2Input: {
    // width: '90%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  phonenumText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  phoneNumber: {
    // width: '95%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  countrystateText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  countryInput: {
    // width: '90%',\
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  postalText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  postalInput: {
    // width: '90%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 45,
    alignItems: 'center',
    // marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  countryText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
  },
  paymentText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
    alignSelf: 'flex-start',
  },
  notesText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '400',
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 11,
    alignSelf: 'flex-start',
  },
  notesInput: {
    // width: '90%',
    width: Dimensions.get('window').width - 60,
    borderColor: '#873900',
    borderWidth: 1,
    height: 120,
    textAlignVertical: 'top',
    // alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#454545',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderColor: '#873900',
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  checkboxText: {
    color: '#873900',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 8,
    marginRight: 5,
    paddingLeft: 10,
  },
  continueButton: {
    width: 100,
    height: 40,
    backgroundColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginVertical: 35,
    marginHorizontal: 18,
    borderRadius: 5,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '600',
  },
  contactFormCard: {
    backgroundColor: '#FFF8F2',
    width: '91%',
    alignSelf: 'center',
    marginTop: 25,
    elevation: 10,
  },
  headerText: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  errortext: {
    color: 'red',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginVertical: 10,
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
  cartItemCountText: {
    color: '#fff',
    // fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  viewBasketDropdown: {
    borderWidth: 1,
    borderColor: '#873900',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    width: 90,
    alignItems: 'center',
  },
  viewBasketDropdownOptions: {
    width: 90,
    maxHeight: 90,
    zIndex: 2,
    // borderRadius: 0,
    top: 33,
    // borderBottomWidth: 1,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
  },
  viewContent: {
    flexDirection: 'row',
    // flex: 0.6,
    justifyContent: 'space-between',
    // paddingHorizontal: 7,
    width: '100%',
    alignItems: 'center',
  },
  authorText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    // paddingHorizontal: 18
  },
  titleAndDes: {
    flex: 1,
    width: '100%',
    // paddingHorizontal: 7,
    // paddingVertical: 12,
  },
  titleText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 8,
  },
  desText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#873900',
    marginTop: 35,
    width: 35,
    height: 35,
    padding: 3,
    alignSelf: 'flex-end',
  },
  firstDropdownCollect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
    alignItems: 'center',
    borderRadius: 5,
    width: 240,
  },
  firstDropdownOptionCollect: {
    width: 240,
    // maxHeight: 150,
    top: 4,
    // position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
    borderRadius: 3,
  },
  addToCartIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    flexGrow: 1,
  },
  addToCartText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '700',
    marginVertical: 20,
  },
});
