import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

import { openDialog, setTitle } from '../../../redux/features/PageDialog'; 
import SingleSelectList from '../../PageDialog/SingleSelectList';
import MyMembersApi from "../../../request/MyMembersApi";
import { SUCCESS_CODE } from '../../../utils/const';

/**单选*/
const SingleSelect = ({
  field, 
  form, 
  label,
  selectList = [], //单选列表自选
  type = '', //单选表单组件：提供几个基础模式：企业，门店，不需要模式也可以在外部传入selectList。
  showLabel = true,
  labelStyle,
  ...rest
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);

  const confirm = (list) => {
    form.setFieldValue(field.name, list);
  };
  const selectOnPress = () => {
    setLoading(true);
    dispatch(setTitle(`请选择${label}`));
    switch(type){
      case 'store':
        getStoreList();
        break;
      case 'factory':
        getFactoryList();
        break;
      default: //没传入type则自动使用外部传进的selectList。
        setLoading(false);
        dispatch(openDialog(<SingleSelectList selectList={selectList} fieldValue={field.value} confirm={confirm}/>));
        break;
    }
  };

  const getStoreList = async() => {
    try {
      const res = await MyMembersApi.StoreList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取门店列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      res.data.map(item => {
        item.label = item.storeName;
        item.value = item.storeId;
      });
      dispatch(openDialog(<SingleSelectList selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    } catch (error) {
      console.log('getStoreList -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  };

  const getFactoryList = async() => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      dispatch(openDialog(<SingleSelectList selectList={res.data} fieldValue={field.value} confirm={confirm}/>));
    } catch (error) {
      console.log('getFactoryList -> error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setLoading(false);
    }
  };

  return (
    <View style={[{flex: 1}, styles.selectArea, form.errors[field.name] && form.touched[field.name] && {marginBottom: 10}]}>
      <View style={styles.container}>
        {showLabel ? <Text style={[styles.labelText, labelStyle]}>{label}：</Text> : <></>}
        <View style={{flex: 1}}>
          <TouchableOpacity style={[styles.inputContainer, form.errors[field.name] && form.touched[field.name] && styles.errorBorder]} onPress={selectOnPress}>
            {field.value && <>
              <Text numberOfLines={1} style={[styles.itemText, !field.value.length && styles.itemText_none]}>
                {!!field.value.length ? field.value[0].label : `请选择${label}`}
              </Text>
            </>}
            {loading ? <ActivityIndicator color="#409EFF" size={28} /> : <AntDesign
              name='down'
              size={36}
              color={!!field?.value?.length ? '#000000' : '#999999'}
            />}
          </TouchableOpacity>
          <ErrorMessage
            name={field.name}
            style={styles.errorMessage}
            component={Text}
        />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  itemText: {
    fontSize: 26,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 19
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default SingleSelect;