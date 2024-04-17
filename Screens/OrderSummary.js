import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import {CategoriesContext} from './componet/AppContext';
import Dropdowns from './componet/Dropdowns';
import Loader from './componet/Loader/Loader';
import Footer from './componet/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import Visa from '../assets/images/visa-logo.svg';
import MasterCard from '../assets/images/mastercardlogo.svg';
import MaestroCard from '../assets/images/maestro_logo.svg';
import AmericaCard from '../assets/images/american_Express-Logo.svg';
import DirectCard from '../assets/images/directdebit.svg';
import Cancel from '../assets/images/x-circle.svg';

const OrderSummary = ({route, navigation}) => {
  const {cartItems, contextCategories} = useContext(CategoriesContext);
  const {details} = route.params;
  const {custmerEmail, orderNo, orderno, Email} = details;
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [loader, setLoader] = useState(true);
  const [totalAmount, setTotalAmount] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  console.log("🚀 ~ OrderSummary ~ orderDetail:", orderDetail)
  const [showModal, setShowModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [merchantSessionKey, setMerchantSessionKey] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [dataEncode, setDataEncode] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    card: '',
    expiry: '',
    cvv: '',
  });

  const [errorMsg, setErrorMsg] = useState({
    name: '',
    card: '',
    expiry: '',
    cvv: '',
  });

  const [showError, setShowError] = useState({
    name: false,
    card: false,
    expiry: false,
    cvv: false,
  });

  const nameRegex = /^[A-Z a-z]+$/;
  const expiryRegex = /^(0[1-9]|1[0-2])([0-9]{2})$/;
  const cvvRegex = /^[0-9]{3,4}$/;

  useEffect(() => {
    if (details.orderno) {
      get_Order_Summary(orderno, Email);
      getUserEmail();
    } else if (details.orderNo) {
      get_Order_Summary(orderNo, custmerEmail);
      getUserEmail();
    }
  }, [details]);

  const venderTxCode = () => {
    // You can use a combination of factors such as a timestamp and a random number to ensure uniqueness.
    const staticString = 'pennymeadbooks'; // Static part of the ID
    const timestamp = Math.floor(new Date().getTime() / 10000); // Get a Unix timestamp
    const transactionID = `${staticString}${timestamp}`;
    setUniqueId(transactionID);
    return transactionID;
  };

  const handleClickTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliSeconds = now.getMilliseconds();

    const convertedMilliSeconds = minutes * seconds * milliSeconds;
    return convertedMilliSeconds;
  };

  const inserTransaction = async () => {
    setLoader(true);
    try {
      const base64Data = {
        orderno: orderDetail.orderno,
        email: address.email,
      };
      console.log('base64Data', base64Data);
      const encodedCredential = await base64.encode(JSON.stringify(base64Data));

      const requestBody = {
        encode_data: encodedCredential,
        txcode: venderTxCode(),
        trantime: handleClickTime(),
      };
      const apiUrl = `https://stagingapi.pennymead.com/view/insertTranscation/`;
      const _res = await axios.post(apiUrl, requestBody);
      console.log('inserted trans', _res.data);
      setDataEncode(encodedCredential);
    } catch (error) {
      console.log('error in inserted transaction', error);
    } finally {
      setLoader(false);
    }
  };

  const upDateTheTransaction = async data => {
    setLoader(true);
    try {
      if (data && data.statusCode === '0000') {
        const requestBody = {
          status: data.status,
          statusdetail: data?.statusDetail,
          vpsTxid: data?.transactionId,
          Txauthno: data?.bankAuthorisationCode,
          amount: data?.amount?.saleAmount / 100,
          avscv2: '',
          address: data?.avsCvcCheck?.address,
          postcode: data?.avsCvcCheck?.postalCode,
          cv2Result: '',
          giftaid: '0',
          '3dsecurestatus': 'NOTCHECKED',
          cavv: '',
          cardtype: data.paymentMethod?.card?.cardType,
          last4digits: data.paymentMethod?.card?.lastFourDigits,
          trantime: handleClickTime(),
          txcode: uniqueId,
        };
        console.log('====>', requestBody);
        const apiUrl = `https://stagingapi.pennymead.com/view/updateTranscation/`;
        const res = await axios.post(apiUrl, requestBody);
        console.log('upDateTheTransaction', res.data.message);
        if (res.data.message === 'Data updated Successfully') {
          const upDatePayApi = `https://stagingapi.pennymead.com/view/paymentresult/`;
          const requestBody = {
            encode_data: dataEncode,
          };
          const _response = await axios.post(upDatePayApi, requestBody);
          console.log('data is updated', _response);
        }
      } else {
        console.log('Invalid data received: ', data);
      }
    } catch (error) {
      console.log('Response data transstatus:', error);
      console.log(
        'Server responded with status transstatus',
        error.response.status,
      );
    } finally {
      setLoader(false);
    }
  };

  const getMerchantSessionKey = async () => {
    setLoader(true);
    try {
      const requestBody = {
        vendorName: 'sandbox',
      };
      const apiUrl = `https://sandbox.opayo.eu.elavon.com/api/v1/merchant-session-keys`;

      // Encode the credentials for HTTP Basic Authentication
      const encodedCredentials = base64.encode(
        'hJYxsw7HLbj40cB8udES8CDRFLhuJ8G54O6rDpUXvE6hYDrria:o2iHSrFybYMZpmWOQMuhsXP52V4fBtpuSDshrKDSWsBY1OiN6hwd9Kb12z4j5Us5u',
      );

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });

      // Set the merchant session key in the state
      setMerchantSessionKey(response.data.merchantSessionKey);
      inserTransaction();
      setShowModal(true);
      console.log('Response payment:', response.data?.merchantSessionKey);
    } catch (error) {
      console.error('Error in merchant key:', error);
    } finally {
      setLoader(false);
    }
  };

  const getCardIdentifiers = async () => {
    setLoader(true);
    try {
      const cardDetails = {
        cardDetails: {
          cardholderName: userDetails.name,
          cardNumber: userDetails.card,
          expiryDate: userDetails.expiry,
          securityCode: userDetails.cvv,
        },
      };
      const apiUrl = `https://sandbox.opayo.eu.elavon.com/api/v1/card-identifiers`;
      const res = await axios.post(apiUrl, cardDetails, {
        headers: {
          Authorization: `Bearer ${merchantSessionKey}`,
        },
      });
      console.log('cardidentifiers', res.data?.cardIdentifier);
      // setCardIdentifier(res?.data?.cardIdentifier);
      getTransactions(res?.data?.cardIdentifier);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(
          'Server responded with status card identifier',
          error.response.status,
        );
        console.log('Response data card identifier:', error.response.data);
      }
    } finally {
      setLoader(false);
    }
  };

  const getTransactions = async cardid => {
    setLoader(true);
    try {
      const transactionRequest = {
        transactionType: 'Payment',
        vendorName: 'sandbox',
        paymentMethod: {
          card: {
            merchantSessionKey: merchantSessionKey,
            cardIdentifier: cardid,
            reusable: false,
            save: true,
          },
        },
        vendorTxCode: uniqueId,
        amount: totalAmount.grandtotal * 100,
        currency: 'GBP',
        description: 'pennymead books payment',
        settlementReferenceText: 'ABC1234',
        customerFirstName: address.name,
        customerLastName: address.name,
        billingAddress: {
          address1: address.address1,
          city: address.county,
          country: 'GB',
          address2: 'addressline2',
          address3: 'addressline3',
          postalCode: address.postcode,
        },
        avsCvcCheck: {
          status: 'AllMatched',
          address: address?.address1,
          postalCode: address?.postcode,
          securityCode: 'Matched',
        },
        entryMethod: 'Ecommerce',
        giftAid: false,
        apply3DSecure: 'Disable',
        // applyAvsCvcCheck: 'UseMSPSetting',
        customerEmail: address.email,
        customerPhone: address.hphone,
        // referrerId: '99c84b48-dd6a-4ec8-9ed7-1d91afe4297b',
        strongCustomerAuthentication: {
          notificationURL: 'https://www.opayolabs.co.uk/OpayoDemo/pi_callback',
          browserIP: '158.175.142.169',
          browserAcceptHeader: 'text/html, application/json',
          browserJavascriptEnabled: true,
          browserUserAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0',
          challengeWindowSize: 'Small',
          transType: 'GoodsAndServicePurchase',
          browserLanguage: 'en-GB',
          browserJavaEnabled: true,
          browserColorDepth: '16',
          browserScreenHeight: '768',
          browserScreenWidth: '1200',
          browserTZ: '+300',
          acctID: 'Additional information',
          threeDSExemptionIndicator: 'LowValue',
          website: 'https://www.opayolabs.co.uk',
        },
        customerMobilePhone: address.hphone,
        customerWorkPhone: address.hphone,
        credentialType: {
          cofUsage: 'First',
          initiatedType: 'CIT',
          mitType: 'Unscheduled',
        },
      };
      // Encode the credentials for HTTP Basic Authentication
      const encodedCredentials = base64.encode(
        'hJYxsw7HLbj40cB8udES8CDRFLhuJ8G54O6rDpUXvE6hYDrria:o2iHSrFybYMZpmWOQMuhsXP52V4fBtpuSDshrKDSWsBY1OiN6hwd9Kb12z4j5Us5u',
      );
      const apiUrl = `https://sandbox.opayo.eu.elavon.com/api/v1/transactions`;
      const _response = await axios.post(apiUrl, transactionRequest, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      console.log('Transactions Details', _response.data);
      if (_response.data.statusCode === '0000') {
        setOpenModal(true);
      }
      setTransactionStatus(_response?.data);
      upDateTheTransaction(_response?.data);
    } catch (error) {
      console.log('Response data transaction:', error);
      console.log(
        'Server responded with status transcation',
        error.response.status,
      );
    } finally {
      setLoader(false);
    }
  };

  // const handleOpenModal = () => {
  //   getMerchantSessionKey();
  //   setShowModal(true);
  // };
  const get_Order_Summary = async (orderNumber, customerEmail) => {
    setLoader(true);
    const apiUrl = `${APIS.getOrderSummary}/${orderNumber}/${customerEmail}/`;
    try {
      const res = await axios.get(apiUrl);
      let _response = res.data.ordersummary[0].itemsdetail || [];
      let response = res.data.ordersummary[0].orderdetail || [];
      setOrderDetail(response);
      setSelectedOrders(_response);
      setAddress(res?.data?.custmerdetail);
      setTotalAmount(res?.data);

      // }
    } catch (error) {
      // if (error.response) {
      //   if (error.code === 500) setShowModal(true);
      // }
    } finally {
      setLoader(false);
    }
  };

  const getName = category => {
    ///so in product detail api we are getting category id .. so getting name based on category id
    if (category) {
      let data = contextCategories.filter(item => item.category == category);
      ///the data will come arrays
      return data[0].name;
    }
  };

  const renderOrderDetails = ({item, index}) => {
    return (
      <View style={styles.mainCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            {item.image && item.image.length > 0 ? (
              <Image
                source={{uri: item.image[0]}}
                style={styles.productImage}
              />
            ) : (
              <View
                style={{
                  marginTop: 10,
                }}>
                <Image
                  source={require('../assets/images/placeholderimage.png')} // Display the first image if available
                  style={{width: 90, height: 120}}
                />
              </View>
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
        {/* <Text
          style={styles.quantityShow}>{`Qty ${item.selectedQuantity}`}</Text> */}
      </View>
    );
  };

  const getUserEmail = async () => {
    try {
      const email = JSON.stringify(custmerEmail);
      await AsyncStorage.setItem('custmerEmail', email);
      console.log('email Stored successfully', email);
    } catch (error) {
      console.log('email not stored', error);
    }
  };

  const showPayNowButton =
    orderDetail.invoiced === '1' &&
    orderDetail.transtatus === '' &&
    orderDetail.status === '1';
  ////////dynamically change the text name of discount
  let PriceAdjustment = 'Discount';
  if (totalAmount.discount > 0) {
    PriceAdjustment = 'Price Adjustment:';
  } else if (totalAmount.discount === 0) {
    PriceAdjustment = null;
  } else if (totalAmount.discount < 0) {
    PriceAdjustment = 'Discount';
  }
  //show the paymentstatus text based on invoiced
  let paymentStatusText = '';
  if (orderDetail.status === '0') {
    paymentStatusText = 'Order Cancelled';
  } else if (orderDetail.invoiced === '0' && orderDetail.transtatus === '') {
    paymentStatusText = 'Waiting for Invoice';
  } else if (orderDetail.invoiced === '1' && orderDetail.transtatus === '') {
    paymentStatusText = 'Payment Pending';
  } else {
    paymentStatusText = 'Paid';
  }

  const handleButtonClick = () => {
    const newErrorMsg = {}; // Initialize a new error message object
    // Check each field and set an error message if it's empty
    if (userDetails.name === '') {
      newErrorMsg.name = 'Name is required';
    }
    if (userDetails.card === '') {
      newErrorMsg.card = 'Card No is reqiured';
    }
    if (userDetails.expiry === '') {
      newErrorMsg.expiry = 'Expiry Date is required';
    }
    if (userDetails.cvv === '') {
      newErrorMsg.cvv = 'Cvv is required';
    }

    // Check if there are any error messages
    if (Object.keys(newErrorMsg).length > 0) {
      // There are errors, update the error messages and show errors
      setErrorMsg(newErrorMsg);
      setShowError({
        ...showError,
        name: 'name' in newErrorMsg,
        card: 'card' in newErrorMsg,
        expiry: 'expiry' in newErrorMsg,
        cvv: 'cvv' in newErrorMsg,
      });
    } else if (!nameRegex.test(userDetails.name)) {
      setErrorMsg({...errorMsg, name: 'Enter valid name'});
      setShowError({...showError, name: true});
    } else if (!expiryRegex.test(userDetails.expiry)) {
      setErrorMsg({
        ...errorMsg,
        expiry: 'The Expiry date needs to in MMYY format',
      });
      setShowError({...showError, expiry: true});
    } else if (!cvvRegex.test(userDetails.cvv)) {
      setErrorMsg({...errorMsg, cvv: 'Enter valid cvv'});
      setShowError({...showError, cvv: true});
    } else {
      setShowError({
        ...showError,
        name: false,
        card: false,
        expiry: false,
        cvv: false,
      });
      setUserDetails({
        name: '',
        card: '',
        expiry: '',
        cvv: '',
      });
      getCardIdentifiers();
      setShowModal(false);
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
      <View style={{marginHorizontal: 15, zIndex: 5, marginVertical: 8}}>
        <Dropdowns
          initialText={'Choose collectables'}
          style={styles.firstDropdownCollect}
          customOptionStyles={styles.firstDropdownOptionCollect}
          isGradient={true}
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
      <ScrollView>
        <View style={styles.orderContent}>
          <Text style={styles.orderSummaryText}>Order summary</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 8,
              paddingHorizontal: 14,
            }}>
            <Text style={styles.orderNoText}>OrderNO: </Text>
            <Text style={styles.orderno}>{orderDetail.orderno}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              paddingHorizontal: 14,
              alignItems: 'center',
              marginTop: 5,
              marginBottom: 15,
            }}>
            <Text style={styles.paymentstatText}>
              {orderDetail.status === '0'
                ? 'Order Status: '
                : 'Payment Status: '}
            </Text>
            <Text style={styles.paymentStatus}>{paymentStatusText}</Text>
          </View>
          {orderDetail.status === '1' && (
            <View>
              <View style={styles.totalitemsorder}>
                <Text style={styles.totalitemText}>Total Items Price: </Text>
                <Text style={styles.ordertotaltext}>
                  &pound;{totalAmount.ordertotal}
                </Text>
              </View>
              <View style={styles.postageandPacking}>
                <Text style={styles.postaandpactext}>Postage & packing:</Text>
                <Text style={styles.postageText}>
                  &pound;{totalAmount.postageandpacking}
                </Text>
              </View>
              {PriceAdjustment && (
                <View style={styles.discount}>
                  <Text style={styles.priceadjusttext}>{PriceAdjustment}</Text>
                  <Text style={styles.discounttext}>
                    &pound;{Number(`${Math.abs(totalAmount.discount)}`)}
                  </Text>
                </View>
              )}
              <View style={styles.line2}></View>
              <View style={styles.subtotal}>
                <Text style={styles.subtotaltext}>SubTotal:</Text>
                <Text style={styles.grandTotal}>
                  &pound;{totalAmount.grandtotal}
                </Text>
              </View>
            </View>
          )}
          {/* <Text style={styles.totalitemText}>Total for items : </Text>
          <Text style={styles.totalPriceTex}>
            &pound;{totalAmount}.00
            <Text style={styles.postageandpacText}>(+ Postage & packing)</Text>
          </Text> */}
          <Text style={styles.totalitemText1}>Delivery address :</Text>
          <Text style={styles.nametext}>
            {address?.name}{' '}
            <Text style={styles.address1Text}>{address?.address1}</Text>
          </Text>
          <Text style={styles.countyText}>
            {address?.county}, <Text>{address?.country} </Text>
            <Text>{address?.postcode}</Text>
          </Text>
          <Text style={styles.recievEmail}>
            You will receive an e-mail shortly detailing how to pay for this
            order.
          </Text>
          {details.orderNo && (
            <>
              <Text style={styles.pleaseText}>Please note:</Text>
              <Text style={styles.descriptionNote}>
                Most e-mail systems nowadays use junk mail filters to filter out
                the huge amounts of unsolicited email being sent every day. In
                some cases, these filters may mark a legitimate email as junk.
                If you have not received your invoice e-mail within 24 hours,
                please check your junk mail folder to make sure it hasn't been
                put there. If you've registered with the site you can also pay
                your invoice from your 'My account' page.
              </Text>
            </>
          )}
          {details.orderNo && showPayNowButton && (
            <TouchableOpacity
              style={styles.PaynowButton}
              onPress={() => {
                // handleOpenModal();
                getMerchantSessionKey();
              }}>
              <Text style={styles.paynowText}>Pay now</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          scrollEnabled={false}
          nestedScrollEnabled={true}
          data={selectedOrders}
          renderItem={renderOrderDetails}
        />
        {/* transaction modal */}
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowModal(false);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Visa width={60} height={50} />
                  <MasterCard width={60} height={50} />
                  <MaestroCard width={60} height={50} />
                  <AmericaCard width={60} height={50} />
                  <DirectCard width={60} height={50} />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: 'black', paddingHorizontal: 5}}>
                    Name:{' '}
                  </Text>
                  <TextInput
                    placeholder="Cardholder Name"
                    placeholderTextColor={'#808B96'}
                    style={styles.nameInputField}
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
                    value={userDetails.name}
                  />
                </View>
                {showError.name && (
                  <Text style={styles.errorText}>{errorMsg.name}</Text>
                )}
                <View style={styles.line3} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: 'black', paddingHorizontal: 5}}>
                    Card:{' '}
                  </Text>
                  <TextInput
                    placeholder="0000 0000 0000 0000"
                    maxLength={16}
                    keyboardType="number-pad"
                    placeholderTextColor={'#808B96'}
                    style={styles.cardInputField}
                    onChangeText={e => {
                      setUserDetails({
                        ...userDetails,
                        card: e,
                      });
                      setShowError({
                        ...showError,
                        card: false,
                      });
                    }}
                    value={userDetails.card}
                  />
                </View>
                {showError.card && (
                  <Text style={styles.errorText}>{errorMsg.card}</Text>
                )}
                <View style={styles.line3} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: 'black', paddingHorizontal: 5}}>
                    Expiry:{' '}
                  </Text>
                  <TextInput
                    placeholder="MMYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholderTextColor={'#808B96'}
                    style={styles.expiryInputField}
                    onChangeText={e => {
                      setUserDetails({
                        ...userDetails,
                        expiry: e,
                      });
                      setShowError({
                        ...showError,
                        expiry: false,
                      });
                    }}
                    onBlur={() => {
                      if (!expiryRegex.test(userDetails.expiry)) {
                        setErrorMsg({
                          ...errorMsg,
                          expiry: 'Enter valid expiry date',
                        });
                        setShowError({
                          ...showError,
                          expiry: true,
                        });
                      }
                    }}
                    value={userDetails.expiry}
                  />
                </View>
                {showError.expiry && (
                  <Text style={styles.errorText}>{errorMsg.expiry}</Text>
                )}
                <View style={styles.line3} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: 'black', paddingHorizontal: 5}}>
                    CVV:{' '}
                  </Text>
                  <TextInput
                    placeholder="123"
                    maxLength={3}
                    keyboardType="number-pad"
                    placeholderTextColor={'#808B96'}
                    style={styles.cvvInputField}
                    onChangeText={e => {
                      setUserDetails({
                        ...userDetails,
                        cvv: e,
                      });
                      setShowError({
                        ...showError,
                        cvv: false,
                      });
                    }}
                    onBlur={() => {
                      if (!cvvRegex.test(userDetails.cvv)) {
                        setErrorMsg({
                          ...errorMsg,
                          cvv: 'Enter valid cvv',
                        });
                        setShowError({
                          ...showError,
                          cvv: true,
                        });
                      }
                    }}
                    value={userDetails.cvv}
                  />
                </View>
                {showError.cvv && (
                  <Text style={styles.errorText}>{errorMsg.cvv}</Text>
                )}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    // setShowModal(false);
                    handleButtonClick();
                  }}>
                  <Text style={styles.modalButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* successful payment modal */}
        <Modal visible={openModal} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              setOpenModal(false);
              navigation.navigate('HomePage');
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent1}>
                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => {
                    setOpenModal(false);
                    navigation.navigate('HomePage');
                  }}>
                  <Cancel width={40} height={40} />
                </TouchableOpacity>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../assets/images/checkmark.png')}
                    style={{width: 100, height: 100}}
                  />
                  <Text style={styles.paysuccessfultext}>
                    Payment successful
                  </Text>
                  <Text style={styles.paysuccessfultext}>
                    Your payment has been processed successfully and your order
                    will be sent to you shortly.
                  </Text>
                  <View style={styles.clickherButton}>
                    <Text
                      style={styles.clickhereText}
                      onPress={() => {
                        navigation.navigate('TrackOrder');
                      }}>
                      Click here
                    </Text>
                    <Text style={styles.clickhereText1}>
                      to go to Track Order
                    </Text>
                  </View>
                </View>
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

