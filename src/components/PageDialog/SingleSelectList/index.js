import React, {useState, useEffect, useMemo, useCallback} from "react";
import { FlatList, TextInput, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { deepCopy } from "../../../utils";
import { closeDialog } from "../../../redux/features/PageDialog";

const FlattListItem = ({item, pressItem, isLastIndex}) => {
  const onChange = useCallback(() => pressItem(item),[item]);

  return useMemo(()=>(
    <TouchableOpacity style={[{height: 60, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E3E3E3', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}, isLastIndex && {borderBottomWidth: 0}]} onPress={onChange}>
      <Text style={{fontSize: 26, color: '#333333'}}>{item.label}</Text>
      <CheckBox
        center
        size={30}
        pointerEvents={'none'}
        checked={!!item.isChecked}
        containerStyle={{padding: 0}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
      />
    </TouchableOpacity>
  ),[item])
};

const SingleSelectList = ({
  selectList,
  fieldValue,
  confirm,
  canSearch = true, //是否可以搜索（default: true）
}) => {
  const dispatch = useDispatch();

  const [showList, setShowList] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const copyList = deepCopy(selectList);
    if(fieldValue.length){
      copyList.map(item => {
        if(item.value === fieldValue[0].value){
          item.isChecked = true;
        }else{
          item.isChecked = false;
        }
      });
    }
    setShowList(copyList);
  }, [fieldValue])

  const selectItem = (item) => {
    if(inputValue.length){
      const copyList = deepCopy(showList);
      copyList.map(data => {
        if(data.value === item.value){
          data.isChecked = true;
        }else{
          data.isChecked = false;
        }
      });
      setShowList(copyList);
      return;
    }

    const copyList = deepCopy(selectList);
    copyList.map(data => {
      if(data.value === item.value){
        data.isChecked = true;
      }else{
        data.isChecked = false;
      }
    });
    setShowList(copyList);
  };

  const renderItem = ({item, index}) => {
    const isLastIndex = index === showList.length - 1;
    return <FlattListItem item={item} pressItem={selectItem} isLastIndex={isLastIndex}/>
  };
  
  const confirmOnPress = () => {
    const selectedList = showList.filter(item => item.isChecked === true);
    confirm(selectedList);
    dispatch(closeDialog());
  };

  const close = () => dispatch(closeDialog());

  const onChangeText = value => {
    setInputValue(value);
    const copyList = deepCopy(selectList);
    const filterList = copyList.filter(factoryName => factoryName.label.includes(value));
    setShowList(filterList);
  };

  const clearInput = () => {
    inputValue.length && setInputValue('');
    const copyList = deepCopy(selectList);
    if(fieldValue.length){
      copyList.map(item => {
        if(item.value === fieldValue[0].value){
          item.isChecked = true;
        }else{
          item.isChecked = false;
        }
      });
    }
    setShowList(copyList);
  };

  return (
    <View style={{maxHeight: 900}}>
      <View style={{maxHeight: 780, marginHorizontal: 20, borderWidth: 1, borderColor: '#E3E3E3', marginBottom: 20, borderRadius: 12}}>
        {canSearch && <View style={{height: 60, borderBottomWidth: 1, borderColor: '#E3E3E3', paddingLeft: 20, flexDirection: 'row'}}>
          <TextInput 
            style={{flex: 1, fontSize: 26}}
            placeholder="请输入搜索内容"
            value={inputValue}
            onChangeText={onChangeText}
          />
          <TouchableOpacity style={{minWidth: 60, height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} onPress={clearInput}>
            <AntDesign
              style={{padding: 5}}
              size={!!inputValue.length ? 26 : 40}
              name={!!inputValue.length ? 'closecircle' : 'search1'}
              color={!!inputValue.length ? "#999999" : "#409EFF"}
            />
          </TouchableOpacity>
        </View>}
        <FlatList
          data={showList}
          renderItem={renderItem}
          getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
        />
      </View>
      <View style={{height: 100, flexDirection: 'row'}}>
        <View style={{flex: 1, borderTopWidth: 1, borderRightWidth: 1, borderColor: '#E3E3E3'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={close}>
            <Text style={{fontSize: 28, color: '#999999'}}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, borderTopWidth: 1, borderColor: '#E3E3E3'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={confirmOnPress}>
            <Text style={{fontSize: 28, color: '#409EFF'}}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  checkBox_containerStyle: {
    width: 40, height: 40
  }

})

export default SingleSelectList;