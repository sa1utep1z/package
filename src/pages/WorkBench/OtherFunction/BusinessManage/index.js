import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/themed';
import NAVIGATION_KEYS from '../../../../navigator/key';
import CompanyApi from '../../../../request/companyApi';
import { useNavigation } from '@react-navigation/native';
import { SITSTAND, DRESS, COMPANY_SHIFT, COMPANY_TYPE } from '../../../../utils/const';
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';


const BusinessManage = () => {
  const flatListRef = useRef(null);
  const getEnumValue = (optionsData, enumKey) => optionsData.find((val) => val.value === enumKey)?.title;
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });
  const [companyList, setCompanyList] = useState([]); // 企业列表数组
  const [companyTotalList, setCompanyTotalList] = useState({}); // 企业列表数据统计
  const [originData, setOriginData] = useState({});
  //滑动到底部的时候会有多次触发底部函数，防抖作用；
  const [load, setLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);

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

  const onChangeText = (value) => {
    setSearch(value);
    console.log('输入的值：', value);
  };

  // 获取企业列表统计
  const companyTotalData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await CompanyApi.CompanyTotalList(prams)
      if (res.code === 0) {
        console.log('打印列表数据：', res);
        setCompanyTotalList(res.data);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  // 获取企业列表
  const companyData = async (value) => {
    try {
      const prams = {
        ...value,
      }
      const res = await CompanyApi.CompanyList(prams)
      if (res.code === 0) {
        setOriginData(res.data);
        console.log('打印列表数据：', res);
        //渲染的列表（有下一页时）
        if (nextPage) {
          setCompanyList([...companyList, ...res.data.content]);
          setNextPage(false);
          return;
        }
        //无下一页（第一页）
        setCompanyList(res.data.content);
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const searchOnPress = () => {
    const prams = {
      ...searchContent,
      nameOrArea: search,
    }
    companyData(prams);
    companyTotalData(prams);
    console.log('点击了搜索:', prams);
  };

  useEffect(() => {
    companyData(searchContent);
    companyTotalData(searchContent);
  }, [searchContent]);

  const addBusiness = () => navigation.navigate(NAVIGATION_KEYS.BUSINESS_ADD);
  const editBusiness = (value) => {
    navigation.navigate(NAVIGATION_KEYS.BUSINESS_EDIT, {
      companyId: value,
    })
  };
  const tabHead = () => {
    return (
      <View style={{ backgroundColor: '#fff', marginBottom: 20, padding: 20 }}>
        <View style={styles.topArea}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={text => onChangeText(text)}
            value={search}
            placeholder="输入地区、企业"
            clearTextOnFocus
            placeholderTextColor="#999999"
          />
          <View style={styles.border}></View>
          <TouchableOpacity style={styles.pressArea} onPress={searchOnPress}>
            <AntDesign
              name='search1'
              color='#409EFF'
              style={{ marginRight: 10 }}
              size={40}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.total}>
          <Text style={styles.title}>全部</Text>
          <Text style={styles.text}>{companyTotalList.allNums || 0}</Text>
          <Text style={styles.title}>个企业</Text>
          <Text style={[styles.text, { marginLeft: 20 }]}>A</Text>
          <Text style={styles.title}>类</Text>
          <Text style={styles.text}>{companyTotalList.anums || 0}</Text>
          <Text style={styles.title}>个</Text>
          <Text style={[styles.text, { marginLeft: 20 }]}>B</Text>
          <Text style={styles.title}>类</Text>
          <Text style={styles.text}>{companyTotalList.bnums || 0}</Text>
          <Text style={styles.title}>个</Text>
          <Text style={[styles.text, { marginLeft: 20 }]}>C</Text>
          <Text style={styles.title}>类</Text>
          <Text style={styles.text}>{companyTotalList.cnums || 0}</Text>
          <Text style={styles.title}>个</Text>
        </View>
      </View>
    )
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.contentBox} key={item.companyId}>
        <View style={styles.left}>
          <Image style={{ width: '100%', height: '100%', borderRadius: 8 }} source={{ uri: `${item.companyImage}` }} />
        </View>
        <View style={styles.right}>
          <View style={styles.content}>
            <Text style={styles.title}>{item.shortCompanyName}</Text>
            <Text style={styles.number}>{getEnumValue(COMPANY_SHIFT, item.scale)}</Text>
            <Text style={styles.area}>{item.city + item.area}</Text>
          </View>
          <View style={styles.rightIcon}>
            <TouchableOpacity onPress={() => editBusiness(item.companyId)}>
              <AntDesign
                name='caretright'
                color='#409EFF'
                size={40}
              />
            </TouchableOpacity>
            <Text style={styles.letter}>{getEnumValue(COMPANY_TYPE, item.companyType)}</Text>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <View style={styles.flatStyle}>
        <FlatList
          ref={flatListRef}
          data={companyList}
          ListHeaderComponent={tabHead()}
          refreshing={isLoading}
          onRefresh={refresh}
          onEndReached={onEndReached}
          keyExtractor={(item) => item.companyId}
          renderItem={(item) => renderItem(item)}
          getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
          initialNumToRender={20}
          ListFooterComponent={<Footer showFooter={companyList.length} hasNext={originData.hasNext} />}
          ListEmptyComponent={<Empty otherEmptyStyle={{ height: 500 }} />}
          onEndReachedThreshold={0.01}
          onScrollEndDrag={() => setLoad(true)}
          stickyHeaderIndices={[0]}
        />
      </View>
      <Button
        title="新增企业"
        onPress={addBusiness}
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonContainerStyle}
        titleStyle={styles.titleStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4F7',
    padding: 30
  },
  flatStyle: {
    flex: 1,
    overflowX: 'scroll'
  },
  topArea: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  inputStyle: {
    width: 560,
    fontSize: 28,
    padding: 0,
    paddingLeft: 20,
  },
  border: {
    width: 1,
    height: 40,
    borderRightWidth: 1,
    borderColor: '#409EFF',
  },
  pressArea: {
    width: 60,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  total: {
    flexDirection: 'row',
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#409EFF',
  },
  contentBox: {
    width: 680,
    height: 200,
    backgroundColor: '#fff',
    marginBottom: 30,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  left: {
    width: 140,
    height: 150,
  },
  content: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  number: {
    fontSize: 28,
    color: '#333',
  },
  area: {
    fontSize: 24,
    color: '#333',
  },
  right: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
    marginLeft: 20
  },
  rightIcon: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  letter: {
    fontSize: 35,
    color: '#409EFF',
    textAlign: 'right'
  },
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 50,
    marginTop: 30,
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
});

export default BusinessManage;