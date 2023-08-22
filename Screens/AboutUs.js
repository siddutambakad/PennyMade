import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AboutUs = () => {
  const [totalPages, setTotalpages] = useState(1140);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 7;
  return (
    <View>
      <Text>AboutUs</Text>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
