//这是会员标签的组件，目前只有一个应用场景，就还没有剥离出去，如果以后有相同使用场景，就把他请求接口写在外边。
import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {Text, Input} from '@rneui/themed';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import NormalDialog from '../../NormalDialog';
import MyMembersApi from '../../../request/MyMembersApi';
import { SUCCESS_CODE } from '../../../utils/const';
import { deepCopy } from '../../../utils';
import { useMemo } from 'react';

const SelectTags = ({
  field, 
  form, 
  title,
  labelAreaStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  containerStyle,
  ...rest
}) => {
  const toast = useToast();
  const dialogRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [selectTags, setSelectTags] = useState([]);

  useMemo(()=>{
    field.value.length && setSelectTags(field.value);
  },[field.value])


  const showTag = async() => {
    dialogRef?.current.setShowDialog(true);
    setLoading(true);
    try{
      const res = await MyMembersApi.MemberTagList();
      if(res.code !== SUCCESS_CODE){
        setLoading(false);
        toast.show(`获取会员标签列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setTagList(res.data);
      setLoading(false);
    }catch(err){
      console.log('MemberTagList-->err', err);
      setLoading(false);
    }
  };

  const pressTag = (tag) => {
    const originList = deepCopy(selectTags);
    const findTagIndex = selectTags.findIndex(name => name === tag);
    if(findTagIndex !== -1){
      originList.splice(findTagIndex, 1);
      setSelectTags(originList);
      return;
    }
    setSelectTags(originList.concat(tag));
  };

  const dialogContent = {
    contentText: '',
    dialogTitle: '选择会员标签',
    rightTitle: selectTags.length > 1 && '取消全选',
    confirmOnPress: () => {
      dialogRef?.current.setShowDialog(false);
      form.setFieldValue(field.name, selectTags);
    },
    backOnPress: () => {
      setSelectTags([]);
      dialogRef?.current.setShowDialog(false);
    },
    rightTitleOnPress: () => setSelectTags([]),
    content: 
      <ScrollView style={{maxHeight: 300}}>
        <View style={{borderWidth: 1, borderRadius: 5, marginHorizontal: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 10, borderColor: '#CCCCCC'}}>
          {tagList.map((tag, tagIndex) => {
            const isSelected = selectTags.find(name => name === tag);
            return (
              <TouchableOpacity key={tagIndex} style={[{paddingHorizontal: 5, marginRight: 5, marginBottom: 5, borderRadius: 3, backgroundColor: '#EEEEEE'}, isSelected && {backgroundColor: '#409EFF'}]} onPress={() => pressTag(tag)}>
                <Text style={[{color: '#999999'}, isSelected && {color: '#fff'}]}>{tag}</Text>
              </TouchableOpacity>
            )
        })}
        {!tagList.length && <ActivityIndicator animating={loading}/>}
        </View>
      </ScrollView>
  }

  console.log('firle,field.value', field.value);
  return (
    <>
      <View style={[styles.selectArea, field.value.length && {paddingTop: 5}]}>
        <View style={[styles.titleArea, labelAreaStyle]}>
          <Text>{title}</Text>
        </View>
        <TouchableOpacity style={styles.rightArea} onPress={showTag}>
          {field.value.length ? <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
            {field.value.map((tag, tagIndex) => {
              return (
                <Text style={{paddingHorizontal: 5, marginRight: 5, marginBottom: 5, borderRadius: 3, backgroundColor: '#409EFF', color: '#fff'}}>{tag}</Text>
              )
            })}
          </View> : 
          <Text style={[styles.rightArea_text, !field.value.length && {color: '#CCCCCC'}]}>{`请选择${title}`}</Text>}
          <AntDesign
            name={dialogRef?.current?.showDialog ? 'up' : 'down'}
            size={20}
            color={!field.value.length ? '#CCCCCC' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
      <ErrorMessage
        name={field.name}
        component={Text}
        style={styles.errorInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  errorInput: {
    textAlign: 'center',
    color: 'red'
  },
  selectArea: {
    minHeight: 48, 
    paddingHorizontal: 10, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3'
  },
  titleArea: {
    width: 80, 
    marginRight: 10, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  rightArea_text: {
    fontSize: 15
  }
})

export default SelectTags;