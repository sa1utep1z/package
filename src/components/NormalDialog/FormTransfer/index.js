import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '@rneui/themed';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import UserSelect from '../../../pages/WorkBench/OtherFunction/ComplaintManage/UserSelect'
import ComplaintApi from "../../../request/ComplaintApi";
import EmptyArea from '../../EmptyArea';
import { WATERMARK_LIST_SMALL, SUCCESS_CODE } from '../../../utils/const';

const FormTransfer = ({
  message,
  // userList
}) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);
  const [userList, setUserList] = useState([]); // 用户名数据
  const initialValues = {
    transferUserId: [],
  };
  // 获取用户数据
  const getUserList = async () => {
    try {
      const res = await ComplaintApi.GetUserList();
      console.log('用户名数据：', res)
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取用户数据失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setUserList(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    getUserList();
  }, [])

  const onSubmit = (values) => {
    console.log('打印选择的处理人：', values);
  };

  return (
    <View style={styles.msgArea}>
      <Formik
        initialValues={initialValues}
        handleChange={(e) => console.log('e', e)}
        onSubmit={onSubmit}>
        {({ handleSubmit, ...rest }) => {
          restForm = rest;
          return (
            <View style={{ flex: 1 }}>
              <Field
                name='transferUserId'
                title="处理人"
                label="处理人"
                selectList={userList}
                inputStyle={{ width: 300 }}
                component={UserSelect}
              />
            </View>
          )
        }}
      </Formik>
    </View>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 400
  },
  itemDateArea: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemDate: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  message: {
    paddingHorizontal: 8
  }
})

export default FormTransfer;