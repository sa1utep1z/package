import React, {useRef} from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, useWindowDimensions, Dimensions} from 'react-native';
import { Avatar, Text } from "@rneui/themed";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, CommonActions } from '@react-navigation/native';

import _rem from '../../utils/rem';
import NAVIGATION_KEYS from '../../navigator/key';
import NormalDialog from '../../components/NormalDialog';
import { useState } from 'react';

const height = Dimensions.get('window').height;

const Mine = () => {
  const navigation = useNavigation();

  const [pressType, setPressType] = useState('');

  const dialogRef = useRef(null);
  
  const card = '116513111';

  const logout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
            name: NAVIGATION_KEYS.LOGIN,
        }]
      })
    );
  };

  const reset = () => {
    // TODO这里还要调取发送验证码接口
    navigation.navigate(NAVIGATION_KEYS.RESET);
  };

  const showDialog = (type) => {
    dialogRef?.current.setShowDialog(true);
    switch(type){
      case 'reset': 
        setPressType('reset');
        return;
      case 'logout':
        setPressType('logout');
        return;
    }
  };

  const listArea = [
    {iconName: 'idcard', title: '对外名片', onPress: () => navigation.navigate(NAVIGATION_KEYS.PERSONAL_CARD)},
    {iconName: 'unlock', title: '重置密码', onPress: () => showDialog('reset')},
    {iconName: 'infocirlceo', title: '关于我们'},
    {iconName: 'logout', title: '退出登录', onPress: () => showDialog('logout')}
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topArea}>
        <Avatar
          size={70}
          rounded
          source={{uri: 'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg'}}
          containerStyle={styles.headContainerStyle}
          key={1}
        />
        <View style={styles.titleArea}>
          <Text style={styles.title_large}>哈哈哈</Text>
          <Text style={styles.title_small}>工号：{card}</Text>
        </View>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.funcArea}>
          <Text style={styles.func_title}>常用功能</Text>
          {listArea.map((item, index) => {
            const isLastIndex = listArea.length - 1 === index;
            return (
              <TouchableOpacity key={index} style={[styles.pressItem, isLastIndex && styles.noBorder]} onPress={item?.onPress}>
                <View style={styles.leftArea}>
                  <AntDesign name={item.iconName} size={22} color='#409EFF'/>
                  <Text style={styles.item_title}>{item.title}</Text>
                </View>
                <AntDesign name='right' size={16}/>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <NormalDialog 
        ref={dialogRef} 
        contentText={pressType === 'reset' ? '将向您绑定的手机发送验证码' : '确定退出当前账号吗？'}
        confirmButton={pressType === 'reset' && '找回密码'}
        confirm={pressType === 'reset' ? reset : logout}
      />
    </SafeAreaView>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  topArea: {
    height: height * 0.2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft: 30
  },
  headContainerStyle: {
    borderColor: 'grey',
    borderWidth: 1,
  },
  titleArea: {
    marginLeft: 15
  },
  title_large: {
    fontSize: 18, 
    fontWeight: 'bold'
  },
  title_small: {
    fontSize: 16
  },
  bottomArea: {
    flex: 1
  },
  funcArea: {
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    borderRadius: 8
  },
  func_title: {
    height: 45, 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    fontSize: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC', 
    paddingLeft: 10
  },
  pressItem: {
    height: 50, 
    borderBottomWidth: 1, 
    borderColor: '#CCCCCC', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15
  },
  noBorder: {
    borderBottomWidth: 0
  },
  leftArea: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  item_title: {
    marginLeft: 10
  }
});

export default Mine;
