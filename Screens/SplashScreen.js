import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SplashScreen = () => {
 
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: '#873900', fontSize: 25, fontFamily: 'RobotoSlab-Rerular', fontWeight: 'bold'}}>Welcome To Pennymead</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({

});
