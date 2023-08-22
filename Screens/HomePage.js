import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Filter from '../assets/images/filter.svg';
import Up from '../assets/images/up.svg';
import PayPal from '../assets/images/paypal.svg';
import MasterCard from '../assets/images/mastercard.svg';
import MaestroCard from '../assets/images/maestro.svg';
import AmericanExpress from '../assets/images/american.svg';
import Visa from '../assets/images/visa.svg';
import VisaLogo from '../assets/images/visalogo.svg';
import DirectDebit from '../assets/images/directdebit.svg';
import Caure from '../assets/images/Caure.svg';
import Trust from '../assets/images/trustimage.svg';
import Reviews from '../assets/images/see44reviews.svg';
import SocialMedia from '../assets/images/socialmedia.svg';
import GET_CAT_DATA from '../src/configs/apiUrls';
import axios from 'axios';

const HomePage = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    itemName: 'Newest Items',
    type: 'newluUpdated',
  });
  const items = [
    {itemName: 'Newest Items', type: 'newluUpdated'},
    {itemName: 'Author', type: 'author'},
    {itemName: 'Title', type: 'title'},
    {itemName: 'Price-High', type: 'price_high'},
    {itemName: 'Price-Low', type: 'price_low'},
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [inputSearch, setInputSearch] = useState('');
  const [error, setError] = useState('');
  const pagesToShow = 3; // Number of page buttons to show
  const totalPages = 1140;

  const handleDropdownPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); ////animation for dropdown make it smooth
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    getCatagories();
  }, []);

  useEffect(() => {
    getCollectibleItems(selectedFilter);
  }, [selectedFilter, currentPage]);

  const getCatagories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://54.226.77.97:81/view/categories/',
      );
      setCategories(response.data.data);
      setIsLoading(false);
      console.log('response 1', response.data.data);
    } catch (error) {
      console.error('response first error', error);
      setIsLoading(false);
    }
  };

  const getCollectibleItems = async () => {
    setIsLoading(true);

    try {
      const apiUrls = `${GET_CAT_DATA}${selectedFilter?.type}/${currentPage}/`;
      const response = await axios.get(apiUrls);
      setCategoryFilter(response.data.data.data);
      setIsLoading(false);
      console.log('response 2', response.data.data.data);
    } catch (error) {
      console.error('getCollectibleItems error:', error); // Log the specific error
      setIsLoading(false);
    }
  };

  const renderCategories = ({item}) => (
    <View style={styles.cardContent}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  const renderSecondCategory = ({item}) => (
    <View style={styles.secondCard}>
      <View style={{alignItems: 'center', padding: 10}}>
        {item.image && item.image.length > 0 && (
          <Image
            source={{uri: item.image[0].url}} // Display the first image if available
            style={{width: 200, height: 200, marginTop: 10}}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.secondcardtitle}>{item.title}</Text>
        <Text style={styles.secondcardtext}>₹ {item.price}</Text>
      </View>
      <Text style={styles.secondcarddes}>{item.description}</Text>
      <TouchableOpacity style={styles.Addtocartbutton} activeOpacity={1}>
        <Text style={styles.addtocarttext}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const generatePaginationButtons = () => {
    const pageButtons = [];

    let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
    let endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <TouchableOpacity
          key={page}
          style={[
            styles.pageButton,
            currentPage === page && styles.activePageButton,
          ]}
          onPress={() => {
            setCurrentPage(page);
          }}>
          <Text
            style={[
              styles.pageButtonText,
              currentPage === page && styles.activePageButton,
            ]}>
            {page}
          </Text>
        </TouchableOpacity>,
      );
    }

    return pageButtons;
  };

  const renderPaginationButtons = () => (
    <View style={styles.paginationButtons}>
      {currentPage > pagesToShow && (
        <>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={() => {
              setCurrentPage(1);
            }}>
            <Text style={styles.pageButtonText}>1</Text>
          </TouchableOpacity>
        </>
      )}
      {generatePaginationButtons()}
      {currentPage <= totalPages - pagesToShow && (
        <>
          <Text style={styles.ellipsis}>...</Text>
          <TouchableOpacity
            style={styles.pageButton1}
            onPress={() => setCurrentPage(totalPages)}>
            <Text style={styles.pageButtonText}>{totalPages}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const handleGoToPage = () => {
    const parsedPage = parseInt(inputSearch); // Convert user's input to a number

    // Check if parsedPage is a valid number and within the allowed range
    if (parsedPage >= 1 && parsedPage <= totalPages) {
      getCollectibleItems(selectedFilter, parsedPage); // Update items based on selected filter and new page
      setCurrentPage(parsedPage); // Update the current page
      setError('');
    } else {
      setError('Page number should be greater then 0');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imageBacground}>
      <View style={styles.container}>
        <View style={styles.headers}>
          <View>
            <Logo />
          </View>
          <Pressable
            style={{
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#873900',
              borderRadius: 50,
            }}>
            <Shoppingcart width={22} height={22} />
          </Pressable>
          <Pressable style={{}} onPress={() => navigation.openDrawer()}>
            <Menu width={43} height={43} />
          </Pressable>
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Collectables</Text>
          <FlatList
            scrollEnabled={false}
            data={categories}
            renderItem={renderCategories}
            numColumns={2}
          />
          <Text style={styles.secondHeader}>Collectable items</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              right: -10,
            }}>
            <View style={styles.filterContent}>
              <Filter width={20} height={18} />
              <Text style={styles.filterText}>Filters</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={handleDropdownPress}
              activeOpacity={1}>
              <Text style={styles.dropdownText}>{selectedFilter.itemName}</Text>
            </TouchableOpacity>
            <View style={{position: 'relative', right: 45}}>
              <Up
                width={20}
                height={10}
                style={[isClicked && styles.reverseImage]}
              />
            </View>
          </View>
          <>
            {isClicked && (
              <ScrollView style={styles.dropdownArea}>
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.countryitem,
                      item.itemName == selectedFilter &&
                        styles.selectedCountryItem,
                    ]}
                    onPress={() => {
                      setSelectedFilter(item);
                      setIsClicked(false);
                      // getCollectibleItems(item.itemName);
                    }}>
                    <Text
                      style={[
                        styles.countryText,
                        item.itemName == selectedFilter &&
                          styles.selectedCountryText,
                      ]}>
                      {item.itemName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
          <FlatList
            data={categoryFilter}
            renderItem={renderSecondCategory}
            scrollEnabled={false}
          />
          <View style={styles.buttonContainer1}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.arrowbutton}
                onPress={() => {
                  const previousPage = currentPage - 1;
                  setCurrentPage(previousPage);
                }}>
                <Text style={styles.pageButtonText}>{'<'}</Text>
              </TouchableOpacity>
              {renderPaginationButtons()}
              <TouchableOpacity
                style={styles.arrowbackbutton}
                onPress={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                }}>
                <Text style={styles.pageButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'RobotoSlab-Regular',
                  fontSize: 15,
                  paddingRight: 10,
                }}>
                Go To Page
              </Text>
              <TextInput
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 1,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: '#873900',
                  borderColor: '#873900',
                }}
                keyboardType="phone-pad"
                maxLength={4}
                onChangeText={setInputSearch}
                value={inputSearch}
              />
              <TouchableOpacity onPress={handleGoToPage}>
                <Text
                  style={{
                    color: 'black',
                    paddingLeft: 20,
                    textDecorationLine: 'underline',
                    fontSize: 15,
                    fontFamily: 'RobotoSlab-Regular',
                  }}>
                  Go {'>'}
                </Text>
              </TouchableOpacity>
            </View>
            {error !== '' && <Text style={{color: 'red'}}>{error}</Text>}
          </View>
          <View style={styles.footerContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 175,
                  height: 110,
                  backgroundColor: '#FFF8F2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  marginHorizontal: 5,
                  borderRadius: 5,
                }}>
                <PayPal />
                <View style={{flexDirection: 'row', padding: 5}}>
                  <MasterCard />
                  <MaestroCard />
                  <AmericanExpress />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Visa />
                  <VisaLogo />
                  <DirectDebit />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#FFF8F2',
                  width: 175,
                  height: 110,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  marginHorizontal: 5,
                  borderRadius: 5,
                }}>
                <View style={{padding: 5}}>
                  <Caure width={150} height={30} />
                </View>
                <View style={{padding: 2}}>
                  <Trust />
                </View>
                <View style={{padding: 2}}>
                  <Reviews />
                </View>
              </View>
            </View>
            <View style={{marginTop: 50}}>
              <SocialMedia />
            </View>
            <Text style={{textAlign: 'center', marginTop: 50}}>
              Copyright © 2023, Pemmymead | All Rights Reserved | Terms &
              Conditions | Privacy Policy
            </Text>
          </View>
          {isLoading && (
            <View style={styles.Loader}>
              <ActivityIndicator
                size={50}
                color={'#8B0000'}></ActivityIndicator>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBacground: {
    flex: 1,
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  secondHeader: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    marginTop: 40,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  cardImage: {
    width: 107,
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    marginHorizontal: 10,
    flex: 1,
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
  Loader: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'RobotoSlab-Regular',
    marginLeft: 7,
    color: '#454545',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: Dimensions.get('window').width - 100,
    width: '60%',
    height: 40,
    borderWidth: 1,
    borderColor: '#873900',
  },
  dropdownText: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 20,
  },
  dropAndError: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 19,
  },
  dropdownArea: {
    marginTop: 2,
    width: '60%',
    left: 116,
    minHeight: 100,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: '#873900',
  },
  countryText: {
    color: 'black',
    padding: 4,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  secondCard: {
    marginTop: 30,
    width: '80%',
    minHeight: 380,
    alignSelf: 'center',
    margin: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
    backgroundColor: '#FFF8F2',
    borderRadius: 5,
  },
  secondcardtitle: {
    padding: 10,
    color: 'black',
    flex: 1,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 18,
  },
  secondcardtext: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
  },
  secondcarddes: {
    color: 'black',
    flex: 1,
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
  },
  buttonContainer1: {
    alignSelf: 'center',
    marginBottom: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width - 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#FFF8F2',
    height: 150,
    elevation: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pageButton: {
    marginHorizontal: 4,
    paddingVertical: 6,
    borderWidth: 1,
    width: 40,
    height: 50,
    borderColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  pageButton1: {
    marginHorizontal: 4,
    paddingVertical: 6,
    borderWidth: 1,
    width: 40,
    height: 50,
    borderColor: '#873900',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: '#873900',
    color: 'white',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#873900',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: 'bold',
  },
  ellipsis: {
    borderWidth: 1,
    width: 40,
    height: 50,
    fontSize: 16,
    marginHorizontal: 5,
    color: '#873900',
    borderColor: '#873900',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
  arrowbutton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    borderRadius: 5,
  },
  arrowbackbutton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#873900',
    borderRadius: 5,
  },
  Addtocartbutton: {
    width: 100,
    height: 40,
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
    flex: 1,
    height: 400,
    backgroundColor: '#873900',
    marginTop: 20,
    alignItems: 'center',
  },
});
