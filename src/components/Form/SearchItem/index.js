import React, { useState } from 'react';
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
  ...rest
}) => {

  const [search, setSearch] = useState('');

  const searchOnPress = () => {
    form.setFieldValue(field.name, search);
    form.handleSubmit();
  };

  return (
    <View style={styles.totalArea}>
      <Text style={styles.title}>{title}：</Text>
      <View style={styles.searchArea}>
        <TextInput
          placeholder={placeholder || `请输入${title}`}
          value={search}
          onChangeText={text => setSearch(text)}
          style={styles.inputStyle}
        />
        <TouchableOpacity style={styles.pressArea} onPress={searchOnPress}>
          <AntDesign 
            name='search1' 
            color='#409EFF'
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    flex: 1, 
    width: 20, 
    height: 20, 
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row'
  },
  inputStyle: {
    flex: 1,
    backgroundColor: '#fff', 
    height: 35, 
    borderBottomLeftRadius: 6, 
    borderTopLeftRadius: 6, 
    padding: 0,
    paddingLeft: 10
  },
  pressArea: {
    width: 30, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopRightRadius: 6, 
    borderBottomRightRadius: 6
  }
})

export default SearchItem;
