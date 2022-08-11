import React, { useState, useEffect, useReducer, useRef } from 'react';
import { StyleSheet, ScrollView, Image, View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { WebView } from 'react-native-webview';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import HomeApi from "../../../request/HomeApi";
import { getYMD } from '../../../utils';
import NAVIGATION_KEYS from '../../../navigator/key';
import { SITSTAND, DRESS, COMPANY_SHIFT, COMPANY_IDCARD, COMPANY_ENGLISH, TATTOOSMOKE, SUCCESS_CODE } from '../../../utils/const';

const CompanyDetail = (props) => {
  const webRef = useRef(null);
  const toast = useToast();

  const navigation = useNavigation();
  const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.label;
  const { route: { params } } = props;
  const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  const [orderData, setOrderData] = useState({
    orderPolicyDetail: ''
  }); // 岗位详情数据
  const [height, setHeight] = useState(0);
  const orderPolicyDetail = String(orderData.orderPolicyDetail).replace(/<br\/>/g,"\n")
  const date = String(orderData.recruitRange).substring(5, 11);
  const date2 = String(orderData.recruitRange).substring(16, 20)
  const recruitRange = date + date2
  
  const getDetail = async () => {
    try{
      const res = await HomeApi.orderDetail(orderId);
      if(res.code !== SUCCESS_CODE){
        toast.show(`请求失败，${res.msg}`, {type: 'danger'});
        return;
      }
      setOrderData(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.companyName,
    });
    getDetail();
    return () => setHeight(0)
  }, [orderId])

  const signUpPress = () => navigation.navigate(NAVIGATION_KEYS.SIGN_UP, {
    jobName: params.orderName,
    orderId: params.orderId,
  });

  return (
    <View style={{ flex: 1}}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.swiperArea}>
          <Swiper
            autoplay
            style={styles.swiperStyle}
            containerStyle={styles.containerStyle}
            paginationStyle={styles.paginationStyle}
            activeDotColor='#409EFF'>
            <Image style={styles.imageStyle} source={require('../../../assets/images/homeImg.png')} />
            <View style={styles.slide2}>
              <Image style={styles.imageStyle} source={require('../../../assets/images/homeImg2.jpg')} />
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>你好</Text>
            </View>
          </Swiper>
        </View>
        <View style={styles.jobBoxStyle}>
          <View style={styles.jobBoxLeft}>
            <Text style={styles.textStyle}>{orderData.orderName}</Text>
            <View style={styles.rowStyles}>
              <Text style={styles.salaryStyle}>综合薪资</Text>
              <Text style={styles.amountStyle}>{orderData.salary}</Text>
            </View>
            <View style={styles.rowStyles}>
              <Text style={styles.tagsStyle}>底薪高</Text>
              <Text style={styles.tagsStyle}>福利好</Text>
            </View>
            <View style={styles.rowStyles}>
              <Text style={styles.workStyle}>正式工</Text>
              <Text style={styles.quotaStyle}>剩余名额：</Text>
              <Text style={styles.workStyle}>{orderData.last}</Text>
              {
                orderData.genderLimit && (
                  <Text style={styles.quotaStyle}>【男：<Text style={styles.workStyle}>{orderData.male}</Text> 女：<Text style={styles.workStyle}>{orderData.female}</Text>】</Text>
                )
              }
            </View>
          </View>
          <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 26 }}>{recruitRange}</Text>
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>发单详情</Text>
          </View>
          <View style={styles.contentStyle}>
            <Text style={styles.fontStyle}>{orderData.orderPolicyDetail.length ? String(orderData.orderPolicyDetail).replace(/<br\/>/g,"\n") : '无'}</Text>
            <Text style={styles.fontStyle}>{orderData.orderPolicyDetail? orderPolicyDetail : '无'}</Text>
            {/* <WebView
              scrollEnabled={false}
              scalesPageToFit={false}
              originWhitelist={['*']}
              source={{ html: orderData.orderPolicyDetail }}>
            </WebView> */}
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>薪资待遇</Text>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>发薪日</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.payDay}</Text>
            </View>
          </View>
          <View style={styles.rowStyle}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>薪资详情</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.salaryDetail}</Text>
            </View>
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>工作环境</Text>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>班别</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(COMPANY_SHIFT, orderData.shiftCategory)}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>着装</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(DRESS, orderData.dress)}</Text>
            </View>
          </View>
          <View style={styles.rowStyle}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>站坐</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(SITSTAND, orderData.sitStand)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>录用要求</Text>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>年龄</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.ageRequire}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>身份证</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(COMPANY_IDCARD, orderData.idCard)}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>纹身烟疤</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(TATTOOSMOKE, orderData.tattooSmoke)}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>英文字母</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{getEnumValue(COMPANY_ENGLISH, orderData.english)}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>行程码</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.itineraryCode}</Text>
            </View>
          </View>
          <View style={styles.row1Style}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>核酸</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.nucleicAcid}</Text>
            </View>
          </View>
          <View style={styles.rowStyle}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>疫苗接种</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.vaccination}</Text>
            </View>
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>工厂地址</Text>
          </View>
          <View style={styles.rowStyle}>
            <View style={styles.boxContent}>
              <Text style={styles.fontStyle}>厂址</Text>
            </View>
            <View style={styles.boxText}>
              <Text style={styles.fontStyle}>{orderData.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{marginVertical: 20, marginHorizontal: 20}}>
        <Button
          title="帮他报名"
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
    height: 312
  },
  swiperStyle: {
    borderRadius: 8
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  jobBoxStyle: {
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 30,
    marginBottom: 30,
    flexDirection: 'row',
    paddingRight: 15
  },
  jobBoxLeft: {
    flex: 7,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 15
  },
  textStyle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000'
  },
  salaryStyle: {
    fontSize: 30,
    color: '#999999',
    fontWeight: 'bold'
  },
  amountStyle: {
    color: '#E6A23C',
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  tagsStyle: {
    color: '#409EFF',
    backgroundColor: '#b7dbff',
    fontSize: 22,
    paddingHorizontal: 8,
    paddingVertical: 1,
    marginRight: 10,
    borderRadius: 3,
    fontWeight: 'bold'
  },
  rowStyles: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10
  },
  workStyle: {
    color: '#409EFF',
    fontWeight: 'bold',
    paddingRight: 8,
    fontSize: 24
  },
  quotaStyle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24
  },
  boxStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 30,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#409EFF'
  },
  boxTopStyle: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#409EFF'
  },
  iconStyle: {
    backgroundColor: '#409EFF',
    width: 8, height: 36,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginRight: 10
  },
  titlesStyle: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#000'
  },
  contentStyle: {
    padding: 10,
    minHeight: 800,
    fontSize: 28
  },
  boxContent: {
    width: 150,
    backgroundColor: '#D9ECFF',
    borderRightWidth: 1,
    borderColor: '#409EFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    paddingLeft: 8,
    paddingRight: 8
  },
  boxText: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    minHeight: 40
  },
  fontStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444444',
  },
  rowStyle: {
    minHeight: 35,
    borderBottomWidth: 0,
    borderColor: '#409EFF',
    flexDirection: 'row'
  },
  row1Style: {
    minHeight: 35,
    borderBottomWidth: 1,
    borderColor: '#409EFF',
    flexDirection: 'row'
  },
  containerStyle: {
    margin: 28,
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
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  }
})

export default CompanyDetail;