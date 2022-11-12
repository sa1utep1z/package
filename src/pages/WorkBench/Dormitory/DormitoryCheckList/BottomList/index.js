import React, {useState, useEffect, useRef} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

import { pageEmpty } from "../../../../Home/listComponent";
import Footer from '../../../../../components/FlatList/Footer';
import { openDialog, setTitle } from "../../../../../redux/features/PageDialog";
import NAVIGATION_KEYS from "../../../../../navigator/key";
import CheckedDetail from '../../../../../components/PageDialog/Dormitory/DormitoryChecked/CheckedDetail';
import CheckedRecord from '../../../../../components/PageDialog/Dormitory/DormitoryChecked/CheckedRecord';

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const Total = ({
  type
}) => {
  const navigation = useNavigation();

  const flatListRef = useRef(null);

  const toast = useToast();

  const dispatch = useDispatch();

  const [searchContent, setSearchContent] = useState({status: '', ...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList({...searchContent});
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])
  
  const getList = async(params) => {
    setIsLoading(true);
    try{
      let arr = [];
      for(let i = 0; i < 30; i++){
        arr.push({
          id: i,
          building: `24${i}栋`,
          room: `50${i+1}`,
          checkDate: `2022/3/${i+1}`,
          status: i%5
        })
      }
      setShowList(arr);
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const statusOnPress = async(item) => {
    const detailList = {
      hygieneStatus: item.id % 3,
      hygieneImages: [
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
        // {
        //   "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
        //   "name": "1.png",
        //   "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
        //   "md5": "6BF745B469034A38026A0C049FFA1942"
        // },
        // {
        //   "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
        //   "name": "1.png",
        //   "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
        //   "md5": "6BF745B469034A38026A0C049FFA1942"
        // },
      ],
      facilityStatus: item.id % 5,
      facilityImages: [
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
        // {
        //   "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
        //   "name": "1.png",
        //   "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
        //   "md5": "6BF745B469034A38026A0C049FFA1942"
        // },
      ],
      waterNum: 188,
      electricNum: 1888,
      waterAndElectricImages: [
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
      ],
      remark: '哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      nextCheckDate: '2022-05-17'
    };
    switch(item.status){
      case 0:
        navigation.navigate(NAVIGATION_KEYS.ADD_DORMITORY_CHECKED, {
          item
        });
        break;
      case 1:
        dispatch(setTitle('点检详情'));
        dispatch(openDialog(<CheckedDetail detailData={detailList} />));
        break;
    }
  };

  const recordOnPress = async() => {
    try {
      dispatch(setTitle('点检记录'));
      dispatch(openDialog(<CheckedRecord />));
    } catch (error) {
      console.log('error', error);
    }
  };

  const refresh = () => setSearchContent({...searchContent, ...firstPage});

  const onEndReached = () => {
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };571704

  const renderItem = ({item}) => {
    return (
      <View style={styles.listStyle}>
        <Text style={styles.itemText} ellipsizeMode="tail">{item.building || '无'}</Text>
        <Text style={styles.itemText} ellipsizeMode="tail">{item.room || '无'}</Text>
        <Text style={styles.itemText} ellipsizeMode="tail">{item.checkDate || '无'}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem, {color: item.status === 0 ? '#409EFF' : '#31df07'}]}
          numberOfLines={2}
          onPress={() => statusOnPress(item)}
          ellipsizeMode="tail">{item.status === 0 ? '待点检' : '已点检'}</Text>
        <Text 
          style={[styles.itemText, styles.pressItem]}
          numberOfLines={2}
          onPress={() => recordOnPress(item)}
          ellipsizeMode="tail">查看</Text>
      </View>
    )
  };

  return (
    <FlatList 
      ref={flatListRef}
      data={showList}
      style={{backgroundColor: '#fff'}}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      getItemLayout={(data, index)=>({length: 90, offset: 90 * index, index})}
      refreshing={isLoading}
      onRefresh={refresh}
      initialNumToRender={20}
      ListFooterComponent={<Footer showFooter={showList.length} hasNext={originData.hasNext}/>}
      ListEmptyComponent={pageEmpty()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
      showsVerticalScrollIndicator={true}
    />
  )
};

const styles = StyleSheet.create({
  listStyle: {
    height: 90,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row'
  },
  itemText: {
    flex: 1,
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  pressItem: {
    color: '#409EFF'
  },
});

export default Total;