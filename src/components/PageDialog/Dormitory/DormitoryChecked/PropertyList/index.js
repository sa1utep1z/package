import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useToast } from "react-native-toast-notifications";

import { deepCopy } from '../../../../../utils';
import CheckedDetail from "../CheckedDetail";
import { SUCCESS_CODE } from '../../../../../utils/const';
import { closeDialog } from "../../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../../redux/features/PageDialog2";
import DormitoryCheckListApi from "../../../../../request/Dormitory/DormitoryCheckListApi";
import moment from "moment";

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
        <View style={{height: 60, borderWidth: 1, borderColor: '#409EFF', marginHorizontal: 30, flexDirection: 'row', marginTop: 10}}>
          <Text style={{width: 150, borderRightWidth: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 26, color: '#333333', backgroundColor: '#ecf5ff', borderColor: '#409EFF'}}>资产名称</Text>
          <Text style={{width: 120, borderRightWidth: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 26, color: '#333333', backgroundColor: '#ecf5ff', borderColor: '#409EFF'}}>数量</Text>
          <Text style={{flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 26, color: '#333333', backgroundColor: '#ecf5ff', borderColor: '#409EFF'}}>资产编号</Text>
        </View>
        <ScrollView style={styles.scrollArea}>
          {propertyList.length ? <>
            {propertyList.map((property, propertyIndex) => <View style={{height: 60, borderWidth: 1, borderTopWidth: 0, borderColor: '#409EFF', flexDirection: 'row'}} key={propertyIndex}>
            <Text style={{width: 150, borderRightWidth: 1, borderColor: '#409eff', fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center'}}>{property.name}</Text>
            <Text style={{width: 120, borderRightWidth: 1, borderColor: '#409eff', fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center'}}>{property.num}{property.unit === 'ge' ? '个' : '台'}</Text>
            <Text style={{flex: 1, borderRightWidth: 1, borderColor: '#409eff', fontSize: 24, color: '#333333', textAlign: 'center', textAlignVertical: 'center'}}>{property.no || '无'}</Text>
          </View>)}
          </> : <Text style={{fontSize: 28, color: '#999999', textAlign: 'center', textAlignVertical: 'center', flex: 1, borderWidth: 1, borderTopWidth: 0, borderColor: '#409eff', height: 200}}>暂无数据</Text>}
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
    flexDirection: 'row'
  },
  bottomArea_text: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    paddingVertical: 6
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#FFFFFF'
  },
  scrollArea: {
    minHeight: 200,
    marginBottom: 20,
    marginHorizontal: 30
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

export default PropertyList;