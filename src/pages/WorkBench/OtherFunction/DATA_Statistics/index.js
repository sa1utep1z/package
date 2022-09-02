import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Tab, TabView } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import DataStatisticApi from "../../../../request/DataStatisticApi"
import AntDesign from 'react-native-vector-icons/AntDesign';
import NormalDialog from "../../../../components/NormalDialog";
import { useToast } from 'react-native-toast-notifications';
import { empty } from "../../../../pages/Home/listComponent";
import { SUCCESS_CODE } from "../../../../utils/const";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { pageEmpty } from "../../../Home/listComponent";

const DATA_Statistics = () => {
  const dispatch = useDispatch();
  const leftFlatListRef = useRef(null);
  const navigation = useNavigation();
  const toast = useToast();
  const [index, setIndex] = useState(0);
  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });
  const [searchTotal, setSearchTotal] = useState({}); // 查询总数据参数
  const [companyDetails, setCompanyDetails] = useState([]); // 各分组数据
  const [totalData, setTotalData] = useState([]); // 各列表总数据
  const groupStoreData = useRef([]); // 搜索门店分组数据
  const groupCompanyData = useRef([]); // 搜索企业分组数据
  const dialogRef = useRef(null);
  const [dialogContent, setDialogContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [originData, setOriginData] = useState({});
  //滑动到底部的时候会有多次触发底部函数，防抖作用；
  const [load, setLoad] = useState(true);

  const title = ['企业', '门店', '供应商', '招聘员'];
  // let timer;

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerCenterArea: ({ ...rest }) => <HeaderCenterSearch routeParams={rest} />
    })
  }, []);

  // 获取企业总数据
  const companyTotalData = async (value) => {
    try {
      const prams = {
        startDate: value.startDate,
        endDate: value.endDate,
        name: value.search,
      }
      const res = await DataStatisticApi.Company(prams)
      if (res.code === 0) {
        setTotalData(res.data);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 获取企业分组数据
  const companyData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.CompanyGroup(prams)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      console.log('获取企业数据参数：', prams)
      console.log('获取企业数据：', res)
      //渲染的列表（有下一页时）
      if (nextPage) {
        setCompanyDetails([...companyDetails, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setCompanyDetails(res.data.content);
    } catch (err) {
      toast.show(`出现异常，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取门店总数据
  const storeTotalData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.Store(prams)
      if (res.code === 0) {
        setTotalData(res.data);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }

  };
  // 获取门店分组数据
  const storeGroupData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.StoreGroup(prams)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      console.log('获取门店数据参数：', prams)
      console.log('获取门店数据：', res)
      //渲染的列表（有下一页时）
      if (nextPage) {
        setCompanyDetails([...companyDetails, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setCompanyDetails(res.data.content);
    } catch (err) {
      toast.show(`出现异常，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取供应商总数据
  const supplierTotalData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.Supplier(prams)
      if (res.code === 0) {
        setTotalData(res.data);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }

  };
  // 获取供应商分组数据
  const supplierData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.SupplierGroup(prams)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      console.log('获取供应商数据参数：', prams)
      console.log('获取供应商数据：', res)
      //渲染的列表（有下一页时）
      if (nextPage) {
        setCompanyDetails([...companyDetails, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setCompanyDetails(res.data.content);
    } catch (err) {
      toast.show(`出现异常，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取招聘员总数据
  const recruiterTotalData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.Recruiter(prams)
      if (res.code === 0) {
        setTotalData(res.data);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 获取招聘员分组数据
  const recruiterData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await DataStatisticApi.RecruiterGroup(prams)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      console.log('获取招聘员数据参数：', prams)
      console.log('获取招聘员数据：', res)
      //渲染的列表（有下一页时）
      if (nextPage) {
        setCompanyDetails([...companyDetails, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setCompanyDetails(res.data.content);
    } catch (err) {
      toast.show(`出现异常，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (index === 0 && searchContent.startDate) {
      companyData(searchContent);
      companyTotalData(searchContent);
    } else if (index === 1) {
      storeTotalData(searchContent);
      storeGroupData(searchContent);
    } else if (index === 2) {
      supplierTotalData(searchContent);
      supplierData(searchContent);
    } else if (index === 3) {
      recruiterTotalData(searchContent)
      recruiterData(searchContent)
    }
  }, [index, searchContent]);

  const toTalItems = (res) => {
    const renderList = [
      { fieldName: res.total || '0', textStyle: { width: 160, fontSize: 26, } },
      { fieldName: res.signUp || '0', textStyle: { width: 100 } },
      { fieldName: res.signUpIntention || '0', textStyle: { width: 99 } },
      { fieldName: res.interviewNoArrive || '0', textStyle: { width: 67 } },
      { fieldName: res.interviewFail || '0', textStyle: { width: 65 } },
      { fieldName: res.interviewPass || '0', textStyle: { width: 66 } },
      { fieldName: res.onBoardingFail || '0', textStyle: { width: 101 } },
      { fieldName: res.onBoardingPass || '0', textStyle: { width: 98 } },
      { fieldName: res.jobOn || '0', textStyle: { width: 163 } }
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


  const IconItem = [
    {
      label: 'name',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 162, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'signUp',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 102, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'signUpIntention',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 101, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'interviewNoArrive',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 69, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'interviewFail',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 67, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'interviewPass',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 68, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'onBoardingFail',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 103, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'onBoardingPass',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 100, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    },
    {
      label: 'jobOn',
      Icon: <AntDesign
        name='caretdown'
        size={32}
        color='#409EFF'
      />,
      styles: { width: 165, alignItems: 'center', borderRightWidth: 2, borderColor: '#409EFF' }
    }
  ]

  const getData = async (prams) => {
    try {
      if (index === 0) {
        const res = await DataStatisticApi.SearchStoreGroup(prams)
        if (res.code === 0) {
          groupStoreData.current = res.data
        }
      } else {
        const res = await DataStatisticApi.SearchCompanyGroup(prams)
        if (res.code === 0) {
          groupCompanyData.current = res.data
        }
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const ModalData = (item, key, value) => {
    return (
      <View style={[{ minHeight: 200 }]}>
        <View style={styles.titleBox}>
          <Text style={styles.status}>{key === 'signUpIntention' ? '报名有意愿人数' : key === 'signUp' ? '报名邀约人数' : key === 'onBoardingFail' ? '未报到人数' : key == 'onBoardingPass' ? '入职人数' : key == 'jobOn' ? '在职人数' : key == 'interviewNoArrive' ? '面试未去' : key == 'interviewFail' ? '面试未过' : '面试通过'}</Text>
          <Text style={styles.number}>{value}</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {index != 0 && groupCompanyData.current.length > 0 && groupCompanyData.current.map((item, index) => (
            <View style={[styles.companyInfo]} >
              <Text style={styles.nameStyle}>{item.companyName}</Text>
              <Text style={styles.nameStyle}>{item.num}</Text>
            </View>
          ))}
          {index === 0 && groupStoreData.current.length > 0 && groupStoreData.current.map((item, index) => (
            <View style={[styles.companyInfo]} >
              <Text style={styles.nameStyle}>{item.storeName}</Text>
              <Text style={styles.nameStyle}>{item.num}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  // 点击图标排序事件
  const sortEvent = async (item) => {
    const prams = {
      ...searchContent,
      property: item,
      pageNumber: 0,
    }
    if (item === 'name') {
      prams.direction = 'ASC'
    }
    console.log('打印排序参数：', prams)
    setSearchContent(prams)
    if (index === 0) {
      companyData(prams);
    } else if (index === 1) {
      storeGroupData(prams);
    } else if (index === 2) {
      supplierData(prams);
    } else {
      recruiterData(prams)
    }
  }

  const record = (item, key, value) => {
    const prams = {
      signUpPhaseStatus: "",
      interviewPhaseStatus: "",
      onBoardingPhaseStatus: "",
      jobPhaseStatus: "",
      startDate: searchContent?.startDate,
      endDate: searchContent?.endDate,
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
      case 'signUp':
        prams.signUpPhaseStatus = 'SIGN_UP';
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
      default:
        break;
    }

    getData(prams)
      .then((res) => {
        dialogRef.current.setShowDialog(true);
        setDialogContent({
          dialogTitle: item.name,
          bottomButton: false,
          rightClose: <AntDesign
            name='closecircleo'
            size={20}
            onPress={() => dialogRef.current.setShowDialog(false)}
          />,
          dialogComponent: ModalData(item, key, value)
        });
      })
  }

  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={[styles.listStyle]}>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 160, color: '#333' }]}
            numberOfLines={2}
            ellipsizeMode="tail">{item.name}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 100 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'signUp')[0], item.signUp)}
            ellipsizeMode="tail">{item.signUp || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 99 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'signUpIntention')[0], item.signUpIntention)}
            ellipsizeMode="tail">{item.signUpIntention || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 67 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'interviewNoArrive')[0], item.interviewNoArrive)}
            ellipsizeMode="tail">{item.interviewNoArrive || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 65 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'interviewFail')[0], item.interviewFail)}
            ellipsizeMode="tail">{item.interviewFail || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 67 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'interviewPass')[0], item.interviewPass)}
            ellipsizeMode="tail">{item.interviewPass || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 100 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'onBoardingFail')[0], item.onBoardingFail)}
            ellipsizeMode="tail">{item.onBoardingFail || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 99 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'onBoardingPass')[0], item.onBoardingPass)}
            ellipsizeMode="tail">{item.onBoardingPass || '0'}</Text>
        </View>
        <View style={styles.listItem}>
          <Text
            style={[styles.itemText, { width: 162 }]}
            numberOfLines={2}
            onPress={() => record(item, Object.keys(item).filter((key) => key === 'jobOn')[0], item.jobOn)}
            ellipsizeMode="tail">{item.jobOn || '0'}</Text>
        </View>
      </View>
    )
  };

  const filter = (values) => {
    setSearchContent({
      pageSize: 20,
      pageNumber: 0,
      startDate: values.dateRange.startDate,
      endDate: values.dateRange.endDate,
      name: values.search,
    });
    console.log('打印值：', values)
  }

  // 刷新
  const refresh = () => setSearchContent({ ...searchContent });
  const onEndReached = () => {
    if (!load) return;
    if (originData.hasNext) {
      console.log('6666666')
      const nextPage = { ...searchContent, pageNumber: searchContent.pageNumber += 1 };
      setSearchContent(nextPage);
      setNextPage(true);
    }
    setLoad(false);
  };

  const selectIndex = (i) => {
    setIndex(i);
    setSearchContent({ ...searchContent, pageNumber: 0 });
  };

  const tabHead = () => {
    return (
      <>
        <View style={[styles.tabTopStyle]}>
          <View style={styles.ItemStyle}>
            <Text style={styles.title}>{index === 0 ? '招聘企业' : index === 1 ? '门店名称' : index === 2 ? '供应商名' : '招聘专员'}</Text>
          </View>
          <View style={[styles.centerStyle]}>
            <Text style={styles.stageStyle}>报名人数</Text>
            <View style={styles.stageItemStyle}>
              <Text style={styles.inductionStyle}>邀约</Text>
              <Text style={[styles.inductionStyle, { borderRightWidth: 0 }]}>有意愿</Text>
            </View>
          </View>
          <View style={[styles.centerStyle, { width: 200 }]}>
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
          {toTalItems(totalData)}
        </View>
      </>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch withoutCompanyFilter filterFun={filter} noStoreAndStaff companyShow={false} placeholder="请输入企业名称" />
      <CenterSelectDate />
      <View style={styles.tab_containerStyle}>
        {title.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={[styles.tabItem, active && { backgroundColor: '#409EFF' }]} onPress={() => selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <ScrollView horizontal={true}>
        <View style={styles.flatStyle}>
          <FlatList
            data={companyDetails}
            ListHeaderComponent={tabHead()}
            refreshing={isLoading}
            onRefresh={refresh}
            onEndReached={onEndReached}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderItem(item)}
            getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
            initialNumToRender={20}
            ListFooterComponent={<Text style={styles.bottomText}>{originData?.hasNext ? '加载中...' : '没有更多数据'}</Text>}
            ListEmptyComponent={pageEmpty()}
            onEndReachedThreshold={0.01}
            onScrollEndDrag={() => setLoad(true)}
            stickyHeaderIndices={[0]}
          />
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
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
    borderWidth: 2,
    borderColor: '#409EFF',
    backgroundColor: '#fff',
  },
  ItemStyle: {
    width: 160,
    height: '100%',
    borderRightWidth: 2,
    borderColor: '#409EFF',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  centerStyle: {
    width: 200,
    height: '100%',
    borderRightWidth: 2,
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
    borderRightWidth: 2,
    borderColor: '#409EFF',
    textAlign: 'center',
    color: '#000',
    fontSize: 30,
  },
  inductionStyle: {
    height: 65,
    width: '50%',
    lineHeight: 65,
    borderRightWidth: 2,
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
    minHeight: 80,
    borderBottomWidth: 2,
    borderColor: '#409EFF',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    borderRightWidth: 2,
    borderColor: '#409EFF',
  },
  itemText: {
    width: 116,
    minHeight: 35,
    fontSize: 26,
    color: '#409EFF',
    textAlign: 'center',
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
  nameStyle: {
    fontSize: 14,
    color: '#333333'
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26,
    color: '#CCCCCC',
    marginTop: 10
  },
  tab_containerStyle: {
    height: 75,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    borderRightWidth: 2,
    borderColor: "#EEF4F7",
    // backgroundColor: 'red'
  },
  tabItem_text: {
    fontSize: 32,
    textAlign: 'center',
  },
  tabItem_titleStyle_active: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollTab: {
    width: '100%',
    overflowX: 'scroll'
  },
  flatStyle: {
    // width: 750,
    overflowX: 'scroll',
    // flex: 1,
    paddingTop: 30,
  },
  style1: {
    width: 160,
    fontSize: 26,
    color: '#333',
    paddingLeft: 20,
    paddingRight: 20,
  },
  style2: {
    width: 160,
    fontSize: 26,
    color: '#333',
  },
});

export default DATA_Statistics;