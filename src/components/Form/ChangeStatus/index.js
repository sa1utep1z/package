import React, { useState, useMemo, useEffect, useRef } from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import {ErrorMessage} from 'formik';

import SearchInput from '../../SearchInput';
import EmptyArea from '../../EmptyArea';
import { deepCopy, checkedType } from '../../../utils';
import NormalDialog from '../../NormalDialog';
import NewestStatus from '../../NormalDialog/NewestStatus';
import { MEMBERS_STATUS } from '../../../utils/const';

const ChangeStatus = ({
    field, 
    form, 
    title,
    placeholder,
    labelAreaStyle,
    selectAreaTextStyle,
    fieldList,
    ...rest
  }) => {
  const toast = useToast();
  const dialogRef = useRef(null);

  const [showSelectItems, setShowSelectItems] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  const changeStatusFunc = (flowId, params) => {
    form.setFieldValue('status', params.status);
    if(params.date){
      switch(params.status){
        case "ON_BOARDING_PASS":
          form.setFieldValue('jobDate', params.date);
          form.setFieldValue('resignDate', '');
          break;
        case "JOB_RESIGN":
          form.setFieldValue('resignDate', params.date);
          form.setFieldValue('jobDate', '');
          break;          
      }
    }
    dialogRef?.current.setShowDialog(false);
  };

  const changeStatus = () => {
    dialogRef?.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '状态修改',
      bottomButton: false,
      dialogComponent: <NewestStatus message={fieldList} dialog={dialogRef} confirmOnPress={changeStatusFunc}/>
    });
  };

  return (
    <>
      <View style={[styles.selectItemArea]}>
        <View style={[styles.labelArea, labelAreaStyle]}>
          <Text style={styles.label}>{title}：</Text>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity 
            style={[styles.selectArea]}
            onPress={changeStatus}>
            <Text
              style={[styles.selectText, selectAreaTextStyle]} 
              ellipsizeMode="tail" 
              numberOfLines={1}>
              {MEMBERS_STATUS[field.value] || placeholder || `请选择${title}`}
            </Text>
            <AntDesign
              name={showSelectItems ? 'up' : 'down'}
              size={30}
              color={'#E3E3E3'}
            />
          </TouchableOpacity>
          <ErrorMessage
            name={field.name}
            component={Text}
            style={{color: 'red', position: 'absolute', bottom: 0}}
          />
        </View>
      </View>
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </>
  )
};

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center',
    height: 91,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    paddingLeft: 28
  },
  rightArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    height: '100%'
  },
  selectArea: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 20,
    height: '100%'
  },
  selectText: {
    color: 'black',
    fontSize: 32
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
  }
})

export default ChangeStatus;