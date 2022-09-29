import React from "react";
import { View, Text, StyleSheet } from 'react-native';

import WaterMark from "../WaterMark";

const Card = ({
  title, 
  content,
  style
}) => {

  return (
    <View style={[styles.card, style]}>
      <View style={styles.titleArea}>
        <View style={styles.titleIcon}></View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        <WaterMark />
        {content}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 32,
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  titleArea: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  titleIcon: {
    width: 8, 
    height: 30,
    backgroundColor: '#409EFF', 
    borderTopRightRadius: 5, 
    borderBottomRightRadius: 5, 
    marginRight: 20
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#333333'
  },
  content: {
    marginVertical: 20
  }
});

export default Card;