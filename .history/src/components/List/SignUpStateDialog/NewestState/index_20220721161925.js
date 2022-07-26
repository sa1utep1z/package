import React, {useState, useImperativeHandle, forwardRef, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog, Input } from '@rneui/themed';

import { CHANGING_STAGE_LIST_IN_DIALOG } from '../../../../utils/const';
import { deepCopy } from '../../../../utils';
import CheckRadio from '../../../CheckRadio';
import ToastInfoInModal from '../../../ToastInfoInModal';

const NewestState = ({

  }) => {
  const [showStage, setShowStage] = useState(false);
  const [stage, setStage] = useState();

  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState();

  const [showReason, setShowReason] = useState(false);
  const [showReasonList, setShowReasonList] = useState(false);
  const [reason, setReason] = useState();
  const [selectedReason, setSelectedReason] = useState();
    
  const stageOnPress = () => setShowStage(!showStage);
  const statusOnPress = () => setShowStatus(!showStatus);

  const selectedStageOnPress = (stage) => {
    setStage(stage);
    setShowStage(false);
    setShowStatus(true);
    setStatus();
    setShowReasonList(false);
  };

  const selectStatusOnPress = (status) => {
    setStatus(status);
    setShowStatus(false);
    setSelectedReason();
    if(status?.reasonList?.length){
      setShowReason(true);
      setShowReasonList(true);
      setReason(status.reasonList);
      return;
    }
    setShowReason(false);
    setShowReasonList(false);
  };

  const selectReasonOnPress = () => {
    setShowReasonList(!showReasonList);
  }

  const selectReason = (reason) => {
    setSelectedReason(reason);
    setShowReasonList(false);
  };

  return (
    <View style={{width: '100%'}}>
      {/* 阶段选择 */}
      <TouchableOpacity style={[styles.titleBox, showStage && styles.showTitleBox, !showStage && styles.noShowTitleBox]} onPress={stageOnPress}>
        <Text style={styles.tagArea_title}>{stage ? `阶段：${stage.title}` : '请选择阶段'}</Text>
      </TouchableOpacity>
      {showStage && CHANGING_STAGE_LIST_IN_DIALOG.map((stageInList, stageIndex) => {
        const isSelected = stageInList.value === stage?.value;
        return (
          <TouchableOpacity key={stageIndex} style={[{
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: '#EFEFEF',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10
          }, stageIndex === CHANGING_STAGE_LIST_IN_DIALOG.length - 1 && {borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 10 }]} onPress={()=>selectedStageOnPress(stageInList)}>
            <Text style={isSelected && {fontWeight: 'bold'}}>{stageInList.title}</Text>
            {isSelected && <CheckRadio checked/>}
          </TouchableOpacity>
        )
      })}

      {/* 状态选择 */}
      {stage && (
        <TouchableOpacity style={[styles.titleBox, showStatus && styles.showTitleBox, !showStatus && styles.noShowTitleBox]} onPress={statusOnPress}>
          <Text style={[styles.tagArea_title]}>{status? `状态：${status.title}` : '请选择状态'}</Text>
        </TouchableOpacity>
      )}
      {showStatus && stage?.statusList?.length && stage.statusList.map((statusInList, statusIndex) => {
        const isSelected = statusInList.value === status?.value;
        return (
          <TouchableOpacity key={statusIndex} style={[{
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: '#EFEFEF',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10
          }, statusIndex === stage.statusList.length - 1 && {borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 10 }]} onPress={()=>selectStatusOnPress(statusInList)}>
            <Text style={isSelected && {fontWeight: 'bold'}}>{statusInList.title}</Text>
            {isSelected && <CheckRadio checked/>}
          </TouchableOpacity>
        )
      })}

      {/* 原因选择 */}
      {showReason && status?.reasonList?.length && 
        <TouchableOpacity style={[styles.titleBox, showReasonList && styles.showTitleBox, !showReasonList && styles.noShowTitleBox]} onPress={selectReasonOnPress}>
          <Text style={[styles.tagArea_title]}>{selectedReason?.title ? `原因：${selectedReason.title}` : '请选择原因'}</Text>
        </TouchableOpacity>}
      {showReasonList && reason.length && <View style={{borderWidth: 1, borderTopWidth: 0, borderColor: '#EFEFEF', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 10, padding: 10, paddingBottom: 0}}>
        <View style={styles.tags_little}>
          {reason.length && reason.map((item, index) => {
            const isFill = reason.length.length % 3 === 2;
            const isLastElement = index === reason.length - 1;
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
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
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
})

export default NewestState;