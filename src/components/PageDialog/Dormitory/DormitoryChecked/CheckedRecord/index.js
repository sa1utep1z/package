import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import Foundation from 'react-native-vector-icons/Foundation';
import moment from "moment";

import { deepCopy } from '../../../../../utils';
import CheckedDetail from "../CheckedDetail";
import { SUCCESS_CODE } from '../../../../../utils/const';
import { closeDialog } from "../../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../../redux/features/PageDialog2";
import DormitoryCheckListApi from "../../../../../request/Dormitory/DormitoryCheckListApi";

const CheckedRecord = ({
  item
}) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [recordLists, setRecordLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    queryCheckedRecord(item.roomId);
  },[])

  const queryCheckedRecord = async(id) => {
    try {
      setLoading(true);
      const res = await DormitoryCheckListApi.queryCheckedRecord(id);
      console.log('queryCheckedRecord -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      res.data.map(item => item.showDetail = false);
      setRecordLists(res.data);
    } catch (error) {
      console.log('queryCheckedRecord -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => dispatch(closeDialog());

  const recordOnPress = (record) => {
    const newArr = deepCopy(recordLists);
    const findItemIndex = newArr.findIndex(newItem => newItem.id ===record.id);
    newArr[findItemIndex].showDetail = !record.showDetail;
    setRecordLists(newArr);
  };

  const showDetail = (record) => {
    dispatch(PageDialog2.setTitle(`${moment(record.date).format('YYYY-MM-DD')}点检详情`));
    dispatch(PageDialog2.openDialog(<CheckedDetail isDialog2 item={{id: record.id}} />));
  };

  return (
    <>
      <View style={styles.topArea}>
        <View style={styles.topArea_topTitle}>
          <Text style={styles.topTitle_topText}>宿舍分类：{item.dormType === 'DORM_MALE' ? '男生宿舍' : '女生宿舍'}</Text>
          <View style={styles.topTitle_bottomArea}>
            <Text style={[styles.bottomArea_text, styles.rightBorder]}>楼栋：{item.buildingName}</Text>
            <Text style={[styles.bottomArea_text, styles.rightBorder]}>楼层：{item.floorName}F</Text>
            <Text style={styles.bottomArea_text}>房间：{item.roomName}</Text>
          </View>
        </View>
        <ScrollView style={styles.scrollArea}>
          {loading && <ActivityIndicator style={{marginBottom: 10}} size={32} color='#409EFF' />}
          {recordLists.length ? <>
            {recordLists.map((record, recordIndex) => (
            <View style={styles.scrollView} key={recordIndex}>
              {!record.showDetail && <TouchableOpacity style={styles.recordItem} onPress={() => recordOnPress(record)}>
                <Text style={styles.recordItemText}>{moment(record.date).format('YYYY-MM-DD')}点检记录</Text>
              </TouchableOpacity>}
              {record.showDetail && <Shadow style={styles.shadowArea}>
                <View style={styles.shadowItem}>
                  <TouchableOpacity key={recordIndex} style={[styles.shadowPressItem, record.showDetail && styles.shadowPressItem_shown]} onPress={() => recordOnPress(record)}>
                    <Text style={styles.shadowPressItem_shownText}>{moment(record.date).format('YYYY-MM-DD')}点检记录</Text>
                  </TouchableOpacity>
                  <View style={styles.shadowContent}>
                    <View style={styles.shadowContent_left}>
                      <Text style={styles.shadowContent_leftTitle}>本次点检情况描述</Text>
                      <Text style={styles.shadowContent_leftText}>{record.desc}</Text>
                    </View>
                    <TouchableOpacity style={styles.shadowContent_right} onPress={() => showDetail(record)}>
                      <Text style={styles.shadowContent_rightText}>查看详情</Text>
                      <AntDesign style={styles.shadowContent_icon} name='right' size={22} color='#ffffff' />
                    </TouchableOpacity>
                  </View>
                </View>
              </Shadow>}
            </View>
          ))}
          </> : <View style={styles.emptyArea}>
            <Foundation style={{marginBottom: 10}} name="page-remove" size={72} color="#999999" />
            <Text style={styles.emptyText}>暂无记录</Text>  
          </View>}
        </ScrollView>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  topArea: {
    flex: 1
  },
  topArea_topTitle: {
    backgroundColor: '#979797', 
    borderWidth: 1, 
    borderColor: '#999999', 
    borderRadius: 10,
    marginHorizontal: 30,
    marginBottom: 20
  },
  topTitle_topText: {
    fontSize: 26, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#FFFFFF', 
    paddingVertical: 8
  },
  topTitle_bottomArea: {
    flexDirection: 'row',
    minHeight: 60
  },
  bottomArea_text: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center',
    padding: 6,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#FFFFFF'
  },
  scrollArea: {
    maxHeight: 650,
    marginBottom: 20
  },
  emptyArea: {
    height: 200, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 12, 
    marginHorizontal: 30, 
    marginBottom: 10
  },
  emptyText: {
    fontSize: 28, 
    color: '#999999', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  scrollView: {
    marginHorizontal: 30, 
    marginTop: 10
  },
  recordItem: {
    height: 70,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
    borderColor: '#999999', 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#EFEFEF'
  },
  recordItemText: {
    fontSize: 26, 
    fontWeight: 'bold'
  },
  shadowArea: {
    width: '100%', 
    marginBottom: 20
  },
  shadowItem: {
    borderRadius: 10
  },
  shadowPressItem: {
    height: 70, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
    borderColor: '#999999', 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#EFEFEF'
  },
  shadowPressItem_shown: {
    marginBottom: 0, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0
  },
  shadowPressItem_shownText: {
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#000000'
  },
  shadowContent: {
    flexDirection: 'row',
    padding: 10
  },
  shadowContent_left: {
    flex: 1, 
    padding: 20, 
    borderColor: '#EFEFEF', 
    borderRadius: 10, 
    borderWidth: 1, 
    marginRight: 10
  },
  shadowContent_leftTitle: {
    fontSize: 26, 
    color: '#333333', 
    fontWeight: 'bold', 
    marginBottom: 10
  },
  shadowContent_leftText: {
    fontSize: 24, 
    color: '#333333'
  },
  shadowContent_right: {
    width: 140, 
    height: 55, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 8, 
    alignSelf: 'center', 
    paddingLeft: 8
  },
  shadowContent_rightText: {
    fontSize: 24, 
    color: '#ffffff'
  },
  shadowContent_icon: {
    marginLeft: 2
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
  }
})

export default CheckedRecord;