import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const HeaderRightButtonOfList = () => {
  const hasPermission = useSelector((state) => state.hasPermission.isAdministrators);

  const [role, setRole] = useState('factory');

  return (
    <View style={styles.screen}>
      {hasPermission && (
        <>
          <TouchableOpacity style={[styles.btnArea, styles.btn1, role === 'factory' && styles.selectedArea]} onPress={() => role === 'recruitment' && setRole('factory')}>
          <Text style={[styles.btnText, role === 'factory' && styles.selected]}>驻厂</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnArea, role === 'recruitment' && styles.selectedArea]} onPress={() => role === 'factory' && setRole('recruitment')}>
            <Text style={[styles.btnText, role === 'recruitment' && styles.selected]}>招聘</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

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