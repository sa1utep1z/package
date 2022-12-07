import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";

import { SUCCESS_CODE } from '../../../../../utils/const';
import { closeDialog } from "../../../../../redux/features/PageDialog";
import DormitoryCheckListApi from "../../../../../request/Dormitory/DormitoryCheckListApi";

const PropertyList = ({
  item
}) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [propertyList, setPropertyList] = useState([]);

  useEffect(()=>{
    queryPropertyOfRecord(item.roomId);
  },[])

  const queryPropertyOfRecord = async(id) => {
    try {
      const res = await DormitoryCheckListApi.queryPropertyOfRecord(item.roomId);
      console.log('queryPropertyOfRecord -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setPropertyList(res.data);
    } catch (error) {
      console.log('queryPropertyOfRecord -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => dispatch(closeDialog());

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
        <View style={styles.titleArea}>
          <Text style={[styles.titleText, {width: 150}]}>资产名称</Text>
          <Text style={[styles.titleText, {width: 120}]}>数量</Text>
          <Text style={[styles.titleText, {flex: 1, borderRightWidth: 0}]}>资产编号</Text>
        </View>
        <ScrollView style={styles.scrollArea}>
          {propertyList.length ? <>
            {propertyList.map((property, propertyIndex) => <View style={styles.propertyArea} key={propertyIndex}>
            <Text style={[styles.propertyText, {width: 150}]}>{property.name}</Text>
            <Text style={[styles.propertyText, {width: 120}]}>{property.num}{property.unit}</Text>
            <Text selectable style={[styles.propertyText, {flex: 1, borderRightWidth: 0}]}>{property.no || '无'}</Text>
          </View>)}
          </> : <Text style={styles.noneText}>暂无数据</Text>}
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
    minHeight: 50
  },
  bottomArea_text: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    textAlignVertical: 'center',
    padding: 6
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#FFFFFF'
  },
  scrollArea: {
    maxHeight: 600,
    marginBottom: 20,
    marginHorizontal: 30
  },
  titleArea: {
    height: 60, 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    marginHorizontal: 30, 
    flexDirection: 'row', 
    marginTop: 10
  },
  titleText: {
    borderRightWidth: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 26, 
    color: '#333333', 
    backgroundColor: '#ecf5ff', 
    borderColor: '#409EFF'
  },
  propertyArea: {
    height: 60, 
    borderWidth: 1, 
    borderTopWidth: 0, 
    borderColor: '#409EFF', 
    flexDirection: 'row'
  },
  propertyText: {
    borderRightWidth: 1, 
    borderColor: '#409eff', 
    fontSize: 24, 
    color: '#333333', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  noneText: {
    flex: 1, 
    height: 200,
    fontSize: 28, 
    color: '#999999', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    borderWidth: 1, 
    borderTopWidth: 0, 
    borderColor: '#409eff', 
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

export default PropertyList;