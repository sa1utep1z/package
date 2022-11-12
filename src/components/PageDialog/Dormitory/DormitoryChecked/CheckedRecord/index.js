import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";

import { deepCopy } from '../../../../../utils';
import CheckedDetail from "../CheckedDetail";
import { closeDialog } from "../../../../../redux/features/PageDialog";
import * as PageDialog2 from "../../../../../redux/features/PageDialog2";

const CheckedRecord = ({
}) => {
  const dispatch = useDispatch();

  const [recordList, setRecordList] = useState([]);

  useEffect(()=>{
    let arr = [];
    for(let i = 0; i < 10; i++){
      arr.push({
        id: i,
        time: `2022-09-${i + 1}`,
        showDetail: false,
        remark: '本次点检情况描述哈哈哈哈'
      })
    }
    setRecordList(arr);
  },[])

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => dispatch(closeDialog());

  const recordOnPress = (record) => {
    const newArr = deepCopy(recordList);
    const findItemIndex = newArr.findIndex(newItem => newItem.id ===record.id);
    newArr[findItemIndex].showDetail = !record.showDetail;
    setRecordList(newArr);
  };

  const showDetail = (record) => {
    const detailList = {
      hygieneStatus: record.id % 3,
      hygieneImages: [
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
      facilityStatus: record.id % 5,
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
        {
          "fileKey": "laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg",
          "name": "1.png",
          "url": "https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/fa82610d40274cb86d4b0fc5bcee0db.jpg?Expires=1668078019&OSSAccessKeyId=LTAI5tMBEPU2B5rv3XfYcC7m&Signature=QnUsmzEk1zgRbbWcWtunk5C6%2Fmg%3D",
          "md5": "6BF745B469034A38026A0C049FFA1942"
        },
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
    dispatch(PageDialog2.setTitle(`${record.time}点检详情`));
    dispatch(PageDialog2.openDialog(<CheckedDetail isDialog2 detailData={detailList} />));
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <View style={styles.topArea_topTitle}>
          <Text style={styles.topTitle_topText}>宿舍分类：男宿舍</Text>
          <View style={styles.topTitle_bottomArea}>
            <Text style={[styles.bottomArea_text, styles.rightBorder]}>楼栋：241栋</Text>
            <Text style={[styles.bottomArea_text, styles.rightBorder]}>楼层：1F</Text>
            <Text style={styles.bottomArea_text}>房间：504</Text>
          </View>
        </View>
        <ScrollView style={styles.scrollArea}>
          {recordList.map((record, recordIndex) => (
            <View style={styles.scrollView}>
              {!record.showDetail && <TouchableOpacity key={recordIndex} style={styles.recordItem} onPress={() => recordOnPress(record)}>
                <Text style={styles.recordItemText}>{record.time}点检记录</Text>
              </TouchableOpacity>}
              {record.showDetail && <Shadow style={styles.shadowArea}>
                <View style={styles.shadowItem}>
                  <TouchableOpacity key={recordIndex} style={[styles.shadowPressItem, record.showDetail && styles.shadowPressItem_shown]} onPress={() => recordOnPress(record)}>
                    <Text style={styles.shadowPressItem_shownText}>{record.time}点检记录</Text>
                  </TouchableOpacity>
                  <View style={styles.shadowContent}>
                    <View style={styles.shadowContent_left}>
                      <Text style={styles.shadowContent_leftTitle}>本次点检情况描述</Text>
                      <Text style={styles.shadowContent_leftText}>点检情况描述点检情况描述点检情况描述点检情况描述点检情况描述点检情况描述点检情况描述点检情况描述</Text>
                    </View>
                    <TouchableOpacity style={styles.shadowContent_right} onPress={() => showDetail(record)}>
                      <Text style={styles.shadowContent_rightText}>查看详情</Text>
                      <AntDesign style={styles.shadowContent_icon} name='right' size={22} color='#ffffff' />
                    </TouchableOpacity>
                  </View>
                </View>
              </Shadow>}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 900
  },
  topArea: {
    flex: 1
  },
  topArea_topTitle: {
    backgroundColor: '#979797', 
    borderWidth: 1, 
    borderColor: '#999999', 
    borderRadius: 10,
    marginHorizontal: 30,
    marginBottom: 20
  },
  topTitle_topText: {
    fontSize: 26, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#FFFFFF', 
    paddingVertical: 8
  },
  topTitle_bottomArea: {
    flexDirection: 'row'
  },
  bottomArea_text: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    paddingVertical: 6
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#FFFFFF'
  },
  scrollArea: {
    flex: 1, 
    marginBottom: 20
  },
  scrollView: {
    marginHorizontal: 30, 
    marginTop: 10
  },
  recordItem: {
    height: 70,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
    borderColor: '#999999', 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#EFEFEF'
  },
  recordItemText: {
    fontSize: 26, 
    fontWeight: 'bold'
  },
  shadowArea: {
    width: '100%', 
    marginBottom: 20
  },
  shadowItem: {
    borderRadius: 10
  },
  shadowPressItem: {
    height: 70, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
    borderColor: '#999999', 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#EFEFEF'
  },
  shadowPressItem_shown: {
    marginBottom: 0, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0
  },
  shadowPressItem_shownText: {
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#000000'
  },
  shadowContent: {
    flexDirection: 'row',
    padding: 10
  },
  shadowContent_left: {
    flex: 1, 
    padding: 20, 
    borderColor: '#EFEFEF', 
    borderRadius: 10, 
    borderWidth: 1, 
    marginRight: 10
  },
  shadowContent_leftTitle: {
    fontSize: 26, 
    color: '#333333', 
    fontWeight: 'bold', 
    marginBottom: 10
  },
  shadowContent_leftText: {
    fontSize: 24, 
    color: '#333333'
  },
  shadowContent_right: {
    width: 140, 
    height: 55, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 8, 
    alignSelf: 'center', 
    paddingLeft: 8
  },
  shadowContent_rightText: {
    fontSize: 24, 
    color: '#ffffff'
  },
  shadowContent_icon: {
    marginLeft: 2
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  }
})

export default CheckedRecord;