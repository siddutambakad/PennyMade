import {View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AboutUs = () => {
  const [catData, setCatData] = useState([]);
  const [selectedCat, setSeletedCat] = useState({});
  const [showCatDropDown, setShowCatDropDown] = useState(false);
  const [dropdownData, setDropDownData] = useState([]);
  const [selectedSubCat, setSeletedSubCat] = useState([]);

  useEffect(() => {
    getCatagories();
    getDropDopwnData();
  }, []);

  const getCatagories = () => {
    axios
      .get('http://54.226.77.97:81/view/categories/')
      .then(res => {
        console.log('cat dataaaa', res?.data?.data);
        setCatData(res?.data?.data);
      })
      .catch(error => {
        console.log('error while mgetting cat data');
      });
  };
  const getDropDopwnData = () => {
    axios
      .get('http://54.226.77.97:81/view/getsubcat_dropdownlist/4/')
      .then(res => {
        console.log('cat dataaaa ========>', res?.data?.data);
        setDropDownData(res?.data?.data);
      })
      .catch(error => {
        console.log('error while mgetting cat data', error);
      });
  };

  return (
    <View style={{ alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          setShowCatDropDown(!showCatDropDown);
        }}
        style={{
          width: '90%',
          paddingVertical: 10,
          backgroundColor: 'yellow',
          padding: 10,
          marginTop: 30,
          elevation: 6,
        }}>
        <Text>{selectedCat?.name}</Text>
      </TouchableOpacity>
      {showCatDropDown && (
        <View style={{borderWidth: 1, width: '90%', zIndex: 2, marginTop: 75}}>
          {catData?.map(item => {
            let selected = selectedCat?.name === item?.name;
            return (
              <TouchableOpacity
                onPress={() => {
                  setShowCatDropDown(false);
                  setSeletedCat(item);
                }}
                style={{
                  paddingVertical: 5,
                  backgroundColor: selected ? 'blue' : 'white',
                }}>
                <Text style={{color: selected ? '#fff' : 'black'}}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <View style={{}}>
        {/* <FlatList */}
        {/* data={dropdownData}
          horizontal
          renderItem={({ item }) => {
            return ( */}
        {dropdownData?.map((item, index) => (
          <ScrollView horizontal style={{width: 200, marginTop: 50}}>
            <TouchableOpacity
            key={index}
              style={{backgroundColor: 'red', padding: 10, marginRight: 10}}
              onPress={() => {
                setSeletedSubCat(item);
              }}>
              <Text>{item?.name}</Text>
            </TouchableOpacity>

            {selectedSubCat?.name === item?.name && (
              <View style={{borderWidth: 1, padding: 10, marginRight: 10}}>
                {selectedSubCat?.dropdownlist?.map(val => {
                  let selected = selectedCat?.name === val?.name;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSeletedSubCat(null);
                      }}
                      style={{
                        paddingVertical: 5,
                        backgroundColor: selected ? 'blue' : 'white',
                      }}>
                      <Text style={{color: selected ? '#fff' : 'black'}}>
                        {val?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        ))}

        {/* )
          }} */}
        {/* > */}

        {/* </FlatList> */}
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
        <Text style={{color: 'black'}}>ksjsjsjsjsjs</Text>
      </View>
    </View>
  );
};

export default AboutUs;
