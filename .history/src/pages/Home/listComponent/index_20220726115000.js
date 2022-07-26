import React, {useState, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';
import { Text, Button } from '@rneui/themed';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import moment from "moment";

import DatePicker from "../DatePicker";
import SearchInput from "../../../components/SearchInput";

const today = moment().format("YYYY-MM-DD");
const tomorrow = moment().add(1, 'd').format("YYYY-MM-DD");

export const Header = ({search}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [activeButton, setActiveButton] = useState(0);
  const [rangeDate, setRangeDate] = useState({startDate: today, endDate: today});

  const showSearch = useSelector((state) => state.homeSearch.canSearch);

  useEffect(()=>{
    showSearch && startingAnimation();
    !showSearch && closeAnimation();
  },[showSearch])

  useMemo(()=>{
    console.log('rangeDate',rangeDate)
  }, [rangeDate])

  const startingAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const closeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const todayOnPress = () => {
    setActiveButton(0);
    setRangeDate({startDate: today, endDate: today});
  };
  
  const tomorrowOnPress = () => {
    setActiveButton(1);
    setRangeDate({startDate: tomorrow, endDate: tomorrow});
  };

  return (
    <>
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
      {showSearch && <Animated.View style={{opacity: fadeAnim}}>
        <SearchInput searchPress={search} />
        <DatePicker rangeDate={rangeDate} setRangeDate={setRangeDate}/>
      </Animated.View>}
      <View style={styles.buttonArea}>
        <Button 
          buttonStyle={[styles.btn, activeButton === 0 && styles.activeButton]} 
          titleStyle={[activeButton === 1 && styles.activeButtonTitle]} 
          onPress={todayOnPress}>今日热招
        </Button>
        <View style={styles.centerLine}></View>
        <Button 
          buttonStyle={[styles.btn, activeButton === 1 && styles.activeButton]} 
          titleStyle={[activeButton === 0 && styles.activeButtonTitle]} 
          onPress={tomorrowOnPress}>明日预招
        </Button>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listHeader_flex1}>序号</Text>
        <Text style={styles.listHeader_flex2}>企业名称</Text>
        <Text style={styles.listHeader_flex2}>招聘时段</Text>
        <Text style={styles.listHeader_flex1}>列表</Text>
      </View>
    </>
  )
};

export const homeFooter = () => (
  <>
    <View style={styles.footer}></View>
    <Text style={styles.footerText}>- 深圳市众鼎人力集团 -</Text>
  </>
);

export const listFooter = () => (
  <Text style={styles.footerText}>- 深圳市众鼎人力集团 -</Text>
)

export const empty = () => (
  <>
    <View style={styles.emptyStyle}>
    <AntDesign
        name='frowno'
        size={40}
        color='#999999'
        style={styles.antIcon}
      />
      <Text style={styles.emptyText}>暂无数据</Text>
    </View>
  </>
)

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
  buttonArea: {
    height: 40,
    backgroundColor: '#fff',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  btn: {
    height: 25,
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderWidth: 0,
    backgroundColor: '#EEEEEE',
  },
  activeButton: {
    backgroundColor: '#409EFF',
  },
  activeButtonTitle: {
    color: '#999999'
  },
  centerLine: {
    width: 2,
    height: 20,
    backgroundColor: '#CCCCCC'
  },
  listHeader: {
    height: 35, 
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  listHeader_flex1: {
    flex: 1, 
    textAlign: 'center', 
    fontWeight: '700'
  },
  listHeader_flex2: {
    flex: 2, 
    textAlign: 'center', 
    fontWeight: '700'
  },
  footer: {
    height: 13, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    backgroundColor: '#fff', 
    marginHorizontal: 10
  },
  footerText: {
    textAlign: 'center', 
    paddingVertical: 10, 
    color: '#999999', 
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#f2f2f2'
  },
  emptyStyle: {
    flex: 1, 
    marginHorizontal: 10, 
    backgroundColor: '#fff', 
    height: 200, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyIcon: {
    fontSize: 30
  },
  antIcon: {
    marginBottom: 10
  },
  emptyText: {
    color: '#999999'
  }
});
