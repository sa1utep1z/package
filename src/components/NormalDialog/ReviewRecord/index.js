import React, {useMemo, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text } from '@rneui/themed';
import moment from 'moment';

const fakeList = [
  {title: '会员姓名', value: '什么鬼'},
  {title: '会员手机号', value: '18889999999'},
  {title: '意向企业', value: '富士康ACKN'},
  {title: '本次回访记录', value: '无'},
  {title: '下次回访记录', value: '无'},
  {title: '历史回访记录', value: '无'}
];

const ReviewRecord = ({
  item,
  reviewList
}) => {
  const [showList, setShowList] = useState([]);

  useMemo(()=>{
    let arr = [
      {title: '姓名', value: item?.userName, type: 'userName'},
      {title: '手机号', value: item?.mobile, type: 'mobile'},
      {title: '历史回访记录', value: reviewList, type: 'reviewList'}
    ];
    setShowList(arr);
  },[reviewList])

  useMemo(()=>{
    console.log('showList',showList);
  },[showList])

  return (
    <ScrollView style={styles.totalArea}>
      {showList.map((item, index) => {
        if(item.type !== 'reviewList'){
          return (
            <View style={styles.listItem} key={index}>
              <Text style={styles.listItem_text}>{item.title}：</Text>
              <View style={[styles.listItem_item, index === 0 && styles.noBoder]}>
                <Text>{item.value}</Text>
              </View>
            </View>
          )
        }else return (
          <View key={index} style={{marginTop: 10}}>
            <Text style={{marginLeft: 20}}>{item.title}：</Text>
            <View style={styles.bottomList}>
              {item.value.map((renderItem, renderIndex)=>{
                if(renderIndex < 3){
                  return (
                    <View key={renderIndex} style={[styles.bottomListItem, renderIndex === 2 && {borderBottomWidth: 0}]}>
                      <Text style={{marginRight: 10}}>{renderItem.lastModifiedByName}</Text>
                      <Text style={{marginRight: 10}}>{moment(renderItem.lastModifiedDate).format('YYYY-MM-DD')}</Text>
                      <Text style={{flex: 1}}>{renderItem.content}</Text>
                    </View>
                  )
                }
              })}
            </View>
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
    minHeight: 30, 
    alignItems: 'center', 
    marginHorizontal: 20
  },
  listItem_text: {
    color: '#000'
  },
  listItem_item: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF'
  },
  noBoder: { 
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
    borderColor: '#999999', 
    marginHorizontal: 15, 
    borderRadius: 4, 
    marginTop: 5,
    paddingHorizontal: 10
  },
  bottomListItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC'
  }
})

export default ReviewRecord;