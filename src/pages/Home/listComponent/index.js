import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Image, Animated, } from 'react-native';
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
let timer;

export const Header = ({ search, range, bannerList }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [activeButton, setActiveButton] = useState(0);
  const [rangeDate, setRangeDate] = useState({ startDate: today, endDate: today });

  const showSearch = useSelector((state) => state.homeSearch.canSearch);

  useEffect(() => {
    showSearch && startingAnimation();
    !showSearch && closeAnimation();
    return () => timer && clearTimeout(timer);
  }, [showSearch])

  useMemo(() => {
    if (rangeDate.startDate !== rangeDate.endDate) {
      setActiveButton();
    }
    if (rangeDate.startDate === rangeDate.endDate && rangeDate.startDate === today) {
      setActiveButton(0);
    }
    if (rangeDate.startDate === rangeDate.endDate && rangeDate.startDate === tomorrow) {
      setActiveButton(1);
    }
    //fix执行顺序会报异常的问题；
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      range(rangeDate);
    })
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
    setRangeDate({ startDate: today, endDate: today });
  };

  const tomorrowOnPress = () => {
    setActiveButton(1);
    setRangeDate({ startDate: tomorrow, endDate: tomorrow });
  };

  return (
    <>
      <View style={styles.swiperArea}>
        <Swiper
          autoplay
          autoplayTimeout={4}
          style={styles.swiperStyle}
          containerStyle={styles.containerStyle}
          paginationStyle={styles.paginationStyle}
          defaultSource={require('../../../assets/images/loading.gif')}
          activeDotColor='#409EFF'>
          {bannerList.length ? bannerList.map((image, index) =>
            <Image
              loadingindicatorsource={require('../../../assets/images/homeImg.png')}
              key={index}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
              source={{ uri: `${image.coverImage.url}` }} />)
            : <>
              <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={require('../../../assets/images/homeImg.png')} />
              <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={require('../../../assets/images/homeImg2.jpg')} />
            </>}
        </Swiper>
      </View>
      <Animated.View style={[{opacity: fadeAnim}, !showSearch && {height: 0}]}>
        <SearchInput searchPress={search} fontStyle={{fontSize: 26}}/>
        <DatePicker rangeDate={rangeDate} setRangeDate={setRangeDate}/>
      </Animated.View>
      <View style={styles.buttonArea}>
        <Button
          buttonStyle={[styles.btn, { marginLeft: 75 }, activeButton === 0 && styles.activeButton]}
          titleStyle={[{ fontSize: 32 }, activeButton === 1 && styles.activeButtonTitle]}
          onPress={todayOnPress}>今日热招
        </Button>
        <View style={styles.centerLine}></View>
        <Button
          buttonStyle={[styles.btn, { marginRight: 75 }, activeButton === 1 && styles.activeButton]}
          titleStyle={[{ fontSize: 32 }, activeButton === 0 && styles.activeButtonTitle]}
          onPress={tomorrowOnPress}>明日预招
        </Button>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listHeader_flex1}>序号</Text>
        <Text style={[styles.listHeader_flex2]}>企业名称</Text>
        <Text style={styles.listHeader_flex2}>招聘时段</Text>
      </View>
    </>
  )
};

export const homeFooter = () => (
  <>
    <View style={styles.homeFooter}></View>
    <Text style={styles.footerText}>- 深圳市众鼎人力集团 -</Text>
  </>
);

export const footer = () => (
  <>
    <Text style={styles.footer}>- 深圳市众鼎人力集团 -</Text>
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
        size={60}
        color='#999999'
        style={styles.antIcon}
      />
      <Text style={styles.emptyText}>暂无数据</Text>
    </View>
  </>
)

const styles = StyleSheet.create({
  swiperArea: {
    height: 312
  },
  swiperStyle: {
    borderRadius: 10
  },
  containerStyle: {
    margin: 31,
    borderRadius: 10
  },
  paginationStyle: {
    bottom: 0,
    marginBottom: 5
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  buttonArea: {
    height: 80,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 31,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: {
    width: 193,
    height: 50,
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
    height: 45,
    backgroundColor: '#CCCCCC'
  },
  listHeader: {
    height: 74,
    backgroundColor: '#fff',
    marginHorizontal: 31,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listHeader_flex1: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 32
  },
  listHeader_flex2: {
    flex: 2,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 32
  },
  footer: {
    height: 13,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 10,
    color: '#999999'
  },
  homeFooter: {
    height: 13,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#fff',
    marginHorizontal: 31
  },
  footerText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#999999',
    fontSize: 20,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  emptyStyle: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 30
  },
  antIcon: {
    marginBottom: 10
  },
  emptyText: {
    color: '#999999',
    fontSize: 28
  }
});
