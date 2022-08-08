import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Tab, TabView } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import DataStatisticApi from "../../../../request/DataStatisticApi"
import AntDesign from 'react-native-vector-icons/AntDesign';
import NormalDialog from "../../../../components/NormalDialog";

const DATA_Statistics = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });
  const [searchTotal, setSearchTotal] = useState({}); // 查询总数据参数
  const [companyDetails, setCompanyDetails] = useState([]); // 企业分组数据
  const [storeDetails, setStoreDetails] = useState([]); // 门店分组数据
  const [supplierDetails, setSupplierDetails] = useState([]); // 供应商分组数据
  const [recruiterDetails, setRecruiterDetails] = useState([]); // 招聘员分组数据
  const [totalData, setTotalData] = useState([]); // 各列表总数据
  const [groupStoreData, setGroupStoreData] = useState([]); // 搜索门店分组数据
  const [groupCompanyData, setGroupCompanyData] = useState([]); // 搜索企业分组数据
  const dialogRef = useRef(null);
  const [dialogContent, setDialogContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    navigation.setOptions({
      headerCenterArea: ({ ...rest }) => <HeaderCenterSearch routeParams={rest} />
    })
    return;
  }, []);

  // 获取企业总数据
  const companyTotalData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.Company(prams)
    if (res.code === 0) {
      setIsLoading(true);
      setTotalData(res.data);
    } else {
      setIsLoading(false)
    }
  };

  // 获取企业分组数据
  const companyData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.CompanyGroup(prams)
      setCompanyDetails(res.data.content)
      console.log('获取到的企业分组数据：', res)
    } catch (error) {
      console.log('获取到的企业分组数据：', error)
    }
  };

  // 获取门店总数据
  const storeTotalData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.Store(prams)
    if (res.code === 0) {
      setTotalData(res.data);
    } else {
      setIsLoading(false)
    }
  };
  // 获取门店分组数据
  const storeData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.StoreGroup(prams)
    setStoreDetails(res.data.content)
    setCompanyDetails(res.data.content)
    console.log('获取到的门店分组数据：', res)
    console.log('请求门店分组数据的参数：', prams)
  };

  // 获取供应商总数据
  const supplierTotalData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.Supplier(prams)
    if (res.code === 0) {
      setTotalData(res.data);
    } else {
      setIsLoading(false)
    }
  };
  // 获取供应商分组数据
  const supplierData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.SupplierGroup(prams)
    setSupplierDetails(res.data.content)
    setCompanyDetails(res.data.content)
    console.log('获取到的供应商分组数据：', res)
    console.log('请求供应商分组数据的参数：', prams)
  };

  // 获取招聘员总数据
  const recruiterTotalData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.Recruiter(prams)
    if (res.code === 0) {
      setTotalData(res.data);
    } else {
      setIsLoading(false)
    }
  };
  // 获取招聘员分组数据
  const recruiterData = async (value) => {
    const prams = {
      ...value,
    }
    const res = await DataStatisticApi.RecruiterGroup(prams)
    setRecruiterDetails(res.data.content)
    setCompanyDetails(res.data.content)
    console.log('获取到的招聘员分组数据：', res)
    console.log('请求招聘员分组数据的参数：', prams)
  };

  useEffect(() => {
    if (index === 0) {
      companyData(searchContent);
      companyTotalData(searchTotal);
    } else if (index === 1) {
      storeTotalData(searchTotal);
      storeData(searchContent);
    } else if (index === 2) {
      supplierTotalData(searchTotal);
      supplierData(searchContent);
    } else {
      recruiterTotalData(searchTotal)
      recruiterData(searchContent)
    }
  }, [index, searchContent, searchTotal]);

  const toTalItem = (res) => {
    const renderList = [
      { fieldName: res.total, textStyle: { width: 116, fontSize: 26, } },
      { fieldName: res.signUpIntention || '0', textStyle: { width: 116 } },
      { fieldName: res.interviewNoArrive || '0', textStyle: { width: 75 } },
      { fieldName: res.interviewFail || '0', textStyle: { width: 70 } },
      { fieldName: res.interviewPass || '0', textStyle: { width: 70 } },
      { fieldName: res.onBoardingFail || '0', textStyle: { width: 100 } },
      { fieldName: res.onBoardingPass || '0', textStyle: { width: 100 } },
      { fieldName: res.jobOn || '0', textStyle: { width: 116 } }
    ];

    return (
      <View style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <View key={index} style={[styles.listItem, renderItem.itemStyle]} >
            <Text style={[styles.itemText1, renderItem.textStyle, renderItem.style]}>{renderItem.fieldName}</Text>
          </View>
        ))}
      </View>
    )
  };

  const res11 = [
    {
      companyId: "1",
      companyName: "富士康",
      num: 10
    },
    {
      companyId: "1",
      companyName: "富士康KSDFH",
      num: 10
    },
    {
      companyId: "1",
      companyName: "富士康",
      num: 10
    },
    {
      companyId: "1",
      companyName: "富士康",
      num: 10
    },
    {
      companyId: "1",
      companyName: "富士康KSDFH",
      num: 10
    },
    {
      companyId: "1",
      companyName: "富士康",
      num: 10
    },
  ]

  const IconItem = [
    {
      label: 'name',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 116, alignItems: 'center' }
    },
    {
      label: 'signUpIntention',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 116, alignItems: 'center' }
    },
    {
      label: 'interviewNoArrive',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 75, alignItems: 'center' }
    },
    {
      label: 'interviewFail',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 70, alignItems: 'center' }
    },
    {
      label: 'interviewPass',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 70, alignItems: 'center' }
    },
    {
      label: 'onBoardingFail',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 100, alignItems: 'center' }
    },
    {
      label: 'onBoardingPass',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 100, alignItems: 'center' }
    },
    {
      label: 'jobOn',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 116, alignItems: 'center' }
    }
  ]

  const getData = async (prams) => {
    try {
      if (index === 0) {
        const res = await DataStatisticApi.SearchStoreGroup(prams)
        setGroupStoreData(res.data)
        console.log('打印获取搜索门店的数据：', res)
        console.log('打印搜索门店请求的参数：', prams)
      } else {
        const res = await DataStatisticApi.SearchCompanyGroup(prams)
        setGroupCompanyData(res.data)
        console.log('打印获取搜索企业的数据：', res)
        console.log('打印搜索企业请求的参数：', prams)
      }
    } catch (error) {
      console.log('打印搜索请求的异常：', error)
    }
  }

  const ModalData = (item, key, value) => {
    const prams = {
      signUpPhaseStatus: " ",
      interviewPhaseStatus: "",
      onBoardingPhaseStatus: "",
      jobPhaseStatus: ""
    }
    if (index === 0) {
      prams.companyId = item.id;
    } else if (index === 1) {
      prams.storeId = item.id;
    } else if (index === 2) {
      prams.supplierId = item.id;
    } else {
      prams.recruiterId = item.id;
    }
    switch (key) {
      case 'signUpIntention':
        prams.signUpPhaseStatus = 'SIGN_UP_INTENTION';
        break;
      case 'interviewNoArrive':
        prams.interviewPhaseStatus = 'INTERVIEW_NO_ARRIVE';
        break;
      case 'interviewFail':
        prams.interviewPhaseStatus = 'INTERVIEW_FAIL';
        break;
      case 'interviewPass':
        prams.interviewPhaseStatus = 'INTERVIEW_PASS';
        break;
      case 'onBoardingFail':
        prams.onBoardingPhaseStatus = 'ON_BOARDING_FAIL';
        break;
      case 'onBoardingPass':
        prams.onBoardingPhaseStatus = 'ON_BOARDING_PASS';
        break;
      case 'jobOn':
        prams.jobPhaseStatus = 'JOB_ON';
        break;
    }
    getData(prams);
    return (
      <View style={[{ height: 300 }]}>
        <View style={styles.titleBox}>
          <Text style={styles.status}>{key === 'signUpIntention' ? '报名人数' : key === 'onBoardingFail' ? '待入职人数' : key == 'onBoardingPass' ? '待入职人数' : key == 'jobOn' ? '在离职人数' : '面试人数'}</Text>
          <Text style={styles.number}>{value}</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {index != 0 && groupCompanyData.length > 0 && groupCompanyData.map((item, index) => (
            <View style={[styles.companyInfo]} >
              <Text style={{ fontSize: 14, color: '#333333' }}>{item.companyName}</Text>
              <Text style={{ fontSize: 14, color: '#333333' }}>{item.num}</Text>
            </View>
          ))}
          {index === 0 && groupStoreData.length > 0 && groupStoreData.map((item, index) => (
            <View style={[styles.companyInfo]} >
              <Text style={{ fontSize: 14, color: '#333333' }}>{item.storeName}</Text>
              <Text style={{ fontSize: 14, color: '#333333' }}>{item.num}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  // 点击图标排序事件
  const sortEvent = async (item) => {
    console.log('点击选择的值：', item)
    const prams = {
      ...searchContent,
      property: item,
    }
    companyData(prams);
  }

  const record = (item, key, value) => {
    console.log('点击选择的值：', item, value, key)
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: item.name,
      dialogComponent: ModalData(item, key, value)
    });
  }

  const renderItem = ({ item }) => {
    const renderList = [
      { fieldName: item.name, textStyle: { width: 116, fontSize: 26, color: '#333' } },
      { fieldName: item.signUpIntention || '0', textStyle: { width: 116 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'signUpIntention')[0], item.signUpIntention) },
      { fieldName: item.interviewNoArrive || '0', textStyle: { width: 75 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'interviewNoArrive')[0], item.interviewNoArrive) },
      { fieldName: item.interviewFail || '0', textStyle: { width: 70 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'interviewFail')[0], item.interviewFail) },
      { fieldName: item.interviewPass || '0', textStyle: { width: 70 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'interviewPass')[0], item.interviewPass) },
      { fieldName: item.onBoardingFail || '0', textStyle: { width: 100 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'onBoardingFail')[0], item.onBoardingFail) },
      { fieldName: item.onBoardingPass || '0', textStyle: { width: 100 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'onBoardingPass')[0], item.onBoardingPass) },
      { fieldName: item.jobOn || '0', textStyle: { width: 116 }, pressFun: () => record(item, Object.keys(item).filter((key) => key === 'jobOn')[0], item.jobOn) }
    ];

    return (
      <View key={item.poolId} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.textStyle, renderItem.style]}>{renderItem.fieldName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  const tabChange = (e) => {
    console.log('切换打印的值：', e);
    setIndex(e)
  }

  const filter = (values) => {
    console.log('values', values)
    setSearchContent({
      pageSize: 20,
      pageNumber: 0,
      startDate: values.dateRange.startDate,
      endDate: values.dateRange.endDate,
      name: values.search,
    });
    setSearchTotal({
      startDate: values.dateRange.startDate,
      endDate: values.dateRange.endDate,
      name: values.search,
    })
  }

  const tabHead = () => {
    return (
      <>
        <View style={styles.tabTopStyle}>
          <View style={styles.ItemStyle}>
            <Text style={styles.title}>招聘企业</Text>
          </View>
          <View style={styles.ItemStyle}>
            <Text style={styles.title}>报名人数</Text>
          </View>
          <View style={styles.centerStyle}>
            <Text style={styles.stageStyle}>面试阶段</Text>
            <View style={styles.stageItemStyle}>
              <Text style={styles.statuStyle}>未去</Text>
              <Text style={styles.statuStyle}>未过</Text>
              <Text style={[styles.statuStyle, { borderRightWidth: 0 }]}>通过</Text>
            </View>
          </View>
          <View style={styles.centerStyle}>
            <Text style={styles.stageStyle}>入职阶段</Text>
            <View style={styles.stageItemStyle}>
              <Text style={styles.inductionStyle}>未报到</Text>
              <Text style={[styles.inductionStyle, { borderRightWidth: 0 }]}>入职</Text>
            </View>
          </View>
          <View style={styles.ItemStyle}>
            <Text style={styles.title}>当前在职</Text>
          </View>
        </View>
        <View style={styles.Icon}>
          {
            IconItem.map((item) => {
              return (
                <TouchableOpacity style={item.styles} onPress={() => sortEvent(item.label)}>
                  {item.Icon}
                </TouchableOpacity>
              )
            })
          }
        </View>
        <View style={styles.Icon}>
          {toTalItem(totalData)}
        </View>
      </>
    )
  }

  return (
    <View style={styles.screen}>
      <HeaderSearch filterFun={filter} noStoreAndStaff companyShow={false} placeholder="请输入搜索" />
      <CenterSelectDate />

      <Tab
        value={index}
        onChange={(e) => tabChange(e)}
        indicatorStyle={{
          backgroundColor: 'none',
          // height: 4,
        }}
        containerStyle={{ padding: 0 }}
      >
        <Tab.Item
          title="企业"
          titleStyle={(active) => ({
            color: active ? "#fff" : '#000',
            fontSize: 32,
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "#409EFF" : '#fff',
            borderRightWidth: 2,
            borderColor: "#EEF4F7",
          })}
        />
        <Tab.Item
          title="门店"
          titleStyle={(active) => ({
            color: active ? "#fff" : '#000',
            fontSize: 32,
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "#409EFF" : '#fff',
            borderRightWidth: 2,
            borderColor: "#EEF4F7",
          })}
        />
        <Tab.Item
          title="供应商"
          titleStyle={(active) => ({
            color: active ? "#fff" : '#000',
            fontSize: 32,
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "#409EFF" : '#fff',
            borderRightWidth: 2,
            borderColor: "#EEF4F7",
          })}
        />
        <Tab.Item
          title="招聘员"
          titleStyle={(active) => ({
            color: active ? "#fff" : '#000',
            fontSize: 32,
          })}
          containerStyle={(active) => ({
            backgroundColor: active ? "#409EFF" : '#fff',
            borderRightWidth: 2,
            borderColor: "#EEF4F7",
          })}
        />
      </Tab>
      {/* <TabView value={index} onChange={setIndex} animationType="spring"> */}
      {/* <TabView.Item style={styles.tabStyle}> */}
      <FlatList
        data={companyDetails}
        ListHeaderComponent={tabHead()}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        renderItem={(item) => renderItem(item)}
        getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
        ListEmptyComponent={() => { return (<Text style={styles.LookMoreStyle}>暂无记录</Text>) }}
      />
      {/* </TabView.Item> */}
      {/* <TabView.Item style={styles.tabStyle}>
            <FlatList
              data={storeDetails}
              ListHeaderComponent={tabHead()}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderItem(item)}
              getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
              ListEmptyComponent={() => { return (<Text style={styles.LookMoreStyle}>暂无记录</Text>) }}
            />
          </TabView.Item>
          <TabView.Item style={styles.tabStyle}>
            <FlatList
              data={supplierDetails}
              ListHeaderComponent={tabHead()}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderItem(item)}
              getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
              ListEmptyComponent={() => { return (<Text style={styles.LookMoreStyle}>暂无记录</Text>) }}
            />
          </TabView.Item>
          <TabView.Item style={styles.tabStyle}>
            <FlatList
              data={recruiterDetails}
              ListHeaderComponent={tabHead()}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderItem(item)}
              getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
              ListEmptyComponent={() => { return (<Text style={styles.LookMoreStyle}>暂无记录</Text>) }}
            />
          </TabView.Item> */}
      {/* </TabView> */}

      <NormalDialog
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4F7',
  },
  Icon: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  totalStyle: {
    height: 30,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
  },
  tabTopStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    height: 132,
    borderWidth: 1,
    borderColor: '#409EFF',
    marginTop: 30,
  },
  ItemStyle: {
    width: 116,
    height: '100%',
    borderRightWidth: 2,
    borderColor: '#409EFF',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  centerStyle: {
    width: 208,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#409EFF',
  },
  stageStyle: {
    width: '100%',
    height: 65,
    borderBottomWidth: 1,
    borderColor: '#409EFF',
    lineHeight: 65,
    textAlign: 'center',
    color: '#000',
    fontSize: 30,
  },
  stageItemStyle: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  statuStyle: {
    height: 65,
    width: '33%',
    lineHeight: 65,
    borderRightWidth: 1,
    borderColor: '#409EFF',
    textAlign: 'center',
    color: '#000',
    fontSize: 30,
  },
  inductionStyle: {
    height: 65,
    width: '50%',
    lineHeight: 65,
    borderRightWidth: 1,
    borderColor: '#409EFF',
    textAlign: 'center',
    color: '#000',
    fontSize: 30,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#000',
    fontSize: 30,
  },
  LookMoreStyle: {
    fontSize: 16,
    color: '#f9f9f9'
  },
  listStyle: {
    minHeight: 35,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  itemText: {
    width: 116,
    fontSize: 26,
    color: '#409EFF',
    textAlign: 'center'
  },
  itemText1: {
    fontSize: 26,
    color: '#333333',
    textAlign: 'center'
  },
  modalStyle: {
    width: '100%',
    minHeight: 280,
  },
  titleBox: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    paddingRight: 20
  },
  status: {
    color: '#409EFF'
  },
  number: {
    color: '#409EFF'
  },
  scrollArea: {
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'red'
  },
  companyInfo: {
    width: '100%',
    minHeight: 35,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)',
    paddingLeft: 15,
    paddingRight: 20
  },
});

export default DATA_Statistics;