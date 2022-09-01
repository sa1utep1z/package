import React, {useEffect, useRef, useState} from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, useWindowDimensions, Dimensions} from 'react-native';
import { Avatar, Text } from "@rneui/themed";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import _rem from '../../utils/rem';
import NAVIGATION_KEYS from '../../navigator/key';
import NormalDialog from '../../components/NormalDialog';
import MineApi from '../../request/MineApi';
import { SUCCESS_CODE } from '../../utils/const';

const height = Dimensions.get('window').height;

const Mine = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [dialogContent, setDialogContent] = useState({});
  const [message, setMessage] = useState({
    loginAccount: '',
    storeName: '',
    userName: ''
  });

  const dialogRef = useRef(null);

  useEffect(()=>{
    getMessage();
  },[])

  const getMessage = async() => {
    try{
      const res = await MineApi.MineMessage();
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setMessage(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const logout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
          name: NAVIGATION_KEYS.LOGIN,
          params: 'logout'
        }],
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
        setDialogContent({
          dialogTitle: '温馨提示',
          dialogComponent: (
            <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
              <Text>将向您绑定的手机发送验证码</Text>
            </View>
          ),
          confirmText: '找回密码',
          confirmOnPress: logout
        })
        return;
      case 'logout':
        setDialogContent({
          dialogTitle: '温馨提示',
          dialogComponent: (
            <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
              <Text>确定退出当前账号？</Text>
            </View>
          ),
          confirmOnPress: logout
        })
        return;
    }
  };

  const listArea = [
    {iconName: 'idcard', title: '对外名片', onPress: () => navigation.navigate(NAVIGATION_KEYS.PERSONAL_CARD)},
    {iconName: 'unlock', title: '重置密码', onPress: () => showDialog('reset')},
    {iconName: 'infocirlceo', title: '关于我们', onPress: () => toast.show(`敬请期待...`)},
    {iconName: 'logout', title: '退出登录', onPress: () => showDialog('logout')}
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topArea}>
        <Avatar
          size={128}
          rounded
          source={require('../../assets/images/logo.png')}
          containerStyle={styles.headContainerStyle}
          key={1}
        />
        <View style={styles.titleArea}>
          <Text style={styles.title_large}>{`${message.storeName} · ${message.userName}`}</Text>
          <Text style={styles.title_small}>手机号：{message.loginAccount}</Text>
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
                  <AntDesign name={item.iconName} size={48} color='#409EFF'/>
                  <Text style={styles.item_title}>{item.title}</Text>
                </View>
                <AntDesign name='right' size={35}/>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <Text style={styles.bottomText}>版本号：0.1.8</Text>
      <NormalDialog 
        ref={dialogRef} 
        dialogContent={dialogContent}
      />
    </SafeAreaView>
)};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4F7'
  },
  topArea: {
    height: 230, 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 32
  },
  headContainerStyle: {
    borderWidth: 1,
    borderColor: '#fff'
  },
  titleArea: {
    marginLeft: 29
  },
  title_large: {
    fontSize: 30, 
    fontWeight: 'bold'
  },
  title_small: {
    fontSize: 30,
    fontWeight: 'normal'
  },
  bottomArea: {
    flex: 1,
    paddingHorizontal: 32
  },
  funcArea: {
    backgroundColor: '#fff', 
    borderRadius: 8
  },
  func_title: {
    height: 80, 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    fontSize: 32, 
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    paddingLeft: 29
  },
  pressItem: {
    height: 95, 
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 29
  },
  noBorder: {
    borderBottomWidth: 0
  },
  leftArea: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  item_title: {
    fontSize: 32,
    marginLeft: 40
  },
  bottomText: {
    textAlign: 'center', 
    textAlignVertical: 'bottom',
    fontSize: 22, 
    marginBottom: 10,
    color: '#999999'
  }
});

export default Mine;
