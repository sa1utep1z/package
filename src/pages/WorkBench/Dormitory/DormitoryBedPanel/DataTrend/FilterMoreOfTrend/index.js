import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';

import { THIS_WEEK_START, THIS_WEEK_END, LAST_WEEK_START, LAST_WEEK_END, THIS_MONTH_START, THIS_MONTH_END } from '../../../../../../utils/const';
import * as PageDialog1 from "../../../../../../redux/features/PageDialog";
import TopSearchApi from '../../../../../../request/Dormitory/TopSearchApi';
import { SUCCESS_CODE } from '../../../../../../utils/const';

const FilterMoreOfTrend = ({
  rangeDate,
  confirm
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  /** 时间范围 */
  const [type, setType] = useState('start');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(true);
  const [rangeTime, setRangeTime] = useState({startTime: rangeDate.startDate, endTime: rangeDate.endDate});

  const [selectedBuilding, setSelectedBuilding] = useState([]);
  const [buildingLoading, setBuildingLoading] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);
  const [buildingList, setBuildingList] = useState([]);

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    setDateTime(type === 'start' ? new Date(rangeTime.startTime) : new Date(rangeTime.endTime));
  };

  //选择日期
  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    const formatDate = moment(selectedDate).format('YYYY-MM-DD');
    if(type === 'start'){
      setRangeTime({...rangeTime, startTime: formatDate})
      return;
    }else{
      setRangeTime({...rangeTime, endTime: formatDate})
      return;
    }
  };

  const buildingConfirm = value => {
    console.log('buildingConfirm -> value', value);
  };

  const showBuildingList = () => {
    setShowBuilding(!showBuilding);
    if(!showBuilding){
      getBuildingList();
    }
  };

  const getBuildingList = async() => {
    try {
      setBuildingLoading(true);
      const res = await TopSearchApi.getBuildingList();
      console.log('getBuildingList -> res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取宿舍楼栋列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        setBuildingList(res.data);
      }
    }catch(error){
      console.log('getBuildingList->error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setBuildingLoading(false);
    }
  };

  //获取时间转字符串显示
  const getRangeDate = () => {
    let rangeText = '';
    if (rangeTime.startTime === THIS_WEEK_START && rangeTime.endTime === THIS_WEEK_END){
      rangeText = '本周';
    }else if (rangeTime.startTime === LAST_WEEK_START && rangeTime.endTime === LAST_WEEK_END){
      rangeText = '上周';
    }else if (rangeTime.startTime === THIS_MONTH_START && rangeTime.endTime === THIS_MONTH_END){
      rangeText = '本月';
    }else{
      rangeText = '其他周期';
    }
    return rangeText;
  };
  
  const close = () => dispatch(PageDialog1.closeDialog());
  
  const confirmOnPress = () => {
    dispatch(PageDialog1.closeDialog());
    const searchContent = {
      rangeTime
    };
    confirm(searchContent);
  };

  return (
    <>
      <ScrollView style={{maxHeight: 750, paddingHorizontal: 20, marginBottom: 20}}>
        <TouchableOpacity style={[styles.touchArea, showDateRangePicker && styles.selectedTouchArea]} onPress={() => setShowDateRangePicker(!showDateRangePicker)}>
          <Text style={[styles.title, showDateRangePicker && styles.fontBold]}>
            {`时间范围：${getRangeDate()}`}
          </Text>
        </TouchableOpacity>
        {showDateRangePicker && <View style={styles.selectArea}>
          <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('start')}>
            <AntDesign name='calendar' size={28} color='#333333'/>
            <Text style={{marginLeft: 4, fontSize: 26}}>{rangeTime.startTime}</Text>
          </TouchableOpacity>
          <Text style={styles.centerText}>至</Text>
          <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('end')}>
            <AntDesign name='calendar' size={28} color='#333333'/>
            <Text style={{marginLeft: 4, fontSize: 26}}>{rangeTime.endTime}</Text>
          </TouchableOpacity>
        </View>}
        <TouchableOpacity style={[styles.touchArea, showBuilding && styles.selectedTouchArea, {marginTop: 20}]} onPress={showBuildingList}>
          <Text style={[styles.title, showBuilding && styles.fontBold]}>
            {`楼栋：${selectedBuilding.length ? selectedBuilding[0].label : '请选择楼栋'}`}
          </Text>
          {buildingLoading && <ActivityIndicator style={{position: 'absolute', right: 20}} size={36} color="#409EFF" />}
        </TouchableOpacity>
        {showBuilding ? buildingList.length ? <View style={{borderWidth: 1, borderTopWidth: 0, borderColor: '#999999', borderBottomLeftRadius: 12, borderBottomRightRadius: 12}}>
          {buildingList.map((building, buildingIndex) => {
            const isChecked = selectedBuilding.length && selectedBuilding[0].value === building.value;
            const isLastIndex = buildingIndex === buildingList.length - 1;
            return <TouchableOpacity key={building.value} style={[{height: 60, borderBottomWidth: 1, borderColor: '#999999', justifyContent: 'center', paddingHorizontal: 20}, isLastIndex && {borderBottomWidth: 0}]} onPress={() => setSelectedBuilding([building])}>
              <Text style={{fontSize: 26, color: '#333333'}}>{building.label}</Text>
              <MaterialIcons style={styles.icon} name={isChecked ? 'radio-button-checked' : 'radio-button-off'} size={32} color={isChecked ? '#409EFF' : '#999999'} />
            </TouchableOpacity>
          })}
        </View> : <View style={{height: 200, borderWidth: 1, borderTopWidth: 0, borderBottomRightRadius: 12, borderBottomLeftRadius: 12, borderColor: '#999999', justifyContent: 'center', alignItems: 'center'}}>
          <Foundation name="page-remove" size={72} color="#999999"/>
          <Text style={{fontSize: 26, color: '#999999'}}>暂无数据</Text>
        </View> : <></>}
      </ScrollView>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={close}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={confirmOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showDataPicker && <DateTimePicker value={dateTime} onChange={dateChange}/>}
    </>
  )
};

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: 'bold'
  },
  touchArea: {
    height: 80, 
    borderWidth: 2, 
    borderColor: '#EFEFEF',
    borderRadius: 12, 
    justifyContent: 'center', 
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28, 
    color: '#000'
  },
  selectedTouchArea: {
    borderColor: '#409EFF', 
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },
  selectArea: {
    borderWidth: 1, 
    height: 100,
    borderColor: '#999999', 
    borderTopWidth: 0, 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    flexDirection: 'row', 
    padding: 20
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  centerText: {
    fontSize: 28, 
    marginHorizontal: 10, 
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
    color: '#999999'
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
  icon: {
    position: 'absolute',
    right: 20,
    textAlign: 'center', 
    marginRight: 5
  }
})

export default FilterMoreOfTrend;