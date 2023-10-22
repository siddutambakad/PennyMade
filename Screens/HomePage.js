import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import axios from 'axios';
import {APIS} from '../src/configs/apiUrls';
import Loader from './componet/Loader/Loader';
import {CategoriesContext} from './componet/AppContext';
import Filter from '../assets/images/filter.svg';
import Dropdowns from './componet/Dropdowns';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Card from './componet/Card';
import Footer from './componet/Footer';
// import {LogBox} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const HomePage = () => {
  const {
    contextCategories,
    getSubCatagories,
    setContextCategories,
    cartItems,
    addToCart,
  } = useContext(CategoriesContext);
  // LogBox.ignoreAllLogs();
  const [selectedFilter, setSelectedFilter] = useState({
    name: 'Newest Items',
    type: 'newlyUpdated',
  });
  const items = [
    {name: 'Newest Items', type: 'newlyUpdated'},
    {name: 'Author', type: 'author'},
    {name: 'Title', type: 'title'},
    {name: 'Price-High', type: 'price_high'},
    {name: 'Price-Low', type: 'price_low'},
  ];
  const [page, setPage] = useState(1);
  const [inputSearch, setInputSearch] = useState('');
  const [error, setError] = useState('');
  const [collectableData, setCollectableData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [category, setCategory] = useState(1);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  /// useeffect for calling the api when app renders for categories
  useEffect(() => {
    getCatagories();
  }, []);

  ///useeffect for the second api
  useEffect(() => {
    getCollectibleItems(selectedFilter.type, page);
  }, [selectedFilter.type, page]);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }, []),
  );
  ///fecth the first api of catagories
  const getCatagories = async () => {
    setLoader(true);
    try {
      // let response = await axios.get(APIS.getCategories);
      let response = await axios.get('http://54.226.77.97:81/view/categories/');
      setContextCategories(response?.data?.data);
      setLoader(false);
    } catch (error) {
      console.log('response first error', error);
      setShowModal(true);
      setLoader(false);
    }
  };
  ///fetch the second api of collectible items
  const getCollectibleItems = async (filtertype, page) => {
    setLoader(true);
    const apiUrls = `${APIS.getCollectableItems}${filtertype}/${page}/`;
    axios
      .get(apiUrls)
      .then(response => {
        setCollectableData(response.data?.data);
      })
      .catch(error => {
        console.log('getCollectibleItems error:', error);
        setShowModal(true);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // when user click any one category
  const getSubCategoryData = async item => {
    setLoader(true); // Set loading to true when the function starts

    try {
      const id = item?.category;
      if (id) {
        await getSubCatagories(id);
      }
      navigation.navigate('CatalougePage', {books: item});
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoader(false); // Set loading to false when the function completes (whether it succeeds or fails)
    }
  };
  /// first category items
  const renderCategories = ({item}) => {
    return (
      // <View style={{alignItems: 'center', flex: 0.5}}>
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.5}
        onPress={() => getSubCategoryData(item)}>
        {item.image && item.image.length > 0 ? (
          <Image source={{uri: item.image[0]}} style={styles.cardImage} />
        ) : (
          <View
            style={{
              marginTop: 10,
            }}>
            <Image
              source={require('../assets/images/placeholderimage.png')}
              style={{width: 107, height: 120}}
            />
          </View>
        )}
        <Text style={styles.cardTitle} ellipsizeMode="tail" numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.cardText}>{item.name}</Text>
      </TouchableOpacity>
      // </View>
    );
  };

  const handleCart = item => {
    addToCart(item);
  };

  const handleScrollUP = () => {
    scrollViewRef.current.scrollTo({x: 1300, y: 1300, animated: false});
  };

  /// second category items
  const renderSecondCategory = ({item, index}) => {
    return (
      <Card
        imgSource={item.image && item.image.length > 0 && item.image[0]}
        author={item.author}
        price={item.price}
        title={item.title}
        description={item.description}
        // isLoading={loading}
        handlePress={() => {
          setTimeout(() => {
            handleCart(item.sysid);
          }, 800);
        }}
        handlePressCard={async () => {
          setLoader(true);
          const id = item?.category;
          setCategory(id);

          if (id) {
            await getSubCatagories(id);
            setLoader(false);
          }
          navigation.navigate('ProductDetail', {sysid: item.sysid});
        }}
        cardIndex={index} // Pass the index of the card
      />
    );
  };
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
    ///pagination buttons data
    let data = [
      {
        id: 1,
        value: page > Math.floor(collectableData.totalpages / 2) ? 1 : page,
      },
      {
        id: 2,
        value:
          page > Math.floor(collectableData.totalpages / 2)
            ? 2
            : page + 1 > collectableData.totalpages
            ? ''
            : page + 1,
      },
      {id: 3, value: collectableData.totalpages > 4 ? '---' : ''},
      {
        id: 4,
        value:
          page > Math.floor(collectableData.totalpages / 2)
            ? page - 1
            : collectableData.totalpages - 1 > 0
            ? collectableData.totalpages - 1
            : '',
      },
      {
        id: 5,
        value:
          page > Math.floor(collectableData.totalpages / 2)
            ? page
            : collectableData.totalpages,
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
        value: 2 > collectableData.totalpages ? '' : 2,
      },
      {
        id: 4,
        value: 3 > collectableData.totalpages ? '' : 3,
      },
      {
        id: 5,
        value: 4 > collectableData.totalpages ? '' : 4,
      },
    ];
    ///removing duplicate values from data
    let data3 = (collectableData.totalpages < 5 ? data1 : data).filter(
      item => item.value != '',
    );
    let data4 = [...new Map(data3.map(item => [item.value, item])).values()];
    return (
      <View style={styles.paginationFlex}>
        {collectableData.totalpages > 1 &&
          collectableData.totalpages >= 2 && ( /// display the backward button the page button should be greater then 1 && should not apear for only 1 total page
            <TouchableOpacity ///backward button for buttons
              onPress={() => {
                if (page > 1) {
                  setPage(page - 1);
                  handleScrollUP();
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
              handleScrollUP();
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
        {collectableData.totalpages >= 2 && ( /// display the button if pages are more then 1 only
          <TouchableOpacity /// forward button for the page button pagination
            onPress={() => {
              if (page < collectableData.totalpages) {
                setPage(page + 1);
                handleScrollUP();
              }
            }}
            disabled={page === collectableData.totalpages}
            style={[
              styles.backwardButton,
              {
                opacity: page === collectableData.totalpages ? 0 : 1,
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
    if (enteredPage >= 1 && enteredPage <= collectableData.totalpages) {
      setPage(enteredPage); // Update the current page
      setError('');
      setInputSearch('');
    } else {
      setError('Page number should be in allowed range');
    }
    handleScrollUP();
  };

  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imageBacground}>
      <View style={styles.container}>
        {/* screen header */}
        <View style={styles.headers}>
          <View style={{marginLeft: -8}}>
            <Logo width={180} height={25} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                navigation.navigate('CartScreen');
              }}
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
            </Pressable>
            <Pressable
              style={{paddingLeft: 10}}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Menu width={43} height={43} />
            </Pressable>
          </View>
        </View>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Collectables</Text>

          <FlatList /// display the first categories items
            scrollEnabled={false}
            data={contextCategories}
            renderItem={renderCategories}
            numColumns={2}
            style={{marginHorizontal: 10}}
          />
          <Text style={styles.secondHeader}>Collectable items</Text>
          {collectableData?.data && ( ///if the loader is active it should not display
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'flex-start',
                flex: 0.5,
                paddingHorizontal: 15,
                zIndex: 5,
              }}>
              <View style={styles.filterContent}>
                <Filter />
                <Text style={styles.filterText}>Filters</Text>
              </View>
              <Dropdowns
                initialText={selectedFilter?.name}
                options={items}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 3,
                  width: 200,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: '#873900',
                  position: 'relative',
                }}
                customOptionStyles={{
                  width: 200,
                  top: 50,
                  position: 'absolute',
                  backgroundColor: '#FFF8F2',
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: '#873900',
                  height: 150,
                  flex: 1,
                  borderStyle: 'solid',
                }}
                handleClick={item => {
                  setSelectedFilter(item);
                  setPage(1);
                }}
                isGradient={false}
                setPage={setPage}
                isClicked={isClicked}
                setIsClicked={() => {
                  setIsClicked(!isClicked);
                }}
              />
            </View>
          )}

          <FlatList /// display the second collectible items
            data={collectableData?.data}
            renderItem={renderSecondCategory}
            scrollEnabled={false}
            // style={{marginTop: isClicked ? -145 : 15}}
          />
          {collectableData?.data && ( //// if the loader is active it will not display
            //// renderbuttons and rendersearch
            <View style={styles.paginationAndSearch}>
              {renderButtons()}
              {renderSearch()}
            </View>
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
          {/* footer content */}
          <Footer />
        </ScrollView>
      </View>
      {/* loader for the whole content */}
      {loader && <Loader />}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  headerText: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    marginBottom: 20,
    paddingLeft: 16,
  },
  secondHeader: {
    fontFamily: 'RobotoSlab-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 26,
    marginTop: 40,
    paddingLeft: 16,
    marginBottom: 25,
  },
  cardImage: {
    width: 107,
    height: 120,
    // resizeMode: 'cover',
  },
  cardContent: {
    margin: 10,
    // flex: 0.5,
    width: '45%',
    minHeight: 280,
    backgroundColor: '#FFF8F2',
    elevation: 10,
    alignItems: 'center',
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
  filterText: {
    fontFamily: 'RobotoSlab-Regular',
    marginLeft: 7,
    color: '#454545',
    fontSize: 16,
    fontWeight: '600',
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
    height: 350,
    backgroundColor: '#873900',
    marginTop: 20,
    alignItems: 'center',
  },
  paginationFlex: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    width: '95%',
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
    position: 'relative',
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
  paginationAndSearch: {
    backgroundColor: '#FFF8F2',
    height: 180,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialMediaImg: {
    width: 130,
    height: 70,
    resizeMode: 'stretch',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: responsiveWidth(30),
    padding: 10,
    // marginTop: 10,
  },
  dropAndFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    // alignItems: 'center',
    width: '100%',
    flex: 1,
    // position: 'relative',
    paddingHorizontal: 10,
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
