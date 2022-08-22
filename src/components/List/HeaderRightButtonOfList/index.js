import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { setRole } from "../../../redux/features/RoleSwitch";

const HeaderRightButtonOfList = () => {
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);

  //RECRUIT：招聘；RESIDENT：驻厂
  const role = useSelector((state) => state.roleSwitch.role);
  const roleInfo = useSelector((state) => state.roleInfo.roleInfo);

  useEffect(()=>{
    const roleIndex = roleInfo.findIndex(role => role === 'ADMIN' || role === 'FINANCE' || role === 'RESIDENT');
    if(roleIndex !== -1){
      setIsAdmin(true);
      return;
    }
    setIsAdmin(false);
    dispatch(setRole('RECRUIT'));
  },[])

  const pressButton = () => {
    switch(role){
      case 'RECRUIT':
        dispatch(setRole('RESIDENT'));
        break;
      case 'RESIDENT':
        dispatch(setRole('RECRUIT'));
        break;
    }
  };

  return (
    <View style={styles.screen}>
      {isAdmin ? (
        <>
          <TouchableOpacity 
            style={[styles.btnArea, styles.btn1, role === 'RESIDENT' && styles.selectedArea]} 
            onPress={pressButton}>
            <Text 
              style={[styles.btnText, role === 'RESIDENT' && styles.selected]}>驻厂</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnArea, role === 'RECRUIT' && styles.selectedArea]} 
            onPress={pressButton}>
            <Text style={[styles.btnText, role === 'RECRUIT' && styles.selected]}>招聘</Text>
          </TouchableOpacity>
        </>
      ): <>
        <TouchableOpacity 
          style={[styles.btnArea, role === 'RECRUIT' && styles.selectedArea]} 
          onPress={pressButton}>
          <Text style={[styles.btnText, role === 'RECRUIT' && styles.selected]}>招聘</Text>
        </TouchableOpacity>
      </>}
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30
  },
  btnArea: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    borderRadius: 3
  },
  btn1: {
    marginRight: 20
  },
  btnText: {
    color: '#999999',
    fontWeight: 'bold',
    fontSize: 28
  },
  selectedArea: {
    backgroundColor: '#409EFF'
  },
  selected: {
    color: '#fff'
  },
  icon: {
    height: '100%', 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    paddingHorizontal: 5, 
    marginRight: 5, 
    borderRadius: 4
  },
  trueIcon: {
    color: '#fff',
    backgroundColor: '#409EFF'
  },
  falseIcon: {
    color: '#409EFF',
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

export default HeaderRightButtonOfList;