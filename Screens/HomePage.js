import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Filter from '../assets/images/filter.svg';
import Up from '../assets/images/up.svg';
import axios from 'axios';
import {APIS} from '../src/configs/apiUrls';

const HomePage = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
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
  const [page, setPage] = useState(1);
  const [inputSearch, setInputSearch] = useState('');
  const [error, setError] = useState('');
  const [collectableData, setCollectableData] = useState({});
  const [loader, setLoader] = useState(true);
  const totalpages = 20;

  useEffect(() => {
    getCatagories();
  }, []);

  useEffect(() => {
    getCollectibleItems(selectedFilter.type, page);
  }, [selectedFilter, page]);

  const getCatagories = async () => {
    setIsLoading(true);
    try {
      console.log('response', APIS.getCategories);
      let response = await axios.get(APIS.getCategories);
      setCategories(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('response first error', error);
      setIsLoading(false);
    }
  };

  const getCollectibleItems = async (filtertype, page) => {
    // setIsLoading(true);
    setLoader(true);
    try {
      const apiUrls = `${APIS.getCollectableItems}${filtertype}/${page}/`;
      console.log('sksksksksks', filtertype);

      const response = await axios.get(apiUrls);

      const totalPages = response.data.data.totalpages;
      setCollectableData(response.data.data);

      console.log('response2', response.data.data);
      console.log('response 2', response.data.data.totalpages);
    } catch (error) {
      console.error('getCollectibleItems error:', error);
    } finally {
      setIsLoading(false);
      setLoader(false);
    }
  };
  /// first category items
  const renderCategories = ({item}) => (
    <View style={styles.cardContent}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <Text style={styles.cardTitle} ellipsizeMode="tail" numberOfLines={3}>
        {item.title}
      </Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  /// second category items
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
        <Text style={styles.secondcardauthor}>{item.author}</Text>
        <Text style={styles.secondcardtext}>₹ {item.price}</Text>
      </View>
      <Text style={styles.secondcardtitle}>{item.title}</Text>
      <Text style={styles.secondcarddes}>{item.description}</Text>
      <TouchableOpacity style={styles.Addtocartbutton} activeOpacity={1}>
        <Text style={styles.addtocarttext}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );
  // page background color
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
    let data = [
      {
        id: 1,
        value: page > Math.floor(totalpages / 2) ? 1 : page,
      },
      {
        id: 2,
        value:
          page > Math.floor(totalpages / 2)
            ? 2
            : page + 1 > totalpages
            ? ''
            : page + 1,
      },
      {id: 3, value: totalpages > 4 ? '---' : ''},
      {
        id: 4,
        value:
          page > Math.floor(totalpages / 2)
            ? page - 1
            : totalpages - 1 > 0
            ? totalpages - 1
            : '',
      },
      {
        id: 5,
        value: page > Math.floor(totalpages / 2) ? page : totalpages,
      },
    ];

    let data1 = [
      {
        id: 1,
        value: 1,
      },
      {
        id: 2,
        value: 2 > totalpages ? '' : 2,
      },
      {
        id: 4,
        value: 3 > totalpages ? '' : 3,
      },
      {
        id: 5,
        value: 4 > totalpages ? '' : 4,
      },
    ];
    ///removing duplicate values from data
    let data3 = (totalpages < 5 ? data1 : data).filter(
      item => item.value != '',
    );
    let data4 = [...new Map(data3.map(item => [item.value, item])).values()];
    // console.log('data', data);
    return (
      <View style={styles.paginationFlex}>
        {totalpages > 1 && totalpages >= 2 && (
          <TouchableOpacity
            onPress={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            disabled={page <= 1 ? true : false}
            style={[styles.forwardButton, {opacity: page <= 1 ? 0 : 1}]}>
            <Text style={styles.forwardButtonText}>{'<'}</Text>
          </TouchableOpacity>
        )}

        {data4.map(item => (
          <TouchableOpacity
            disabled={item.id === 3 ? true : false}
            key={item.id}
            style={[
              styles.paginationButton,
              {backgroundColor: getBackground(item)},
            ]}
            onPress={() => {
              setPage(item.value);
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
        {totalpages >= 2 && (
          <TouchableOpacity
            onPress={() => {
              if (page < totalpages) {
                setPage(page + 1);
              }
            }}
            disabled={page === totalpages}
            style={[
              styles.backwardButton,
              {
                opacity: page === totalpages ? 0 : 1,
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
    if (enteredPage >= 1 && enteredPage <= totalpages) {
      setPage(enteredPage); // Update the current page
      setError('');
      setInputSearch('');
    } else {
      setError('Page number should be in allowed range');
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
          <Pressable style={styles.pressableImage}>
            <Shoppingcart width={22} height={22} />
          </Pressable>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Menu width={43} height={43} />
          </Pressable>
        </View>
        {loader && (
          <View style={styles.Loader}>
            <ActivityIndicator size={50} color={'#8B0000'}></ActivityIndicator>
          </View>
        )}
        {!isLoading ? (
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>Collectables</Text>
            <FlatList
              scrollEnabled={false}
              data={categories}
              renderItem={renderCategories}
              numColumns={2}
            />
            <Text style={styles.secondHeader}>Collectable items</Text>
            <View style={styles.filterFlex}>
              <View style={styles.filterContent}>
                <Filter width={20} height={18} />
                <Text style={styles.filterText}>Filters</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => setIsClicked(!isClicked)}
                activeOpacity={1}>
                <Text style={styles.dropdownText}>
                  {selectedFilter.itemName}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'relative', right: 45}}
                onPress={() => setIsClicked(!isClicked)}>
                <Up
                  width={20}
                  height={10}
                  style={[isClicked && styles.reverseImage]}
                />
              </TouchableOpacity>
            </View>
            <View>
              {isClicked && (
                <ScrollView style={styles.dropdownArea}>
                  {items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      disabled={item.itemName === selectedFilter.itemName}
                      onPress={() => {
                        setSelectedFilter(item);
                        setPage(1);
                        setIsClicked(false);
                      }}>
                      <Text
                        style={[
                          styles.dropdownAreaText,
                          {
                            color:
                              item.itemName === selectedFilter.itemName
                                ? 'white'
                                : 'black',
                            backgroundColor:
                              item.itemName === selectedFilter.itemName &&
                              '#873900',
                          },
                        ]}>
                        {item.itemName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <FlatList
              data={collectableData.data}
              renderItem={renderSecondCategory}
              scrollEnabled={false}
            />
            <View style={styles.paginationAndSearch}>
              {renderButtons()}
              {renderSearch()}
            </View>
            {loader && (
              <View style={styles.Loader}>
                <ActivityIndicator
                  size={50}
                  color={'#8B0000'}></ActivityIndicator>
              </View>
            )}

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
        ) : (
          <View style={styles.Loader}>
            <ActivityIndicator size={50} color={'#8B0000'}></ActivityIndicator>
          </View>
        )}
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
    // width: '60%',
    paddingHorizontal: 15,
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
    // alignItems: 'center',
    // width: Dimensions.get('window').width - 100,
    width: '60%',
    height: 40,
    borderWidth: 1,
    borderColor: '#873900',
    paddingLeft: 10,
  },
  dropdownText: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  dropdownArea: {
    width: '60%',
    flex: 1,
    alignSelf: 'center',
    marginLeft: 97,
    minHeight: 100,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#873900',
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
  secondcardauthor: {
    padding: 10,
    color: 'black',
    flex: 1,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 20,
    fontWeight: '700',
  },
  secondcardtitle: {
    padding: 10,
    color: 'black',
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '700',
  },
  secondcardtext: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: '700',
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
    padding: 10,
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
    height: 380,
    backgroundColor: '#873900',
    marginTop: 20,
    alignItems: 'center',
  },
  paginationFlex: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
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
    margin: 2.5,
    flex: 1,
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
  pressableImage: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#873900',
    borderRadius: 50,
  },
  filterFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    right: -5,
    // position: 'relative',
  },
  dropdownAreaText: {
    padding: 4,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: '400',
  },
  paginationAndSearch: {
    backgroundColor: '#FFF8F2',
    height: 180,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
});
