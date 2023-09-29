import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <Image
          source={require('../../assets/images/Payment1.png')}
          style={{height: '100%', width: '47%', resizeMode: 'stretch'}}
        />
        <Image
          source={require('../../assets/images/Reviews1.png')}
          style={{width: '47%', height: '100%', resizeMode: 'stretch'}}
        />
      </View>
      <View style={{marginTop: 50}}>
        <Image
          source={require('../../assets/images/socialmedia.png')}
          style={styles.socialMediaImg}
        />
      </View>
      <Text style={styles.footerText}>
        Copyright © 2023, Pemmymead | All Rights Reserved | Terms & Conditions |
        Privacy Policy
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    height: 350,
    flexGrow: 1,
    backgroundColor: '#873900',
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 0,
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
