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

const Dropdowns = props => {
  const {options, handleClick, initialText, isClicked, setIsClicked} = props;
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOptionClick = item => {
    setSelectedItem(item);
    handleClick(item);
    setIsClicked(false);
  };
  // return (
  //   <View style={styles.dropdownContainer}>
  //     <LinearGradient
  //       colors={['#B14B00', '#873900']}
  //       style={styles.dropdownHeader}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           setIsClicked(!isClicked);
  //         }}
  //         activeOpacity={0.5}>
  //         <Text style={styles.dropDownText}>
  //           {selectedItem?.name || initialText}
  //         </Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           setIsClicked(!isClicked);
  //         }}
  //         style={{paddingVertical: 7, paddingHorizontal: 10}}>
  //         <Up
  //           width={20}
  //           height={10}
  //           style={[isClicked && styles.reverseImage]}
  //         />
  //       </TouchableOpacity>
  //     </LinearGradient>
  //     {isClicked && (
  //       <FlatList
  //         data={options}
  //         renderItem={({item, index}) => (
  //           <TouchableOpacity
  //             key={index}
  //             onPress={() => {
  //               handleOptionClick(item);
  //             }}
  //             style={styles.options}>
  //             <Text
  //               style={[
  //                 styles.dropdownOptionText,
  //                 {
  //                   color: item === selectedItem ? '#FFF8F2' : 'black',
  //                   backgroundColor: item === selectedItem && '#873900',
  //                 },
  //               ]}>
  //               {item.name}
  //             </Text>
  //           </TouchableOpacity>
  //         )}
  //         keyExtractor={(item, index) => index.toString()}
  //         style={styles.dropdownOptions}
  //         //   maxHeight={200}
  //       />
  //     )}
  //   </View>
  // );
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
          <Text style={styles.dropDownText}>
            {selectedItem?.name || initialText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsClicked(!isClicked);
          }}
          style={{paddingVertical: 7, paddingHorizontal: 10}}>
          <Up
            width={20}
            height={10}
            style={[isClicked && styles.reverseImage]}
          />
        </TouchableOpacity>
      </LinearGradient>
      {isClicked && (
        <ScrollView style={styles.dropdownOptions}>
          {options?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleOptionClick(item);
              }}
              style={styles.option}>
              <Text
                style={[
                  styles.dropdownOptionText,
                  {
                    color: item === selectedItem ? '#FFF8F2' : 'black',
                    backgroundColor: item === selectedItem && '#873900',
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

export default Dropdowns;

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    minHeight: 50,
    padding: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#B14B00',
  },
  dropdownOptions: {
    borderWidth: 1,
    width: 200,
    // position: 'absolute',
    zIndex: 5,
    backgroundColor: '#FFF8F2',
    height: 150,
    marginTop: 2,
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
