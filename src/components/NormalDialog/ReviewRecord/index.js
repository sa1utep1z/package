import React, {useMemo, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text } from '@rneui/themed';
import moment from 'moment';

const ReviewRecord = ({
  item,
  reviewList
}) => {
  const [showList, setShowList] = useState([]);

  useMemo(()=>{
    let arr = [
      {title: '会员标签', value: item?.tags, type: 'tags'},
      {title: '姓名', value: item?.userName, type: 'userName'},
      {title: '手机号', value: item?.mobile, type: 'mobile'},
      {title: '历史回访记录', value: reviewList, type: 'reviewList'}
    ];
    setShowList(arr);
  },[reviewList])

  return (
    <ScrollView style={styles.totalArea}>
      {showList.map((item, index) => {
        if(item.type === 'tags'){
          return (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItem_text}>{item.title}：</Text>
              <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                {item.value.length ? item.value.map((tag, tagIndex) => {
                  return (
                    <Text key={tagIndex} style={{backgroundColor: '#409EFF', color: '#fff', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, marginRight: 5, marginBottom: 5}}>{tag}</Text>
                  )
                }): <Text>无</Text>}
              </View>
            </View>
          )
        }
        if(item.type !== 'reviewList'){
          return (
            <View style={styles.listItem} key={index}>
              <Text style={styles.listItem_text}>{item.title}：</Text>
              <View style={[styles.listItem_item, index === 0 && styles.noBorder]}>
                <Text style={{borderBottomWidth: 1, borderColor: '#EFEFEF'}}>{item.value || '无'}</Text>
              </View>
            </View>
          )
        }else return (
          <View key={index}>
            <Text style={styles.recordTitle}>{`${item.title}${!reviewList.length ? '：无' : ''}`}</Text>
            {reviewList.length ? <View style={styles.bottomList}>
              <View style={styles.recordTitle_head}>
                <Text style={styles.recordTitle_item}>回访人</Text>
                <Text style={[styles.recordTitle_item, {width: 120}]}>回访日期</Text>
                <Text style={{paddingLeft: 4}}>回访详情</Text>
              </View>
              {item.value.map((renderItem, renderIndex)=>{
                if(renderIndex < 3){
                  return (
                    <View key={renderIndex} style={[styles.bottomListItem, renderIndex%2 === 0 && {backgroundColor: '#ecf5ff'}]}>
                      <Text style={styles.recordItem}>{renderItem.lastModifiedByName}</Text>
                      <Text style={[styles.recordItem, {width: 120}]}>{moment(renderItem.lastModifiedDate).format('YY/MM/DD HH:mm')}</Text>
                      <Text style={{flex: 1, paddingLeft: 4, paddingVertical: 4}}>{renderItem.content}</Text>
                    </View>
                  )
                }
              })}
            </View> : <></>}
          </View>
        )
      })}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    maxHeight: 300
  },
  listItem: {
    flexDirection: 'row', 
    marginBottom: 10,
    alignItems: 'center', 
    marginHorizontal: 20
  },
  listItem_text: {
    color: '#000'
  },
  listItem_item: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'center'
  },
  noBorder: { 
    borderBottomWidth: 0 
  },
  item_array: {
    borderWidth: 1
  },
  item_array_item: {
    paddingHorizontal: 8, 
    borderWidth: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 12, 
    borderRadius: 4, 
    marginRight: 4, 
    marginBottom: 2, 
    borderColor: '#E6A23C', 
    color: '#E6A23C', 
    backgroundColor: '#fcf2e4'
  },
  bottomList: {
    borderWidth: 1,
    marginHorizontal: 20,
    borderColor: '#409EFF',
    borderBottomWidth: 0
  },
  bottomListItem: {
    minHeight: 30,
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#409EFF'
  },
  recordTitle: {
    marginLeft: 20, 
    marginBottom: 10
  },
  recordTitle_head: {
    height: 30, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#409EFF', 
    alignItems: 'center'
  },
  recordTitle_item: {
    width: 60, 
    height: '100%', 
    borderRightWidth: 1, 
    borderRightColor: '#409EFF', 
    textAlignVertical: 'center', 
    paddingLeft: 4
  },
  recordItem: {
    height: '100%', 
    width: 60, 
    borderRightWidth: 1, 
    borderRightColor: '#409EFF', 
    textAlignVertical: 'center', 
    paddingLeft: 4
  }
})

export default ReviewRecord;