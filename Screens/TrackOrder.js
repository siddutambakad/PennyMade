import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ITEMS_PER_PAGE = 1; // Adjust this based on your preference

const NumberList = () => {
  const totalNumbers = 1140;
  const totalPages = Math.ceil(totalNumbers / ITEMS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getDisplayedNumbers = (page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE + 2; // Start from 2 to exclude the first number
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, totalNumbers - 1); // End before the last number
    return Array.from({ length: endIndex - startIndex + 1 }, (_, index) => index + startIndex);
  };

  const displayedNumbers = getDisplayedNumbers(currentPage);

  return (
    <View style={styles.container}>
      <Text style={styles.staticNumber}>[1]</Text>
      {displayedNumbers.map((number, index) => (
        <Text key={index} style={styles.number}>
          [{number}]
        </Text>
      ))}
      <Text style={{color: 'black'}}>{'....'}</Text>
      <Text style={styles.staticNumber}>[1140]</Text>
      <TouchableOpacity style={styles.navigationButton} onPress={handlePrev}>
        <Text style={styles.navigationButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navigationButton} onPress={handleNext}>
        <Text style={styles.navigationButtonText}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staticNumber: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  number: {
    margin: 5,
    fontSize: 16,
  },
  navigationButton: {
    margin: 5,
    padding: 5,
  },
  navigationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NumberList;
