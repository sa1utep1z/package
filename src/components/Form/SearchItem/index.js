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
    width: 20, 
    height: 20, 
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    color: '#000',
    fontWeight: 'bold'
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row'
  },
  inputStyle: {
    flex: 1,
    height: 60, 
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 10, 
    borderTopLeftRadius: 10, 
    padding: 0,
    paddingLeft: 20,
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
