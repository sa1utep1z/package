//这个组件作用的位置为：【我的会员】-表单最后一项点击进入-【加入报名】-底部选项-【订单编号】；目前只在这里做了这种筛选互动；（at 2022/08/03）
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from '@react-navigation/native';

import { SUCCESS_CODE } from '../../../utils/const';
import SearchInput from '../../SearchInput';
import EmptyArea from '../../EmptyArea';
import { deepCopy, checkedType } from '../../../utils';
import NormalDialog from '../../NormalDialog';
import MemberDetail from '../../NormalDialog/MemberDetail';
import MyMembersApi from '../../../request/MyMembersApi';
import NAVIGATION_KEYS from '../../../navigator/key';

const SelectOrderId = ({
    field, 
    form, 
    title,
    labelAreaStyle,
    selectContainerStyle,
    selectAreaStyle,
    selectAreaTextStyle,
    ...rest
  }) => {
  const toast = useToast();
  const navigation = useNavigation();
  console.log('rest', rest);

  const dialogRef = useRef(null);

  const [dialogContent, setDialogContent] = useState({});
  const [companyList, setCompanyList] = useState([]);

  const itemName = () => {
    // if(bottomButton){
    //   return field.value.length && field.value.length !== 0 && field.value.map(item => item.title).join('、');
    // }
    // return list.find(item => item.id === field.value.id)?.title;
    return 'hahah'
  };

  const confirm = () => {
    const checkedList = list.filter(item => item.isChecked);
    setShowSelectItems(!showSelectItems);
    form.setFieldValue(field.name, checkedList);
    form.handleSubmit();
  };

  const getCompaniesList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if(res.data.length){
        res.data.forEach((item,index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
          list: res.data,
          pageTitle: '选择意向报名企业',
          confirm: (list) => {
            console.log('list', list);
            navigation.goBack();
          }
        })
      }
    }catch(err){
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  const touchItem = () => {
    console.log('dialogRef',dialogRef);
    dialogRef?.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '筛选',
      dialogComponent: (<View style={{marginHorizontal: 10}}>
        <TouchableOpacity style={{borderWidth: 1, height: 35, borderColor: '#CCCCCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 5}} onPress={getCompaniesList}>
          <Text style={{width: 100, textAlign: 'right'}}>意向报名企业：</Text>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{`请选择意向报名企业`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{borderWidth: 1, height: 35, borderColor: '#CCCCCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
          <Text style={{width: 100, textAlign: 'right'}}>订单日期：</Text>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{`请选择订单日期`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{borderWidth: 1, height: 35, borderColor: '#CCCCCC', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
          <Text style={{width: 100, textAlign: 'right'}}>订单名称：</Text>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{`请选择订单名称`}</Text>
          </View>
        </TouchableOpacity>
      </View>)
    });
  }

  return (
    <View style={[styles.selectItemArea]}>
      <View style={[styles.labelArea]}>
        <Text style={styles.label}>{title}</Text>
      </View>
      <View style={styles.rightArea}>
        <TouchableOpacity 
          style={[styles.selectArea]}
          onPress={touchItem}>
          <Text
            style={[styles.selectText, selectAreaTextStyle]} 
            ellipsizeMode="tail" 
            numberOfLines={1}>
            {itemName() || placeholder || `请选择${title}`}
          </Text>
          <AntDesign
            name={dialogRef?.current?.showDialog ? 'up' : 'down'}
            size={20}
            color={'black'}
          />
        </TouchableOpacity>
      </View>
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 10
  },
  showLittleTitleText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 10
  },
  selectArea: {
    flex: 1,
    height: 48, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  selectText: {
    color: 'black',
    fontSize: 15
  },
  dialogTitle: {
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold'
  },
  labelArea: {
    width: 100,
    height: '100%',
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: 'center'
  },
  labelArea_noLittle: {
    marginRight: 10
  },
  label: {
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

export default SelectOrderId;