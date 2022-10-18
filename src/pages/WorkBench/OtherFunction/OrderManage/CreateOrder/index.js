import React, {useRef, useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import OrderInfo from "./OrderInfo";
import Requirement from "./Requirement";
import Policy from "./Policy";
import CommissionDescription from "./CommissionDescription";
import WagesDetail from "./WagesDetail";
import CreateOrderApi from "../../../../../request/CreateOrderApi";
import { SUCCESS_CODE } from "../../../../../utils/const";

const CreateOrder = ({
  route: {
    params: {
      type, 
      orderId: originOrderId
  }}
}) => {
  const toast = useToast();

  const scrollRef = useRef(null);
  const basicOrderRef = useRef(null);
  const requirementRef = useRef(null);
  const policyRef = useRef(null);
  const commissionRef = useRef(null);
  const wagesRef = useRef(null);

  const navigation = useNavigation();

  const [orderId, setOrderId] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(()=>{
    if(originOrderId){
      setOrderId(originOrderId);
      navigation.setOptions({
        headerTitle: '订单详情',
      })
    }
  },[originOrderId])

  const save = async() => {
    setButtonLoading(true);
    if(!orderId){
      setButtonLoading(false);
      toast.show('请先保存订单基本信息！', {type: 'danger'});
      scrollRef?.current?.scrollTo({x: 0, y: 0, animated: true, duration: 500});
      return;
    }
    basicOrderRef?.current?.BasicRestForm.submitForm();
    requirementRef?.current?.RequirementForm.submitForm();
    policyRef?.current?.PolicyForm.submitForm();
    commissionRef?.current?.CommissionForm.submitForm();
    wagesRef?.current?.WagesForm.submitForm();
    setTimeout(() => onShelf(), 250);
  };

  const onShelf = async() => {
    try {
      const res = await CreateOrderApi.onOrder(orderId);
        if(res?.code !== SUCCESS_CODE){
          toast.show(`${res?.msg}`, {type: 'danger'});
          return;
        }
        toast.show('上架成功！', {type: 'success'});
        setButtonLoading(false);
        navigation.goBack();
    } catch (error) {
      console.log('save->error', error);
      setButtonLoading(false);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      keyboardVerticalOffset={-300}
    >
      <View style={styles.screen}>
        <ScrollView 
          ref={scrollRef}
          style={styles.screen}
          keyboardShouldPersistTaps="handled">
            <OrderInfo ref={basicOrderRef} type={type} orderId={orderId} setOrderId={setOrderId} />
            <Requirement ref={requirementRef} orderId={orderId} />
            <Policy ref={policyRef} orderId={orderId} />
            <CommissionDescription ref={commissionRef} orderId={orderId} />
            <WagesDetail scrollRef={scrollRef} ref={wagesRef} orderId={orderId} />
        </ScrollView>
        <Button
          title="保存并上架"
          onPress={save}
          disabled={buttonLoading}
          loading={buttonLoading}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
        />
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  screen: {
    flex: 1
  },
  buttonContainerStyle: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#ffffff'
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 5
  }
});

export default CreateOrder;