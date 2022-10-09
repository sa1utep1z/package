import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, TextInput, TouchableOpacity, Image, SafeAreaView, } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import { Formik, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import FormItem from '../../../../../components/Form/FormItem';
import SelectItem from '../../../../../components/Form/SelectItem';
import CitySelect from '../../../../../components/CitySelect';
import Radio from '../../../../../components/Form/Radio';
import RadioGroup from '../../../../../components/Form/RadioGroup';
import ImagePicker from 'react-native-image-crop-picker';
import CompanyApi from '../../../../../request/companyApi';
import { deepCopy, getYMD } from '../../../../../utils';
import UserSelect from '../UserSelect'
import { CityData } from '../../../../../assets/City';
import MobileInput from "../../../../../components/OrderForm/MobileInput";
import { SUCCESS_CODE, SITSTAND, DRESS, COMPANY_SHIFT, MICROSCOPE, DORMITORY, COMPANY_FOOD, COMPANY_PHONE, COMPANY_LINE, COMPANY_IDCARD, COMPANY_ENGLISH, TATTOOSMOKE, RETURNFACTORY, STUDENTPROVE, BACKGROUND, COMPANYNATIONALITY, COMPANY_SCALE, COMPANY_TYPE, COMPANY_INDUSTRY } from '../../../../../utils/const';



let restForm;
const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('请输入企业全称'),
  shortCompanyName: Yup.string().required('请输入企业简称'),
  companyNo: Yup.string().required('请输入企业代号'),
  scale: Yup.array().min(1, '请选择企业规模'),
  industry: Yup.array().min(1, '请选择所属行业'),
  companyType: Yup.array().min(1, '请选择企业类别'),
  companyGoodTags: Yup.array().min(1, '请输入企业优势'),
  companyImages: Yup.array().min(1, '请上传企业照片'),
  region: Yup.string().required('请选择区域地址'),
  addressDetail: Yup.string().required('请输入企业位置'),
  receiveAddress: Yup.string().required('请输入接人地址'),
  payDay: Yup.string().required('请输入发薪日期'),
  payCycleStart: Yup.string().required('请输入起始发薪日期'),
  payCycleEnd: Yup.string().required('请输入结束发薪日期'),
  shiftCategory: Yup.string().required('请选择班别'),
  sitStand: Yup.string().required('请选择站坐'),
  dress: Yup.array().min('请选择着装'),
  line: Yup.string().required('请选择产线'),
  microscope: Yup.string().required('请选择显微镜'),
  dormitory: Yup.string().required('请选择住宿条件'),
  food: Yup.string().required('请选择伙食'),
  phone: Yup.string().required('请选择手机'),
  idCard: Yup.string().required('请选择身份证'),
  english: Yup.string().required('请选择英文字母'),
  returnFactory: Yup.string().required('请选择返厂条件'),
  tattooSmoke: Yup.string().required('请选择纹身烟疤'),
  nationality: Yup.string().required('请选择民族限制'),
  background: Yup.string().required('请选择案底是否可要'),
  studentProve: Yup.string().required('请选择学生证明'),
  examine: Yup.string().required('请输入体检要求'),
  idCardCopy: Yup.string().required('请输入身份证复印件要求'),
  graduateCopy: Yup.string().required('请输入毕业证复印件要求'),
  photo: Yup.string().required('请输入照片要求'),
  itineraryCode: Yup.string().required('请输入行程码要求'),
  nucleicAcid: Yup.string().required('请输入核酸要求'),
  vaccination: Yup.string().required('请输入疫苗要求'),
});

