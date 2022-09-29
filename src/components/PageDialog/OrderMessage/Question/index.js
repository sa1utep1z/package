import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import { closeDialog } from "../../../../redux/features/PageDialog";

const Question = () => {
  const dispatch = useDispatch();

  const confirm = () => {
    dispatch(closeDialog());
  };

  return (
    <>
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.contentText}>复制：一键复制订单详情和内容，相当于新增一条订单；</Text>
        <Text style={styles.contentText}>续单：点击后，停招日期自动顺延1个自然日，当前停招：9/15，点击续单，则停招日变为9/16；</Text>
        <Text style={styles.contentText}>暂停：点击后订单的停招日期变更为当前日期，同时，订单下架，不在小程序和APP首页展示；</Text>
        <Text style={styles.contentText}>新建订单：就是不用复制旧订单，自己单独重新创建。</Text>
        <View style={{height: 40}}></View>
        <Text style={styles.contentText}>订单排序规则：</Text>
        <Text style={styles.contentText}>全部：按照订单上架在前，下架在后，上架的订单按照排序号排列，正在创建编辑中的订单排在最上面；</Text>
        <Text style={styles.contentText}>招聘中：按照订单排序号排列，同一个企业的订单紧挨着排序；</Text>
        <Text style={styles.contentText}>停招：按照创建日期排序，最近的日期排上，同一个企业的订单紧挨着排序。</Text>
        <View style={{height: 40}}></View>
        <Text style={styles.contentText}>点击照片可以弹出生成解析的工价文本并支持一键复制文本</Text>
        <View style={{height: 40}}></View>
        <Text style={styles.contentText}>左滑订单支持删除订单，删除的订单必须为<Text style={{color: '#FF4040'}}>无效的且没有正在进行报名中的人员</Text>。</Text>
      </ScrollView>
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.bottomBtn} onPress={confirm}>
          <Text style={styles.confirm}>确 定</Text>
        </TouchableOpacity>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 40
  },
  contentText: {
    fontSize: 26, 
    color: '#333333'
  },
  bottomArea: {
    height: 120, 
    padding: 20
  },
  bottomBtn: {
    flex: 1, 
    backgroundColor: '#409EFF', 
    borderRadius: 12, 
    justifyContent: 'center'
  },
  confirm: {
    fontSize: 32, 
    textAlign: 'center', 
    color: '#FFFFFF'
  }
})

export default Question;