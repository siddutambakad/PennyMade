import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import VectorUp from '../../assets/images/vectorup.svg';

const DropdownSelector = ({
  items,
  selectedFilter,
  handleClick,
  initialText,
  isClicked,
  setIsClicked,
}) => {
  // const [isClicked, setIsClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleSelect = item => {
    setSelectedItem(item);
    handleClick(item);
    setIsClicked(false);
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownContainer}
        activeOpacity={0.9}
        onPress={() => setIsClicked(!isClicked)}>
        <TouchableOpacity
          style={styles.dropdownSelector}
          onPress={() => setIsClicked(!isClicked)}
          activeOpacity={1}>
          <Text style={styles.dropdownText}>{initialText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.dropdownArrow}
          onPress={() => setIsClicked(!isClicked)}>
          <VectorUp
            width={20}
            height={10}
            style={[isClicked && styles.reverseImage]}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {isClicked && (
        <ScrollView style={styles.dropdownArea}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              // disabled={item.name === selectedFilter.name}
              onPress={() => {
                handleSelect(item);
              }}>
              <Text
                style={[
                  styles.dropdownAreaText,
                  {
                    color:
                      selectedItem?.name == item.name ? '#FFF8F2' : '#873900',
                    backgroundColor:
                      selectedItem?.name == item.name ? '#873900' : '#FFF8F2',
                  },
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default DropdownSelector;

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    padding: 10,
    borderColor: '#873900',
  },
  dropdownSelector: {
    justifyContent: 'center',
    borderColor: '#873900',
    paddingLeft: 5,
  },
  dropdownText: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  dropdownArea: {
    width: '30%',
    zIndex: 1,
    top: 50,
    backgroundColor: '#FFF8F2',
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#873900',
    overflow: 'hidden',
  },
  dropdownArrow: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dropdownAreaText: {
    padding: 4,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: '400',
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
  },
});
