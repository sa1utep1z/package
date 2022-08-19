import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const header = ({back, navigation, options, route}) => {
  const param = {back, navigation, options, route};
  const title = options?.headerTitle;
  const headerRight = options?.headerRight && options?.headerRight(param);
  const headerLeft = options?.headerLeft && options?.headerLeft(param);
  const headerCenterArea = options?.headerCenterArea && options?.headerCenterArea(param);
  const goBack = () => navigation.goBack();
  
  return (
    <View style={styles.headerArea}>
      <View style={styles.leftArea}>
        {headerLeft ? headerLeft : 
          <TouchableOpacity onPress={goBack}>
            <AntDesign
              size={50}
              name='left' 
              style={styles.icon}
            />
          </TouchableOpacity>}
      </View>
      {headerCenterArea ? headerCenterArea : <View style={styles.centerArea}>
        <Text style={styles.centerAreaText}>{title}</Text>
      </View>}
      <View style={styles.rightArea}>
        {headerRight}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  headerArea: {
    height: 100, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff'
  },
  leftArea: {
    flex: 1
  },
  icon:{ 
    width: 50, 
    height: '100%',
    textAlignVertical: 'center',
    paddingLeft: 15
  },
  centerArea: {
    height: '100%', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerAreaText: {
    textAlign: 'center', 
    fontSize: 36, 
    color: '#000'
  },
  rightArea: {
    flex: 1, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  }
});

export default header;