import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import HomePage from './Screens/HomePage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AboutUs from './Screens/AboutUs';
import TrackOrder from './Screens/TrackOrder';
import ContactUs from './Screens/ContactUs';
import SplashScreen from './Screens/SplashScreen';
import CatalougePage from './Screens/CatalougePage';
import {CategoriesProvider} from './Screens/componet/AppContext';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {View, Text} from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, []);
  return (
    <Stack.Navigator>
      {showSplash && (
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      )}
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
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{drawerPosition: 'right'}}>
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen name="AboutUs" component={AboutUs} />
      <Drawer.Screen name="TrackOrder" component={TrackOrder} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const toastConfig = {
    tomatoToast: ({text1}) => (
      <View
        style={{
         padding:15,
          backgroundColor: '#818589cc',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius:5
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
  };

  return (
    <CategoriesProvider>
      <NavigationContainer>
        {/* <StackNavigator> */}

        <DrawerNavigator />
        {/* </StackNavigator> */}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </CategoriesProvider>
  );
};

export default App;
