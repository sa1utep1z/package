import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Keyboard} from 'react-native';
import { SearchBar, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderSearchInput = ({
    form,
    field,
    searchPress, 
    autoSearch,
    placeholder, 
    fontStyle,
    onChange,
    ...rest
  }) => {

  const searchBarRef = useRef(null);
  const [search, setSearch] = useState('');

  //默认的键入内容
  const updateSearch = (value) => {
    setSearch(value);
    onChange && onChange(value);
    if(autoSearch){
      autoSearch(value);
    }
  };

  //点击返回
  const cancelIconPress = () => {
    searchBarRef.current.cancel();
  };

  //点击清除
  const clearIconPress = () => {
    searchBarRef.current.clear();
    searchPress && searchPress('');
    if(form){
      form.setFieldValue(field.name, '');
      form.handleSubmit();
      Keyboard.dismiss();
    }
  };

  const btnPress = () => {
    const {value} = searchBarRef.current.props;
    if(form){
      form.setFieldValue(field.name, value);
      form.handleSubmit();
      Keyboard.dismiss();
      return;
    }
    searchPress(value);
  };

  const searchIcon = (
    <AntDesign 
      name='search1' 
      color='#A9A9A9'
      size={31}
    />
  ),
  cancelIcon = (
    <AntDesign 
      name='left' 
      color='#A9A9A9'
      size={31}
      onPress={cancelIconPress}
    />
  ),
  clearIcon = (
    <AntDesign 
      name='closecircle' 
      color='#A9A9A9' 
      size={31}
      style={{marginRight: 10}}
      onPress={clearIconPress}
    />
  );

  return (
    <View style={styles.searchInput}>
      <SearchBar
        ref={searchBarRef}
        placeholder={placeholder || "请输入搜索内容"}
        value={search}
        onChangeText={updateSearch}
        platform="android"
        lightTheme
        showCancel
        allowFontScaling={false}
        searchIcon={searchIcon}
        cancelIcon={cancelIcon}
        clearIcon={clearIcon}
        containerStyle={styles.containerStyle}
        inputStyle={[styles.inputStyle, fontStyle]}
        inputContainerStyle={styles.inputContainerStyle}
        leftIconContainerStyle={[styles.leftIconContainerStyle]}
        rightIconContainerStyle={styles.rightIconContainerStyle}
        {...rest}
      />
      <View style={styles.rightArea}>
        <View style={styles.line}></View>
        <TouchableOpacity style={styles.btnArea} onPress={btnPress}>
          <Text style={styles.btnArea_text}>搜索</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchInput: {
    height: 60,
    flexDirection: "row"
  },
  containerStyle:  {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingTop: 0, 
    paddingBottom: 0
  },
  inputContainerStyle: {
    margin: 0,
    height: '100%',
    backgroundColor: '#fff', 
    borderTopLeftRadius: 10, 
    borderBottomLeftRadius: 10,
    paddingLeft: 10
  },
  inputStyle: {
    fontSize: 26, 
    marginLeft: 10, 
    marginRight: 0,
    paddingLeft: 0
  },
  leftIconContainerStyle: {
  },
  rightIconContainerStyle: {
    paddingRight: 0
  },
  rightArea: {
    width: 100, 
    backgroundColor: '#fff', 
    borderTopRightRadius: 10, 
    borderBottomRightRadius: 10, 
    flexDirection: 'row',
    alignItems: 'center'
  },
  line: {
    width: 2, 
    height: 31, 
    backgroundColor: '#DCDCDC'
  },
  btnArea: {
    flex: 1,
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnArea_text: {
    color: '#409EFF', 
    fontSize: 26
  }
})

export default HeaderSearchInput;