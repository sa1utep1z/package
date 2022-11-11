import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";

import { deepCopy } from '../../../../../utils';

const CheckedRecord = ({
}) => {
  const [recordList, setRecordList] = useState([]);

  useEffect(()=>{
    let arr = [];
    for(let i = 0; i < 30; i++){
      arr.push({
        id: i,
        time: `2022-09-${i + 1}`,
        showDetail: true,
        remark: '本次点检情况描述哈哈哈哈'
      })
    }
    setRecordList(arr);
  },[])

  const rejectOnPress = () => console.log('取消');

  const passOnPress = () => console.log('确认', detailData);

  const recordOnPress = (record) => {
    const newArr = deepCopy(recordList);
    const findItemIndex = newArr.findIndex(newItem => newItem.id ===record.id);
    newArr[findItemIndex].showDetail = !record.showDetail;
    setRecordList(newArr);
  };

  return (
    <View style={{height: 900}}>
      <View style={{flex: 1}}>
        <View style={{paddingHorizontal: 30, marginBottom: 20}}>
          <View style={{backgroundColor: '#979797', borderWidth: 1, borderColor: '#999999', borderRadius: 10}}>
            <Text style={{fontSize: 26, color: '#FFFFFF', textAlign: 'center', borderBottomWidth: 1, borderColor: '#FFFFFF', paddingVertical: 8}}>宿舍分类：男宿舍</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1, fontSize: 24, color: '#FFFFFF', textAlign: 'center', borderRightWidth: 1, borderColor: '#FFFFFF', paddingVertical: 6}}>楼栋：241栋</Text>
              <Text style={{flex: 1, fontSize: 24, color: '#FFFFFF', textAlign: 'center', borderRightWidth: 1, borderColor: '#FFFFFF', paddingVertical: 6}}>楼层：1F</Text>
              <Text style={{flex: 1, fontSize: 24, color: '#FFFFFF', textAlign: 'center', paddingVertical: 6}}>房间：504</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          {recordList.map((record, recordIndex) => (
            <View style={{marginHorizontal: 30, marginTop: 10}}>
              {!record.showDetail && <TouchableOpacity key={recordIndex} style={[{height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderColor: '#999999', paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#EFEFEF'}, record.showDetail && {marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]} onPress={() => recordOnPress(record)}>
                <Text style={{fontSize: 26, fontWeight: 'bold'}}>{record.time}点检记录</Text>
              </TouchableOpacity>}
              {record.showDetail && <Shadow style={{width: '100%', marginBottom: 20}}>
                <View style={{borderRadius: 10}}>
                  <TouchableOpacity key={recordIndex} style={[{height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderColor: '#999999', paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#EFEFEF'}, record.showDetail && {marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]} onPress={() => recordOnPress(record)}>
                    <Text style={{fontSize: 26, fontWeight: 'bold', color: '#000000'}}>{record.time}点检记录</Text>
                  </TouchableOpacity>
                  <View style={{height: 100, flexDirection: 'row', padding: 10}}>
                    <View style={{flex: 1, padding: 10}}>
                      <Text style={{fontSize: 26, color: '#333333'}}>本次点检情况描述</Text>
                    </View>
                    <TouchableOpacity style={{width: 140, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#409EFF', borderRadius: 8, alignSelf: 'center'}}>
                      <Text style={{fontSize: 24, color: '#ffffff'}}>查看详情</Text>
                      <AntDesign style={{marginLeft: 2}} name='right' size={28} color='#ffffff' />
                    </TouchableOpacity>
                  </View>
                </View>
              </Shadow>}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
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
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  }
})

export default CheckedRecord;