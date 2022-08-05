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
    margin: 32,
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
    paddingVertical: 20
  }
});

export default Card;