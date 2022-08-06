import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

import Card from "../../components/Card";
import NAVIGATION_KEYS from "../../navigator/key";
import { workBenchList } from "./workBenchList";

const WorkBench = (props) => {
  const {navigation} = props;

  const gotoPage = (item) => {
    navigation.navigate(item.routeName);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#EEF4F7' }}>
      {workBenchList?.length && workBenchList.map((item, index) => (
        <Card
          key={index}
          title={item.moduleName}
          content={
            <View style={styles.cardContent}>
              {item?.list?.length && item.list.map((box, index) => (
                <TouchableOpacity key={index} style={styles.cardItem} onPress={() => gotoPage(box)}>
                  <View style={styles.imgBox}>
                    <Image style={styles.img} source={box.imgBackground}/>
                    <Image style={[
                      styles.icon, 
                      box.routeName === NAVIGATION_KEYS.MY_COMMISSION && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.LEAVING_LIST && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.HIRE_REPORT_FORM && {left: 11, top: 20},
                      box.routeName === NAVIGATION_KEYS.COMPLAINT_PLATE && {left: 22, top: 14}
                    ]} source={box.iconSource}/>
                  </View>
                  <Text style={styles.title}>{box.title}</Text>
                </TouchableOpacity>
                )
              )}
            </View>
          }
        />
      ))}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  cardContent: {
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cardItem: {
    width: '25%', 
    height: 161, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  imgBox: {
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: '#409EFF', 
    marginBottom: 5
  },
  img: {
    width: 92, 
    height: 92,
  },
  icon: {
    position: 'absolute',
    zIndex: 99,
    left: 18,
    top: 18
  },
  title: {
    fontSize: 26, 
    color: '#333333'
  }
});

export default WorkBench;