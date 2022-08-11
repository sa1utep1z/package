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
  const [dialogContent, setDialogContent] = useState({});

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
        setDialogContent({
          dialogTitle: '温馨提示',
          dialogComponent: (
            <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20}}>将向您绑定的手机发送验证码</Text>
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
              <Text style={{fontSize: 20}}>确定退出当前账号？</Text>
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
    {iconName: 'infocirlceo', title: '关于我们'},
    {iconName: 'logout', title: '退出登录', onPress: () => showDialog('logout')}
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topArea}>
        <Avatar
          size={128}
          rounded
          source={{uri: 'https://labor-dev.oss-cn-shenzhen.aliyuncs.com/labormgt/labor/logo.png?Expires=1660208589&OSSAccessKeyId=TMP.3Kk9KzMJzXFhMkhdE2bd7AkSVFAPrSdRxb5e44U9qhDdRCHTbaR19D2P1q3dttfy3PdFfCnaFo9ounPJFt4x2ggoB9qBaY&Signature=K9%2FpbhXu1EKVnTe7w%2Bn80WzUQwo%3D'}}
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
                  <AntDesign name={item.iconName} size={48} color='#409EFF'/>
                  <Text style={styles.item_title}>{item.title}</Text>
                </View>
                <AntDesign name='right' size={35}/>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
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
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: '#fff'
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
  },
  funcArea: {
    height: 526,
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    borderRadius: 8
  },
  func_title: {
    height: 90, 
    textAlignVertical: 'center', 
    fontWeight: 'bold', 
    fontSize: 32, 
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    paddingLeft: 29
  },
  pressItem: {
    height: 107, 
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
  }
});

export default Mine;
