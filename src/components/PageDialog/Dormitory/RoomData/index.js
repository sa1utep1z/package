import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Text } from 'react-native';
import { useDispatch } from "react-redux";

import { closeDialog } from "../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../redux/features/PageDialog2";
import AdjustDormitory from './AdjustDormitory';
import LeaveDormitory from './LeaveDormitory';
import NAVIGATION_KEYS from '../../../../navigator/key';

const RoomData = ({
  navigation,
  room
}) => {
  const titleScrollViewRef = useRef(null);

  const dispatch = useDispatch();

  const [roomData, setRoomData] = useState([]);
  const [contentScrollViewX, setContentScrollViewX] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(()=>{
    let originData = [];
    for(let i = 0; i < 20; i++){
      originData.push({
        name: `张${i+1}`,
        date: `2022-07-${i+1}`,
        bedNum: i + 1,
        company: i % 2 ? '龙华AC' : '观澜AB',
        belong: '哈哈',
        store: 'XXXX店'
      })
    }
    setRoomData(originData);
  },[])

  useEffect(()=>{
    if(showTitle){
      titleScrollViewRef && titleScrollViewRef?.current?.scrollTo({x: contentScrollViewX, y: 0, animated: false, duration: 0});
    }
  },[showTitle]);

  const cancelOnPress = () => dispatch(closeDialog());

  const createLiving = () => {
    navigation.navigate(NAVIGATION_KEYS.CREATE_DORMITORY);
    dispatch(closeDialog());
  };

  const onVerticalScroll = ({nativeEvent: {contentOffset}}) => setShowTitle(contentOffset.y > 60);

  const onHorizontalScroll = ({nativeEvent: {contentOffset}}) => titleScrollViewRef && titleScrollViewRef?.current?.scrollTo({x: contentOffset.x, y: 0, animated: false, duration: 0});

  const onMomentumScrollEnd = ({nativeEvent: {contentOffset}}) => setContentScrollViewX(contentOffset.x);

  const adjustDormitoryOnPress = () => {
    dispatch(PageDialog2.setTitle('调迁宿舍'));
    dispatch(PageDialog2.openDialog(<AdjustDormitory />));
  };

  const leaveDormitoryOnPress = () => {
    dispatch(PageDialog2.setTitle('退宿'));
    dispatch(PageDialog2.openDialog(<LeaveDormitory />));
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomInfo_left}>楼栋：241栋</Text> 
        <Text style={styles.roomInfo_left}>楼层：{room.floor}F</Text>   
        <Text style={styles.roomInfo_right}>房间：{room.roomName}</Text> 
      </View>
      <View style={styles.titleArea}>
        <Text Text style={styles.nameText}>姓名</Text>
        <ScrollView ref={titleScrollViewRef} scrollEnabled={false} horizontal showsHorizontalScrollIndicator={false}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.titleText, {width: 180}]}>入住日期</Text>
            <Text style={[styles.titleText, {width: 80}]}>床位</Text>
            <Text style={[styles.titleText, {width: 150}]}>企业</Text>
            <Text style={[styles.titleText, {width: 120}]}>归属</Text>
            <Text style={[styles.titleText, {width: 120}]}>门店</Text>
            <Text style={[styles.titleText, {width: 220, borderRightWidth: 0}]}>操作</Text>
          </View>
        </ScrollView>
      </View>
      <ScrollView style={styles.contentScrollView} onScroll={onVerticalScroll}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.contentScrollView_topArea}>
            {roomData.map((room, roomIndex) => <View key={roomIndex} style={[styles.topArea_titleArea, roomIndex === roomData.length - 1 && styles.borderBottom_0, roomIndex % 2 === 0 && styles.bkgColor]}>
              <Text style={styles.topArea_titleText}>{room.name}</Text>
            </View>)}
          </View>
          <ScrollView horizontal onScroll={onHorizontalScroll} onMomentumScrollEnd={onMomentumScrollEnd}>
            <View>
              {roomData.map((room, roomIndex) => <View key={roomIndex} style={[styles.contentScrollView_item, roomIndex === roomData.length - 1 && styles.borderBottom_0, roomIndex % 2 === 0 && styles.bkgColor]}>
                <Text style={[styles.contentScrollView_itemText, {width: 180}]}>{room.date}</Text>
                <Text style={[styles.contentScrollView_itemText, {width: 80}]}>{room.bedNum}</Text>
                <Text style={[styles.contentScrollView_itemText, {width: 150}]}>{room.company}</Text>
                <Text style={[styles.contentScrollView_itemText, {width: 120}]}>{room.belong}</Text>
                <Text style={[styles.contentScrollView_itemText, {width: 120}]}>{room.store}</Text>
                <View style={styles.operation}>
                  <TouchableOpacity style={styles.operation_leftArea} onPress={adjustDormitoryOnPress}>
                    <Text style={[styles.operation_text, {color: '#409EFF'}]}>调迁宿舍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flex: 1}} onPress={leaveDormitoryOnPress}>
                    <Text style={[styles.operation_text, {color: 'red'}]}>退宿</Text>
                  </TouchableOpacity>
                </View>
              </View>)}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={cancelOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={createLiving}>
            <Text style={styles.confirmText}>新增住宿</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  borderBottom_0: {
    borderBottomWidth: 0
  },
  bkgColor: {
    backgroundColor: '#ECF5FF'
  },
  totalArea: {
    minHeight: 500,
    maxHeight: 900
  },
  roomInfo: {
    height: 60, 
    marginHorizontal: 20, 
    borderRadius: 8, 
    flexDirection: 'row', 
    backgroundColor: '#999999', 
    marginBottom: 20
  },
  roomInfo_left: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    borderRightWidth: 1, 
    borderColor: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  roomInfo_right: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  titleArea: {
    height: 60, 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    borderWidth: 1, 
    borderBottomWidth: 0, 
    borderColor: '#409EFF'
  },
  nameText: {
    width: 120, 
    height: 60, 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderRightWidth: 1,
    borderColor: '#409EFF'
  },
  titleText: {
    height: 60, 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  contentScrollView: {
    marginBottom: 20, 
    marginHorizontal: 20, 
    borderWidth: 1, 
    borderColor: '#409EFF'
  },
  contentScrollView_topArea: {
    width: 120, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  topArea_nameText: {
    width: 120, 
    height: 60, 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#000000', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#409EFF'
  },
  topArea_titleArea: {
    height: 60, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#409EFF'
  },
  topArea_titleText: {
    width: 120, 
    fontSize: 24, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  contentScrollView_item: {
    height: 60, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#409EFF'
  },
  contentScrollView_itemText: {
    fontSize: 24, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  operation: {
    width: 220, 
    flexDirection: 'row'
  },
  operation_leftArea: {
    width: 140, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  operation_text: {
    height: '100%', 
    letterSpacing: 2,
    fontSize: 22, 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default RoomData;