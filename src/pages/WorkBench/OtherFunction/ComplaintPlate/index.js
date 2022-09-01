import React, {useEffect, useState, useCallback, useMemo} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { SUCCESS_CODE } from "../../../../utils/const";
import MyMembersApi from "../../../../request/MyMembersApi";
import { SIGN_UP_STATUS } from "../../../../utils/const";

const ComplaintPlate = () => {
  const toast = useToast();

  const [list, setList] = useState([]);

  useEffect(() => {
    getCompanyList();
  }, [])

  const getCompanyList = async() => {
    try{  
      const res = await MyMembersApi.CompaniesList();
      console.log('getCompanyList-->res', res);
      if(res.code !== SUCCESS_CODE){
        toast.show(`获取企业列表失败，${res.msg}`, { type: 'danger' });
        return;
      }
      setList(res.data);
    }catch(err){
      toast.show(`获取企业列表失败，请稍后重试`, { type: 'danger' });
    }
  };


  const renderItem = ({item}) => {
    // const isSelected = selectOther.value === item.value;
    return (
      <TouchableOpacity style={{height: 80, borderWidth: 1, borderTopWidth: 0, borderColor: '#EFEFEF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}}>
        <Text style={{color: '#333333', textAlign: 'center', fontSize: 32}}>{item.label}</Text>
        {/* <CheckBox
          checked={isSelected}
          size={18}
          containerStyle={{padding: 0}}
          checkedIcon={"dot-circle-o"}
          uncheckedIcon={"circle-o"}
        /> */}
      </TouchableOpacity>
    )
  };

  const memoizedValue = useMemo(() => renderItem, [list]);

  return (
    <FlatList 
      data={list}
      renderItem={memoizedValue} 
      initialNumToRender={20}
      keyExtractor={item => item.value}
      getItemLayout={(data, index)=>({length: 80, offset: 80 * index, index})}
    />
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ComplaintPlate;