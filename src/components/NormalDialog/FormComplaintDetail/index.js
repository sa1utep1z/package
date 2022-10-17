import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';

import EmptyArea from '../../EmptyArea';
import { TYPERESULT, MEMBERS_STATUS, WAY_TO_GO, WATERMARK_LIST_SMALL, COMPLAINT_INFO } from '../../../utils/const';
import { deepCopy } from '../../../utils';

const FormComplaintDetail = ({
  memberInfoList = COMPLAINT_INFO,
}) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  const [showList, setShowList] = useState([
    { type: 'type', title: '问题类型', value: '' },
    { type: 'userName', title: '会员姓名', value: '' },
    { type: 'idNo', title: '身份证号', value: '' },
    { type: 'mobile', title: '手机号码', value: '' },
    { type: 'companyShortName', title: '企业名称', value: '' },
    { type: 'jobOn', title: '是否在职', value: '' },
    { type: 'jobDate', title: '入职日期', value: '' },
    { type: 'createdDate', title: '反馈时间', value: '' },
    { type: 'content', title: '反馈内容', value: '' },
    { type: 'imgs', title: '上传照片', value: [] },
  ]);

  useMemo(() => {
    const copyList = deepCopy(showList);
    for (let key in memberInfoList) {
      if (copyList.length) {
        const findItem = copyList.find(item => item.type === key);
        if (findItem) {
          switch (key) {
            case 'type':
              const chanelName = TYPERESULT.find(name => name.value === memberInfoList[key]);
              findItem.value = chanelName?.title;
              break;
            case 'createdDate':
              findItem.value = memberInfoList[key] ? moment(memberInfoList[key]).format('YYYY-MM-DD HH:mm:ss') : '无';
              break;
            case 'jobDate':
              findItem.value = memberInfoList[key] ? moment(memberInfoList[key]).format('YYYY-MM-DD') : '无';
              break;
            case 'jobOn':
              findItem.value = memberInfoList[key] ? memberInfoList[key] === true ? '是' : '否' : '无';
              break;
            default:
              findItem.value = memberInfoList[key];
              break;
          }
        }
      }
    }
    setShowList(copyList);
    // console.log('打印数据格式4444：', copyList);
    let arr = [];
    for (let key in copyList) {
      // console.log('打印遍历的数据：', copyList[key].title, copyList[key].value);
      arr.push([copyList[key].title, copyList[key].value])
    }
    const newArr = arr.join('、');
    // console.log('newArrnewArrnewArrnewArrnewArrs', newArr)
  }, [memberInfoList])

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);
  };
  // console.log('打印数据格式3333：', memberInfoList);
  const newDate = showList.filter((item) => (item.type !== 'jobDate' && item.type !== 'resignDate'));

  return (
    <ScrollView style={styles.msgArea}>
      <View style={styles.topArea}>
        {showList?.length ? showList.map((item, index) => {
          return (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberItem_text}>{item.title}：</Text>
              {item.type === 'mobile' ?
                item.value ? <TouchableOpacity style={[styles.memberItem_value, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={() => callPhone(item)}>
                  <Text style={{ color: '#409EFF' }}>{item.value}</Text>
                  <Entypo name='phone' size={16} color='#409EFF' />
                </TouchableOpacity> : <Text style={{ textAlignVertical: 'center', paddingLeft: 3 }}>无</Text> : item.type === 'name' ?
                  <View style={styles.memberItem_value}>
                    <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                  </View> : item.type === 'idNo' ? <View style={styles.memberItem_value}>
                    <Text selectable={true} style={{ color: '#409EFF' }}>{item.value || '无'}</Text>
                  </View> : item.type === 'imgs' ? <View style={styles.imageBox}>
                    {
                      item.value.length > 0 && item.value.map((img, index) => {
                        return (
                          <View style={styles.imags} key={index}>
                            <Image
                              style={{ width: '100%', height: '100%' }}
                              source={{ uri: `${img.url}` }}
                            />
                          </View>
                        )
                      })
                    }
                  </View> : <View style={styles.memberItem_value}>
                    <Text>{item.value || '无'}</Text>
                  </View>}
            </View>
          )
        }) : <EmptyArea />}
      </View>
      <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.store}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.name}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 360,
    marginHorizontal: 10
  },
  topArea: {
    width: '100%',
    paddingHorizontal: 20
  },
  memberItem: {
    minHeight: 30,
    flexDirection: 'row'
  },
  memberItem_text: {
    textAlignVertical: 'center',
    textAlign: 'left'
  },
  memberItem_value: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 3
  },
  imageBox: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    // margin: 30,
  },
  imags: {
    width: 100,
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999999',
    marginRight: 20,
    marginBottom: 20,
    position: 'relative',
  },
})

export default FormComplaintDetail;