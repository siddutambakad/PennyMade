import 'react-native-gesture-handler';
import React from 'react';
import HomePage from './Screens/HomePage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AboutUs from './Screens/AboutUs';
import TrackOrder from './Screens/TrackOrder';
import ContactUs from './Screens/ContactUs';
import SplashScreen from './Screens/SplashScreen';
import CatalougePage from './Screens/CatalougePage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
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
  return (
    <NavigationContainer>
      <DrawerNavigator></DrawerNavigator>
    </NavigationContainer>
  );
};

export default App;
