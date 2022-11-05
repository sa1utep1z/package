import React, {useState, useEffect, useMemo, useCallback} from "react";
import { FlatList, TextInput, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';

import { deepCopy } from "../../../utils";
import { closeDialog } from "../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../redux/features/PageDialog2";

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
  canSearch = true, //是否可以搜索（default: true）；
  isDialog2 = false, //判定是不是二层弹窗，如果是，则没有底部按钮； 
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
    }else{
      copyList.map(item => item.isChecked = false);
    }
    setShowList(copyList);
  }, [fieldValue])

  const selectItem = (item) => {
    if(isDialog2){
      confirm(item);
      dispatch(PageDialog2.closeDialog());
      return;
    }
    if(inputValue.length){
      const copyList = deepCopy(selectList);
      const filterList = copyList.filter(list => list.label.includes(inputValue));
      const findOutItem = filterList.find(list => list.value === item.value);
      findOutItem.isChecked = !item.isChecked;
      setShowList(filterList);
      return;
    }
    const copyList = deepCopy(selectList);
    const findOutItem = copyList.find(list => list.value === item.value);
    findOutItem.isChecked = !item.isChecked;
    setShowList(copyList);
  };

  const renderItem = ({item, index}) => {
    const isLastIndex = index === showList.length - 1;
    return <FlattListItem item={item} pressItem={selectItem} isLastIndex={isLastIndex}/>
  };

  const onChangeText = value => {
    setInputValue(value);
    const copyList = deepCopy(selectList);
    const filterList = copyList.filter(factoryName => factoryName.label.includes(value));
    setShowList(filterList);
  };

  const clearInput = () => {
    inputValue.length && setInputValue('');
    const copyList = deepCopy(selectList);
    const filterSelectedList = showList.filter(item => !!item.isChecked);
    if(filterSelectedList.length){
      copyList.map(item => {
        if(item.value === filterSelectedList[0].value){
          item.isChecked = true;
        }else{
          item.isChecked = false;
        }
      });
      setShowList(copyList);
      return;
    }
    
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

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => {
    dispatch(closeDialog());
    const filterSelectedList = showList.filter(item => !!item.isChecked);
    confirm(filterSelectedList);
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
          style={{flex: 1}}
          renderItem={renderItem}
          getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}
        />
      </View>
      {!isDialog2 && <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>提交</Text>
          </TouchableOpacity>
        </View>
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 900
  },
  topArea: {
    flex: 1,
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

export default SingleSelectList;