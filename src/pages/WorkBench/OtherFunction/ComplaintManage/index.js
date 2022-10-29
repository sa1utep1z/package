import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dialog, CheckBox, ListItem } from '@rneui/themed';
import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import FormComplaintDetail from "../../../../components/NormalDialog/FormComplaintDetail";
import MemberDetail from "../../../../components/NormalDialog/MemberDetail";
import SelectItem from '../../../../components/Form/SelectItem';
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import NAVIGATION_KEYS from "../../../../navigator/key";
import ListApi from "../../../../request/ListApi";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ComplaintApi from "../../../../request/ComplaintApi";
import { SUCCESS_CODE, TYPERESULT, TAB_OF_LIST, COMPLAINT_INFO } from "../../../../utils/const";
import { setStartDate, setEndDate } from "../../../../redux/features/RangeDateOfList";
import { deepCopy } from "../../../../utils";
import Clipboard from '@react-native-clipboard/clipboard';
import CallPhone from "../../../../components/NormalDialog/CallPhone";
import { pageEmpty } from "../../../Home/listComponent";
import { setTabName } from "../../../../redux/features/NowSelectTabNameInList";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';
import WaterMark from "../../../../components/WaterMark";
import UserSelect from '../ComplaintManage/UserSelect'
import { Formik, Field } from 'formik';
import moment from 'moment';

let timer;
const firstPage = { pageSize: 20, pageNumber: 0 };

