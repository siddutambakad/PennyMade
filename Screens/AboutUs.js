import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import {CategoriesContext} from './componet/AppContext';
import Loader from './componet/Loader/Loader';
import axios from 'axios';
import Footer from './componet/Footer';

const AboutUs = ({navigation}) => {
  const {setContextCategories, cartItems, contextCategories, getSubCatagories} =
    useContext(CategoriesContext);
  const [loader, setLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCatagories();
  }, []);

  const getCatagories = async () => {
    setLoader(true);
    try {
      let response = await axios.get('https://stagingapi.pennymead.com/view/categories/');
      setContextCategories(response?.data?.data);
      setLoader(false);
    } catch (error) {
      console.log('response first error', error);
      setLoader(false);
      setShowModal(true);
    }
  };

  const getSubCategoryData = async item => {
    setLoader(true); // Set loading to true when the function starts

    try {
      const id = item?.category;
      if (id) {
        await getSubCatagories(id);
      }
      // Assuming navigation.navigate is asynchronous or doesn't return a promise
      navigation.navigate('CatalougePage', {books: item});
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoader(false); // Set loading to false when the function completes (whether it succeeds or fails)
    }
  };

  const renderCategories = ({item}) => (
    // <View style={{alignItems: 'center', alignSelf: 'center',}}>
    <TouchableOpacity
      style={styles.cardContent}
      activeOpacity={0.5}
      onPress={() => getSubCategoryData(item)}>
      {item.image && item.image.length > 0 ? (
        <Image source={{uri: item.image[0]}} style={styles.cardImage} />
      ) : (
        <View
          style={{
            borderWidth: 0.4,
            borderColor: '#CACFD2',
            width: 107,
            height: 120,
            marginTop: 10,
          }}></View>
      )}
      <Text style={styles.cardTitle} ellipsizeMode="tail" numberOfLines={3}>
        {item.title}
      </Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
    // </View>
  );
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
      <ScrollView>
        <View style={styles.imgback}>
          <Image
            source={require('../assets/images/aboutimage.png')}
            style={styles.firstimg}
          />
        </View>
        <Text style={styles.headerText}>
          Vintage Enthusiasts Rejoice: Uncover Hidden Gems in our website
        </Text>
        <Text style={styles.desText}>
          Attention vintage enthusiasts! Get ready to explore a treasure trove
          of hidden gems that have been carefully sourced from around the world.
          Our auction showcases a diverse range of vintage collectables, each
          with its own unique allure. From elegant Victorian-era pieces to
          mid-century modern marvels, there's something for everyone.
        </Text>
        <Text style={styles.desText}>
          Don't let these one-of-a-kind items slip through your fingers – place
          your bids today! Whether you're a seasoned collector or a newcomer to
          the vintage world, this is your chance to find that perfect piece to
          elevate your collection. Start bidding now and make history your own!
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/adminimage.png')}
            style={styles.adminimg}
          />
        </View>
        <Text style={styles.adminNameText}>Mr David N Druett</Text>
        <Text style={styles.admindec}>- Pennymead administrator</Text>
        <Text style={styles.desText}>
          I am delighted to introduce myself as the proud owner of [Your
          Business Name], a passion-driven venture dedicated to providing
          exceptional [product/service]. As the driving force behind this
          enterprise, my commitment is to deliver unparalleled quality,
          innovation, and customer satisfaction.
        </Text>
        <Text style={styles.desText}>
          Our commitment extends beyond financial success; we are also dedicated
          to giving back to the community that supports us. As a socially
          responsible company, we actively participate in various philanthropic
          endeavors, striving to make a positive impact on society.
        </Text>
        <Text style={styles.headertext}>Collectables</Text>
        <FlatList /// display the first categories items
          scrollEnabled={false}
          data={contextCategories}
          renderItem={renderCategories}
          numColumns={2}
          style={{marginHorizontal: 10}}
        />
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

export default AboutUs;

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
  firstimg: {
    width: 330,
    height: 330,
    resizeMode: 'contain',
  },
  imgback: {
    alignItems: 'center',
  },
  headerText: {
    paddingHorizontal: 14,
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
  },
  desText: {
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'justify',
    marginVertical: 8,
    paddingHorizontal: 14,
  },
  adminimg: {
    width: 330,
    height: 330,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  adminNameText: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 5,
    paddingHorizontal: 14,
  },
  admindec: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    marginVertical: 5,
    paddingHorizontal: 14,
  },
  cardContent: {
    marginHorizontal: 9,
    marginVertical: 5,
    flex: 0.5,
    width: '40%',
    minHeight: 280,
    backgroundColor: '#FFF8F2',
    elevation: 10,
    alignItems: 'center',
    marginBottom: 18,
    borderRadius: 5,
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    color: 'black',
    padding: 5,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: 'bold',
    color: 'black',
  },
  headertext: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    marginBottom: 20,
    paddingLeft: 16,
  },
  cardImage: {
    width: 107,
    height: 120,
    // resizeMode: 'cover',
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
