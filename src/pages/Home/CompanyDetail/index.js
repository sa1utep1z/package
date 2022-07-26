import React, { useState, useEffect, useReducer, useRef } from 'react';
import { StyleSheet, ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from '@rneui/themed';
import { WebView } from 'react-native-webview';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import { useSelector } from 'react-redux';

import HomeApi from "../../../request/HomeApi";
import { getYMD } from '../../../utils';
import NAVIGATION_KEYS from '../../../navigator/key';
import { SITSTAND, DRESS, COMPANY_SHIFT, COMPANY_IDCARD, COMPANY_ENGLISH, TATTOOSMOKE, SUCCESS_CODE, PROFESSION, WATERMARK_LIST, WATERMARK_LIST_SMALLEST } from '../../../utils/const';
import WaterMark from '../../../components/WaterMark';

const CompanyDetail = (props) => {
  const webRef = useRef(null);
  const toast = useToast();

  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  const navigation = useNavigation();
  const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.label;
  const { route: { params } } = props;
  const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  const [orderTextDetail, setorderTextDetail] = useState(''); // 工价详情
  const [orderData, setOrderData] = useState({
    orderPolicyDetail: ''
  }); // 岗位详情数据
  const orderPolicyDetail = String(orderData.orderPolicyDetail).replace(/<br\/>/g, "\n")
  const date = String(orderData.recruitRange).substring(5, 11);
  const date2 = String(orderData.recruitRange).substring(16, 21);
  const recruitRange = date + date2;
  const startTime = String(orderData.recruitRange).substring(0, 10); //开始日期
  const endTime = String(orderData.recruitRange).substring(11, 21);// 结束日期


  const getDetail = async () => {
    try {
      const res = await HomeApi.orderDetail(orderId);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setOrderData(res.data);
      console.log('岗位详情：', res, params.currentTime)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const getOrderDetail = async () => {
    try {
      const res = await HomeApi.orderTextDetail(orderId);
      if (res.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setorderTextDetail(res.data);
      console.log('发单详情：', res)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.orderName,
    });
    getDetail();
    getOrderDetail();
  }, [orderId])

  const signUpPress = () => navigation.navigate(NAVIGATION_KEYS.SIGN_UP, {
    jobName: params.orderName,
    orderId: params.orderId,
    startDate: startTime,
    endDate: endTime,
    currentTime: params.currentTime,
  });

  //复制文本
  const _handleClipboardContent = async () => {
    console.log('复制订单详情：', orderTextDetail);
    //设置内容到剪贴板
    Clipboard.setString(orderTextDetail);
    //从剪贴板获取内容
    Clipboard.getString().then((content) => {
      toast.show('复制成功');
    }, (error) => {
      console.log('error:' + error);
    })
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.swiperArea}>
          <Swiper
            autoplay
            autoplayTimeout={4}
            style={styles.swiperStyle}
            containerStyle={styles.containerStyle}
            paginationStyle={styles.paginationStyle}
            defaultSource={require('../../../assets/images/loading.gif')}
            activeDotColor='#409EFF'>
            {orderData.positionImage ? orderData.positionImage.map((image, index) =>
              <Image
                loadingindicatorsource={image}
                key={index}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                source={{ uri: `${image.url}` }} />)
              : <>
                <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={require('../../../assets/images/homeImg.png')} />
                <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={require('../../../assets/images/homeImg2.jpg')} />
              </>}
          </Swiper>
        </View>
        <View>
          <View style={styles.jobBoxStyle}>
            <Text style={styles.textStyle}>{params.companyName}</Text>
            <View style={styles.jobBoxLeft}>
              <View style={styles.rowStyles}>
                <Text style={styles.salaryStyle}>综合薪资</Text>
                <Text style={styles.amountStyle}>{orderData.salary}</Text>
              </View>
              <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 26 }}>{recruitRange}</Text>
              </View>
            </View>
            <View style={styles.rowStyles}>
              {
                orderData.tags?.map((item, index) => (
                  <Text style={styles.tagsStyle} key={index}>{item}</Text>
                ))
              }
            </View>
            <View style={styles.rowStyles}>
              <Text style={styles.workBox}>{getEnumValue(PROFESSION, orderData.typeOfWork)}</Text>
            </View>
            <View style={styles.rowStyles}>
              <Text style={styles.quotaStyle}>招聘人数：</Text>
              <Text style={styles.workStyle}>{orderData.total}</Text>
              {
                orderData.genderLimit && (
                  <Text style={styles.quotaStyle}>【男：<Text style={styles.workStyle}>{orderData.maleTotal}</Text> 女：<Text style={styles.workStyle}>{orderData.femaleTotal}</Text>】</Text>
                )
              }
              {
                !orderData.genderLimit && (
                  <Text style={styles.quotaStyle}>【男女不限】</Text>
                )
              }
            </View>
            <View style={styles.rowStyles}>
              <Text style={styles.quotaStyle}>已报名人数：</Text>
              <Text style={styles.workStyle}>{parseInt(orderData.male) + parseInt(orderData.female)}</Text>
              <Text style={styles.quotaStyle}>【男：<Text style={styles.workStyle}>{orderData.male}</Text> 女：<Text style={styles.workStyle}>{orderData.female}</Text>】</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, itemIndex) => {
              const isSingle1 = itemIndex < 4 && itemIndex % 2 === 0;
              const isSingle2 = itemIndex > 4 && itemIndex < 8 && itemIndex % 2 === 1;
              return (
                <View key={itemIndex} style={[{ width: '25%', height: '50%', transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },]}>
                  {isSingle1 && <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{`${memberInfo.store} · ${memberInfo.name}`}</Text>}
                  {isSingle2 && <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{`${memberInfo.store} · ${memberInfo.name}`}</Text>}
                </View>
              )
            })}
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={[styles.boxTopStyle, { display: 'flex', justifyContent: 'space-between' }]}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={styles.iconStyle}></View>
              <Text style={styles.titlesStyle}>发单详情</Text>
            </View>
            <TouchableOpacity onPress={_handleClipboardContent}>
              <Text style={{ color: '#409EFF', fontSize: 30, marginRight: 15 }}>一键复制</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentStyle}>
            {/* <View>
              <Text style={styles.fontStyle}>{orderTextDetail || '无'}</Text>
              <WaterMark list={WATERMARK_LIST}/>
            </View> */}
            <View>
              <View style={styles.contentStyle}>
                <Text style={styles.fontStyle}>{orderTextDetail || '无'}</Text>
                <Text style={{fontSize: 30, color: '#409EFF', textAlign: 'center'}}>///////////////////////////////////////////////////////////////////</Text>
                <Text style={[styles.fontStyle, {marginTop: 20 }]}>{orderData.orderPolicyDetail ? orderPolicyDetail : '无'}</Text>
              </View>
              <WaterMark list={WATERMARK_LIST} />
            </View>
          </View>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>薪资待遇</Text>
          </View>
          <View>
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
            <View style={{ paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
              {WATERMARK_LIST_SMALLEST.map((item, itemIndex) => {
                return (
                  <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.store}</Text>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>工作环境</Text>
          </View>
          <View>
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
            <View style={{ paddingHorizontal: 30, paddingBottom: 30, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
              {WATERMARK_LIST_SMALLEST.map((item, itemIndex) => {
                return (
                  <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.store}</Text>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>录用要求</Text>
          </View>
          <View>
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
            <View style={{ paddingHorizontal: 30, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
              {WATERMARK_LIST_SMALLEST.map((item, itemIndex) => {
                return (
                  <View key={itemIndex} style={[{ width: '25%', height: 150, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.store}</Text>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.boxStyle}>
          <View style={styles.boxTopStyle}>
            <View style={styles.iconStyle}></View>
            <Text style={styles.titlesStyle}>工厂地址</Text>
          </View>
          <View>
            <View style={styles.rowStyle}>
              <View style={styles.boxContent}>
                <Text style={styles.fontStyle}>厂址</Text>
              </View>
              <View style={styles.boxText}>
                <Text style={styles.fontStyle}>{orderData.address || '无'}</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 30, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }} pointerEvents={'none'}>
              {WATERMARK_LIST_SMALLEST.map((item, itemIndex) => {
                return (
                  <View key={itemIndex} style={[{ width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }, { opacity: item }]}>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.store}</Text>
                    <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 20 }}>{memberInfo.name}</Text>

                  </View>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
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
    padding: 20,
  },
  jobBoxLeft: {
    flex: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
  },
  workBox: {
    color: '#409EFF',
    borderColor: '#409EFF',
    borderWidth: 2,
    fontSize: 24,
    paddingHorizontal: 8,
    // paddingVertical: 2,
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
    fontSize: 24,
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
    width: 8,
    height: 36,
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
})

export default CompanyDetail;