import React, {useState, useImperativeHandle, forwardRef, useRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog, Input } from '@rneui/themed';

import { DEFAULT_STATUS_LIST } from '../../../utils/const';
import ToastInfoInModal from '../../ToastInfoInModal';
import { deepCopy } from '../../../utils';

const SignUpStateDialog = ({
  memberInfo = []
  }, ref) => {
  const inputRef = useRef(null);
  const toastInfoRef = useRef();

  const [showDetail, setShowDetail] = useState(false);
  const [statusList, setStatusList] = useState(DEFAULT_STATUS_LIST);
  const [inputContent, setInputContent] = useState('');
  const [selectStatus, setSelectStatus] = useState('noThink');
  const [reasonList, setReasonList] = useState([]);


  useEffect(()=>{
    setStatusList(DEFAULT_STATUS_LIST);
  }, [])

  useImperativeHandle(ref, () => {
    return { setShowDetail, showDetail };
  }, []);

  const status = memberInfo?.find(item => item.type === 'signUpState');

  const increaseReason = () => {
    setInputContent('');
    const newArr = deepCopy(statusList);
    newArr.push({
      value: `new_value_${statusList.length - (DEFAULT_STATUS_LIST.length - 1)}`,
      title: inputContent
    })
    setStatusList(newArr);
  };

  const pressReason = (reason) => {
    const originArr = deepCopy(statusList);
    const pressItem = originArr.find(item => item.value === reason.value);
    pressItem.isSelected = !pressItem.isSelected;
    setStatusList(originArr);

    if(reasonList.includes(reason.value)){
      reasonList.splice(reasonList.findIndex(item => item === reason.value), 1);
      setReasonList(reasonList);
      return;
    }
    reasonList.push(reason.value);
    setReasonList(reasonList);
  };

  const pressStatus = (status) => setSelectStatus(status);

  const confirm = () => {
    if(!reasonList.length){
      toastInfoRef.current.toast('请选择原因！', 'danger');
      return;
    }
    setShowDetail(!showDetail);
  };


  return (
    <Dialog
      isVisible={showDetail}
      onBackdropPress={()=> setShowDetail(!showDetail)}>
      <View style={styles.msgArea}>
        <Text style={styles.title}>{status?.value}</Text>
        <View style={{width: '100%'}}>
          <View style={styles.tagArea}>
            <Text style={styles.tagArea_title}>状态选择</Text>
            <View style={styles.tags}>
              <TouchableOpacity style={[styles.tag, selectStatus === 'noThink' && {backgroundColor: '#409EFF'}]} onPress={()=>pressStatus('noThink')}>
                <Text style={[styles.tag_text, selectStatus === 'noThink' && {color: '#fff'}]}>无意愿</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tag, selectStatus === 'hasSignedUp' && {backgroundColor: '#409EFF'}]} onPress={()=>pressStatus('hasSignedUp')}>
                <Text style={[styles.tag_text, selectStatus === 'hasSignedUp' && {color: '#fff'}]}>已报名</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tagArea}>
            <Text style={styles.tagArea_title}>原因选择</Text>
            <ScrollView>
              <View style={styles.tags_little}>
                {statusList.length && statusList.map((item, index) => {
                  const isFill = statusList.length % 3 === 2;
                  const isLastElement = index === statusList.length - 1;
                  return (
                    <View key={index}>
                      <TouchableOpacity style={styles.tag_little} onPress={() => pressReason(item)}>
                        <Text style={[styles.tag_littleText, item.isSelected && styles.tag_littleText_selected]}>{item.title}</Text>
                      </TouchableOpacity>
                      {isLastElement && isFill && (<View style={{width: '33.33%'}}></View>)}
                    </View>
                  )
                })}
              </View>
            </ScrollView>
            <Input
              ref={inputRef}
              value={inputContent}
              onChangeText={text => setInputContent(text)}
              placeholder='手动输入原因' 
              allowFontScaling={false}
              containerStyle={styles.input_containerStyle} 
              inputContainerStyle={styles.input_inputContainerStyle}
              inputStyle={styles.inputStyle}
              rightIcon={
                <TouchableOpacity style={styles.input_rightIcon} onPress={increaseReason}>
                  <Text style={styles.input_rightIconText}>保存</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
        <TouchableOpacity style={styles.bottomBtn} onPress={confirm}>
          <Text style={styles.btnText}>确 定</Text>
        </TouchableOpacity>
      </View>
      <ToastInfoInModal ref={toastInfoRef}/>
    </Dialog>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    alignItems: 'center'
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  topArea: {
    flex: 1, 
    width: '100%',
    marginBottom: 10
  },
  bottomBtn: {
    height: 40, 
    width: '100%', 
    backgroundColor: '#409EFF', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnText: {
    fontSize: 20, 
    color: '#fff'
  },
  tagArea: {
    borderWidth: 1, 
    borderColor: '#EFEFEF', 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10
  },
  tagArea_title: {
    fontSize: 15, 
    fontWeight: 'bold'
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tags_little: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    height: 26, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 3, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  tag_text: {
    paddingHorizontal: 30, 
    fontSize: 15, 
    color: '#999999'
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
    marginTop: 10
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

export default forwardRef(SignUpStateDialog);