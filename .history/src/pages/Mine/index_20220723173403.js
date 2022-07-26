import React from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Text } from "@rneui/themed";

const Mine = () => {
  
  const card = '116513111';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{height: 150, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 30}}>
        <Avatar
          size={80}
          rounded
          source={{uri: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg'}}
          key={1}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>哈哈哈</Text>
          <Text style={{fontSize: 16}}>工号：{card}</Text>
        </View>
      </View>
      <View>

      </View>
    </SafeAreaView>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  title: {
    fontSize: 30,
    color: 'red'
  }
});

export default Mine;
