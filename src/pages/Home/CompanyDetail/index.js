import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, Image, View, Text} from 'react-native';
import {Button} from '@rneui/themed';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

import { getYMD } from '../../../utils';
import NAVIGATION_KEYS from '../../../navigator/key';

const CompanyDetail = (props) => {
  const navigation = useNavigation();

  const {route: {params}} = props;

  useEffect(()=>{
    navigation.setOptions({
      headerTitle: params.companyName,
    });
  },[])

  let content;
  for(let i = 0; i < 200; i++){
    content += '这里是发单详情';
  };
  let payContent = '这里是薪资详情';
  for(let i = 0; i < 50; i++){
    payContent += '这里是薪资详情';
  };
  let requireContent = '这里是岗位要求';
  for(let i = 0; i < 15; i++){
    requireContent += '这里是岗位要求';
  };
  let hireContent = '这里是招聘要求';
  for(let i = 0; i < 20; i++){
    hireContent += '这里是招聘要求';
  };

  const signUpPress = () => navigation.navigate(NAVIGATION_KEYS.SIGN_UP, {
    jobName: params.companyName
  });

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.swiperArea}>
          <Swiper 
            autoplay 
            style={styles.swiperStyle} 
            containerStyle={styles.containerStyle} 
            paginationStyle={styles.paginationStyle} 
            activeDotColor='#409EFF'>
            <Image style={{width: '100%', height: '100%', borderRadius: 8}} source={require('../../../assets/images/homeImg.png')}/>
            <View style={styles.slide2}>
              <Image style={{width: '100%', height: '100%', borderRadius: 8}} source={require('../../../assets/images/homeImg2.jpg')}/>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>你好</Text>
            </View>
          </Swiper>
        </View>
        <View style={{height: 100, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 10, marginBottom: 10, flexDirection: 'row'}}>
          <View style={{flex: 7, justifyContent: 'space-between', paddingVertical: 10, paddingLeft: 15}}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000'}}>南山电子补贴5700元</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 14, color: '#999999', fontWeight: 'bold'}}>综合薪资</Text>
              <Text style={{color: '#E6A23C', fontSize: 14, fontWeight: 'bold'}}>5300~6700元/月</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#409EFF', backgroundColor: '#b7dbff', fontSize: 12, paddingHorizontal: 8, paddingVertical: 1, marginRight: 10, borderRadius: 3, fontWeight: 'bold'}}>底薪高</Text>
              <Text style={{color: '#409EFF', backgroundColor: '#b7dbff', fontSize: 12, paddingHorizontal: 8, paddingVertical: 1, marginRight: 10, borderRadius: 3, fontWeight: 'bold'}}>福利好</Text>
            </View>
          </View>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{getYMD(new Date())}</Text>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#409EFF'}}>
          <View style={{height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#409EFF'}}>
            <View style={{backgroundColor: '#409EFF', width: 5, height: 18, borderTopRightRadius: 5, borderBottomRightRadius: 5, marginRight: 10}}></View>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>发单详情</Text>
          </View>
          <View style={{flex: 1, padding: 10, minHeight: 50}}>
            <Text style={{color: '#000'}}>
            {content}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#409EFF'}}>
          <View style={{height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#409EFF'}}>
            <View style={{backgroundColor: '#409EFF', width: 5, height: 18, borderTopRightRadius: 5, borderBottomRightRadius: 5, marginRight: 10}}></View>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>薪资待遇</Text>
          </View>
          <View style={{flex: 1, minHeight: 50}}>
            <View style={{height: 35, borderBottomWidth: 1, borderColor: '#409EFF' ,flexDirection: 'row'}}>
              <View style={{width: 100, backgroundColor: '#D9ECFF', borderRightWidth: 1, borderColor: '#409EFF', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#000', fontSize: 14}}>发薪日</Text>
              </View>
              <View style={{flex: 1, paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000'}}>12号</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 100, backgroundColor: '#D9ECFF', borderRightWidth: 1, borderColor: '#409EFF', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#000', fontSize: 14}}>薪资详情</Text>
              </View>
              <View style={{flex: 1, padding: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000'}}>{payContent}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#409EFF'}}>
          <View style={{height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#409EFF'}}>
            <View style={{backgroundColor: '#409EFF', width: 5, height: 18, borderTopRightRadius: 5, borderBottomRightRadius: 5, marginRight: 10}}></View>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>岗位描述</Text>
          </View>
          <View style={{flex: 1, minHeight: 50}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 100, backgroundColor: '#D9ECFF', borderRightWidth: 1, borderColor: '#409EFF', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#000', fontSize: 14}}>要求</Text>
              </View>
              <View style={{flex: 1, padding: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000'}}>{requireContent}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#409EFF'}}>
          <View style={{height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#409EFF'}}>
            <View style={{backgroundColor: '#409EFF', width: 5, height: 18, borderTopRightRadius: 5, borderBottomRightRadius: 5, marginRight: 10}}></View>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>招聘要求</Text>
          </View>
          <View style={{flex: 1, minHeight: 50}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 100, backgroundColor: '#D9ECFF', borderRightWidth: 1, borderColor: '#409EFF', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#000', fontSize: 14}}>要求</Text>
              </View>
              <View style={{flex: 1, padding: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000'}}>{hireContent}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{height: 70, justifyContent: 'center'}}>
        <Button
          title="帮 他 报 名"
          onPress={signUpPress}
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.titleStyle}
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  swiperArea: {
    height: 200
  },
  swiperStyle: {
    borderRadius: 8
  },
  containerStyle: {
    margin: 10, 
    borderRadius: 8
  },
  paginationStyle: {
    bottom: 0,
    marginBottom: 5
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    borderRadius: 8
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonStyle: {
    height: 45,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default CompanyDetail;