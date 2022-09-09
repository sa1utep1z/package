import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Footer = ({
  hasNext,
  showFooter = true //是否显示底部footer
}) => {
  return (
    <View style={[styles.footerArea, !showFooter && {display: 'none'}]}>
      {hasNext ? 
        <ActivityIndicator size={48} color="#409EFF" /> : 
        <Text style={styles.footerText}>没有更多数据</Text>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  footerArea: {
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  footerText: {
    textAlign: 'center', 
    fontSize: 28, 
    color: '#999999'
  }
})

export default Footer;