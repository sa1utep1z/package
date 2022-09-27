import React, {useState} from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

/**状态审核弹框 */
const StatusAudit = ({ 
  memberInfo,
  audit
}) => {

  const [pickerShow, setPickerShow] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  const dateChange = (event, selectedDate) => {
    setPickerShow(false);
    if (event.type !== 'set') return;
    setDateTime(selectedDate);
  };

  return (
    <>
      <ScrollView style={styles.msgArea}>
        <View style={styles.lineItem}>
          <Text style={styles.font}>会员姓名：</Text>
          <Text selectable style={styles.font}>{memberInfo.userName}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>会员手机号：</Text>
          <Text selectable style={styles.font}>{memberInfo.mobile}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>会员身份证号：</Text>
          <Text selectable style={styles.font}>{memberInfo.idNo}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>所在企业：</Text>
          <Text selectable style={styles.font}>{memberInfo.companyShortName}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>订单名称：</Text>
          <Text selectable style={styles.font}>{memberInfo.orderName}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>入职日期：</Text>
          <Text selectable style={styles.font}>{moment(memberInfo.jobDate).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>预离职日期：</Text>
          <Text selectable style={styles.font}>{moment(memberInfo.expectResignDate).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.font}>确认离职日期：</Text>
          <View style={{height: 30}}>
            <TouchableOpacity style={styles.btnArea} onPress={()=>setPickerShow(true)}>
              <AntDesign
                name='calendar' 
                size={15}
                color='#999999'
              />
              <Text style={{marginLeft: 10}}>{moment(dateTime).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>离职原因：</Text>
          <View style={styles.reasonArea}>
            {memberInfo.resignReasons.map((reason, reasonIndex) => {
              return (
                <Text style={styles.reasonTag} key={reasonIndex}>{reason}</Text>
              )
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomButtonArea}>
        <TouchableOpacity style={styles.bottomLeft} onPress={() => audit('reject', memberInfo, moment(dateTime).format('YYYY-MM-DD'))}>
          <Text style={styles.leftText}>拒绝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomRight} onPress={() => audit('pass', memberInfo, moment(dateTime).format('YYYY-MM-DD'))}>
          <Text style={styles.rightText}>通过</Text>
        </TouchableOpacity>
      </View>
      {pickerShow && <DateTimePicker 
        value={dateTime} 
        onChange={dateChange} 
        maximumDate={new Date()}
      />}
    </>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    paddingHorizontal: 20
  },
  lineItem: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  font: {
    color: '#333333'
  },
  reasonArea: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingTop: 2
  },
  reasonTag: {
    borderWidth: 1, 
    borderColor: '#409EFF', 
    borderRadius: 4, 
    fontSize: 12, 
    paddingHorizontal: 4, 
    backgroundColor: '#F4F9FF', 
    color: '#409EFF', 
    marginRight: 4, 
    marginBottom: 4, 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  bottomButtonArea: {
    flexDirection: 'row',
    height: 45,
    marginTop: 10
  },
  bottomLeft: {
    flex: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderColor: '#E3E3E3'
  },
  leftText: {
    fontSize: 16,
    color: 'red'
  },
  bottomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    borderBottomRightRadius: 6
  },
  rightText: {
    fontSize: 16,
    color: 'green'
  },
  btnArea: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    borderRadius: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10
  }
})

export default StatusAudit;