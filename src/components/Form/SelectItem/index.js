import React, { useState } from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';

import SearchInput from '../../SearchInput';
import EmptyArea from '../../EmptyArea';
import { deepCopy, checkedType } from '../../../utils';

const SelectItem = ({
    field, 
    form, 
    canSearch, 
    bottomButton, //有底部按钮意味支持多选
    selectList,
    showLittleTitle, //这是名单模块中顶部筛选栏的label样式开关
    formalLabel = true, //一般表单label默认显示，除非有意关掉
    lastButton, //selectItem一行是否添加元素
    title,
    placeholder,
    noBorder,
    selectContainerStyle,
    selectAreaStyle,
    selectAreaTextStyle,
    ...rest
  }) => {
  const [showSelectItems, setShowSelectItems] = useState(false);
  const [list, setList] = useState(selectList);
  const [selectedItemList, setSelectedItemList] = useState([]);

  const pressItem = (item) => {
    // 单选
    if(!bottomButton){
      setShowSelectItems(!showSelectItems);
      form.setFieldValue(field.name, item);
      form.handleSubmit();
      return;
    }

    //多选（控制列表视图的展示）
    const newArr = deepCopy(list);
    newArr.map(data => {
      if(data.id === item.id){
        data.isChecked = !data.isChecked;
      }
    });
    setList(newArr);

    //多选（多选增加的数据push进数组中，用来显示取消全选按钮）
    const findIndex = selectedItemList.findIndex(data => data.id === item.id);
    if(findIndex !== -1){
      selectedItemList.splice(findIndex, 1);
      setSelectedItemList(selectedItemList);
      return;
    }
    selectedItemList.push(item);
    setSelectedItemList(selectedItemList);
  };

  const itemName = () => {
    if(bottomButton){
      return field.value.length && field.value.length !== 0 && field.value.map(item => item.title).join('、');
    }
    return list.find(item => item.id === field.value.id)?.title;
  };

  const checkFieldValueType = () => {
    const type = checkedType(itemName());
    switch (type){
      case 'String': 
        return false;
      case 'Undefined':
        return true;
      case 'Object': 
        return true;
      default:
        return true;
    }
  };

  const onChanging = value => {
    let newArr = selectList?.length && selectList.filter(item => item.title.includes(value));
    setList(newArr);
  };

  const confirm = () => {
    const checkedList = list.filter(item => item.isChecked);
    setShowSelectItems(!showSelectItems);
    form.setFieldValue(field.name, checkedList);
    form.handleSubmit();
  };

  const clearSelected = () => {
    // setSelectedItemList([]);
    const newArr = deepCopy(list);
    if(newArr.find(item => item.isChecked)){
      newArr.map(item => item.isChecked = false);
    }else{ 
      newArr.map(item => item.isChecked = true);
    }
    setList(newArr);
  };

  return (
    <View style={[styles.selectItemArea, !showLittleTitle && styles.noLittleTitle, selectContainerStyle]}>
      {showLittleTitle && 
        <Text style={styles.showLittleTitleText}>{title}：</Text>
      }
      {formalLabel && 
        <View style={[styles.labelArea, !showLittleTitle && styles.labelArea_noLittle]}>
          <Text style={styles.label}>{title}</Text>
          {rest.isRequired && <Text style={styles.required}>*</Text>}
        </View>
      }
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity 
          style={[styles.selectArea, !showLittleTitle && styles.selectArea_noLittle, noBorder && styles.noBorder, selectAreaStyle]}
          onPress={() => setShowSelectItems(!showSelectItems)}>
          <Text
            style={[styles.selectText, checkFieldValueType() && styles.noItem, selectAreaTextStyle]} 
            ellipsizeMode="tail" 
            numberOfLines={1}>
            {itemName() || placeholder || `请选择${title}`}
          </Text>
          <AntDesign
            name={showSelectItems ? 'up' : 'down'}
            size={20}
            color={!checkFieldValueType() ? 'black' : '#E3E3E3'}
          />
        </TouchableOpacity>
        {lastButton}
      </View>

      <Dialog
        isVisible={showSelectItems}
        overlayStyle={styles.overlayStyle}
        onBackdropPress={()=> setShowSelectItems(!showSelectItems)}>
          <View style={styles.dialogTitleArea}>
            <Text style={styles.dialogTitle}>请选择{title}</Text>
            <TouchableOpacity style={styles.selectAll} onPress={clearSelected}>
              <Text style={styles.selectAll_text}>全选</Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 10}}>
            {canSearch && <SearchInput
              borderRadius = {8}
              placeholder='请输入企业名称'
              smallSize
              // autoFocus
              withoutButton
              keyboardType='default'
              onChange={onChanging}
              fontStyle={{fontSize: 14}}
              searchInputStyle={styles.searchInputStyle}
            />}
            {list.length ? 
              <View style={{borderBottomWidth: 1, borderColor: '#E3E3E3', marginBottom: 10}}>
                <ScrollView style={[
                  styles.scrollArea, 
                  canSearch && styles.canSearchWithScrollView,
                  bottomButton && styles.bottomButtonWithScrollView
                ]}>
                  {
                    list.map((item, index) => {
                      const isLastIndex = index === list.length - 1;
                      const checkedItem = item.isChecked;
                      return (
                        <TouchableOpacity 
                          key={item.id} 
                          style={[styles.scrollItem, isLastIndex && styles.noBorder]} 
                          onPress={() => pressItem(item)}>
                          <Text>{item.title}</Text>
                          <CheckBox
                            center
                            checked={checkedItem}
                            onPress={() => pressItem(item)}
                            containerStyle={styles.checkBox_containerStyle}
                            checkedIcon={<Text style={[styles.checkBox_icon, !checkedItem && styles.falseColor]}>{'\ue669'}</Text>}
                            uncheckedIcon={<Text style={[styles.checkBox_icon, !checkedItem && styles.falseColor]}>{'\ue68d'}</Text>}
                          />
                        </TouchableOpacity>
                    )})
                  }
                </ScrollView>
              </View> : <EmptyArea withSearch />
            }
          </View>
          {bottomButton && <View style={styles.bottomButtonArea}>
            <TouchableOpacity style={styles.bottomLeft} onPress={() => setShowSelectItems(!showSelectItems)}>
              <Text style={styles.leftText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomRight} onPress={() => confirm()}>
              <Text style={styles.rightText}>确认</Text>
            </TouchableOpacity>
          </View>}
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  showLittleTitleText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  noLittleTitle: {
    borderBottomWidth: 1,
    borderColor: '#E3E3E3', 
    paddingLeft: 10
  },
  selectArea: {
    flex: 1,
    height: 48, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 15
  },
  selectArea_noLittle: {
    paddingLeft: 0, 
    paddingRight: 15
  },
  noBorder: {
    borderBottomWidth: 0
  },
  selectText: {
    color: 'black',
    fontSize: 15
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
    borderRadius: 8, 
    maxHeight: 300
  },
  scrollItem: {
    height: 35, 
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
  canSearchWithScrollView: {
    borderTopLeftRadius: 0, 
    borderTopRightRadius: 0
  },
  bottomButtonWithScrollView: {
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0, 
    borderBottomWidth: 0
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
    backgroundColor: '#409EFF', 
    borderBottomRightRadius: 6,
    borderTopWidth: 1,
    borderColor: '#E3E3E3'
  },
  rightText: {
    fontSize: 16, 
    color: '#fff'
  },
  labelArea: {
    width: 80,
    height: '100%',
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'center'
  },
  labelArea_noLittle: {
    marginRight: 20
  },
  label: {
    fontWeight: 'bold', 
    fontSize: 16, 
    maxWidth: 70, 
    textAlign: 'center'
  },
  required: {
    color: 'red', 
    textAlign: 'center', 
    textAlignVertical: 'top', 
    alignSelf: 'flex-start', 
    marginTop: 7
  },
})

export default SelectItem;