import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigation.navigate('HomePage');
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [navigation]);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: '#873900', fontSize: 25, fontFamily: 'RobotoSlab-Rerular', fontWeight: 'bold'}}>Welcome To Pennymead</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({

});
