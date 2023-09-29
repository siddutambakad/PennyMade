import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const Card = props => {
  const {
    imgSource,
    author,
    price,
    title,
    description,
    handlePressCard,
    handlePress,
    cardIndex,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handlePressCard()}
      style={styles.secondCard}>
      <View style={{alignItems: 'center', padding: 10}}>
        <View
          style={{
            width: 200,
            height: 200,
            marginTop: 10,
          }}>
          {imgSource ? (
            <Image
              source={{uri: imgSource}} // Display the first image if available
              style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
            />
          ) : (
            <Image
              source={require('../../assets/images/placeholderimage.png')} // Display the first image if available
              style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
            />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <Text style={styles.secondcardauthor}>{author}</Text>
        <Text style={styles.secondcardtext}>&pound; {price}</Text>
      </View>
      <Text
        style={styles.secondcardtitle}
        ellipsizeMode="tail"
        numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.secondcarddes} ellipsizeMode="tail" numberOfLines={3}>
        {description}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setIsLoading(true); // Set loading state to true for this card
          handlePress(cardIndex); // Pass the card index to handlePress
          setTimeout(() => {
            setIsLoading(false); // Set loading state to false after a delay
            Toast.show({
              type: 'customToast',
              text1: 'Item has been added to the cart',
              text2: 'click to View',
              visibilityTime: 800,
              autoHide: true,
              position: 'bottom',
            });
          }, 1000);
        }}
        style={[styles.Addtocartbutton, isLoading && styles.disabledButton]}
        disabled={isLoading}
        activeOpacity={1}>
        {isLoading ? (
          <ActivityIndicator
            size={25}
            color={'white'}
            animating={true}></ActivityIndicator>
        ) : (
          <Text style={styles.addtocarttext}>Add To Cart</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  secondCard: {
    // marginTop: 30,
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
    fontSize: 18,
    fontWeight: '700',
  },
  secondcardtitle: {
    // padding: 10,
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
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
  disabledButton: {
    backgroundColor: '#873900',
  },
});
