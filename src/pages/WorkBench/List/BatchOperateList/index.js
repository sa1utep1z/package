import React, {useState, useRef} from "react";
import {StyleSheet, View} from 'react-native';

import SelectList from "../../../../components/SelectList";
import SearchInput from "../../../../components/SearchInput";
import { deepCopy } from "../../../../utils";
import SignUpStateDialog from "../../../../components/List/SignUpStateDialog";
import { MEMBER_INFO } from "../../../../utils/const";

const BatchOperateList = () => {
  const signUpStateRef = useRef(null);

  let arr = [];
  for(let i = 0; i < 50; i++ ){
    arr.push({
      title: `厂${i+1}号`,
      id: `${i+1}`,
      index: `${i+1}`
    })
  }

  const [listArr, setListArr] = useState(arr);

  const filterFactory = (value) => {
    let newArr = deepCopy(arr);
    const filterArr = newArr.filter(item => item.title.includes(value));
    setListArr(filterArr);
  }

  const batchChangeStatus = (list) => {
    signUpStateRef?.current.setShowDetail(true);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
      <SearchInput 
        placeholder='请输入需要筛选的名字'
        autoSearch={filterFactory}
        searchPress={filterFactory}
        searchInputStyle={{marginBottom: 0}}
      />
      <SelectList 
        data={listArr} 
        confirm={batchChangeStatus} 
        canMultiChoice 
        bottomButton
      />
      <SignUpStateDialog 
        ref={signUpStateRef} 
        memberInfo={MEMBER_INFO} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default BatchOperateList;