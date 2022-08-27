import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from '@rneui/themed';
import moment from 'moment';

import { CHART_STATUS_LIST } from '../../../utils/const';

const FilterMore = ({
  CompanyList
}, ref) => {

  /** 时间范围 */
  const [type, setType] = useState('start');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [dataRangePicker, setDateRangePicker] = useState(false);
  const [rangeTime, setRangeTime] = useState({startTime: moment().format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')});

  /** 状态 */
  const [showStatusList, setShowStatusList] = useState(false);
  const [selectedState, setSelectedState] = useState({});

  /** 其他 */
  const [showOther, setShowOther] = useState(false);

  const changeDateRangePicker = () => setDateRangePicker(!dataRangePicker);
  const changeStatus = () => setShowStatusList(!showStatusList);
  const changeOther = () => setShowOther(!showOther);

  const showDate = (type) => {
    setType(type);
    setShowDataPicker(true);
    setDateTime(type === 'start' ? new Date(rangeTime.startTime) : new Date(rangeTime.endTime));
  };
  console.log('CompanyList', CompanyList);

  const dateChange = (event, selectedDate) => {
    setShowDataPicker(false);
    if (event.type !== 'set') return;
    if(type === 'start'){
      setRangeTime({...rangeTime, startTime: moment(selectedDate).format('YYYY-MM-DD')})
      return;
    }else{
      setRangeTime({...rangeTime, endTime: moment(selectedDate).format('YYYY-MM-DD')})
      return;
    }
  };

  const stateOnPress = (state) => setSelectedState(state);

  return (
    <ScrollView style={{maxHeight: 400, paddingHorizontal: 10}}>
      <>
          <TouchableOpacity style={[styles.touchArea, dataRangePicker && styles.selectedTouchArea]} onPress={changeDateRangePicker}>
            <Text style={[{fontSize: 16, color: '#000'}, dataRangePicker && styles.fontBold]}>{`时间范围${!dataRangePicker ? `：${rangeTime.startTime + `~` + rangeTime.endTime}` : ''}`}</Text>
          </TouchableOpacity>
          {dataRangePicker && (
            <View style={styles.selectArea}>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('start')}>
                <AntDesign
                  name='calendar'
                  size={15}
                  color='#333333'
                />
                <Text style={{marginLeft: 4}}>{rangeTime.startTime}</Text>
              </TouchableOpacity>
              <Text>至</Text>
              <TouchableOpacity style={styles.selectTime} onPress={()=>showDate('end')}>
                <AntDesign
                  name='calendar' 
                  size={15}
                  color='#333333'
                />
                <Text style={{marginLeft: 4}}>{rangeTime.endTime}</Text>
              </TouchableOpacity>
            </View>
          )}
        {showDataPicker && <DateTimePicker 
          value={dateTime} 
          onChange={dateChange} 
        />}
      </>
      <>
        <TouchableOpacity style={[styles.touchArea, showStatusList && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeStatus}>
          <Text style={[{fontSize: 16, color: '#000'}, showStatusList && styles.fontBold]}>{`${selectedState.title ? `已选状态：${selectedState.title}` : `请选择状态`}`}</Text>
        </TouchableOpacity>
        {showStatusList && (
          <View style={[styles.selectArea, {flexDirection: 'column'}]}>
            {CHART_STATUS_LIST.map((state, stateIndex) => {
              const isLastIndex = stateIndex === (CHART_STATUS_LIST.length - 1);
              const isSelected = state.value === selectedState?.value;
              return (
                <TouchableOpacity style={[{height: 35, borderBottomWidth: 1, borderBottomColor: '#EFEFEF', width: '100%', alignItems: 'center', paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}, isLastIndex && {borderBottomWidth: 0}]} onPress={() => stateOnPress(state)} key={stateIndex}>
                  <Text style={{color: '#333333'}}>{state.title}</Text>
                  <CheckBox
                    checked={isSelected}
                    size={18}
                    containerStyle={{padding: 0}}
                    checkedIcon={"dot-circle-o"}
                    uncheckedIcon={"circle-o"}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </>
      <>
        <TouchableOpacity style={[styles.touchArea, showOther && styles.selectedTouchArea, {marginTop: 10}]} onPress={changeOther}>
          <Text style={[{fontSize: 16, color: '#000'}, showOther && styles.fontBold]}>请选择企业</Text>
        </TouchableOpacity>
        {showOther && (
          <View style={[styles.selectArea, {flexDirection: 'column'}]}>
            <View style={{height: 50}}></View>
          </View>
        )}
      </>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: 'bold'
  },
  touchArea: {
    height: 40, 
    borderWidth: 1, 
    borderRadius: 6, 
    justifyContent: 'center', 
    paddingLeft: 10, 
    borderColor: '#EFEFEF'
  },
  selectedTouchArea: {
    borderColor: '#409EFF', 
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },
  selectArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderTopWidth: 0, 
    borderBottomLeftRadius: 6, 
    borderBottomRightRadius: 6, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  selectTime: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    marginHorizontal: 10, 
    height: 30, 
    borderRadius: 6, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical: 10
  }
})

export default FilterMore;