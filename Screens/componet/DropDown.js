import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import VectorUp from '../../assets/images/vectorup.svg';
import Filter from '../../assets/images/filter.svg';


const DropdownSelector = ({
  items,
  selectedFilter,
  setSelectedFilter,
  setPage,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <View style={{flex: 1}}>
      <View style={styles.dropAndFilter}>
        <View style={styles.filterContent}>
          <Filter />
          <Text style={styles.filterText}>Filters</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownSelector}
            onPress={() => setIsClicked(!isClicked)}
            activeOpacity={1}>
            <Text style={styles.dropdownText}>{selectedFilter.itemName}</Text>
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
        </View>
      </View>
      <View style={styles.dropDown}>
        {isClicked && (
          <ScrollView contentContainerStyle={styles.dropdownArea}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                disabled={item.itemName === selectedFilter.itemName}
                onPress={() => {
                  setSelectedFilter(item);
                  setPage(1);
                  setIsClicked(false);
                }}>
                <Text
                  style={[
                    styles.dropdownAreaText,
                    {
                      color:
                        item.itemName === selectedFilter.itemName
                          ? 'white'
                          : 'black',
                      backgroundColor:
                        item.itemName === selectedFilter.itemName && '#873900',
                    },
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

export default DropdownSelector;

const styles = StyleSheet.create({
  dropAndFilter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: '100%',
    flex: 0.5,
    paddingHorizontal: 10,
    
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
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
    width: '56.5%',
    flex: 1,
    left: '37.5%',
    minHeight: 100,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#873900',
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
  filterText: {
    fontFamily: 'RobotoSlab-Regular',
    // marginLeft: 7,
    color: '#454545',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    padding: 10,
  },
  reverseImage: {
    transform: [{rotate: '180deg'}],
    // padding: 10,
  },
});
