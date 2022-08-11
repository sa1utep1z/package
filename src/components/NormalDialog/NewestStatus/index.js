import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Input, CheckBox } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { CHANGING_STAGE_LIST_IN_DIALOG, ALL_STATUS_IN_NEWEST_LIST } from '../../../utils/const';
import { deepCopy, getYMD } from '../../../utils';

const NewestStatus = ({
  message,
  dialog,
  confirmOnPress
}, ref) => {
  const scrollRef = useRef(null);

  //输入框的内容；
  const [inputContent, setInputContent] = useState('');

  //是否展示阶段标题，已选择的标题，是否未选阶段；
  const [showStage, setShowStage] = useState(true);
  const [selectedStage, setSelectedStage] = useState();
  const [noSelectStage, setNoSelectStage] = useState(false);

  //是否展示状态标题，是否展示状态列表，状态列表，已选择的状态，是否未选状态；
  const [showStatus, setShowStatus] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [isNoSelectStatus, setNoSelectStatus] = useState(false);

  //是否展示原因标题，是否展示原因列表，原因列表，已选择的原因列表；
  const [showReason, setShowReason] = useState(false);
  const [showReasonList, setShowReasonList] = useState(false);
  const [reasonList, setReasonList] = useState([]);
  const [selectedReasonList, setSelectedReasonList] = useState([]);

  //是否展示时间框标题，是否展示选择框组件，选择的时间，是否未选时间；
  const [showDate, setShowDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [isNoSelectDate, setNoSelectDate] = useState(false);

  useEffect(()=>{
    //清空选择的状态
    setSelectedStage();
    setSelectedStatus();
    setShowStatus(false);
    setShowStatusList(false);
    setSelectedReasonList([]);
    setShowReason(false);
    setShowReasonList(false);
    setShowDate(false);
    setNoSelectStatus(false);
    setNoSelectDate(false);
  },[])

  //标题栏的开关；
  const stageOnPress = () => setShowStage(!showStage);
  const statusOnPress = () => setShowStatusList(!showStatusList);
  const reasonOnPress = () => setShowReasonList(!showReasonList);
  const dateOnPress = () => setShowDatePicker(true);

  const selectedStageOnPress = (stage) => {
    setSelectedStage(stage);
    setDateTime();
    setNoSelectDate(false);
    setNoSelectStage(false);
    
    if(stage.value === 'JOB_RESIGN'){
      setShowReason(true);
      setShowReasonList(true);
      setSelectedReasonList([]);
      setReasonList(stage.reasonList);
      setSelectedStatus();
      setShowStatus(false);
      setStatusList([]);
      setShowDate(true);
      scrollRef.current.scrollToEnd();
      return;
    }
    setShowStatus(true);
    setShowStatusList(true);
    setStatusList(stage.statusList);
    setSelectedStatus();

    setShowReason(false);
    setShowReasonList(false);
    setReasonList([]);
    setSelectedReasonList([]);

    setShowDate(false);
    scrollRef.current.scrollToEnd();
  };

  const selectStatusOnPress = (status) => {
    scrollRef.current.scrollToEnd();
    setNoSelectStatus(false);
    setNoSelectDate(false);
    setSelectedStatus(status);
    setSelectedReasonList([]);
    if(status?.reasonList?.length){
      setShowReason(true);
      setShowReasonList(true);
      setReasonList(status.reasonList);
      setShowDate(false);
      return;
    }
    setShowReason(false);
    setShowReasonList(false);
    if(status.value === 'ON_BOARDING_PASS'){
      setShowDate(true);
      return;
    }
  };

  const selectReason = (reason) => {
    const newArr = deepCopy(selectedReasonList);
    const findIndex = newArr.findIndex(item => item.value === reason.value);
    if(findIndex > -1){
      newArr.splice(findIndex, 1);
      setSelectedReasonList(newArr);
      return;
    }
    newArr.push(reason);
    setSelectedReasonList(newArr);
  };

  //添加原因
  const increaseReason = () => {
    const newArr = deepCopy(reasonList);
    const originReasonLength = selectedStatus?.reasonList?.length;
    const newObj = {
      value: `new_value_${reasonList.length - (originReasonLength - 1)}`,
      title: inputContent
    };
    newArr.push(newObj);
    setReasonList(newArr);
    setInputContent('');
  };

  const dateChange = (event, selectedDate) => {
    if (event.type !== 'set') {
      setShowDatePicker(false);
      return;
    };
    setDateTime(selectedDate);
    setShowDatePicker(false);
    setNoSelectDate(false);
  };

  const confirm = () => {
    //没选阶段
    if(!selectedStage){
      setNoSelectStage(true);
      return;
    }

    const flowId = message.flowId;
    const status = selectedStatus ? selectedStatus.value : selectedStage.value;
    const date = showDate ? moment(dateTime).format('YYYY-MM-DD') : '';
    const reasons = selectedReasonList.length ? selectedReasonList.map(reason => reason.title) : [];

    //没选状态；
    if(!ALL_STATUS_IN_NEWEST_LIST.includes(status)){
      setNoSelectStatus(true);
      return;
    }

    //没选时间；
    if(['ON_BOARDING_PASS', 'JOB_RESIGN'].includes(status) && !dateTime){
      setNoSelectDate(true);
      return;
    }

    const params = {
      status,
      date,
      reasons
    };

    confirmOnPress(flowId, params);
  };

  return (
    <View style={styles.totalArea}>
      <ScrollView style={styles.scrollStyle} ref={scrollRef} >
        {/* 阶段选择 */}
        <TouchableOpacity 
          style={[styles.titleBox, showStage && styles.showTitleBox, !showStage && styles.noShowTitleBox]} 
          onPress={stageOnPress}>
          <Text style={[styles.tagArea_title, noSelectStage && {color: 'red'}]}>{selectedStage ? `阶段：${selectedStage.title}` : `请选择阶段${noSelectStage ? ' ！' : ''}`}</Text>
        </TouchableOpacity>
        {showStage && CHANGING_STAGE_LIST_IN_DIALOG.map((stageInList, stageIndex) => {
          const isSelected = stageInList.value === selectedStage?.value;
          const isLastItem = stageIndex === CHANGING_STAGE_LIST_IN_DIALOG.length - 1;
          return (
            <TouchableOpacity 
              key={stageIndex} 
              style={[styles.listArea, isLastItem && styles.isLastItem]} 
              onPress={()=>selectedStageOnPress(stageInList)}>
              <Text style={isSelected && {fontWeight: 'bold'}}>{stageInList.title}</Text>
              {isSelected && <CheckBox
                checked
                size={20}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
              />}
            </TouchableOpacity>
          )
        })}

        {/* 状态选择 */}
        {showStatus && (
          <TouchableOpacity 
            style={[styles.titleBox, showStatusList && styles.showTitleBox, !showStatusList && styles.noShowTitleBox]} 
            onPress={statusOnPress}>
            <Text style={[styles.tagArea_title, isNoSelectStatus && {color: 'red'}]}>{selectedStatus? `状态：${selectedStatus.title}` : `请选择状态${isNoSelectStatus ? '！' : ''}`}</Text>
          </TouchableOpacity>
        )}
        {showStatusList && statusList.map((statusInList, statusIndex) => {
          const isSelected = statusInList.value === selectedStatus?.value;
          const isLastItem = statusIndex === statusList.length - 1;
          return (
            <TouchableOpacity 
              key={statusIndex} 
              style={[styles.listArea, isLastItem && styles.isLastItem]} 
              onPress={()=>selectStatusOnPress(statusInList)}>
              <Text style={isSelected && {fontWeight: 'bold'}}>{statusInList.title}</Text>
              {isSelected && <CheckBox
                checked
                size={20}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
              />}
            </TouchableOpacity>
          )
        })}

        {/* 原因选择 */}
        {showReason && 
          <TouchableOpacity 
            style={[styles.titleBox, showReasonList && styles.showTitleBox, !showReasonList && styles.noShowTitleBox]} 
            onPress={reasonOnPress}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.tagArea_title}>{selectedReasonList.length ? `已选${selectedReasonList.length}项：${selectedReasonList.map(reason => reason.title).join('、')}` : '请选择原因'}</Text>
          </TouchableOpacity>}
        {showReasonList && reasonList.length && 
          <View style={styles.reasonTitleArea}>
            <View style={styles.tags_little}>
              {reasonList.length && reasonList.map((item, index) => {
                const isFill = reasonList.length.length % 3 === 2;
                const isLastElement = index === reasonList.length - 1;
                const isSelected = selectedReasonList.findIndex(reason => reason.value === item.value) > -1;
                return (
                  <View key={index}>
                    <TouchableOpacity style={styles.tag_little} onPress={() => selectReason(item)}>
                      <Text style={[styles.tag_littleText, isSelected && styles.tag_littleText_selected]}>{item.title}</Text>
                    </TouchableOpacity>
                    {isLastElement && isFill && (<View style={{width: '33.33%'}}></View>)}
                  </View>
                )
              })}
            </View>
            <Input
              value={inputContent}
              onChangeText={text => setInputContent(text)}
              placeholder='手动输入原因'
              inputStyle={styles.inputStyle}
              containerStyle={styles.input_containerStyle} 
              inputContainerStyle={styles.input_inputContainerStyle}
              rightIcon={<TouchableOpacity style={styles.input_rightIcon} onPress={increaseReason}>
                <Text style={styles.input_rightIconText}>保存</Text>
              </TouchableOpacity>}
            />
        </View>}

        {/* 时间选择 */}
        {showDate && <TouchableOpacity 
          style={[styles.titleBox, {marginBottom: 10}]} 
          onPress={dateOnPress}>
          <Text style={[styles.tagArea_title, isNoSelectDate && {color: 'red'}]}>{dateTime ? `时间：${getYMD(dateTime)}` : `请选择时间${isNoSelectDate ? '！' : ''}`}</Text>
        </TouchableOpacity>}
        {showDatePicker && 
          <DateTimePicker 
            value={dateTime || new Date()} 
            onChange={dateChange} 
          />}
      </ScrollView>
      {/**底部按钮 */}
      <View style={styles.bottomButtonArea}>
        <TouchableOpacity style={styles.bottomLeft} onPress={()=>dialog?.current.setShowDialog(false)}>
          <Text style={styles.leftText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomRight} onPress={confirm}>
          <Text style={styles.rightText}>确认</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    width: '100%',
    maxHeight: 400
  },
  scrollStyle: {
    paddingHorizontal: 20
  },
  titleBox: {
    minHeight: 40,
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 8, 
    padding: 10
  },
  showTitleBox: {
    borderColor: '#409EFF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  noShowTitleBox: {
    marginBottom: 10
  },
  listArea: {
    minHeight: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10
  },
  isLastItem: {
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8, 
    marginBottom: 10 
  },
  reasonTitleArea: {
    borderWidth: 1, 
    borderTopWidth: 0, 
    borderColor: '#EFEFEF', 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 8, 
    marginBottom: 10, 
    padding: 10, 
    paddingBottom: 0
  },
  tagArea_title: {
    fontSize: 15, 
    fontWeight: 'bold'
  },
  tags_little: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag_little: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 8
  },
  tag_littleText: {
    paddingVertical: 3,
    paddingHorizontal: 6, 
    fontSize: 14, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 3, 
    color: '#999999'
  },
  tag_littleText_selected: {
    backgroundColor: '#409EFF', 
    color: '#fff'
  },
  input_containerStyle: {
    paddingHorizontal: 5, 
    height: 28, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 4,
    marginBottom: 10
  },
  input_inputContainerStyle: {
    height: 28, 
    borderBottomWidth: 0
  },
  inputStyle: {
    fontSize: 14, 
    color: '#999999'
  },
  input_rightIcon: {
    height: '100%', 
    justifyContent: 'center' 
  },
  input_rightIconText: {
    color: '#fff', 
    backgroundColor: '#409EFF', 
    paddingHorizontal: 5, 
    borderRadius: 3, 
    paddingVertical: 1
  },
  bottomButtonArea: {
    flexDirection: 'row',
    height: 45
  },
  bottomLeft: {
    flex: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16,
    color: '#999999'
  },
  bottomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16,
    color: '#409EFF'
  },
})

export default NewestStatus;