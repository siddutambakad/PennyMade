import {Image, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';

const SplashScreen = ({navigation}) => {
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   // Simulated loading time (you can replace this with your actual loading logic)
  //   setTimeout(() => {
  //     setIsLoading(false); // Set isLoading to false when loading is done
  //     navigation.navigate('HomePage')
  //   }, 1000); // Replace 2000 with the actual time your loading process takes
  // }, []);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/images/pennysplash.png')}
        style={{
          width: 100,
          height: 80,
          resizeMode: 'contain',
          marginVertical: 18,
        }}
      />
      <Text
        style={{
          color: '#873900',
          fontSize: 25,
          fontFamily: 'RobotoSlab-Rerular',
          fontWeight: 'bold',
        }}>
        Welcome To Pennymead
      </Text>
      {/* {isLoading && ( */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={50} color="#873900" />
        </View>
      {/* )} */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