export default OrderSummary;

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
    maxHeight: 150,
    top: 53,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
    borderRadius: 3,
  },
  mainCard: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    marginBottom: 20,
    elevation: 10,
    backgroundColor: '#FFF8F2',
    borderRadius: 5,
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
  },
  authorText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    width: '80%',
    fontWeight: 'bold',
  },
  priceText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
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
    top: 33,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
  },
  orderContent: {
    width: '95%',
    minHeight: 450,
    backgroundColor: '#FFF8F2',
    alignSelf: 'center',
    marginVertical: 16,
    elevation: 10,
    borderRadius: 5,
  },
  orderSummaryText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  totalPriceTex: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingHorizontal: 14,
    fontSize: 30,
    fontWeight: '600',
  },
  postageandpacText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  nametext: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  address2Text: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    paddingTop: 10,
    paddingHorizontal: 14,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  address1Text: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    paddingTop: 10,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '400',
  },
  countyText: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    paddingTop: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '400',
  },
  recievEmail: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    paddingTop: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '400',
  },
  pleaseText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingTop: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
  },
  descriptionNote: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '400',
  },
  PaynowButton: {
    width: 70,
    height: 40,
    backgroundColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
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
  quantityShow: {
    borderWidth: 1,
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    fontSize: 15,
    width: 90,
    height: 30,
    borderColor: '#873900',
    color: '#873900',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: 10,
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
  totalitemsorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  totalitemText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
  },
  totalitemText1: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#454545',
    paddingHorizontal: 14,
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
    paddingHorizontal: 14,
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
    paddingHorizontal: 14,
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
    paddingHorizontal: 14,
  },
  line2: {
    borderBottomWidth: 0.4,
    paddingVertical: 8,
  },
  line3: {
    borderBottomWidth: 0.4,
    marginTop: 2,
    marginHorizontal: 5,
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
    width: '90%',
    padding: 5,
  },
  modalContent1: {
    backgroundColor: '#FFF8F2',
    borderRadius: 8,
    width: '90%',
    padding: 5,
    height: 290,
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
    width: '95%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  nameInputField: {
    width: '70%',
    height: 40,
    color: 'black',
  },
  cardInputField: {
    width: '70%',
    height: 40,
    color: 'black',
  },
  expiryInputField: {
    width: '70%',
    height: 40,
    color: 'black',
  },
  cvvInputField: {
    width: '70%',
    height: 40,
    color: 'black',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },
  paysuccessfultext: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  clickhereText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  clickhereText1: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
  },
  clickherButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
