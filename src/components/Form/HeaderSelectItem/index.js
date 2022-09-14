import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ErrorMessage} from 'formik';

import SearchInput from '../../SearchInput';
import EmptyArea from '../../EmptyArea';
import { deepCopy } from '../../../utils';

const FlattListItem = ({item, pressItem, isChecked, isLastIndex, selectedItemList}) => {
  return useMemo(()=>(
    <TouchableOpacity 
      style={[styles.scrollItem, isLastIndex && {borderBottomWidth: 0}]} 
      onPress={() => pressItem(item)}>
      <Text>{item.title}</Text>
      <CheckBox
        center
        checked={isChecked}
        onPress={() => pressItem(item)}
        containerStyle={styles.checkBox_containerStyle}
        checkedIcon={<Text style={[styles.checkBox_icon, !isChecked && styles.falseColor]}>{'\ue669'}</Text>}
        uncheckedIcon={<Text style={[styles.checkBox_icon, !isChecked && styles.falseColor]}>{'\ue68d'}</Text>}
      />
    </TouchableOpacity>
  ),[item.isChecked])
};

const HeaderSelectItem = ({
    field, 
    form, 
    originList,
    title,
    placeholder,
    singleSelect = false, //是否单选
    lastButton, //外部表单后部是否要增加按钮
    ...rest
  }) => {
  const [list, setList] = useState([]);
  const [showSelectItems, setShowSelectItems] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(()=>{
    setList(originList);
    if(field.value.length){
      setSelectedItemList(field.value);
    }
  },[showSelectItems])

  useMemo(() => console.log('selectedItemList', selectedItemList), [selectedItemList])

  const pressItem = (item) => {
    // 单选
    if(singleSelect){
      const newList = [item];
      setSelectedItemList(newList);
      return;
    }

    //多选
    const copyList = [...list];  
    const findOutItem = copyList.find((list) => list.value === item.value);
    findOutItem.isChecked = !item.isChecked;
    setList(copyList);

    const copySelectList = [...selectedItemList];
    const findIndex = copySelectList.findIndex(data => data.id === item.id);
    console.log('findIndex', findIndex);
    // if(findIndex !== -1){
    //   copySelectList.splice(findIndex, 1);
    //   setSelectedItemList(copySelectList);
    //   return;
    // }
    copySelectList.push(item);
    console.log('copySelectList', copySelectList);
    setSelectedItemList(copySelectList);
  };

  const textContent = () => {
    if(field.value.length){
      return field.value.map(item => item.title).join('、');
    }else if (placeholder){
      return placeholder;
    }else{
      return `请选择${title}`;
    }
  };

  const onChanging = value => {
    if(!list.length) return;
    let newArr = originList?.length && originList.filter(item => item.title.includes(value));
    setList(newArr);
  };

  const confirm = () => {
    setShowSelectItems(!showSelectItems);
    if(field.name === 'store'){
      if(form.values.staff.length){
        form.setFieldValue('staff', []);
      }
    }
    form.setFieldValue(field.name, selectedItemList);
    form.handleSubmit();  
  };

  const clearFieldValue = () => {
    if(field.name === 'store'){
      form.setFieldValue('staff', []);
    }
    form.setFieldValue(field.name, []);
    form.handleSubmit();
  };

  const touchItem = () => setShowSelectItems(!showSelectItems);

  return (
    <>
      <View style={[styles.selectItemArea]}>
        <Text style={styles.showLittleTitleText}>{title}：</Text>
        <View style={styles.rightArea}>
          <TouchableOpacity 
            style={styles.selectArea}
            onPress={touchItem}>
            <Text
              style={[styles.selectText, !field.value.length && styles.noItem]} 
              ellipsizeMode="tail" 
              numberOfLines={1}>
              {textContent()}
            </Text>
            {!field.value.length && 
              <AntDesign
                name={showSelectItems ? 'up' : 'down'}
                size={30}
                style={{paddingHorizontal: 10}}
                color={!!field.value.length ? 'black' : '#E3E3E3'}
              />}
          </TouchableOpacity>
          {!!field.value.length && 
            <TouchableOpacity onPress={clearFieldValue} style={{height: '100%', paddingHorizontal: 10, justifyContent: 'center'}}>
              <AntDesign
                name='closecircle' 
                size={30}
                color='#999999'
              />
            </TouchableOpacity>}
        </View>
        {lastButton}
      </View>
      <ErrorMessage
        name={field.name}
        component={Text}
        style={{color: 'red', fontSize: 22, textAlign: 'center'}}
      />
        
      <Dialog
        animationType="fade"
        isVisible={showSelectItems}
        overlayStyle={styles.overlayStyle}
        onBackdropPress={()=> setShowSelectItems(!showSelectItems)}>
          <View style={styles.dialogTitleArea}>
            <Text style={styles.dialogTitle}>请选择{title}</Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
            <SearchInput
              borderRadius = {8}
              placeholder={`请输入${title}名称`}
              smallSize
              allowFontScaling={false}
              withoutButton
              keyboardType='default'
              onChange={onChanging}
              fontStyle={{fontSize: 14}}
              searchInputStyle={styles.searchInputStyle}
            />
            {list.length ? 
              <FlatList 
                data={list}
                style={styles.scrollArea}
                renderItem={({item, index})=>{
                  const isChecked = item.isChecked === true;
                  const isLastIndex = index === list.length - 1;
                  return <FlattListItem item={item} pressItem={pressItem} isChecked={isChecked} isLastIndex={isLastIndex} selectedItemList={selectedItemList} />
                }}
                ListEmptyComponent={<ActivityIndicator size={36} />}
                keyboardShouldPersistTaps="handled"
                keyExtractor={item => item.id}
                getItemLayout={(data, index)=>({length: 35, offset: 35 * index, index})}
                initialNumToRender={15}
              /> : <EmptyArea withSearch />
            }
          </View>
          <View style={styles.bottomButtonArea}>
            <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowSelectItems(!showSelectItems)}>
              <Text style={styles.leftText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomRight} onPress={confirm}>
              <Text style={styles.rightText}>确认</Text>
            </TouchableOpacity>
          </View>
      </Dialog>
    </>
  )
}

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center',
    height: 60
  },
  pageFieldStyle: {
    paddingHorizontal: 28, 
    height: 91, 
    borderBottomWidth: 2, 
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  showLittleTitleText: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10
  },
  selectArea: {
    flex: 1,
    height: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 0
  },
  selectArea_noLittle: {
    paddingRight: 10
  },
  selectText: {
    flex: 1,
    color: 'black',
    fontSize: 28,
    paddingLeft: 20
  },
  noItem: {
    color: '#999999'
  },
  overlayStyle: {
    padding: 0, 
    paddingTop: 20, 
    borderRadius: 6
  },
  dialogTitleArea: {
    marginBottom: 10
  },
  dialogTitle: {
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold'
  },
  selectAll: {
    position: 'absolute', 
    right: 20
  },
  selectAll_text: {
    color: '#409EFF'
  },
  searchInputStyle: {
    height: 35, 
    marginBottom: 0, 
    paddingHorizontal: 0, 
    borderWidth: 1, 
    borderColor: '#E3E3E3', 
    borderTopRightRadius: 8, 
    borderTopLeftRadius: 8, 
    borderBottomWidth: 0
  },
  scrollArea: {
    borderWidth: 1, 
    borderColor: '#E3E3E3', 
    maxHeight: 300,
    borderRadius: 8,
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 0
  },
  scrollItem: {
    minHeight: 35, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3'
  },
  checkBox_containerStyle: {
    height: 20,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: 5,
    borderWidth: 1
  },
  checkBox_icon: {
    fontFamily: "iconfont", 
    color: '#409EFF', 
    fontSize: 20
  },
  falseColor: {
    color: '#DDDDDD'
  },

  bottomButtonArea: {
    flexDirection: 'row', 
    height: 45
  },
  bottomLeft: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 6, 
    borderTopWidth: 1,
    borderRightWidth: 1,
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
    borderBottomRightRadius: 6,
    borderTopWidth: 1,
    borderColor: '#E3E3E3'
  },
  rightText: {
    fontSize: 16, 
    color: '#409EFF'
  },
  labelArea: {
    height: '100%',
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'center'
  },
  label: {
    textAlign: 'center',
    fontSize: 32
  },
  required: {
    color: 'red', 
    textAlign: 'center', 
    textAlignVertical: 'top', 
    alignSelf: 'flex-start', 
    marginTop: 7
  },
})

export default HeaderSelectItem;