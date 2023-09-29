import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIS} from '../src/configs/apiUrls';
import axios from 'axios';
import Loader from './componet/Loader/Loader';

const TrackOrder = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
  });

  const [errorMsg, setErrorMsg] = useState({
    email: '',
  });

  const [showError, setShowError] = useState({
    email: false,
  });

  useEffect(() => {
    getEmailStored();
  }, []);

  const getEmailStored = async () => {
    let storedEmail = await AsyncStorage.getItem('emails');
    storedEmail = JSON.parse(storedEmail);
    console.log('storedEmail', storedEmail);
    setEmail(storedEmail);
  };

  const sendOtp = async () => {
    setLoader(true);
    try {
      const api = `${APIS.getEmailvalue}${email}/`;
      const res = await axios.get(api);
      const errorMessage = res.data.message;
      console.log('responce message', res.data.message);
      setOtpSent(true);
    } catch (error) {
      if (error.response) {
        console.log('Server responded with:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    } finally {
      setLoader(false);
    }
  };

  const emailRegex = /^\S+@\S+\.\S{2,3}$/;

  const handleClick = () => {
    const newErrorMsg = {}; // Initialize a new error message object
    // Check each field and set an error message if it's empty
    if (userDetails.email === '') {
      newErrorMsg.email = 'Email is required';
    }

    // Check if there are any error messages
    if (Object.keys(newErrorMsg).length > 0) {
      // There are errors, update the error messages and show errors
      setErrorMsg(newErrorMsg);
      setShowError({
        ...showError,
        email: 'email' in newErrorMsg,
      });
    } else if (!emailRegex.test(userDetails.email)) {
      setErrorMsg({...errorMsg, email: 'Enter valid email'});
      setShowError({...showError, email: true});
    } else {
      setShowError({
        ...showError,
        email: false,
      });
      sendOtp();
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
      <Text style={styles.headerText}>Track your order</Text>
      <Text style={styles.subHeaderText}>
        Get the real-time updates on your purchase. We understand that knowing
        the status of your order is important to you, and we're here to make the
        tracking process as seamless as possible.
      </Text>
      <Text style={styles.emailText}>Email</Text>
      <View style={{}}>
        <TextInput
          style={styles.emailInput}
          onChangeText={e => {
            setEmail(e);
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
      <TouchableOpacity
        style={styles.sendOtpButton}
        onPress={() => {
          handleClick();
          // sendOtp();
        }}>
        <Text style={styles.sendotpText}>Send OTP</Text>
      </TouchableOpacity>
      <Text style={styles.enteroptText}>Enter OTP</Text>
      <View style={{}}>
        <TextInput style={styles.otpInput} />
      </View>
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
      <Text style={styles.orderText}>Order list</Text>
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
});
