import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Dialog, Input } from '@rneui/themed';
import { useToast } from 'react-native-toast-notifications';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

const SignUpDate = ({
  field,
  form,
  labelAreaStyle,
  labelStyle,
  onPress,
  startDate,
  endDate,
  currentTime,
  ...rest
}) => {

  var now = new Date();
  var nowTime = now.getTime();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;//js从0开始取
  var date = now.getDate();
  var deadlineStr = year + "/" + month + "/" + date + " " + "16:00:00";
  var deadline = Date.parse(deadlineStr);
  const today = moment(now).format('YYYY-MM-DD');
  // 当前日期加一
  var dateTime1 = new Date();
  dateTime1 = dateTime1.setDate(dateTime1.getDate() + 1);
  dateTime1 = new Date(dateTime1);
  // 当前日期加2
  var dateTime2 = new Date();
  dateTime2 = dateTime2.setDate(dateTime2.getDate() + 2);
  dateTime2 = new Date(dateTime2);

  const toast = useToast();
  // const invalidVal = (nowTime > deadline) ? dateTime1 : new Date();
  const [dateTime, setDateTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const dateChange = (event, selectedDate) => {
    setModalVisible(false);
    if (event.type !== "set") return;
    setDateTime(selectedDate);
    form.setFieldValue(field.name, selectedDate);
  };

  // useEffect(() => {
  //   if (nowTime > deadline) {
  //     form.setFieldValue(field.name, dateTime1);
  //   }
  // }, [])
  useEffect(() => {
    if (today === currentTime) {
      if (nowTime > deadline) {
        form.setFieldValue(field.name, dateTime1);
        setDateTime(dateTime1);
      } else {
        form.setFieldValue(field.name, new Date());
        setDateTime(new Date());
      }
    } else {
      if (nowTime > deadline) {
        form.setFieldValue(field.name, dateTime2);
        setDateTime(dateTime2);
      } else {
        form.setFieldValue(field.name, dateTime1);
        setDateTime(dateTime1);
        console.log('打印日志：',dateTime1);
      }
    }
  }, [])

  const label = (
    <View style={[styles.labelArea, labelAreaStyle]}>
      {rest.isRequired && <Text style={styles.required}>*</Text>}
      <Text style={[styles.label, rest.isRequired && { marginRight: 4 }, labelStyle]}>{rest.title}: </Text>
    </View>
  );

  return (
    <>
      <View style={styles.msgArea}>
        {label}
        <TouchableOpacity style={styles.pickerTouchable} onPress={() => setModalVisible(true)}>
          <AntDesign
            name='calendar'
            size={35}
            style={{ marginHorizontal: 10 }}
            color='#999999'
          />
          <Text style={styles.font}>{moment(dateTime).format('YYYY-MM-DD')}</Text>
        </TouchableOpacity>
      </View>
      {
        modalVisible && (
          <DateTimePicker
            value={dateTime}
            onChange={dateChange}
            minimumDate={startDate}
            maximumDate={endDate}
          />
        )
      }
    </>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    height: 91,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    paddingRight: 0,
    paddingLeft: 28
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerTouchable: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
  },
  font: {
    fontSize: 36
  },
  labelArea: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  label: {
    textAlign: 'center',
    fontSize: 32
  },
})

export default SignUpDate;