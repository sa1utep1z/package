import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';

/**状态审核弹框 */
const StatusAudit = ({ 
  memberInfo,
  audit
}) => {

  return (
    <>
      <ScrollView style={styles.msgArea}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>会员姓名：</Text>
          <Text selectable style={styles.font}>{memberInfo.userName}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>会员手机号：</Text>
          <Text selectable style={styles.font}>{memberInfo.mobile}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>会员身份证号：</Text>
          <Text selectable style={styles.font}>{memberInfo.idNo}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>所在企业：</Text>
          <Text selectable style={styles.font}>{memberInfo.companyShortName}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>订单名称：</Text>
          <Text selectable style={styles.font}>{memberInfo.orderName}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>入职日期：</Text>
          <Text selectable style={styles.font}>{moment(memberInfo.jobDate).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.font}>预离职日期：</Text>
          <Text selectable style={styles.font}>{moment(memberInfo.expectResignDate).format('YYYY-MM-DD')}</Text>
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
        <TouchableOpacity style={styles.bottomLeft} onPress={() => audit('reject', memberInfo)}>
          <Text style={styles.leftText}>拒绝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomRight} onPress={() => audit('pass', memberInfo)}>
          <Text style={styles.rightText}>通过</Text>
        </TouchableOpacity>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    paddingHorizontal: 20
  },
  font: {
    color: '#333333', 
    marginBottom: 10
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
  }
})

export default StatusAudit;