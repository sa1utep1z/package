import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';

import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import CenterSelectDate from '../../../../components/List/CenterSelectDate';

const DormitoryCheckList = () => {
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        selectIndex={index}
        filterBuilding
        filterDormitoryType
        filterFloorAndRoom
        filterDateRange
        otherHeaderStyle={{paddingBottom: 10}}
     />
      <CenterSelectDate />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default DormitoryCheckList;