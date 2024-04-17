import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Loader from './componet/Loader/Loader';
import Search from '../assets/images/search.svg';
import Footer from './componet/Footer';
import ChevronDown from '../assets/images/chevrondown.svg';
import Dropdowns from './componet/Dropdowns';
import {CategoriesContext} from './componet/AppContext';
import {useFocusEffect} from '@react-navigation/native';

const TrackOrder = ({navigation}) => {
  const {contextCategories, getSubCatagories} = useContext(CategoriesContext);
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState(true);
  const [selectedOption2, setSelectedOption2] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [filterOrders, setFilterOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(1);
  const [otpResponseError, setOtpResponseError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [collapsedView, setCollapsedView] = useState(-1);
  const scrollViewRef = useRef(null);
  const [_itemHeights, setItemHeights] = useState([]);
  // const test1Ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [height1, setHeight1] = useState(0);
  const [height2, setHeight2] = useState(0);

  useEffect(() => {
    getEmailStored();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (otpVerified) {
      trackByEmail()
      }
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }, [otpVerified]),
  );

  const getEmailStored = async () => {
    let storedEmail = await AsyncStorage.getItem('emails');
    storedEmail = JSON.parse(storedEmail);
    // setEmail(storedEmail);
  };

  const emailRegex = /^\S+@\S+\.\S{2,3}$/;
  const otpRegex = /^[^\s]+$/;

  const sendOtp = () => {
    setLoader(true);
    const api = `${APIS.getEmailvalue}${email}/`;

    // Send a GET request to the API URL using axios and handle the response and errors
    axios
      .get(api)
      .then(res => {
        const errorMessage = res.data.message;

        // Check if the response contains an error message
        if (errorMessage) {
          setResponseMessage(errorMessage);
          setErrorMessage(''); // Clear the normal error message
        } else {
          setResponseMessage('');
          setErrorMessage(''); // Clear any previous error message
        }
        setEmailSent(true);
        setOtpSent(true);
      })
      .catch(error => {
        if (error.response) {
          console.log('Server responded with:', error.response.status);
          console.log('Response data:', error.response.data);
          setResponseMessage(
            'Please check your Email, if new user, Order the Items',
          );
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const verifyOtp = () => {
    setLoader(true);
    const api = `${APIS.getVerifyOtp}${email}/${otp}/`;
    // Send a GET request to the API URL using axios and handle the response and errors
    axios
      .get(api)
      .then(verifyotp => {
        setEmailSent(false);
        setOtpVerified(verifyotp);
      })
      .catch(error => {
        if (error.response) {
          console.log('Server responded with:', error.response.status);
          console.log('Response data:', error.response.data);
          setOtpResponseError(error.response.data.message);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  // useEffect(() => {
  //   trackByEmail();
  // }, [email]);

  const trackByEmail = () => {
    setLoader(true);
    const apiUrl = `https://stagingapi.pennymead.com/view/getOrderdetailbyEmail/${email}/`;

    // Send a GET request to the API URL using axios and handle the response and errors
    axios
      .get(apiUrl)
      .then(result => {
        const orderData = result?.data?.orderDetails;
        setOrderDetails(orderData);
        filterOrdersAndTrack('unPaid', orderData);
      })
      .catch(error => {
        if (error.response) {
          console.log('Server responded with:', error.response.status);
          console.log('Response data:', error.response.data);
        }
        setShowModal(true);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleClick = () => {
    if (email === '') {
      setErrorMessage('Email Required');
    } else if (!emailRegex.test(email)) {
      setErrorMessage('Enter Valid Email');
    } else {
      setErrorMessage('');
      sendOtp();
      setOtp('');
    }
  };

  const handleotpClick = () => {
    if (otp === '') {
      setOtpError('Otp Required');
    } else if (otp.length < 6 || !otpRegex.test(otp)) {
      setOtpError('Enter Valid Otp');
    } else {
      setOtpError('');
      setResponseMessage('');
      verifyOtp();
      trackByEmail();
      setOtpSent(false);
    }
  };

  const handleSearch = () => {
    if (searchKeyword === '') {
      let datas = selectedOption1 ? 'unPaid' : 'paid';
      filterOrdersAndTrack(datas, orderDetails);
    } else {
      const filteredOrders = orderDetails.filter(order => {
        // Check if the order is paid (transtatus is not empty) and selected option is Paid
        if (
          selectedOption1 &&
          order.orderDetail.transtatus === '' &&
          order.orderDetail.status === '1' &&
          order.orderDetail.orderno
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        ) {
          return true;
        }

        // Check if the order is unpaid (transtatus is empty) and selected option is Unpaid
        if (
          selectedOption2 &&
          order.orderDetail.transtatus !== '' &&
          order.orderDetail.status === '1' &&
          order.orderno.toLowerCase().includes(searchKeyword.toLowerCase())
        ) {
          return true;
        }

        return false;
      });
      // Update the state with the filtered orders
      setFilterOrders(filteredOrders);

      // Update the dataFound state based on whether data is found or not
      // setDataFound(filteredOrders.length > 0);
    }
  };

  useEffect(() => {
    let scrollToY = height1 + height2;
    for (let i = 0; i < collapsedView; i++) {
      scrollToY += _itemHeights[i];
    }
    scrollToY += (collapsedView + 1) * 30;

    // Scroll to the clicked accordion item using the ref
    scrollViewRef.current.scrollTo({y: scrollToY, animated: false});
  }, [collapsedView]);

  const handleButtonClick = (index, e, items) => {
    if (collapsedView === index) {
      // If the clicked item is already expanded, collapse it.
      setCollapsedView(null);
    } else {
      // Expand the clicked item.
      setCollapsedView(index);
    }
  };

  const measureItemHeight = (event, index) => {
    if (_itemHeights[index] === undefined) {
      const newHeights = [..._itemHeights];
      newHeights[index] = event.nativeEvent.layout.height;
      setItemHeights(newHeights);
    }
  };

  const renderOrderDetails = () => {
    return filterOrders.map((item, index) => {
      const showPayNowButton =
        item.orderDetail.invoiced === '1' &&
        item.orderDetail.transtatus === '' &&
        item.orderDetail.status === '1';
      ////////dynamically change the text name of discount
      let PriceAdjustment = 'Discount';
      if (item.discount > 0) {
        PriceAdjustment = 'Price Adjustment:';
      } else if (item.discount === 0) {
        PriceAdjustment = null;
      } else if (item.discount < 0) {
        PriceAdjustment = 'Discount';
      }
      //show the paymentstatus text based on invoiced
      let paymentStatusText = '';
      if (item.orderDetail.status === '0') {
        paymentStatusText = 'Order Cancelled';
      } else if (
        item.orderDetail.invoiced === '0' &&
        item.orderDetail.transtatus === ''
      ) {
        paymentStatusText = 'Waiting for Invoice';
      } else if (
        item.orderDetail.invoiced === '1' &&
        item.orderDetail.transtatus === ''
      ) {
        paymentStatusText = 'Payment Pending';
      } else {
        paymentStatusText = 'Paid';
      }

      return (
        <View
          key={index}
          style={styles.mainCard}
          onLayout={event => measureItemHeight(event, index)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 8,
            }}>
            <Text style={styles.orderNoText}>OrderNO: </Text>
            <Text style={styles.orderno}>{item.orderno}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 5,
              marginBottom: 15,
            }}>
            <Text style={styles.paymentstatText}>
              {item.orderDetail.status === '0'
                ? 'Order Status: '
                : 'Payment Status: '}
            </Text>
            <Text style={styles.paymentStatus}>{paymentStatusText}</Text>
          </View>
          {item.orderDetail.status === '1' && (
            <View>
              <View style={styles.totalitemsorder}>
                <Text style={styles.totalitemText}>Total Items Price: </Text>
                <Text style={styles.ordertotaltext}>
                  &pound;{item.orderTotal}
                </Text>
              </View>
              <View style={styles.postageandPacking}>
                <Text style={styles.postaandpactext}>Postage & packing:</Text>
                <Text style={styles.postageText}>&pound;{item.postage}</Text>
              </View>
              {PriceAdjustment && (
                <View style={styles.discount}>
                  <Text style={styles.priceadjusttext}>{PriceAdjustment}</Text>
                  <Text style={styles.discounttext}>
                    &pound;{`${Math.abs(item.discount)}`}
                  </Text>
                </View>
              )}
              <View style={styles.line2}></View>
              <View style={styles.subtotal}>
                <Text style={styles.subtotaltext}>SubTotal:</Text>
                <Text style={styles.grandTotal}>&pound;{item.grandTotal}</Text>
              </View>
            </View>
          )}
          {showPayNowButton && (
            <TouchableOpacity
              style={styles.PaynowButton}
              onPress={() => {
                navigation.navigate('OrderSummary', {
                  // orderno: item.orderno,
                  // email: email,
                  details: {
                    custmerEmail: email, 
                    orderNo: item.orderno
                  },
                });
              }}>
              <Text style={styles.paynowText}>Pay now</Text>
            </TouchableOpacity>
          )}
          <View style={styles.line}></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Text style={styles.totalitemText}>
              items ({item.orderSummary.length})
            </Text>
            <TouchableOpacity
              onPress={e => {
                handleButtonClick(index);
              }}
              style={[
                styles.chevronicon,
                collapsedView === index && styles.reverseImage,
              ]}>
              <ChevronDown width={28} height={28} />
            </TouchableOpacity>
          </View>
          {collapsedView === index && (
            <View>
              {item.orderSummary.map((summaryItem, summaryIndex) => {
                return (
                  <>
                    <View
                      key={summaryIndex} // Make sure to provide a unique key
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        zIndex: 1,
                      }}>
                      <View>
                        {summaryItem.image && summaryItem.image[0] ? (
                          <Image
                            source={{uri: summaryItem.image[0]}}
                            style={styles.productImage}
                          />
                        ) : (
                          <Image
                            source={require('../assets/images/placeholderimage.png')} // Replace with the path to your static image
                            style={styles.productImage}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          flex: 1,
                          marginLeft: 7,
                        }}>
                        <View style={styles.viewContent}>
                          <Text style={styles.authorText}>
                            {summaryItem.author}
                          </Text>
                          <Text style={styles.priceText}>
                            &pound;{summaryItem.price}
                          </Text>
                        </View>
                        <View style={styles.titleAndDes}>
                          <Text numberOfLines={2} style={styles.titleText}>
                            {summaryItem.title}
                          </Text>
                          <Text numberOfLines={2} style={styles.desText}>
                            {summaryItem.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      {summaryIndex < item.orderSummary.length - 1 && (
                        <View style={styles.line1}></View>
                      )}
                    </View>
                  </>
                );
              })}
            </View>
          )}
        </View>
      );
    });
  };

  const filterOrdersAndTrack = (data, filterArray) => {
    // Determine whether to show paid, unpaid, or all orders
    const filteredOrders = filterArray.filter(order => {
      if (data === 'unPaid') {
        return (
          order.orderDetail.transtatus === '' &&
          order.orderDetail.status === '1'
        );
      } else if (data === 'paid') {
        return (
          order.orderDetail.transtatus !== '' &&
          order.orderDetail.status === '1'
        );
      }
      // If both options are selected, show all orders
      return true;
    });
    // Update the state with the filtered orders
    setFilterOrders(filteredOrders);
  };

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
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingLeft: 10}}
            onPress={() => navigation.openDrawer()}>
            <Menu width={43} height={43} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginHorizontal: 13, marginBottom: 25, marginTop: 10}}>
        <Dropdowns
          initialText={'Choose collectables'}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 13,
            alignItems: 'center',
            borderRadius: 5,
            width: 240,
          }}
          customOptionStyles={{
            backgroundColor: 'white',
            width: 240,
            height: 150,
            borderWidth: 1,
            borderColor: '#873900',
            elevation: 10,
            zIndex: 10,
            position: 'absolute',
            borderRadius: 3,
            top: 53,
          }}
          isGradient={true}
          options={contextCategories}
          handleClick={async item => {
            setLoader(true);
            const id = item?.category;
            setCategory(id);

            if (id) {
              await getSubCatagories(id);
              setLoader(false);
            }
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
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}>
        <View
          onLayout={e => {
            const {height} = e.nativeEvent.layout;
            setHeight1(parseInt(height));
          }}>
          <Text style={styles.headerText}>Track your order</Text>
          <Text style={styles.subHeaderText}>
            Get the real-time updates on your purchase. We understand that
            knowing the status of your order is important to you, and we're here
            to make the tracking process as seamless as possible.
          </Text>
          <Text style={styles.emailText}>Email</Text>
          <View style={{}}>
            <TextInput
              style={styles.emailInput}
              onChangeText={e => {
                setEmail(e);
                setResponseMessage('');
              }}
              onBlur={() => {
                if (email === '') {
                  setErrorMessage('Email Required');
                } else if (!emailRegex.test(email)) {
                  setErrorMessage('Enter Valid Email');
                } else {
                  setErrorMessage('');
                  setOtpResponseError('');
                }
              }}
              value={email}
            />
          </View>
          <Text
            style={{
              ...styles.errorText,
              color:
                errorMessage ||
                (responseMessage && responseMessage.includes('check'))
                  ? 'red'
                  : 'black',
            }}>
            {responseMessage || errorMessage}
          </Text>
          <TouchableOpacity
            style={styles.sendOtpButton}
            onPress={() => {
              handleClick();
            }}>
            <Text style={styles.sendotpText}>
              {otpSent ? "Didn't get Otp? Resend Otp" : 'Send OTP'}
            </Text>
          </TouchableOpacity>
          {emailSent && (
            <>
              <Text style={styles.enteroptText}>Enter OTP</Text>
              <View style={{}}>
                <TextInput
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={text => {
                    setOtp(text);
                    setOtpResponseError('');
                  }}
                  onBlur={() => {
                    if (otp === '') {
                      setOtpError('Otp Required');
                    } else if (otp.length < 6 || !otpRegex.test(otp)) {
                      setOtpError('Enter Valid Otp');
                    } else {
                      setOtpError('');
                      setResponseMessage('');
                    }
                  }}
                />
              </View>
              <Text style={styles.errorText}>
                {otpResponseError || otpError}
              </Text>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => {
                  handleotpClick();
                }}>
                <Text style={styles.verifyText}>Verify</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {otpVerified && (
          <>
            <View
              onLayout={e => {
                const {height} = e.nativeEvent.layout;
                setHeight2(parseInt(height));
                // console.log('2view ---------->>>>', height);
              }}>
              <Text style={styles.orderText}>Order list</Text>
              <Text style={styles.subHeaderText}>
                Here, you can find all the details about your orders, both paid
                and unpaid. We value your business and strive to provide you
                with the best service possible. Please select your preferred
                option from the dropdown menu to view the corresponding order
                list.
              </Text>
              <View style={styles.paidAndUnpaid}>
                <TouchableOpacity
                  style={styles.paidButton}
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedOption1(true);
                    setSelectedOption2(false);
                    filterOrdersAndTrack('unPaid', orderDetails);
                  }}>
                  <View style={styles.circle}>
                    {selectedOption1 && <View style={styles.dotCircle}></View>}
                  </View>
                  <Text style={styles.radioText}>UnPaid</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 25,
                  }}
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedOption2(true);
                    setSelectedOption1(false);
                    filterOrdersAndTrack('paid', orderDetails);
                  }}>
                  <View style={styles.circle}>
                    {selectedOption2 && <View style={styles.dotCircle}></View>}
                  </View>
                  <Text style={styles.radioText2}>Paid</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.orderNubmerText}>Order number</Text>
              <View style={{...styles.searchFlex}}>
                <TextInput
                  style={styles.inputsearch}
                  onChangeText={text => {
                    setSearchKeyword(text);
                  }}
                  placeholder="Enter OrderNo......."
                  placeholderTextColor={'#873900'}
                  value={searchKeyword}
                />
                <TouchableOpacity
                  style={styles.searchbutton}
                  onPress={() => {
                    handleSearch();
                  }}
                  activeOpacity={0.5}>
                  <Search />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {filterOrders.length === 0 ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'OpenSans-Regular',
                    paddingHorizontal: 13,
                  }}>
                  No data found
                </Text>
              ) : (
                <View>{renderOrderDetails()}</View>
              )}
              {/* {!dataFound && (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'OpenSans-Regular',
                    paddingHorizontal: 13,
                  }}>
                  No data found
                </Text>
              )} */}
            </View>
          </>
        )}
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowModal(false);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {'Ooops\nSomething Went Wrong!!\nPlease try again...'}
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  <Text style={styles.modalButtonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Footer />
      </ScrollView>
      {loader && <Loader />}
    </ImageBackground>
  );
};

