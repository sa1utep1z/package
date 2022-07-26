import React, {useState, useImperativeHandle, forwardRef, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog, Input } from '@rneui/themed';

import { CHANGING_STAGE_LIST_IN_DIALOG } from '../../../../utils/const';
import { deepCopy } from '../../../../utils';
import CheckRadio from '../../../CheckRadio';
import ToastInfoInModal from '../../../ToastInfoInModal';

const NewestState = ({

  }) => {
  const scrollRef = useRef(null);
  //输入框的内容；
  const [inputContent, setInputContent] = useState('');

  //展示阶段框及设置其内容；
  const [showStage, setShowStage] = useState(false);
  const [stage, setStage] = useState();

  //展示状态框及设置其内容；
  const [showStatus, setShowStatus] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();

  //展示原因框，设置原因列表的内容，展示原因列表，已选择的原因；
  const [showReason, setShowReason] = useState(false);
  const [showReasonList, setShowReasonList] = useState(false);
  const [reasonList, setReasonList] = useState([]);
  const [selectedReason, setSelectedReason] = useState();

  //设置三个标题栏的开关
  const stageOnPress = () => setShowStage(!showStage);
  const statusOnPress = () => setShowStatusList(!showStatusList);
  const selectReasonOnPress = () => setShowReasonList(!showReasonList);

  const selectedStageOnPress = (stage) => {
    console.log('stage', stage);
    setStage(stage);
    if(stage.value === 'leave'){
      setShowReason(true);
      setShowReasonList(true);
      setSelectedReason();
      setReasonList(stage.reasonList);
      setSelectedStatus();
      setShowStatus(false);
      setStatusList([]);
      return;
    }
    setShowStatus(true);
    setShowStatusList(true);
    setStatusList(stage.statusList);
    setSelectedStatus();

    setShowReason(false);
    setShowReasonList(false);
    setReasonList([]);
    setSelectedReason();
  };

  const selectStatusOnPress = (status) => {
    console.log('status', status);
    scrollRef.current.scrollToEnd();
    setSelectedStatus(status);
    setSelectedReason();
    if(status?.reasonList?.length){
      setShowReason(true);
      setShowReasonList(true);
      setReasonList(status.reasonList);
      return;
    }
    setShowReason(false);
    setShowReasonList(false);
  };

  const selectReason = (reason) => {
    setSelectedReason(reason);
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

  return (
    <View style={styles.totalArea}>
      <ScrollView ref={scrollRef}>
        {/* 阶段选择 */}
        <TouchableOpacity 
          style={[styles.titleBox, showStage && styles.showTitleBox, !showStage && styles.noShowTitleBox]} 
          onPress={stageOnPress}>
          <Text style={styles.tagArea_title}>{stage ? `阶段：${stage.title}` : '请选择阶段'}</Text>
        </TouchableOpacity>
        {showStage && CHANGING_STAGE_LIST_IN_DIALOG.map((stageInList, stageIndex) => {
          const isSelected = stageInList.value === stage?.value;
          const isLastItem = stageIndex === CHANGING_STAGE_LIST_IN_DIALOG.length - 1;
          return (
            <TouchableOpacity 
              key={stageIndex} 
              style={[styles.listArea, isLastItem && styles.isLastItem]} 
              onPress={()=>selectedStageOnPress(stageInList)}>
              <Text style={isSelected && {fontWeight: 'bold'}}>{stageInList.title}</Text>
              {isSelected && <CheckRadio checked/>}
            </TouchableOpacity>
          )
        })}

        {/* 状态选择 */}
        {showStatus && (
          <TouchableOpacity 
            style={[styles.titleBox, showStatusList && styles.showTitleBox, !showStatusList && styles.noShowTitleBox]} 
            onPress={statusOnPress}>
            <Text style={styles.tagArea_title}>{selectedStatus? `状态：${selectedStatus.title}` : '请选择状态'}</Text>
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
              {isSelected && <CheckRadio checked/>}
            </TouchableOpacity>
          )
        })}

        {/* 原因选择 */}
        {showReason && 
          <TouchableOpacity 
            style={[styles.titleBox, showReasonList && styles.showTitleBox, !showReasonList && styles.noShowTitleBox]} 
            onPress={selectReasonOnPress}>
            <Text style={styles.tagArea_title}>{selectedReason?.title ? `原因：${selectedReason.title}` : '请选择原因'}</Text>
          </TouchableOpacity>}
        {showReasonList && reasonList.length && 
          <View style={styles.reasonTitleArea}>
            <View style={styles.tags_little}>
              {reasonList.length && reasonList.map((item, index) => {
                const isFill = reasonList.length.length % 3 === 2;
                const isLastElement = index === reasonList.length - 1;
                const isSelected = selectedReason?.value === item.value;
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
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    width: '100%',
    maxHeight: 450
  },
  titleBox: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 8, 
    padding: 10, 
    height: 40
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
    height: 40,
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
  }
})

export default NewestState;