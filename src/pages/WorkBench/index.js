import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

import Card from "../../components/Card";
import { workBenchList } from "./workBenchList";

const WorkBench = (props) => {
  const {navigation} = props;

  const gotoPage = (item) => {
    navigation.navigate(item.routeName);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {workBenchList?.length && workBenchList.map((item, index) => (
        <Card
          key={index}
          title={item.moduleName}
          content={
            <View style={styles.cardContent}>
              {item?.list?.length && item.list.map((box, index) => (
                <TouchableOpacity key={index} style={styles.cardItem} onPress={() => gotoPage(box)}>
                  <View style={styles.imgBox}>
                    <Image style={styles.img} source={box.imgSource}/>
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
    height: 85, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  imgBox: {
    padding: 8, 
    borderWidth: 1, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: '#409EFF', 
    marginBottom: 5
  },
  img: {
    width: 25, 
    height: 25
  },
  title: {
    fontSize: 12, 
    color: '#000'
  }
});

export default WorkBench;