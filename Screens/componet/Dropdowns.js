import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Up from '../../assets/images/up.svg';
import VectorUp from '../../assets/images/vectorup.svg';

const Dropdowns = React.forwardRef((props, ref) => {
  const {
    options,
    handleClick,
    initialText,
    isGradient,
    setPage,
    isClicked,
    setIsClicked,
    style,
    customOptionStyles,
  } = props;
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOptionClick = item => {
    setSelectedItem(item);
    handleClick(item);
    setIsClicked(false);
  };
  return (
    <View ref={ref}>
      {isGradient ? (
        <LinearGradient colors={['#B14B00', '#873900']} style={style}>
          <TouchableOpacity
            onPress={() => {
              setIsClicked(!isClicked);
            }}
            style={{flex: 0.95}}
            activeOpacity={0.5}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.dropDownText}>
              {selectedItem?.name || initialText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsClicked(!isClicked);
            }}
            style={{paddingVertical: 7}}>
            <Up
              width={20}
              height={10}
              style={[isClicked && styles.reverseImage]}
            />
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          style={style}
          activeOpacity={0.9}
          onPress={() => {
            setIsClicked(!isClicked);
          }}>
          <TouchableOpacity
            style={styles.dropdownSelector}
            onPress={() => {
              setIsClicked(!isClicked);
            }}
            activeOpacity={1}>
            <Text style={styles.dropdownText}>
              {selectedItem?.name || initialText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dropdownArrow}
            onPress={() => {
              setIsClicked(!isClicked);
            }}>
            <VectorUp
              width={20}
              height={10}
              style={[isClicked && styles.reverseImage]}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      {isClicked && (
        <ScrollView
          nestedScrollEnabled={true}
          scrollEnabled={true}
          style={[styles.optionsStyle, customOptionStyles]}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleOptionClick(item);
              }}
              style={[
                styles.inputField,
                selectedItem?.name === item.name && styles.selectedDropdown,
                initialText === item.name &&
                  !selectedItem?.name &&
                  styles.matchingDropdown,
              ]}>
              <Text
                key={index}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.dropdownOptionText,
                  // {color: selectedItem?.name === item.name ? '#fff' : '#000'},
                  selectedItem?.name === item.name && styles.selectedText,
                  initialText === item.name &&
                    !selectedItem?.name &&
                    styles.matchingText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

export default Dropdowns;

const styles = StyleSheet.create({
  selectedText: {
    color: '#FFF8F2',
  },
  matchingText: {
    color: '#FFF8F2',
  },
  matchingDropdown: {
    backgroundColor: '#873900',
  },
  selectedDropdown: {
    backgroundColor: '#873900',
  },
  inputField: {
    padding: 5,
  },
  dropdownOptionText: {
    color: '#000',
  },
  dropDownText: {
    color: 'white',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  dropdownSelector: {
    justifyContent: 'center',
    borderColor: '#873900',
    paddingLeft: 5,
    borderStyle: 'solid',
  },
  optionsStyle: {
    borderWidth: 2,
    backgroundColor: '#FFF8F2',
    maxHeight: 150,
    zIndex: 5,
  },
  dropdownText: {
    color: '#454545',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  dropdownArrow: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
  },
});
