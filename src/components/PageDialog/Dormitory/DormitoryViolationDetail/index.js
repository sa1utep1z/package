import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";

import { closeDialog } from "../../../../redux/features/PageDialog";
import ImageZoom from '../../../ImageZoom';

const DormitoryViolationDetail = ({
  violationDetail
}) => {
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => dispatch(closeDialog());

  const modalOnPress = () => setIsVisible(!isVisible);

  const imageOnPress = (imgList, imgIndex) => {
    setIsVisible(true);
    setImageUrls(imgList);
    setImgIndex(imgIndex);
  };

  return (
    <>
      <View style={styles.totalArea}>
        <ScrollView style={styles.scrollViewArea} showsVerticalScrollIndicator={false}>
          <View style={styles.scrollView_total}>
            <Shadow style={styles.dormitoryArea}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>会员信息</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>姓名</Text>
                    <Text style={styles.rightText}>{violationDetail.name}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>会员工号</Text>
                    <Text style={styles.rightText}>{violationDetail.no}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>手机号</Text>
                    <Text style={styles.rightText}>{violationDetail.mobile}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>身份证号</Text>
                    <Text style={styles.rightText}>{violationDetail.idNo}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>渠道来源</Text>
                    <Text style={styles.rightText}>{violationDetail.from}</Text>
                  </View>
                  {violationDetail.from === 'SUPPLIER' && <View style={styles.textLine}>
                    <Text style={styles.titleText}>供应商：</Text>
                    <Text style={styles.rightText}>{violationDetail.supplier || '无'}</Text>
                  </View>}
                  {violationDetail.from === 'RECRUITER' && <View style={styles.textLine}>
                    <Text style={styles.titleText}>经纪人：</Text>
                    <Text style={styles.rightText}>{memberInfoList.recruitName || '无'}</Text>
                  </View>}
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>归属门店</Text>
                    <Text style={styles.rightText}>{violationDetail.bumen}</Text>
                  </View>
                </View>
              </View>
            </Shadow>
            <Shadow style={styles.dormitoryArea}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>住宿信息</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>宿舍楼栋</Text>
                    <Text style={styles.rightText}>{violationDetail.building}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>宿舍分类</Text>
                    <Text style={styles.rightText}>{violationDetail.dormitoryType}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>宿舍楼层</Text>
                    <Text style={styles.rightText}>{violationDetail.floor}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>房间号</Text>
                    <Text style={styles.rightText}>{violationDetail.room}</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>床位号</Text>
                    <Text style={styles.rightText}>{violationDetail.bed}</Text>
                  </View>
                </View>
              </View>
            </Shadow>
            <Shadow style={[styles.dormitoryArea, {marginBottom: 15}]}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>违纪详情</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>违纪类别</Text>
                    <Text style={styles.rightText}>{violationDetail.violationType}</Text>
                  </View>
                  <View style={styles.photos}>
                    <Text style={styles.titleText}>违纪文字描述</Text>
                    <Text style={styles.rightText}>{violationDetail.violationRemark}</Text>
                  </View>
                  <View style={styles.photoArea}>
                    <Text style={styles.titleText}>违纪照片</Text>
                    <View style={styles.rightPhotosArea}>
                      {violationDetail.violationList.length ? <>
                        {violationDetail.violationList.map((image, imageIndex) => (
                          <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(violationDetail.violationList, imageIndex)}>
                            <Image style={styles.image} source={{ uri: `${image.url}` }} />
                          </TouchableOpacity>))}
                      </> : <Text style={styles.image_null_text}>无</Text>}
                    </View>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>处罚结果</Text>
                    <Text style={styles.rightText}>{violationDetail.punishResult}</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>处罚日期</Text>
                    <Text style={styles.rightText}>{violationDetail.punishDate}</Text>
                  </View>
                </View>
              </View>
            </Shadow>
          </View>
        </ScrollView>
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
      <ImageZoom 
        index={imgIndex} 
        isVisible={isVisible} 
        imageUrls={imageUrls} 
        onShowModal={modalOnPress} 
        onCancel={modalOnPress} 
      />
    </>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 900
  },
  scrollViewArea: {
    flex: 1
  },
  scrollView_total: {
    marginHorizontal: 30,
    marginVertical: 8
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
  },
  dormitoryArea: {
    width: '100%', 
    marginBottom: 30
  },
  dormitoryArea_topArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  dormitoryArea_topAreaText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  dormitoryArea_bottomArea: {
    padding: 10
  },
  photos: {
    minHeight: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    paddingRight: 10
  },
  textLine: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  textLine_right: {
    flexDirection: 'row', 
    paddingRight: 20, 
    alignItems: 'center'
  },
  photoArea: {
    minHeight: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  photoArea_leftText: {
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#409EFF',
    backgroundColor: '#ECF5FF'
  },
  rightPhotosArea: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 10, 
    paddingTop: 10
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    marginBottom: 10
  },
  image_null_text: {
    fontSize: 24, 
    color: '#333333', 
    paddingLeft: 10
  },
  longTextArea: {
    minHeight: 100,
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  longTextTitle: {
    width: 230, 
    height: '100%', 
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold', 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  longText: {
    flex: 1, 
    paddingVertical: 10,
    paddingHorizontal: 20, 
    fontSize: 24, 
    color: '#333333'
  },
  listItem: {
    height: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  lastItem: {
    height: 50, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  titleText: {
    width: 180,
    height: '100%', 
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF',
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold'
  },
  rightText: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 24, 
    paddingLeft: 20, 
    color: '#333333'
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

export default DormitoryViolationDetail;