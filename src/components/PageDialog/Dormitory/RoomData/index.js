import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useDispatch } from "react-redux";
import { useToast } from 'react-native-toast-notifications';
import Foundation from 'react-native-vector-icons/Foundation';

import DormitoryDataListApi from "../../../../request/Dormitory/DormitoryDataListApi";
import { closeDialog } from "../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../redux/features/PageDialog2";
import AdjustDormitory from './AdjustDormitory';
import LeaveDormitory from './LeaveDormitory';
import { SUCCESS_CODE } from '../../../../utils/const';
import NAVIGATION_KEYS from '../../../../navigator/key';
import moment from 'moment';

const RoomData = ({
  navigation,
  room,
  refresh,
}) => {
  const titleScrollViewRef = useRef(null);
  const toast = useToast();

  const dispatch = useDispatch();

  const [roomData, setRoomData] = useState([]);
  const [contentScrollViewX, setContentScrollViewX] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    getRoomMemberList(room.roomId);
  },[])

  useEffect(()=>{
    if(showTitle){
      titleScrollViewRef && titleScrollViewRef?.current?.scrollTo({x: contentScrollViewX, y: 0, animated: false, duration: 0});
    }
  },[showTitle]);
  
  const getRoomMemberList = async(roomId) => {
    try {
      setLoading(true);
      const res = await DormitoryDataListApi.getRoomMemberList(roomId);
      console.log('getRoomMemberList -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setRoomData(res.data);
    } catch (error) {
      console.log('getRoomMemberList -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const cancelOnPress = () => dispatch(closeDialog());

  const createLiving = () => {
    if(room.flag === 2 || room.flag === 3 || room.flag === 4){
      toast.show('该房间没有空余床位，无法新增！', {type: 'warning'});
      return;      
    }
    navigation.navigate(NAVIGATION_KEYS.CREATE_DORMITORY, {
      type: 'fromRoom',
      roomMessage: room,
      refresh: refresh
    });
    dispatch(closeDialog());
  };

  const onVerticalScroll = ({nativeEvent: {contentOffset}}) => setShowTitle(contentOffset.y > 60);

  const onHorizontalScroll = ({nativeEvent: {contentOffset}}) => titleScrollViewRef && titleScrollViewRef?.current?.scrollTo({x: contentOffset.x, y: 0, animated: false, duration: 0});

  const onMomentumScrollEnd = ({nativeEvent: {contentOffset}}) => setContentScrollViewX(contentOffset.x);

  const adjustDormitoryOnPress = (roomMsg) => {
    const memberMsg = {
      ...room,
      ...roomMsg,
      roomName: room.name,
    };
    dispatch(PageDialog2.setTitle('调迁宿舍'));
    dispatch(PageDialog2.openDialog(<AdjustDormitory memberMsg={memberMsg} refresh={refresh} />));
  };

  const leaveDormitoryOnPress = (roomMsg) => {
    const memberMsg = {
      ...room,
      ...roomMsg,
      roomName: room.name,
    };
    dispatch(PageDialog2.setTitle('退宿'));
    dispatch(PageDialog2.openDialog(<LeaveDormitory memberMsg={memberMsg} refresh={refresh} />));
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomInfo_left}>楼栋：{room.building}</Text> 
        <Text style={styles.roomInfo_left}>楼层：{room.floor}F</Text>   
        <Text style={styles.roomInfo_right}>房间：{room.name}</Text> 
      </View>
      {loading && <ActivityIndicator style={{marginBottom: 10}} size={32} color="#409EFF" />}
      {roomData.length ? <>
        <View style={styles.titleArea}>
          <Text Text style={styles.nameText}>姓名</Text>
          <ScrollView ref={titleScrollViewRef} scrollEnabled={false} horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.titleText, {width: 180}]}>入住日期</Text>
              <Text style={[styles.titleText, {width: 80}]}>床位</Text>
              <Text style={[styles.titleText, {width: 180}]}>企业</Text>
              <Text style={[styles.titleText, {width: 140}]}>归属</Text>
              <Text style={[styles.titleText, {width: 140}]}>门店</Text>
              <Text style={[styles.titleText, {width: 220, borderRightWidth: 0}]}>操作</Text>
            </View>
          </ScrollView>
        </View>
        <ScrollView style={styles.contentScrollView} onScroll={onVerticalScroll}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.contentScrollView_topArea}>
              {roomData.map((room, roomIndex) => <View key={roomIndex} style={[styles.topArea_titleArea, roomIndex === roomData.length - 1 && styles.borderBottom_0, roomIndex % 2 === 0 && styles.bkgColor]}>
                <Text style={styles.topArea_titleText}>{room.name || '无'}</Text>
              </View>)}
            </View>
            <ScrollView horizontal onScroll={onHorizontalScroll} onMomentumScrollEnd={onMomentumScrollEnd}>
              <View>
                {roomData.map((room, roomIndex) => <View key={roomIndex} style={[styles.contentScrollView_item, roomIndex === roomData.length - 1 && styles.borderBottom_0, roomIndex % 2 === 0 && styles.bkgColor]}>
                  <Text style={[styles.contentScrollView_itemText, {width: 180}]}>{room.date ? moment(room.date).format('YYYY-MM-DD') : '无'}</Text>
                  <Text style={[styles.contentScrollView_itemText, {width: 80}]}>{room.bedNo || '无'}</Text>
                  <Text style={[styles.contentScrollView_itemText, {width: 180}]}>{room.shortCompanyName || '无'}</Text>
                  <Text style={[styles.contentScrollView_itemText, {width: 140}]}>{room.recruiterName || room.supplierName || '无'}</Text>
                  <Text style={[styles.contentScrollView_itemText, {width: 140}]}>{room.storeName || '无'}</Text>
                  <View style={styles.operation}>
                    <TouchableOpacity style={styles.operation_leftArea} onPress={() => adjustDormitoryOnPress(room)}>
                      <Text style={[styles.operation_text, {color: '#409EFF'}]}>调迁宿舍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => leaveDormitoryOnPress(room)}>
                      <Text style={[styles.operation_text, {color: 'red'}]}>退宿</Text>
                    </TouchableOpacity>
                  </View>
                </View>)}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </> : <View style={styles.emptyArea}>
        <Foundation name="page-remove" size={72} color="#999999" />
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>}
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={cancelOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={createLiving}>
            <Text style={[styles.confirmText, room.flag === 2 && {color: '#999999'}, room.flag === 3 && {color: '#999999'}, room.flag === 4 && {color: '#999999'}]}>新增住宿</Text>
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
    minHeight: 200,
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
  emptyArea: {
    height: 250, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    marginHorizontal: 20, 
    marginBottom: 20, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#999999', 
    marginTop: 5
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
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default RoomData;