export default TrackOrder;

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
  headerText: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 20,
    paddingHorizontal: 13,
    fontWeight: '700',
    color: '#454545',
  },
  subHeaderText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'justify',
    paddingHorizontal: 13,
    fontWeight: '400',
    color: '#454545',
  },
  emailText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#454545',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  emailInput: {
    borderWidth: 1,
    width: '80%',
    height: 45,
    borderColor: '#873900',
    color: '#454545',
    fontSize: 15,
    marginHorizontal: 13,
  },
  sendOtpButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendotpText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#0075FF',
    textDecorationLine: 'underline',
    paddingVertical: 20,
  },
  enteroptText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#454545',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  otpInput: {
    borderWidth: 1,
    width: '50%',
    height: 45,
    borderColor: '#873900',
    color: '#454545',
    fontSize: 15,
    marginHorizontal: 13,
  },
  verifyText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  verifyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#873900',
    width: 70,
    height: 50,
    marginHorizontal: 13,
    marginVertical: 20,
  },
  orderText: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 20,
    paddingHorizontal: 13,
    paddingVertical: 15,
    fontWeight: '700',
    color: '#454545',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
  },
  paidAndUnpaid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    paddingVertical: 15,
  },
  paidButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  orderNubmerText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#454545',
    paddingHorizontal: 13,
    paddingTop: 10,
  },
  searchFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    marginVertical: 15,
  },
  inputsearch: {
    borderWidth: 1,
    width: '83%',
    height: 50,
    borderColor: '#873900',
    padding: 10,
    color: '#873900',
  },
  searchbutton: {
    borderWidth: 1,
    width: 45,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    borderColor: '#873900',
    padding: 10,
  },
  mainCard: {
    marginTop: 30,
    width: '95%',
    height: 'auto',
    alignSelf: 'center',
    padding: 15,
    marginBottom: 20,
    elevation: 10,
    backgroundColor: '#FFF8F2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  productImage: {
    width: 90,
    height: 100,
    resizeMode: 'stretch',
  },
  viewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  authorText: {
    flex: 0.8,
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleAndDes: {
    flex: 1,
    width: '100%',
  },
  titleText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  desText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  line: {
    borderBottomWidth: 0.7,
    borderColor: '#FFD5B0',
    marginVertical: 10,
  },
  line1: {
    borderBottomWidth: 0.7,
    borderColor: '#2F4F4F',
    marginVertical: 15,
  },
  line2: {
    borderBottomWidth: 0.4,
    paddingVertical: 8,
  },
  chevronicon: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderNoText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '700',
  },
  orderno: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '700',
  },
  paymentstatText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '700',
  },
  paymentStatus: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '700',
  },
  itemCountText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    padding: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  postageandpacText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 8,
  },
  subtotaltext: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    fontWeight: '700',
  },
  grandTotal: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    fontWeight: '700',
  },
  PaynowButton: {
    width: '90%',
    height: 40,
    backgroundColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // marginHorizontal: 13,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 20,
  },
  paynowText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  totalitemsorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalitemText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  ordertotaltext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  postageandPacking: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postaandpactext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  postageText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  discount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  priceadjusttext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  discounttext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#818589cc',
  },
  modalContent: {
    backgroundColor: '#FFF8F2',
    borderRadius: 8,
    height: 200,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButtonText: {
    color: '#FFF8F2',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: '#873900',
    borderRadius: 3,
    width: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});
