import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { Text } from '@rneui/themed';

import { checkedType } from '../../../utils';

const fakeList = [
  {title: '会员标签', value: [
    {title: '标签一', type: 'tag_1'},
    {title: '标签二', type: 'tag_2'},
    {title: '标签三', type: 'tag_3'},
    {title: '标签四', type: 'tag_4'},
    {title: '标签五', type: 'tag_4'},
    {title: '标签六', type: 'tag_4'},
    {title: '标签七', type: 'tag_4'},
    {title: '标签八', type: 'tag_4'},
    {title: '标签九', type: 'tag_4'},
    {title: '标签十', type: 'tag_4'}
  ]},
  {title: '会员姓名', value: '什么鬼'},
  {title: '会员手机号', value: '18889999999'},
  {title: '会员意愿', value: `${true ? '有意愿' : '无意愿'}`},
  {title: '意向企业', value: '富士康ACKN'},
  {title: '本次回访记录', value: '无'},
  {title: '下次回访记录', value: '无'},
  {title: '历史回访记录', value: '无'}
];

const ReviewRecord = ({
  reviewList = fakeList
}) => {

  return (
    <ScrollView style={styles.totalArea}>
      {reviewList.map((item, index) => {
        return (
          <View style={styles.listItem} key={index}>
            <Text style={styles.listItem_text}>{item.title}：</Text>
            <View style={[styles.listItem_item, index === 0 && styles.noBoder]}>
              {checkedType(item.value) === 'Array' ? 
                <View style={styles.item_array}>
                  {item.value.map((itemValue, itemIndex) => <Text key={itemIndex} style={[
                    styles.item_array_item,
                    itemIndex % 2 === 0 && {borderColor: '#409EFF', color: '#409EFF', backgroundColor: '#F4F9FF'},
                    itemIndex % 3 === 0 && {borderColor: '#00D789', color: '#00D789', backgroundColor: '#F3FFFB'}]}>{itemValue.title}</Text>)}
                </View>:
              <Text>{item.value}</Text>}
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
    color: '#000', 
    width: 100, 
    textAlign: 'right'
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
    flexDirection: 'row', 
    flexWrap: 'wrap'
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
  }
})

export default ReviewRecord;