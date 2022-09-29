import React from "react";
import { FlatList, ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";

const SingleSelectList = ({
  selectList
}) => {

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={{height: 50, borderBottomWidth: 1, borderColor: '#333333'}}>
        <Text>{item.label}</Text>
      </TouchableOpacity>
    )
  };

  return (
    <View style={{maxHeight: 500}}>
      <FlatList
        data={selectList}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
      />
    </View>
  )
};

const styles = StyleSheet.create({

})

export default SingleSelectList;