const ComplaintManage = () => {
  const flatListRef = useRef(null);
  const dialogRef = useRef(null);
  const initialValues = {
    transferUserId: '',
  };
  const toast = useToast();

  const navigation = useNavigation();

  const dispatch = useDispatch();
  let restForm;
  const role = useSelector(state => state.roleSwitch.role);
  const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.title;
  const getValue = (optionsData, enumKey) => optionsData.find((val) => val.type === enumKey)?.title;
  const [searchContent, setSearchContent] = useState({ status: '', role, ...firstPage });
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [tabNumberList, setTabNumberList] = useState({});
  const [dialogContent, setDialogContent] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [visible4, setVisible4] = useState(false);
  const [feedbackId, setFeedbackId] = useState(''); // 投诉id
  const [userList, setUserList] = useState([]); // 用户名数据
  const [complainInfo, setComplainInfo] = useState([]); // 投诉详情数据
  const copyContentRef = useRef(''); // 复制内容
  const [showInfoList, setShowInfoList] = useState([
    { type: 'type', title: '问题类型', value: '' },
    { type: 'userName', title: '会员姓名', value: '' },
    { type: 'idNo', title: '身份证号', value: '' },
    { type: 'mobile', title: '手机号码', value: '' },
    { type: 'companyShortName', title: '企业名称', value: '' },
    { type: 'jobOn', title: '是否在职', value: '' },
    { type: 'jobDate', title: '入职日期', value: '' },
    { type: 'createdDate', title: '反馈时间', value: '' },
    { type: 'content', title: '反馈内容', value: '' },
    { type: 'imgs', title: '上传照片', value: [] },
  ]);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      // headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({ ...rest }) => <HeaderCenterSearch routeParams={rest} />
    })
    clearRangeDate();
    return () => dispatch(setTabName(''));
  }, [])

  // 跳转新增页面
  const addComplaint = () => navigation.navigate(NAVIGATION_KEYS.COMPLAINT_ADD);
  // 跳转编辑页面
  const editComplaint = (values) => {
    navigation.navigate(NAVIGATION_KEYS.COMPLAINT_EDIT, {
      msg: values,
    })
  }

  //每次进入页面的时候都清空顶部时间筛选值
  const clearRangeDate = () => {
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
  };

  // useEffect(() => {
  //   timer && clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     getList(searchContent);
  //     getTypeList();
  //   }, 0)
  //   return () => timer && clearTimeout(timer);
  // }, [searchContent])

  useFocusEffect(React.useCallback(() => {
    getList(searchContent);
      getTypeList();
  }, [searchContent]));

  //修改角色时
  useMemo(() => {
    setSearchContent({
      ...searchContent,
      ...firstPage,
      // role
    });
  }, [role])

  const getList = async (params) => {
    setIsLoading(true);
    try {
      const res = await ComplaintApi.ComplaintList(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      //初始数据
      setOriginData(res.data);
      console.log('打印列表数据：', res)
      //渲染的列表（有下一页时）
      if (nextPage) {
        setShowList([...showList, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setShowList([...res.data.content]);
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取用户数据
  const getUserList = async () => {
    try {
      const res = await ComplaintApi.GetUserList();
      console.log('用户名数据：', res)
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取用户数据失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setUserList(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    getUserList();
  }, [])

  const getTypeList = async () => {
    const params = {
      companyId: searchContent?.companyId || '',
      storeId: searchContent?.storeId || '',
      recruiterId: searchContent?.recruiterId || '',
      createDateStart: searchContent?.createDateStart || '',
      createDateEnd: searchContent?.createDateEnd || '',
      nameOrIdNoOrMobile: searchContent?.nameOrIdNoOrMobile || '',
      type: searchContent?.type || '',
      // role
    };
    try {
      const res = await ComplaintApi.ComplaintTotalList(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      setTabNumberList(res.data);
      console.log('打印全部数量：', res, params)
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 会员信息
  const memberDetailOnPress = async (msg) => {
    const poolId = msg?.memberPoolId;
    try {
      const res = await ComplaintApi.MemberDetail(poolId);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，请稍后重试。${data?.msg}`, { type: 'danger' });
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <MemberDetail memberInfoList={res.data} />,
      });
    } catch (err) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 转单
  const pressTransfer = (item) => {
    setVisible4(true);
    setFeedbackId(item.feedbackId);
  };

  // 转单提交
  const onSubmit = async (values) => {
    try {
      console.log('提交参数11：', values)
      const params = {
        transferUserId: values.transferUserId ? values.transferUserId[0].id : '',
      }
      const res = await ComplaintApi.Transfer(feedbackId, params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`${res?.msg}`, { type: 'danger' });
        return;
      }
      toast.show('转单成功');
      getList(searchContent);
      setVisible4(false);
    } catch (error) {
      console.log('errorerrorerrorerrorerrorerror', error)
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  }

  useEffect(() => {
    const copyList = deepCopy(showInfoList);
    for (let key in complainInfo) {
      if (copyList.length) {
        const findItem = copyList.find(item => item.type === key);
        if (findItem) {
          switch (key) {
            case 'type':
              const chanelName = TYPERESULT.find(name => name.value === complainInfo[key]);
              findItem.value = chanelName?.title;
              break;
            case 'createdDate':
              findItem.value = complainInfo[key] ? moment(complainInfo[key]).format('YYYY-MM-DD HH:mm:ss') : '无';
              break;
            case 'jobDate':
              findItem.value = complainInfo[key] ? moment(complainInfo[key]).format('YYYY-MM-DD') : '无';
              break;
            case 'jobOn':
              findItem.value = complainInfo[key] ? complainInfo[key] === true ? '是' : '否' : '无';
              break;
            default:
              findItem.value = complainInfo[key];
              break;
          }
        }
      }
    }
    setShowInfoList(copyList);
    let arr = [];
    for (let key in copyList) {
      arr.push([copyList[key].title, copyList[key].value]);
    }
    const dd = arr.pop();
    let newArr = arr.join('、').replace(/、/g, "\n");
    newArr = newArr.replace(/\,/g, ":");
    copyContentRef.current = newArr;
    console.log('复制的内容：', newArr, dd);
  }, [complainInfo, copyContentRef.current])

  //复制文本
  const handleClipboardContent = () => {
    console.log('你点击了！！！！！', copyContentRef.current);
    //设置内容到剪贴板
    Clipboard.setString(copyContentRef.current);
    //从剪贴板获取内容
    Clipboard.getString().then((content) => {
      toast.show('复制成功');
      dialogRef.current.setShowDialog(false);
    }, (error) => {
      console.log('error:' + error);
    })
  };

  // 查看投诉详情
  const pressDetail = useCallback(async (item) => {
    dialogRef.current.setShowDialog(true);
    console.log('打印详情：', item);
    setComplainInfo(item);
    setDialogContent({
      dialogTitle: '投诉反馈详情',
      dialogComponent: <FormComplaintDetail memberInfoList={item} />,
      confirmText: '一键复制',
      confirmOnPress: handleClipboardContent,
      rightCloseIcon: true,
    });
  }, [complainInfo, copyContentRef.current]);

  const Result = (item) => {
    return (
      <View style={styles.textArea}>
        <View style={styles.titleArea}>
          <Text style={styles.text}>处理人：</Text>
        </View>
        <View>
          <Text style={styles.text}>{item.handlerName || '无'}</Text>
        </View>
      </View>
    )
  }

  // 查看处理结果详情
  const pressResult = useCallback(async (item) => {
    dialogRef.current.setShowDialog(true);
    console.log('打印详情：', item);
    setDialogContent({
      dialogTitle: '处理结果详情',
      dialogComponent: <View>
        <View style={styles.resultArea}>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>处理人：</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>{item.handlerName || '无'}</Text>
          </View>
        </View>
        <View style={styles.resultArea}>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>处理时长：</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>{item.processHours || '无'}</Text>
          </View>
        </View>
        <View style={styles.resultArea}>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>处理结果：</Text>
          </View>
          <View style={{ minWidth: 200, flexDirection: 'row', flexWrap: 'wrap', }}>
            <Text style={{ fontSize: 16, color: '#333' }}>{item.handleResult || '无'}</Text>
          </View>
        </View>
        <View style={styles.resultArea}>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>是否结案：</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, color: '#333' }}>{item.status === 'END' ? '是' : '否' || '无'}</Text>
          </View>
        </View>
      </View>,
      confirmText: '返回',
      rightCloseIcon: true,
    });
  }, [complainInfo, copyContentRef.current]);

  // 催单
  const changeUrge = async (item) => {
    try {
      if (item.feedbackId) {
        const res = await ComplaintApi.UrgeComplaint(item.feedbackId);
        if (res?.code !== SUCCESS_CODE) {
          toast.show(`${res?.msg}`, { type: 'danger' });
          return;
        }
        toast.show('催单成功');
        console.log('催单成功');
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  // 打电话
  const callPhone = useCallback(item => {
    dialogRef.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '温馨提示',
      confirmOnPress: () => {
        Linking.openURL(`tel:${item.mobile}`)
        dialogRef.current.setShowDialog(false);
      },
      dialogComponent: <CallPhone message={item} />
    });
  }, []);

  const filter = (values) => {
    console.log('打印筛选框的值：', values);
    const createDateStart = values.dateRange.startDate;
    const createDateEnd = values.dateRange.endDate;
    const companyId = values.enterprise.length ? values.enterprise[0].value : '';
    const storeId = values.store.length ? values.store[0].value : '';
    const recruiterId = values.staff.length ? values.staff[0].value : '';
    const nameOrIdNoOrMobile = values.search;
    const type = values.type.length ? values.type[0].value : '';

    setSearchContent({
      ...searchContent,
      ...firstPage,
      createDateStart,
      createDateEnd,
      nameOrIdNoOrMobile,
      companyId,
      storeId,
      recruiterId,
      type
    });
  };

  const selectIndex = (selectIndex) => {
    setIndex(selectIndex);
    const selectItem = TAB_OF_LIST.COMPLAINT_LIST.find((item, index) => index === selectIndex);
    const tabName = selectItem.type;
    dispatch(setTabName(tabName));
    if (showList.length) {
      flatListRef?.current?.scrollToIndex({
        index: 0,
        viewPosition: 0
      });
    }
    switch (selectIndex) {
      case 0:
        searchContent.status = '';
        break;
      case 1:
        searchContent.status = 'PREPARING';
        break;
      case 2:
        searchContent.status = 'PROCESSING';
        break;
      case 3:
        searchContent.status = 'END';
        break;
    }
    setSearchContent({ ...searchContent, ...firstPage });
  };

  const refresh = () => setSearchContent({ ...searchContent, ...firstPage });

  const onEndReached = () => {
    if (originData.hasNext) {
      const nextPage = { ...searchContent, pageNumber: searchContent.pageNumber += 1 };
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.boxStyle, { backgroundColor: item.status === 'PREPARING' ? '#FFD6D6' : item.status === 'PROCESSING' ? '#B2FF8E' : '#B5EFFF' }]}>
        <View style={[styles.textArea, { flex: 1, justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.titleArea}>
              <Text style={styles.text}>问题类型：</Text>
            </View>
            <Text style={styles.text}>{getEnumValue(TYPERESULT, item.type)}</Text>
          </View>
          <View style={[styles.pressStyle, { backgroundColor: item.status === 'PREPARING' ? '#FF4040' : item.status === 'PROCESSING' ? '#1FBA00' : '#0065CD' }]}>
            <Text style={styles.status}>{getValue(TAB_OF_LIST.COMPLAINT_LIST, item.status)}</Text>
          </View>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>会员姓名：</Text>
          </View>
          <TouchableOpacity onPress={() => memberDetailOnPress(item)}>
            <Text style={[styles.text, { color: '#409EFF' }]}>{item.userName || '无'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>手机号码：</Text>
          </View>
          <TouchableOpacity onPress={() => callPhone(item)}>
            <Text style={[styles.text, { color: '#409EFF' }]}>{item.mobile || '无'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>身份证号：</Text>
          </View>
          <Text style={styles.text}>{item.idNo || '无'}</Text>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>企业名称：</Text>
          </View>
          <Text style={styles.text}>{item.companyShortName || '无'}</Text>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>是否在职：</Text>
          </View>
          <Text style={styles.text}>{item.jobOn === 'JOB_ON' ? '在职' : '离职'}</Text>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>入职日期：</Text>
          </View>
          <Text style={styles.text}>{item.jobDate ? moment(item.jobDate).format('YYYY-MM-DD') : '无'}</Text>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>反馈内容：</Text>
          </View>
          <TouchableOpacity onPress={() => pressDetail(item)}>
            <Text style={[styles.text, { color: '#409EFF' }]}>查看详情</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>反馈时间：</Text>
          </View>
          <Text style={styles.text}>{item.createdDate ? moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss') : '无'}</Text>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>处理人：</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.text, { color: '#409EFF' }]}>{item.handlerName || '无'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textArea}>
          <View style={styles.titleArea}>
            <Text style={styles.text}>处理结果：</Text>
          </View>
          <TouchableOpacity onPress={() => pressResult(item)}>
            <Text style={[styles.text, { color: '#409EFF' }]}>查看详情</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.operationStyle}>
          <TouchableOpacity style={styles.pressBtn} onPress={() => pressTransfer(item)}>
            <Text style={styles.btnText}>转单</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressBtn} onPress={() => changeUrge(item)}>
            <Text style={styles.btnText}>催单</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressBtn} onPress={() => editComplaint(item)}>
            <Text style={styles.btnText}>编辑</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  const memoList = useMemo(() => showList, [showList])

  return (
    <View style={styles.screen}>
      <HeaderSearch
        filterFun={filter}
        startText="开始日期："
        endText="结束日期："
        typeResult
        clearRangeDate
        singleSelect
      />
      <CenterSelectDate />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.COMPLAINT_LIST.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={() => selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title === '全部' ? tabNumberList.allNums || 0 : tabItem.title === '待处理' ?
                tabNumberList.preparingNums || 0 : tabItem.title === '处理中' ? tabNumberList.processingNums || 0 : tabNumberList.endNums || 0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={{ flex: 1, }}>
        <FlatList
          ref={flatListRef}
          data={memoList}
          style={{ backgroundColor: '#fff' }}
          renderItem={renderItem}
          onRefresh={refresh}
          onEndReached={onEndReached}
          keyExtractor={(item) => item.feedbackId}
          getItemLayout={(data, index) => ({ length: 520, offset: 520 * index, index })}
          refreshing={isLoading}
          initialNumToRender={20}
          ListFooterComponent={<Footer showFooter={memoList.length} hasNext={originData.hasNext} />}
          ListEmptyComponent={<Empty otherEmptyStyle={{ height: 500 }} />}
          onEndReachedThreshold={0.01}
        />
        <WaterMark />
        <Dialog
          isVisible={visible4}
          style={{ width: 580, height: 400 }}
        >
          <Text style={{ color: '#333', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }} >转单分配投诉事件</Text>
          <Dialog.Actions style={{ width: '100%', height: 300 }}>
            <Formik
              initialValues={initialValues}
              handleChange={(e) => console.log('e', e)}
              onSubmit={onSubmit}>
              {({ handleSubmit, ...rest }) => {
                restForm = rest;
                return (
                  <View style={{ flex: 1 }}>
                    <Field
                      name='transferUserId'
                      title="处理人"
                      placeholder='请选择'
                      selectList={userList}
                      inputStyle={{ width: 240, height: 30 }}
                      component={UserSelect}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'center' }}>
                      <Button
                        title="取消"
                        onPress={() => setVisible4(!visible4)}
                        buttonStyle={styles.comfirmStyle}
                        titleStyle={styles.comfirmText}
                        containerStyle={styles.buttonContainerStyle}
                      />
                      <Button
                        title="保存"
                        onPress={handleSubmit}
                        buttonStyle={styles.comfirmStyle}
                        titleStyle={styles.comfirmText}
                        containerStyle={styles.buttonContainerStyle}
                      />
                    </View>
                  </View>
                )
              }}
            </Formik>
          </Dialog.Actions>
        </Dialog>
        <Button
          title="新增投诉"
          onPress={addComplaint}
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.buttonContainerStyle}
          titleStyle={styles.titleStyle}
        />
      </View>
      <NormalDialog
        ref={dialogRef}
        dialogContent={dialogContent}
      />

    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4F7',
  },
  boxStyle: {
    backgroundColor: '#FFD6D6',
    marginHorizontal: 28,
    marginBottom: 28,
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
    minHeight: 520,
  },
  resultArea: {
    width: 200,
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    color: '#000',
    padding: 0
  },
  textArea: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    width: '100%',
    paddingHorizontal: 20,
    color: '#000'
  },
  titleArea: {
    minWidth: 160
  },
  text: {
    color: '#000',
    fontSize: 28
  },
  pressStyle: {
    flexDirection: 'row',
    height: 40,
    // backgroundColor: '#FF4040',
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    alignItems: 'center',
    // paddingVertical: 5,
    padding: 0,
  },
  status: {
    color: '#fff',
    fontSize: 25,
  },
  operationStyle: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5
  },
  pressBtn: {
    flexDirection: 'row',
    alignContent: 'center',
    height: 50,
    marginRight: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#409EFF',
  },
  btnText: {
    color: '#fff',
    fontSize: 26,
  },
  comfirmStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 0,
  },
  comfirmText: {
    fontSize: 16,
    color: '#333'
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 680,
    height: 60,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
    margin: 30,
  },
  buttonContainerStyle: {
    marginHorizontal: 8,
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
    textAlign: 'center'
  },
  listStyle: {
    height: 80,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    marginHorizontal: 32
  },
  listStyle1: {
    height: 80,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row',
    backgroundColor: '#ffcfcf',
    marginHorizontal: 32
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  tabArea: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 32
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
    color: '#333333'
  },
  tab_containerStyle: {
    minHeight: 120,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center'
  },
  tabItem_text: {
    fontSize: 32,
    color: '#333333',
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  }
});

export default ComplaintManage;