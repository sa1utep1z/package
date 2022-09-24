import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/themed';
import NAVIGATION_KEYS from '../../../../navigator/key';
import { useNavigation } from '@react-navigation/native';

const BusinessManage = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const onChangeText = (value) => {
    setSearch(value);
    console.log('输入的值：', value);
  };

  const searchOnPress = () => {
    console.log('点击了搜索');
  };

  const addBusiness = () => navigation.navigate(NAVIGATION_KEYS.BUSINESS_ADD);

  return (
    <View style={styles.screen}>
      <View style={styles.topArea}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={text => onChangeText(text)}
          value={search}
          placeholder="输入地区、企业"
          clearTextOnFocus
          placeholderTextColor="#999999"
        />
        <View style={styles.border}></View>
        <TouchableOpacity style={styles.pressArea} onPress={searchOnPress}>
          <AntDesign
            name='search1'
            color='#409EFF'
            style={{ marginRight: 10 }}
            size={40}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.total}>
        <Text style={styles.title}>全部</Text>
        <Text style={styles.text}>290</Text>
        <Text style={styles.title}>个企业</Text>
        <Text style={[styles.text, { marginLeft: 20 }]}>A</Text>
        <Text style={styles.title}>类</Text>
        <Text style={styles.text}>90</Text>
        <Text style={styles.title}>个</Text>
        <Text style={[styles.text, { marginLeft: 20 }]}>B</Text>
        <Text style={styles.title}>类</Text>
        <Text style={styles.text}>90</Text>
        <Text style={styles.title}>个</Text>
        <Text style={[styles.text, { marginLeft: 20 }]}>C</Text>
        <Text style={styles.title}>类</Text>
        <Text style={styles.text}>90</Text>
        <Text style={styles.title}>个</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.contentBox}>
          <View style={styles.left}>
            <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={require('../../../../assets/images/homeImg.png')} />
          </View>
          <View style={styles.right}>
            <View style={styles.content}>
              <Text style={styles.title}>龙华AKCN</Text>
              <Text style={styles.number}>500人以上</Text>
              <Text style={styles.area}>深圳市龙华区</Text>
            </View>
            <View style={styles.rightIcon}>
              <TouchableOpacity>
                <AntDesign
                  name='caretright'
                  color='#409EFF'
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styles.letter}>A</Text>
            </View>
          </View>
        </View>
        <Button
          title="新增企业"
          onPress={addBusiness}
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.titleStyle}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4F7',
    padding: 30
  },
  topArea: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  inputStyle: {
    width: 580,
    fontSize: 28,
    paddingLeft: 20,
  },
  border: {
    width: 1,
    height: 40,
    borderRightWidth: 1,
    borderColor: '#409EFF',
  },
  pressArea: {
    width: 60,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  total: {
    flexDirection: 'row',
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#409EFF',
  },
  contentBox: {
    width: 680,
    height: 200,
    backgroundColor: '#fff',
    marginTop: 30,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  left: {
    width: 140,
    height: 150,
  },
  content: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  number: {
    fontSize: 28,
    color: '#333',
  },
  area: {
    fontSize: 24,
    color: '#333',
  },
  right: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
    marginLeft: 20
  },
  rightIcon: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  letter: {
    fontSize: 35,
    color: '#409EFF',
    textAlign: 'right'
  },
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
    marginTop: 30,
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
});

export default BusinessManage;