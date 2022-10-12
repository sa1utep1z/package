import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Button } from '@rneui/themed';
import { Formik, Field, validateYupSchema } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import Entypo from 'react-native-vector-icons/Entypo';
import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import SelectDate from '../../../../../components/Form/SelectDate';
import MyMembersApi from '../../../../../request/MyMembersApi';
import SelectTags from '../../../../../components/Form/SelectTags';
import { SUCCESS_CODE, ARRIVE_WAY, TYPERESULT } from '../../../../../utils/const';
import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ComplaintApi from "../../../../../request/ComplaintApi";

let restForm;

const SignUpValidationSchema = Yup.object().shape({

});

const initialValues = {
  type: '',
  userName: '',
  mobile: '',
  companyImages: [],
  companyId: '',
  content: '',
};

const AddComplaint = (props) => {
  const navigation = useNavigation();
  // const { route: { params: { msg } } } = props;
  const toast = useToast();

  const [storeList, setStoreList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [companyImage, setCompanyImage] = useState([]); // 企业图片

  useEffect(() => {
    getCompaniesList();
  }, [])

  // 上传图片
  const uploadImage = async (fileName, localFilePath) => {
    const data = new FormData();
    const file = {
      uri: localFilePath, type: 'multipart/form-data', name: fileName,
    };
    data.append('file', file);
    console.log('选择图库照片data的值：', data);
    try {
      const res = await CompanyApi.UploadImages(data)
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}`, { type: 'danger' });
        return;
      }
      console.log('是否执行操作上传', res.data)
      setCompanyImage([...companyImage, res.data]);
      restForm.setFieldValue('imgs', [...companyImage, res.data]);
    } catch (error) {
      toast.show('识别失败，出现异常请联系管理员处理')
    }
  }

  //从图库选择图片
  const openPick = async () => {
    try {
      const pickerImage = await ImagePicker.openPicker({
        cropperChooseText: '确定',
        cropperCancelText: '取消',
        width: 300,
        hignt: 400,
        compressImageMaxWidth: 300,
        cropping: true,
      })
      const fileName = `${pickerImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
      uploadImage(fileName, pickerImage.path);
      console.log('选择图库照片：', pickerImage)
      return pickerImage;
    } catch (err) {
      console.log('选择图库照片err: ', err);
    }
  }

  const delImage = (value) => {
    console.log('打印照片传值：', value);
    const newArr = deepCopy(companyImage);
    const findIndex = newArr.findIndex(item => item.md5 === value);
    if (findIndex > -1) {
      newArr.splice(findIndex, 1);
      setCompanyImage(newArr);
      restForm.setFieldValue('imgs', newArr);
      return;
    }
  }

  const onSubmit = async (values) => {
    console.log('打印上传的参数：',values)
    try {
      const params = {
        ...values,
        type: values.type ? values.type[0].value : '',
        companyId: values.companyId ? values.companyId[0].value : '',
      }
      const res = await ComplaintApi.AddComplaint(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}`, { type: 'danger' });
        return;
      }
      toast.show('新增投诉成功');
      console.log('保存提交成功：', params);
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const getCompaniesList = async () => {
    try {
      const res = await MyMembersApi.CompaniesList();
      if (res.code !== SUCCESS_CODE) {
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      if (res.data.length) {
        res.data.forEach((item, index) => {
          item.title = item.label;
          item.id = index + 1;
        });
        setCompanyList(res.data);
      }
    } catch (err) {
      console.log('err', err);
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpValidationSchema}
      onSubmit={onSubmit}>
      {({ handleSubmit, ...rest }) => {
        restForm = rest;
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, { marginTop: 28 }]}>
                <Field
                  name="type"
                  title="问题类型"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  isRequired
                  validate={value => {
                    let errorMsg;
                    if (value.length === 0) {
                      errorMsg = '请选择问题类型';
                    }
                    return errorMsg;
                  }}
                  selectList={TYPERESULT}
                  component={SelectItem}
                />
                <Field
                  name="userName"
                  title="会员姓名"
                  placeholder="请输入"
                  isRequired
                  inputStyle={{ color: '#333' }}
                  component={FormItem}
                />
                <Field
                  name="mobile"
                  title="手机号码"
                  placeholder="请输入"
                  isRequired
                  inputStyle={{ color: '#333' }}
                  maxLength={11}
                  component={FormItem}
                />
                <Field
                  name="companyId"
                  title="选择企业"
                  noBorder
                  bottomButton
                  singleSelect
                  canSearch
                  inPageField
                  isRequired
                  selectList={companyList}
                  component={SelectItem}
                />
                <Field
                  name="content"
                  title="反馈内容"
                  placeholder="请输入"
                  isRequired
                  inputStyle={{ color: '#333' }}
                  component={FormItem}
                />
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.required}>*</Text>
                    <Text style={styles.text}>上传照片：</Text>
                  </View>
                  <View style={styles.imageBox}>
                    {
                      companyImage.length > 0 && companyImage.map((item, index) => {
                        return (
                          <View style={styles.imags} key={index}>
                            <Image
                              style={{ width: '100%', height: '100%' }}
                              source={{ uri: `${item.url}` }}
                            />
                            <TouchableOpacity style={styles.closeStyle} onPress={() => delImage(item.md5)}>
                              <AntDesign
                                name='close'
                                color='#FFFEFE'
                                size={50}
                              />
                            </TouchableOpacity>
                          </View>
                        )
                      })
                    }
                    <TouchableOpacity style={styles.uploadStyle} onPress={openPick}>
                      <AntDesign
                        name='plus'
                        color='#333'
                        size={50}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.btnArea}>
              <Button
                title="保存"
                onPress={handleSubmit}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.titleStyle}
              />
            </View>
          </View>
        )
      }}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    paddingHorizontal: 28
  },
  buttonStyle: {
    height: 88,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 44
  },
  buttonContainerStyle: {
    marginHorizontal: 8
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  theWayToGo: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10
  },
  btnArea: {
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginBottom: 20
  },
  cardArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 28,
    fontSize: 32,
    paddingBottom: 20
  },
  title: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 30,
    fontSize: 36,
    color: '#333',
  },
  text: {
    fontSize: 36,
    color: '#333',
  },
  required: {
    color: 'red',
    textAlign: 'center',
    textAlignVertical: 'top',
    alignSelf: 'flex-start',
    fontSize: 25
  },
  phoneStyle: {
    flex: 1,
    minHeight: 91,
    flexDirection: 'row',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    textAlign: 'center',
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  label: {
    // paddingVertical: 40,
    fontSize: 32,
    color: '#000',
    lineHeight: 91
  },
  listItem_text: {
    color: '#409EFF',
    fontSize: 32,
  },
  listItem_item: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'center'
  },
  imageBox: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: 30,
  },
  imags: {
    width: 290,
    height: 200,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999999',
    marginRight: 20,
    marginBottom: 20,
    position: 'relative',
  },
  closeStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  uploadStyle: {
    width: 130,
    height: 130,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 5,
  },
});

export default AddComplaint;