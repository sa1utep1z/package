import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from 'react-redux';
import { Formik, Field } from 'formik';

import { closeDialog } from "../../../../../../redux/features/PageDialog";
import { DORMITORY_LEAVE_REASON } from "../../../../../../utils/const";
import SelectTimeOfFilterMore from '../../../../../../components/HeaderSearchOfDormitory/FilterMore/SelectTimeOfFilterMore';

let restForm;
const initialValues = {
  stayDate: '',
  leaveDate: ''
};

const OperateDialog = ({
  selectIndex,
  confirm
}) => {
  const dispatch = useDispatch();

  const [selectReason, setSelectReason] = useState('');

  const onSubmit = values => {
    if(selectIndex === 1){
      confirm(values.stayDate);
    }else{
      confirm(values.leaveDate, selectReason);
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => restForm.submitForm();

  const reasonOnPress = (reason) => setSelectReason(reason);

  return (
    <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}>
    {({...rest}) => {
      restForm = rest;
      return (
        <>
          {selectIndex === 1 ?<View style={styles.topArea}>
            <View style={{height: 60, marginBottom: 30}}>
              <Field
                name="stayDate"
                label="入住日期"
                component={SelectTimeOfFilterMore}
              />
            </View>
          </View> : <>
            <View style={{height: 55, paddingHorizontal: 20, marginTop: 10}}>
              <Field
                name="leaveDate"
                label="退宿日期"
                fontSize={26}
                canDelete={false}
                borderColor='#999999'
                component={SelectTimeOfFilterMore}
              />
            </View>
            <View style={{height: 200, margin: 20}}>
              <Text style={{fontSize: 26, color: '#333333', marginBottom: 10}}>退宿原因：</Text>
              <View style={{flex: 1, borderWidth: 1, borderColor: '#999999', borderRadius: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 20}}>
                {DORMITORY_LEAVE_REASON.map((reason, reasonIndex) => {
                  const isSelected = selectReason === reason.value;
                  return (
                    <TouchableOpacity key={reasonIndex} style={[{borderRadius: 6, backgroundColor: '#EFEFEF', paddingHorizontal: 15, paddingVertical: 5, marginRight: 20, marginBottom: 20}, isSelected && {backgroundColor: '#409EFF'}]} onPress={() => reasonOnPress(reason.value)}>
                      <Text style={[{fontSize: 26, color: '#999999'}, isSelected && {color: '#ffffff'}]}>{reason.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </>}
          <View style={styles.bottomArea}>
            <View style={styles.leftArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
                <Text style={styles.closeText}>取消</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightArea}>
              <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
                <Text style={styles.confirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  topArea: {
    flex: 1, 
    paddingHorizontal: 30
  },
  typeArea: {
    height: 60, 
    marginBottom: 20, 
    flexDirection: 'row'
  },
  typeArea_title: {
    minWidth: 140, 
    fontSize: 28, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  typeArea_radio: {
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 6, 
    borderColor: '#999999', 
    flexDirection: 'row'
  },
  leftRadio: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 10
  },
  rightRadio: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  radioText: {
    fontSize: 26, 
    color: '#000', 
    textAlignVertical: 'center'
  },
  dormitoryArea: {
    width: '100%', 
    marginBottom: 30
  },
  dormitoryArea_topArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  dormitoryArea_topAreaText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  dormitoryArea_bottomArea: {
    flex: 1, 
    padding: 10
  },
  listItem: {
    height: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  lastItem: {
    height: 50, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  leftTitle: {
    width: 150, 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF'
  },
  titleText: {
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold'
  },
  rightText: {
    fontSize: 24, 
    paddingLeft: 20, 
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
    fontSize: 28
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
})

export default OperateDialog;