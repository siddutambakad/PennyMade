import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
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


const OrderSummary = ({route, navigation}) => {
  const {cartItems, contextCategories} = useContext(CategoriesContext);
  const {summary} = route.params;
  const emails = [summary.customerEmailid];
  const orderNo = [summary.ordernumber];
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    get_Order_Summary();
    getUserEmail();
  }, []);

  const get_Order_Summary = async () => {
    setLoader(true);
    const apiUrl = `${APIS.getOrderSummary}/${orderNo}/${emails}/`;
    try {
      const res = await axios.get(apiUrl);
      let _response = res.data.ordersummary[0].itemsdetail || [];
      // Assuming the response contains the cart data, you can access it here
      if (_response.length > 0) {
        const mergedArray = _response.map(item1 => {
          const matchingItem = cartItems.find(
            item2 => item2.sysid === item1.sysid,
          );
          return {...item1, ...matchingItem};
        });

        setSelectedOrders(mergedArray);
        setAddress(res.data.custmerdetail);
      }
    } catch (error) {
      if (error.response) {
        console.log('Server responded with:', error.response.status);
        console.log('Response data:', error.response.data);
      }
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

  const totalAmount = selectedOrders.reduce((acc, item) => {
    const itemTotalPrice =
      parseFloat(item.price) * parseInt(item.selectedQuantity);
    return acc + itemTotalPrice;
  }, 0);

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
        <Text
          style={styles.quantityShow}>{`Qty ${item.selectedQuantity}`}</Text>
      </View>
    );
  };

  const getUserEmail = async () => {
    try {
      const email = JSON.stringify(emails);
      await AsyncStorage.setItem('emails', email);
      console.log('email Stored successfully', email);
    } catch (error) {
      console.log('email not stored', error);
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
        <FlatList
          scrollEnabled={false}
          nestedScrollEnabled={true}
          data={selectedOrders}
          renderItem={renderOrderDetails}
        />
        <View style={styles.orderContent}>
          <Text style={styles.orderSummaryText}>Order summary</Text>
          <Text style={styles.totalitemText}>Total for items : </Text>
          <Text style={styles.totalPriceTex}>
            &pound;{totalAmount}.00
            <Text style={styles.postageandpacText}>(+ Postage & packing)</Text>
          </Text>
          <Text style={styles.totalitemText}>Delivery address :</Text>
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
          <Text style={styles.pleaseText}>Please note:</Text>
          <Text style={styles.descriptionNote}>
            Most e-mail systems nowadays use junk mail filters to filter out the
            huge amounts of unsolicited email being sent every day. In some
            cases, these filters may mark a legitimate email as junk. If you
            have not received your invoice e-mail within 24 hours, please check
            your junk mail folder to make sure it hasn't been put there. If
            you've registered with the site you can also pay your invoice from
            your 'My account' page.
          </Text>
          <TouchableOpacity style={styles.PaynowButton}>
            <Text style={styles.paynowText}>Pay now</Text>
          </TouchableOpacity>
        </View>
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
    height: 260,
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
    // flex: 0.6,
    justifyContent: 'space-between',
    // paddingHorizontal: 7,
    width: '100%',
    alignItems: 'center',
  },
  authorText: {
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
    // borderRadius: 0,
    top: 33,
    // borderBottomWidth: 1,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
  },
  orderContent: {
    width: '90%',
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
  totalitemText: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingTop: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
  },
  totalPriceTex: {
    fontFamily: 'RobotoSlab-Regular',
    color: '#454545',
    paddingHorizontal: 25,
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
});
