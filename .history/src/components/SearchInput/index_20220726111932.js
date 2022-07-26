import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { SearchBar, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

//默认的搜索框边角度数；
const defaulBorderRadius = 30;

const SearchInput = ({
    form,
    field,
    searchPress, 
    autoSearch,
    borderRadius, 
    searchInputStyle, 
    placeholder, 
    fontStyle,
    smallSize,
    withoutButton,
    autoFocus,
    onChange,
    ...rest
  }) => {

  const searchBarRef = useRef(null);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    autoFocus && searchBarRef.current.focus();
  },[])

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
    searchBarRef.current.clear();
  };

  //点击清除
  const clearIconPress = () => searchBarRef.current.clear();

  const btnPress = () => {
    const {value} = searchBarRef.current.props;
    if(form){
      form.setFieldValue(field.name, value);
      form.handleSubmit();
      return;
    }
    searchPress(value);
  };

  const searchIcon = (
    <AntDesign 
      name='search1' 
      color='#A9A9A9'
      size={smallSize ? 16 : 20}
    />
  ),
  cancelIcon = (
    <AntDesign 
      name='left' 
      color='#A9A9A9'
      size={smallSize ? 16 : 20}
      onPress={cancelIconPress}
    />
  ),
  clearIcon = (
    <AntDesign 
      name='closecircle' 
      color='#A9A9A9' 
      size={smallSize ? 14 : 18}
      onPress={clearIconPress}
    />
  );

  return (
    <ScrollView>
      <View style={[styles.searchInput, searchInputStyle]}>
        <SearchBar
          ref={searchBarRef}
          placeholder={placeholder || "请输入搜索内容"}
          value={search}
          onChangeText={updateSearch}
          platform="android"
          lightTheme
          showCancel
          searchIcon={searchIcon}
          cancelIcon={cancelIcon}
          clearIcon={clearIcon}
          containerStyle={styles.containerStyle}
          inputStyle={[styles.inputStyle, fontStyle]}
          onEndEditing={(params)=>{
            console.log('params', params)
          }}
          inputContainerStyle={[
            styles.inputContainerStyle, 
            borderRadius && {borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius},
            withoutButton && {borderTopRightRadius: borderRadius}
          ]}
          leftIconContainerStyle={[styles.leftIconContainerStyle, smallSize && styles.smallLeftArea]}
          rightIconContainerStyle={styles.rightIconContainerStyle}
          {...rest}
        />
        {!withoutButton && <View style={[
            styles.rightArea, 
            borderRadius && {borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius}, 
            smallSize && styles.smallRightArea]}>
          <View style={[styles.line, smallSize && styles.smallLine]}></View>
          <TouchableOpacity style={styles.btnArea} onPress={btnPress}>
            <Text style={styles.btnArea_text}>搜 索</Text>
          </TouchableOpacity>
        </View>}
      </View>
    </ScrollView>
    
  )
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    flexDirection: "row", 
    paddingHorizontal: 10,
    marginBottom: 10
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
    borderTopLeftRadius: defaulBorderRadius, 
    borderBottomLeftRadius: defaulBorderRadius
  },
  inputStyle: {
    fontSize: 15, 
    marginLeft: 0, 
    marginRight: 0
  },
  leftIconContainerStyle: {
    width: 40
  },
  rightIconContainerStyle: {
    paddingRight: 0
  },
  rightArea: {
    width: 68, 
    backgroundColor: '#fff', 
    borderTopRightRadius: defaulBorderRadius, 
    borderBottomRightRadius: defaulBorderRadius, 
    flexDirection: 'row',
    alignItems: 'center'
  },
  line: {
    width: 2, 
    height: 20, 
    backgroundColor: '#DCDCDC', 
    marginRight: 6
  },
  btnArea: {
    width: 40, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnArea_text: {
    color: '#409EFF', 
    fontWeight: '700'
  },
  smallLeftArea: {
    width: 20
  },
  smallRightArea: {
    width: 55
  },
  smallLine: {
    height: '100%', 
    width: 1
  },
})

export default SearchInput;