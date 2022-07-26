import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const Card = ({title, content}) => (
  <View style={styles.card}>
    <View style={styles.titleArea}>
      <View style={styles.titleIcon}></View>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.content}>
      {content}
    </View>
  </View>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8
  },
  titleArea: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#CCCCCC'
  },
  titleIcon: {
    width: 5, 
    height: 18,
    backgroundColor: '#409EFF', 
    borderTopRightRadius: 5, 
    borderBottomRightRadius: 5, 
    marginRight: 10
  },
  title: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#000'
  },
  content: {
    minHeight: 50,
    padding: 10
  }
});

export default Card;