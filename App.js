import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import HomePage from './Screens/HomePage';
import {DrawerActions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import AboutUs from './Screens/AboutUs';
import TrackOrder from './Screens/TrackOrder';
import ContactUs from './Screens/ContactUs';
import SplashScreen from './Screens/SplashScreen';
import CatalougePage from './Screens/CatalougePage';
import {CategoriesProvider} from './Screens/componet/AppContext';
import Toast from 'react-native-toast-message';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import ProductDetail from './Screens/ProductDetail';
import CartScreen from './Screens/CartScreen';
import Home from './assets/images/homeicon.svg';
import AboutUS from './assets/images/aboutusicon.svg';
import Track from './assets/images/trackicon.svg';
import Contact from './assets/images/contacticon.svg';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import OrderSummary from './Screens/OrderSummary';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  // const [showSplash, setShowSplash] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowSplash(false);
  //   }, 1000);
  // }, []);
  return (
    <Stack.Navigator>
      {/* {showSplash && (
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      )} */}
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CatalougePage"
        component={CatalougePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = props => {
  const {navigation} = props;

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity style={styles.iconStyle} onPress={closeDrawer}>
          <Image
            source={require('./assets/images/drawericon.png')}
            style={{width: 42, height: 42}}
          />
        </TouchableOpacity>
        <Text style={styles.pennyText}>PENNYMEAD.COM</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.line}></View>
      <View style={styles.imgContainer}>
        <Image
          source={require('./assets/images/socialmedia.png')}
          style={styles.img}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  pennyText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'RobotoSlab-Regular',
    // marginBottom: 4,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 50,
    paddingHorizontal: 18,
  },
  homeText: {
    color: 'white',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
  },
  line: {
    marginVertical: 50,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    width: '55%',
    alignSelf: 'center',
  },
  imgContainer: {
    alignSelf: 'center',
  },
  img: {
    width: 90,
    height: 55,
    resizeMode: 'contain',
  },
});

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: '#873900',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{
          headerShown: false,
          drawerActiveBackgroundColor: '#873900',
          drawerInactiveBackgroundColor: '#873900',
          drawerIcon: () => <Home width={42} height={42} />,
          drawerLabelStyle: {
            color: '#FFF8F2',
            fontSize: 18,
            fontFamily: 'RobotoSlab-Regular',
          },
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          drawerActiveBackgroundColor: '#873900',
          drawerInactiveBackgroundColor: '#873900',
          headerShown: false,
          drawerIcon: () => <AboutUS width={42} height={42} />,
          drawerLabelStyle: {
            color: '#FFF8F2',
            fontSize: 18,
            fontFamily: 'RobotoSlab-Regular',
          },
        }}
      />
      <Drawer.Screen
        name="TrackOrder"
        component={TrackOrder}
        options={{
          drawerActiveBackgroundColor: '#873900',
          drawerInactiveBackgroundColor: '#873900',
          headerShown: false,
          drawerIcon: () => <Track width={42} height={42} />,
          drawerLabelStyle: {
            color: '#FFF8F2',
            fontSize: 18,
            fontFamily: 'RobotoSlab-Regular',
          },
        }}
      />
      <Drawer.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          drawerActiveBackgroundColor: '#873900',
          drawerInactiveBackgroundColor: '#873900',
          headerShown: false,
          drawerIcon: () => <Contact width={42} height={42} />,
          drawerLabelStyle: {
            color: '#FFF8F2',
            fontSize: 18,
            fontFamily: 'RobotoSlab-Regular',
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const navigationRef = useRef();
  const toastConfig = {
    tomatoToast: ({text1}) => (
      <View
        style={{
          padding: 15,
          backgroundColor: '#818589cc',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'RobotoSlab-Regular',
          }}>
          {text1}
        </Text>
      </View>
    ),
    customToast: ({text1, text2}) => (
      <View
        style={{
          padding: 15,
          backgroundColor: '#873900',
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '600',
            fontFamily: 'RobotoSlab-Regular',
            textAlign: 'center',
          }}>
          {text1}{' '}
        </Text>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => navigationRef.current?.navigate('CartScreen')}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'RobotoSlab-Regular',
              textDecorationLine: 'underline',
            }}>
            {text2}
          </Text>
        </TouchableOpacity>
      </View>
    ),
  };

  return (
    <SafeAreaProvider>
      <CategoriesProvider>
        <NavigationContainer ref={navigationRef}>
          <DrawerNavigator>
            <CustomDrawerContent />
          </DrawerNavigator>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </CategoriesProvider>
    </SafeAreaProvider>
  );
};

export default App;
