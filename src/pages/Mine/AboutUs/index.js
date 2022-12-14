import React, {useState} from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import ImageZoom from '../../../components/ImageZoom';
import {honorList, customerList, layoutList, modeList, goodList, codeList, teamList} from "./imagesList";

const AboutUs = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  
  const picturesOnPress = (type, picIndex) => {
    setIsVisible(!isVisible);
    switch(type){
      case 'honor': 
        setPhotoIndex(0);
        setImageUrls(honorList);
        break;
      case 'customer':
        setPhotoIndex(0);
        setImageUrls(customerList);
        break;
      case 'layout':
        setPhotoIndex(0);
        setImageUrls(layoutList);
        break;
      case 'mode':
        setPhotoIndex(0);
        setImageUrls(modeList);
        break;
      case 'good':
        setPhotoIndex(0);
        setImageUrls(goodList);
        break;
      case 'code':
        setPhotoIndex(picIndex);
        setImageUrls(codeList);
        break;
      case 'team':
        setPhotoIndex(picIndex);
        setImageUrls(teamList);
        break;
    }
  };

  return (
    <>
      <ScrollView style={styles.screen}>
        <View style={{backgroundColor: '#FFFFFF', margin: 20, paddingHorizontal: 20, borderRadius: 12}}>
          <Image resizeMode="contain" style={{width: '100%', height: 180}} source={require('../../../assets/images/zd_logo.png')}/>
          <Text style={{fontSize: 26, color: '#333333', marginBottom: 20}}>　　众鼎人力集团最早成立于2012年8月，经过十多年发展壮大，公司下属十二家人力资源分公司，分布在深圳、惠州、长沙等城市，开设招聘门店十五家；专注于人力资源服务领域，包括劳务派遣、劳务外包、职业教育、人才招聘、企业咨询与培训、小程序定制开发等业务，具备独立法人和人力资源外包资质的专业人力资源整体服务商。</Text>
          <TouchableOpacity activeOpacity={1} style={{height: 360, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={()=>picturesOnPress('honor')}>
            <View>
              <Image resizeMode="cover" source={require('../../../assets/images/honor_total.png')}/>
            </View>
          </TouchableOpacity>
          <Text style={{fontSize: 26, color: '#333333', marginBottom: 20}}>　　公司现有管理团队近300人，其中招聘营销中心有150人的招聘团队、35人网招团队，驻厂客服中心有63人专业驻厂管理人员，综合管理中心及财务保障服务21人，具备丰富的人力资源从业经验，能够做到高效、及时地为客户及员工提供贴心服务。</Text>
          <Text style={{fontSize: 26, color: '#333333', marginBottom: 20}}>　　公司长期合作企业客户：富士康科技集团、村田科技、肯发集团、欣旺达、比亚迪、普联、爱普生、伯恩、中兴通讯、华为、长城开发、联想、航嘉、佳能、住友、理光、美律、旺鑫、裕同、领胜、纬创、TCL等知名企业，与珠三角500多家大中型企业建立了良好的人力资源供求合作关系。</Text>
          <TouchableOpacity activeOpacity={1} onPress={()=>picturesOnPress('customer')}>
            <Image resizeMode="contain" style={{width: '100%', height: 300}} source={require('../../../assets/images/hezuokehu.png')}/>
          </TouchableOpacity>
          <Text style={{fontSize: 26, color: '#333333', marginBottom: 20}}>　　公司每年为20多万蓝领提供就业安置服务，成功为全国各地500多家企业输送员工超过20万人以上，在职派遣员工10000多人，日招聘输送1000多人，极为方便地满足了企业和求职者的需求，深得各方的信赖与支持。</Text>
          <TouchableOpacity activeOpacity={1} onPress={()=>picturesOnPress('mode')}>
            <Image resizeMode="contain" style={{width: '100%', height: 350}} source={require('../../../assets/images/mode.png')}/>
          </TouchableOpacity>
          <Text style={{fontSize: 26, color: '#333333', marginBottom: 20}}>　　公司2020年上线日薪系统，受到蓝领工人的热烈欢迎，极大地满足了蓝领借支问题，提高了蓝领劳动积极性，让蓝领工人安心持续工作。</Text>
          <TouchableOpacity activeOpacity={1} onPress={()=>picturesOnPress('layout')}>
            <Image resizeMode="contain" style={{width: '100%', height: 300, marginBottom: 20}} source={require('../../../assets/images/buju.png')}/>
          </TouchableOpacity>
          <Text style={{fontSize: 26, color: '#333333'}}>　　公司秉承“客户为先，服务至上，诚信服务，规范高效”的服务理念，不断提高经营管理水平和核心竞争能力，为广大客户提供最优质的服务，并致力于成为全球蓝领终生服务的首选平台，挖掘蓝领产业价值链，为客户提供蓝领服务解决方案，竭诚打造中国最具规模与实力的数字型人力资源服务商。</Text>
          <TouchableOpacity activeOpacity={1} onPress={()=>picturesOnPress('good')}>
            <Image resizeMode="contain" style={{width: '100%', height: 300, marginBottom: 10}} source={require('../../../assets/images/good.png')}/>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: 'center', paddingTop: 20, backgroundColor: '#FFFFFF'}}>
          <Text style={{fontSize: 36, fontWeight: 'bold', color: '#333333', textAlign: 'center', textAlignVertical: 'center'}}>企业风采</Text>
        </View>
        <ScrollView style={{height: 300, marginBottom: 20, paddingVertical: 20, backgroundColor: '#FFFFFF'}} horizontal showsHorizontalScrollIndicator={false}>
          {teamList.map((image, imageIndex) => (
            <TouchableOpacity activeOpacity={1} key={imageIndex} style={{height: 260}} onPress={()=>picturesOnPress('team', imageIndex)}>
              <Image resizeMode="cover" style={{height: 260, width: 360}} source={image.props.source}/>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{backgroundColor: '#FFFFFF', margin: 20, marginTop: 0, padding: 20, paddingBottom: 0, borderRadius: 12}}>
          <View style={{justifyContent: 'center', paddingBottom: 20}}>
            <Text style={{fontSize: 36, fontWeight: 'bold', color: '#333333', textAlign: 'center', textAlignVertical: 'center'}}>关注我们</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity style={{padding: 20, paddingTop: 0, borderRadius: 12}} onPress={()=>picturesOnPress('code', 0)}>
              <Image resizeMode="contain" style={{width: 260, height: 260}} source={require('../../../assets/images/gzh_code.jpg')}/>
              <Text style={{fontSize: 28, fontWeight: 'bold', color: '#333333', textAlign: 'center', marginTop: 20}}>众鼎人力公众号</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 20, paddingTop: 0, borderRadius: 12}} onPress={()=>picturesOnPress('code', 1)}>
              <Image resizeMode="contain" style={{width: 250, height: 250, marginBottom: 10}} source={require('../../../assets/images/xcx_code.jpg')}/>
              <Text style={{fontSize: 28, fontWeight: 'bold', color: '#333333', textAlign: 'center', marginTop: 20}}>众鼎直聘小程序</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ImageZoom 
        index={photoIndex}
        isVisible={isVisible} 
        imageUrls={imageUrls} 
        onShowModal={picturesOnPress} 
        onCancel={picturesOnPress} 
      />
    </>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default AboutUs;