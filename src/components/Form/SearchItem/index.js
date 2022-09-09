import React, { useState, useMemo } from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";

const SearchItem = ({
  field, 
  form, 
  title,
  placeholder,
  pressStyle,
  fontStyle,
  autoSearch = false,
  ...rest
}) => {

  const [search, setSearch] = useState('');

  const searchOnPress = () => {
    form.setFieldValue(field.name, search);
    form.handleSubmit();
  };

  const onChangeText = value => {
    setSearch(value);
    if(autoSearch){
      form.setFieldValue(field.name, value);
      form.handleSubmit();
    }
  };

  const onSubmit = () => searchOnPress();

  return (
    <View style={styles.totalArea}>
      <Text style={styles.title}>{title}：</Text>
      <View style={styles.searchArea}>
        <TextInput
          placeholder={placeholder || `请输入${title}`}
          clearTextOnFocus
          selectTextOnFocus
          ellipsizeMode="tail"
          onSubmitEditing={onSubmit}
          blurOnSubmit={false}
          numberOfLines={1}
          value={search}
          allowFontScaling={false}
          onChangeText={onChangeText}
          placeholderTextColor="#999999"
          style={[styles.inputStyle, fontStyle]}
        />
        <TouchableOpacity style={styles.pressArea} onPress={searchOnPress}>
          <AntDesign 
            name='search1' 
            color='#409EFF'
            style={{marginRight: 10}}
            size={40}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    height: 60
  },
  title: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff', 
    borderRadius: 10,
    paddingLeft: 20
  },
  inputStyle: {
    flex: 1,
    height: 60, 
    padding: 0,
    fontSize: 28
  },
  pressArea: {
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopRightRadius: 10, 
    borderBottomRightRadius: 10
  }
})

export default SearchItem;
