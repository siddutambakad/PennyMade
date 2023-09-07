import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Up from '../../assets/images/up.svg';

const CustomDropdown = ({
  options,
  setSelectedValue,
  selectedValue,
  selectedCategoryName,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <LinearGradient
        colors={['#B14B00', '#873900']}
        style={styles.dropdownHeader}>
        <TouchableOpacity
          onPress={() => {
            setIsClicked(!isClicked);
          }}
          activeOpacity={1}>
          <Text
            style={styles.dropDownText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {selectedCategoryName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsClicked(!isClicked);
          }}
          style={{paddingVertical: 10, paddingHorizontal: 10}}>
          <Up
            width={20}
            height={10}
            style={[isClicked && styles.reverseImage]}
          />
        </TouchableOpacity>
      </LinearGradient>
      {isClicked && (
        <ScrollView style={styles.dropdownOptions}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedValue(item);
                setIsClicked(false);
              }}
              style={styles.option}>
              <Text
                style={[
                  styles.dropdownOptionText,
                  {
                    color:
                      item.itemName === selectedValue.itemName
                        ? '#FFF8F2'
                        : 'black',
                    backgroundColor:
                      item.itemName === selectedValue.itemName && '#873900',
                  },
                ]}>
                {item.itemName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    // alignItems: 'center',
    // marginHorizontal: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    padding: 12,
    // marginHorizontal: 5,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#B14B00',
  },
  dropdownOptions: {
    borderWidth: 1,
    width: '70%',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#FFF8F2',
    top: 68,
    borderRadius: 5,
  },
  dropdownOptionText: {
    color: 'black',
    padding: 5,
  },
  dropDownText: {
    color: 'white',
    fontSize: 16,
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
    // padding: 10,
  },
});