const BusinessAdd = (props) => {
  const { navigation, route: { params } } = props;
  // const [orderId, setOrderId] = useState(params?.orderId); // 订单id
  const [modalVisible, setModalVisible] = useState(false); // 图库选择、拍照弹框
  const toast = useToast();
  const [userList, setUserList] = useState([]); // 用户名数据
  const [orderTime, setOrderTime] = useState(new Date()); // 日期
  const [content, setContent] = useState(''); // 公司简介内容
  const [payDay, setPayDay] = useState(''); // 发薪日
  const [payStart, setPayStart] = useState(''); // 发薪起始
  const [payEnd, setPayEnd] = useState(''); // 发薪结束
  const [tag, setTag] = useState(''); // 标签值
  const [tagArry, setTagArry] = useState([]); // 标签数组
  const [companyImage, setCompanyImage] = useState([]); // 企业图片
  const [cityValue, setCityValue] = useState([]); // 选择的城市数据
  const [addTags, setAddTags] = useState(true); // 添加标签显隐
  const [selected, setSelected] = useState([]); //地区选择数组
  const [contactFields, setContactFields] = useState([
    {
      userId: '',
      userName: '',
      mobile: '',
    },
  ]); // 驻场对接人
  const [businessFields, setBusinessFields] = useState([
    {
      userId: '',
      userName: '',
      mobile: '',
    },
  ]); // 商务对接人
  const [financesFields, setFinancesFields] = useState([
    {
      userId: '',
      userName: '',
      mobile: '',
    },
  ]); // 财务对接人

  const initialValues = {
    companyName: '',
    shortCompanyName: '',
    companyNo: '',
    scale: '',
    receiveAddress: '',
    region: '',
    companyType: [],
    companyScale: [],
    industry: [],
    address: '',
    microscope: '',
    region: '',
    position: '',
    idCardCopy: '',
    graduateCopy: '',
    photo: '',
    itineraryCode: '',
    nucleicAcid: '',
    vaccination: '',
    contactResidents: [],
    contactBusiness: [],
    contactFinances: [],
    idCard: '',
    companyIntroduction: '',
    addressDetail: '',
    payDay: '',
    payStart: '',
    payEnd: '',
    companyGoodTags: [],
    companyImages: companyImage,
    remark: '',
    tip: true,
    examine: '',
    background: '',
    studentProve: '',
    nationality: '',
    tattooSmoke: '',
    returnFactory: '',
    english: '',
    phone: '',
    food: '',
    dormitory: '',
    line: '',
    dress: '',
    sitStand: '',
    shiftCategory: '',
  };

  // 获取默认企业图片
  const getImage = async () => {
    const res = await CompanyApi.getDefaultImage();
    setCompanyImage(res.data);
    restForm.setFieldValue('companyImages', res.data);
    console.log('打印获取的值：', res)
  };

  // 获取用户数据
  const getUserList = async () => {
    try {
      const res = await CompanyApi.UserList();
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

  const onChangeText = (value) => {
    setContent(value);
    restForm.setFieldValue('companyIntroduction', value);
  };

  // 发薪日期
  const onChangeDay = (value) => {
    setPayDay(value);
    restForm.setFieldValue('payDay', value);
  }

  const onChangeStart = (value) => {
    setPayStart(value);
    restForm.setFieldValue('payCycleStart', value);
  }

  const onChangeDayEnd = (value) => {
    setPayEnd(value);
    restForm.setFieldValue('payCycleEnd', value);
  }

  //　输入标签
  const onChangeTags = (value) => {
    setTag(value);
  }

  // 添加标签
  const addTagsFun = () => {
    setAddTags(true);
    if (!tag) {
      console.log('是否拒绝了')
      return;
    } else {
      if (tagArry.length > 0) {
        tagArry.map(item => {
          if (item === tag) {
            toast.show('该内容已存在不可重复添加');
          } else {
            setTagArry([...tagArry, tag]);
            restForm.setFieldValue('companyGoodTags', [...tagArry, tag]);
            console.log('数组的值11：', tag)
            setTag('');
          }
        })
      } else {
        setTagArry([...tagArry, tag]);
        setTag('');
      }
    }
  }
  console.log('标签数组的值11：', tagArry)
  // 删除标签
  const delTag = (value) => {
    let prams = tagArry.indexOf(value);
    tagArry.splice(prams, 1);
    setTagArry(tagArry);
    restForm.setFieldValue('companyGoodTags', [...tagArry]);
    console.log('删除了：', tagArry, value)
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
      const data = new FormData();
      const file = {
        uri: pickerImage.path, type: 'multipart/form-data', name: fileName,
      };
      data.append('file', file);
      restForm.setFieldValue('companyImages', [...companyImage, ...data]);
      console.log('选择图库照片：', pickerImage)
      return pickerImage;
    } catch (err) {
      console.log('err', err);
    }
  }

  const delImage = (value) => {
    console.log('打印照片传值：', value);
    const newArr = deepCopy(companyImage);
    const findIndex = newArr.findIndex(item => item.md5 === value);
    if (findIndex > -1) {
      newArr.splice(findIndex, 1);
      setCompanyImage(newArr);
      restForm.setFieldValue('companyImages', newArr);
      return;
    }
  }

  // 添加驻场
  const addField = () => {
    const formData = restForm.values;
    const copyList = deepCopy(contactFields);
    console.log('获取数组:', formData)
    if (formData.Resident1.length) {
      setContactFields([...contactFields, { userId: '', userName: '', mobile: '' }]);
      let newFieldValues = {};
      newFieldValues[`Resident${contactFields.length + 1}`] = [];
      restForm.setValues({
        ...restForm.values,
        ...newFieldValues
      })
    } else if (contactFields.length === 0) {
      setContactFields([{ userId: '', userName: '', mobile: '' }])
    } else {
      toast.show('请完善上一行信息');
    }
  }

  // 删除驻场
  const delField = (value) => {
    const newArr = deepCopy(contactFields);
    const findIndex = newArr.findIndex(item => item.index === value);
    if (findIndex > -1) {
      newArr.splice(findIndex, 1);
      setContactFields(newArr);
      return;
    }
    console.log('删除按钮11:', newArr)
  }


  // 提交报名表单
  const onSubmit = async (values) => {
    try {
      console.log('提交参数11：', values)
      const params = {
        ...values,
        companyType: values.companyType ? values.companyType[0].value : '',
        industry: values.industry ? values.industry[0].value : '',
        scale: values.scale ? values.scale[0].value : '',
      }
      console.log('打印上上传参数：', params);
      const res = await CompanyApi.AddCompany(params);
      if (res?.code !== SUCCESS_CODE) {
        toast.show(`请求失败，${res?.msg}`, { type: 'danger' });
        return;
      }
      toast.show('新建企业成功');
      console.log('保存提交成功：', params);
    } catch (error) {
      console.log('errorerrorerrorerrorerrorerror', error)
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }

  }

  useEffect(() => {
    getImage();
    getUserList();
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      handleChange={(e) => console.log('e', e)}
      onSubmit={onSubmit}>
      {({ handleSubmit, ...rest }) => {
        restForm = rest;

        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea}>
              <View style={[styles.cardArea, { marginTop: 28 }]}>
                <Field
                  name="companyName"
                  title="企业全称"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="shortCompanyName"
                  title="企业简称"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyNo"
                  title="企业代号"
                  placeholder="请输入企业代号"
                  isRequired
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="companyType"
                  title="企业类别"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  formalLabel
                  isRequired
                  selectList={COMPANY_TYPE}
                  component={SelectItem}
                />
                <Field
                  name="scale"
                  title="人员规模"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  formalLabel
                  isRequired
                  selectList={COMPANY_SCALE}
                  component={SelectItem}
                />
                <Field
                  name="industry"
                  title="所属行业"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  formalLabel
                  isRequired
                  selectList={COMPANY_INDUSTRY}
                  component={SelectItem}
                />
                <Field
                  name="region"
                  title="区域地址"
                  noBorder
                  bottomButton
                  singleSelect
                  inPageField
                  formalLabel
                  isRequired
                  selectList={CityData}
                  component={CitySelect}
                />
                <Field
                  name="addressDetail"
                  title="工厂位置"
                  isRequired
                  placeholder="请输入工厂位置"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
                <Field
                  name="receiveAddress"
                  title="接人位置"
                  isRequired
                  placeholder="请输入接人位置"
                  inputStyle={{ fontSize: 28 }}
                  component={FormItem}
                />
              </View>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>企业优势标签</Text>
                  </View>
                  <View style={styles.tagsBox}>
                    {
                      tagArry.length > 0 && tagArry.map(item => {
                        return (
                          <TouchableOpacity style={styles.tags} key={item}>
                            <Text style={styles.tagText}>{item}</Text>
                            <TouchableOpacity onPress={() => delTag(item)}>
                              <AntDesign
                                name='close'
                                color='#FFFEFE'
                                size={40}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        )
                      })
                    }
                    {
                      addTags && <TouchableOpacity style={styles.tags} onPress={() => setAddTags(false)}>
                        <AntDesign
                          name='plus'
                          color='#FFFEFE'
                          size={40}
                        />
                        <Text style={styles.tagText}>添加标签</Text>
                      </TouchableOpacity>
                    }
                    {
                      !addTags && <View style={styles.addInput}>
                        <TextInput
                          style={styles.inputTags}
                          onChangeText={text => onChangeTags(text)}
                          value={tag}
                          textAlign='center'
                          clearTextOnFocus
                          autoFocus
                          clearButtonMode
                          placeholderTextColor="#999999"
                        />
                        <TouchableOpacity style={styles.button} onPress={addTagsFun}>
                          <Text style={styles.buttonText}>添加</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>一、企业简介</Text>
                  </View>
                  <View>
                    <TextInput
                      name="companyIntroduction"
                      multiline
                      style={styles.inputStyle}
                      onChangeText={text => onChangeText(text)}
                      value={content}
                      placeholder="输入公司简介"
                      clearTextOnFocus
                      placeholderTextColor="#999999"
                    />
                  </View>
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>二、企业照片</Text>
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
                  </View>
                  <TouchableOpacity style={styles.uploadStyle} onPress={openPick}>
                    <AntDesign
                      name='plus'
                      color='#409EFE'
                      size={50}
                    />
                  </TouchableOpacity>
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>三、工资说明</Text>
                  </View>
                  <View style={styles.moneyStyle}>
                    <Text style={styles.titleName}>发薪日：</Text>
                    <TextInput
                      name="payDay"
                      style={styles.inputNumber}
                      onChangeText={text => onChangeDay(text)}
                      value={payDay}
                      textAlign='center'
                      clearTextOnFocus
                      placeholderTextColor="#999999"
                    />
                    <Text style={styles.titleName}>号</Text>
                    <Text style={[styles.titleName, { marginLeft: 20 }]}>发薪周期：</Text>
                    <TextInput
                      name="payCycleStart"
                      style={styles.inputNumber}
                      onChangeText={text => onChangeStart(text)}
                      value={payStart}
                      clearTextOnFocus
                      placeholderTextColor="#999999"
                    />
                    <Text style={[styles.titleName, { marginRight: 15 }]}>至</Text>
                    <TextInput
                      name="payCycleEnd"
                      style={styles.inputNumber}
                      onChangeText={text => onChangeDayEnd(text)}
                      value={payEnd}
                      clearTextOnFocus
                      placeholderTextColor="#999999"
                    />
                    <Text style={styles.titleName}>号</Text>
                  </View>
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>四、工作环境</Text>
                  </View>
                  <Field
                    name="shiftCategory"
                    title="班别"
                    noBorder
                    isRequired
                    label="shiftCategoryExplain"
                    arryDate={COMPANY_SHIFT}
                    component={RadioGroup}
                  />
                  <Field
                    name="sitStand"
                    title="站坐"
                    noBorder
                    isRequired
                    label="sitStandExplain"
                    arryDate={SITSTAND}
                    component={RadioGroup}
                  />
                  <Field
                    name="dormitory"
                    title="住宿"
                    noBorder
                    isRequired
                    label="dormitoryExplain"
                    arryDate={DORMITORY}
                    component={RadioGroup}
                  />
                  <Field
                    name="food"
                    title="伙食"
                    noBorder
                    isRequired
                    label="foodExplain"
                    arryDate={COMPANY_FOOD}
                    component={RadioGroup}
                  />
                  <Field
                    name="dress"
                    title="着装"
                    noBorder
                    isRequired
                    label="dressExplain"
                    arryDate={DRESS}
                    component={RadioGroup}
                  />
                  <Field
                    name="line"
                    title="产线"
                    noBorder
                    isRequired
                    label="lineExplain"
                    arryDate={COMPANY_LINE}
                    component={RadioGroup}
                  />
                  <Field
                    name="microscope"
                    title="显微镜"
                    noBorder
                    isRequired
                    label="microscopeExplain"
                    arryDate={MICROSCOPE}
                    component={RadioGroup}
                  />
                  <Field
                    name="phone"
                    title="车间带手机"
                    noBorder
                    isRequired
                    label="phoneExplain"
                    arryDate={COMPANY_PHONE}
                    component={RadioGroup}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>五、录用条件</Text>
                  </View>
                  <Field
                    name="idCard"
                    title="身份证"
                    noBorder
                    isRequired
                    label="idCardExplain"
                    arryDate={COMPANY_IDCARD}
                    component={RadioGroup}
                  />
                  <Field
                    name="english"
                    title="英文字母"
                    noBorder
                    isRequired
                    label="englishExplain"
                    arryDate={COMPANY_ENGLISH}
                    component={RadioGroup}
                  />
                  <Field
                    name="returnFactory"
                    title="二次返厂"
                    noBorder
                    isRequired
                    label="returnFactoryExplain"
                    arryDate={RETURNFACTORY}
                    component={RadioGroup}
                  />
                  <Field
                    name="tattooSmoke"
                    title="纹身烟疤"
                    noBorder
                    isRequired
                    label="tattooSmokeExplain"
                    arryDate={TATTOOSMOKE}
                    component={RadioGroup}
                  />
                  <Field
                    name="nationality"
                    title="民族要求"
                    noBorder
                    isRequired
                    label="nationalityExplain"
                    arryDate={COMPANYNATIONALITY}
                    component={RadioGroup}
                  />
                  <Field
                    name="background"
                    title="案底"
                    noBorder
                    isRequired
                    label="backgroundExplain"
                    arryDate={BACKGROUND}
                    component={RadioGroup}
                  />
                  <Field
                    name="studentProve"
                    title="学生证明"
                    noBorder
                    isRequired
                    label="studentProveExplain"
                    arryDate={STUDENTPROVE}
                    component={RadioGroup}
                  />
                  <Field
                    name="height"
                    title="身高要求"
                    placeholder="请输入身高要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="examine"
                    title="体检要求"
                    isRequired
                    placeholder="请输入体检要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>六、面试资料</Text>
                  </View>
                  <Field
                    name="idCardCopy"
                    title="身份证复印件"
                    isRequired
                    placeholder="请输入身份证复印件要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="graduateCopy"
                    title="毕业证原件/复印件"
                    isRequired
                    placeholder="请输入毕业证要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="photo"
                    title="照片"
                    isRequired
                    placeholder="请输入照片要求"
                    noBorder
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
              <>
                <View style={styles.cardArea}>
                  <View style={styles.title}>
                    <Text style={styles.text}>七、防疫要求</Text>
                  </View>
                  <Field
                    name="itineraryCode"
                    title="行程码"
                    isRequired
                    placeholder="请输入行程码要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="nucleicAcid"
                    title="核酸"
                    isRequired
                    placeholder="请输入核酸要求"
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                  <Field
                    name="vaccination"
                    title="疫苗要求"
                    isRequired
                    placeholder="请疫苗接种要求"
                    noBorder
                    inputStyle={{ fontSize: 28 }}
                    component={FormItem}
                  />
                </View>
              </>
            </ScrollView>
            <Button
              title="保存提交"
              onPress={handleSubmit}
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.titleStyle}
            />
          </View>
        )
      }}
    </Formik>
  )
};

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
    paddingHorizontal: 28
  },
  btnArea: {
    justifyContent: 'center',
    borderWidth: 1
  },
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderColor: 'transparent',
    borderRadius: 50,
    marginBottom: 28,
    marginHorizontal: 28
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  theWayToGo: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10
  },
  cardArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 28,
    fontSize: 32,
    paddingBottom: 20
  },
  title: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
  },
  moneyStyle: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center'
  },
  titleName: {
    fontSize: 26,
    color: '#333',
  },
  inputNumber: {
    width: 90,
    height: 50,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 26,
    color: '#333',
    marginRight: 10,
    padding: 0,
  },
  close: {
    position: 'absolute',
    top: 15,
    right: 30,
  },
  modalView: {
    margin: 20,
    marginTop: 150,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingTop: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageTitle: {
    fontSize: 18,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  openButton: {
    width: 300,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 25
  },
  inputStyle: {
    minHeight: 100,
    margin: 30,
    fontSize: 28,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  tagsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: 30,
    marginTop: 20
  },
  tags: {
    minWidth: 160,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F9EFE',
    borderRadius: 4,
    marginRight: 20,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  tagText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFEFE',
    textAlign: 'center',
  },
  addInput: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center'
  },
  inputTags: {
    width: 150,
    height: 50,
    fontSize: 28,
    padding: 0,
    borderWidth: 1,
    borderColor: '#3F9EFE',
  },
  button: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: '#3F9EFE',
    borderColor: '#3F9EFE',
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFEFE',
    textAlign: 'center',
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
    height: 70,
    margin: 30,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#409EFE',
    borderRadius: 35
  },
  contactStyle: {
    margin: 30,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contactText: {
    fontSize: 32,
    color: '#333',
  },
  box: {
    margin: 20,
    marginTop: 0,
    marginRight: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingRight: 20,
  },
  inputName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  useNameStyle: {
    width: 200,
    height: 60,
    borderWidth: 1,
    fontSize: 26,
    padding: 0,
    textAlign: 'center',
    color: '#333',
  },
  select: {
    width: 200,
    height: 60,
    borderWidth: 1,
    fontSize: 26,
    padding: 0,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  useName: {
    fontSize: 26,
    color: '#333',
    marginLeft: 15,
    textAlign: 'center'
  }
})

export default BusinessAdd;