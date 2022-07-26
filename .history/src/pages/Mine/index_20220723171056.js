import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from "@rneui/themed";

const Mine = () => {

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{height: 200, borderWidth: 1}}>
        <Avatar
          size={64}
          rounded
          source={'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg'}
          key={1}
        />
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
