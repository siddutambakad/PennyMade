import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to import the correct Icon library

const DropDown = ({
  selectedFilter,
  setSelectedFilter,
  items,
  getSecondData,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => {
          setIsClicked(!isClicked);
        }}>
        <Text style={styles.dropdownText}>{selectedFilter}</Text>
        <Icon
          name={isClicked ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="black"
          style={{}}
        />
      </TouchableOpacity>
      <View style={styles.dropAndError}>
        {isClicked && (
          <ScrollView style={styles.dropdownArea}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.countryitem,
                  item.itemName == selectedFilter && styles.selectedCountryItem,
                ]}
                onPress={() => {
                  setSelectedFilter(item.itemName);
                  setIsClicked(false);
                  getSecondData(item.itemName);
                }}>
                <Text
                  style={[
                    styles.countryText,
                    item.itemName == selectedFilter &&
                      styles.selectedCountryText,
                  ]}>
                  {item.itemName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#873900',
  },
  dropdownText: {
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 20,
  },
  dropAndError: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 19,
  },
  dropdownArea: {
    marginTop: 2,
    minWidth: '64%',
    minHeight: 100,
    borderRadius: 5,
    backgroundColor: '#FFF8F2',
  },
  countryText: {
    color: 'black',
    padding: 4,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default DropDown;
