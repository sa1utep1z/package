import React, {useState, useEffect, useMemo, useCallback} from "react";
import { FlatList, TextInput, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import Foundation from 'react-native-vector-icons/Foundation';

import { deepCopy } from "../../../utils";
import { closeDialog } from "../../../redux/features/PageDialog";

const FlattListItem = ({item, pressItem, isLastIndex}) => {
  const onChange = useCallback(() => pressItem(item),[item]);

  return useMemo(()=>(
    <TouchableOpacity style={[styles.itemArea, isLastIndex && {borderBottomWidth: 0}]} onPress={onChange}>
      <Text style={styles.labelArea}>{item.label}</Text>
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
  emptyText = '',
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
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        {canSearch && <View style={styles.searchArea}>
          <TextInput 
            style={{flex: 1, fontSize: 26}}
            placeholder="请输入搜索内容"
            value={inputValue}
            onChangeText={onChangeText}
          />
          <TouchableOpacity style={styles.clearIcon} onPress={clearInput}>
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
          ListEmptyComponent={<View style={{height: 200, alignItems: 'center', justifyContent: 'center'}}>
            <Foundation name="page-remove" size={72} color="#999999" />
            <Text style={styles.emptyText}>{emptyText || '暂无数据'}</Text>
          </View>}
        />
      </View>
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
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    maxHeight: 900
  },
  topArea: {
    maxHeight: 780, 
    borderWidth: 1, 
    borderColor: '#E3E3E3', 
    borderRadius: 12,
    marginHorizontal: 20, 
    marginBottom: 20
  },
  searchArea: {
    height: 60, 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3', 
    paddingLeft: 20, 
    flexDirection: 'row'
  },
  clearIcon: {
    height: 60,
    minWidth: 60, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center'
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
  itemArea: {
    height: 60, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20
  },
  labelArea: {
    fontSize: 26, 
    color: '#333333'
  },
  emptyText: {
    fontSize: 24, 
    color: '#999999', 
    marginTop: 2
  },
})

export default SingleSelectList;