import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import moment from "moment";

import { closeDialog } from "../../../../redux/features/PageDialog";
import ImageZoom from '../../../ImageZoom';
import DormitoryViolationApi from "../../../../request/Dormitory/DormitoryViolationApi";
import { SUCCESS_CODE, VIOLATION_TYPE_LIST_NAME, DORMITORY_VIOLATION_LIST } from "../../../../utils/const";

const DormitoryViolationDetail = ({
  item
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isVisible, setIsVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [memberDetail, setMemberDetail] = useState({}); //会员信息
  const [memberLoading, setMemberLoading] = useState(false);
  const [violationDetail, setViolationDetail] = useState({}); //违纪详情
  const [violationLoading, setViolationLoading] = useState(false);

  useEffect(()=>{
    queryMemberDormitoryInfo(item.idNo);
  },[])

  const queryMemberDormitoryInfo = async(idNo) => {
    try {
      setMemberLoading(true);
      const res = await DormitoryViolationApi.queryMemberDormitoryInfo(idNo);
      console.log('queryMemberDormitoryInfo -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setMemberDetail(res.data);
      queryMemberViolationInfo(item.id);
    } catch (error) {
      console.log('queryMemberDormitoryInfo -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setMemberLoading(false);
    }
  };

  const queryMemberViolationInfo = async(violationId) => {
    try {
      setViolationLoading(true);
      const res = await DormitoryViolationApi.queryMemberViolationInfo(violationId);
      console.log('queryMemberViolationInfo -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setViolationDetail(res.data);
    } catch (error) {
      console.log('queryMemberViolationInfo -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setViolationLoading(false);
    }
  };

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
          {memberLoading && <ActivityIndicator size={48} color="#409EFF" style={{marginBottom: 20}}/>}
          <View style={styles.scrollView_total}>
            <Shadow style={styles.dormitoryArea}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>会员信息</Text>
                </View>
                <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>姓名</Text>
                    <Text selectable style={styles.rightText}>{memberDetail.name || '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>会员工号</Text>
                    <Text selectable style={[styles.rightText, {color: '#409EFF'}]}>{memberDetail.jobNo || '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>手机号</Text>
                    <Text selectable style={[styles.rightText, {color: '#409EFF'}]}>{memberDetail.mobile || '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>身份证号</Text>
                    <Text selectable style={[styles.rightText, {color: '#409EFF'}]}>{memberDetail.idNo || '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>渠道来源</Text>
                    <Text style={styles.rightText}>{memberDetail.signUpType === 'SUPPLIER' ? '供应商' : '门店录入' || '无'}</Text>
                  </View>
                  {memberDetail.signUpType === 'SUPPLIER' && <View style={styles.textLine}>
                    <Text style={styles.titleText}>供应商：</Text>
                    <Text style={styles.rightText}>{memberDetail.supplierName || '无'}</Text>
                  </View>}
                  {memberDetail.signUpType === 'RECRUITER' && <View style={styles.textLine}>
                    <Text style={styles.titleText}>经纪人：</Text>
                    <Text style={styles.rightText}>{memberDetail.recruiterName || '无'}</Text>
                  </View>}
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>归属门店</Text>
                    <Text style={styles.rightText}>{memberDetail.storeName || '无'}</Text>
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
                    <Text style={styles.rightText}>{memberDetail.buildingName || '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>宿舍分类</Text>
                    <Text style={styles.rightText}>{memberDetail.idNo ? `${memberDetail.idNo[17] % 2 === 0 ? '女生宿舍' : '男生宿舍'}` : '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>宿舍楼层</Text>
                    <Text style={styles.rightText}>{memberDetail.floorName ? `${memberDetail.floorName}F` : '无'}</Text>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>房间号</Text>
                    <Text style={styles.rightText}>{memberDetail.roomName ? `${memberDetail.roomName}房` : '无'}</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>床位号</Text>
                    <Text style={styles.rightText}>{memberDetail.bedName ? `${memberDetail.bedName}床` : '无'}</Text>
                  </View>
                </View>
              </View>
            </Shadow>
            <Shadow style={[styles.dormitoryArea, {marginBottom: 15}]}>
              <View style={{borderRadius: 10}}>
                <View style={styles.dormitoryArea_topArea}>
                  <Text style={styles.dormitoryArea_topAreaText}>违纪详情</Text>
                </View>
                {!violationLoading ? <View style={styles.dormitoryArea_bottomArea}>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>违纪类别</Text>
                    <Text style={styles.rightText}>{violationDetail.type ? VIOLATION_TYPE_LIST_NAME[violationDetail.type] : '无'}</Text>
                  </View>
                  <View style={styles.photos}>
                    <Text style={styles.titleText}>违纪文字描述</Text>
                    <Text style={styles.rightText}>{violationDetail.desc || '无'}</Text>
                  </View>
                  <View style={styles.photoArea}>
                    <Text style={styles.titleText}>违纪照片</Text>
                    <View style={styles.rightPhotosArea}>
                      {violationDetail.pic && violationDetail.pic.length ? <>
                        {violationDetail.pic.map((image, imageIndex) => (
                          <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(violationDetail.pic, imageIndex)}>
                            <Image style={styles.image} source={{ uri: `${image.url}` }} />
                          </TouchableOpacity>))}
                      </> : <Text style={styles.image_null_text}>无</Text>}
                    </View>
                  </View>
                  <View style={styles.textLine}>
                    <Text style={styles.titleText}>处罚结果</Text>
                    <Text style={styles.rightText}>{violationDetail.result ? DORMITORY_VIOLATION_LIST[violationDetail.result] : '无'}</Text>
                  </View>
                  <View style={styles.lastItem}>
                    <Text style={styles.titleText}>处罚日期</Text>
                    <Text style={styles.rightText}>{violationDetail.date ? moment(violationDetail.date).format('YYYY年MM月DD日') : '无'}</Text>
                  </View>
                </View> : <ActivityIndicator size={48} color="#409EFF" style={{marginVertical: 20}}/>}
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