import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text, Dialog } from '@rneui/themed';

const MemberDetailDialog = ({
  memberInfoList = [],
  edit
  }, ref) => {
  const [showDetail, setShowDetail] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDetail, showDetail };
  }, []);

  return (
    <Dialog
      isVisible={showDetail}
      onBackdropPress={()=> setShowDetail(!showDetail)}>
      <View style={styles.msgArea}>
        <Text style={styles.title}>会员信息</Text>
        {edit && <Text style={styles.listText} onPress={edit}>编辑</Text>}
        <View style={styles.topArea}>
          {memberInfoList?.length && memberInfoList.map((item, index) => {
            return (
              <View key={index} style={styles.memberItem}>
                <Text style={styles.memberItem_text}>{item.title}:</Text>
                <View style={styles.memberItem_value}>
                  <Text>{item.value}</Text>
                </View>
              </View>
            )
          })}
        </View>
        <TouchableOpacity style={styles.bottomBtn} onPress={()=>setShowDetail(!showDetail)}>
          <Text style={styles.btnText}>确 定</Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    // minHeight: 450,
    alignItems: 'center'
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  topArea: {
    minHeight: 100,
    width: '100%',
    marginBottom: 10
  },
  bottomBtn: {
    height: 40, 
    width: '100%', 
    backgroundColor: '#409EFF', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnText: {
    fontSize: 20, 
    color: '#fff'
  },
  listText: {
    position: 'absolute', 
    right: 0, 
    fontSize: 13, 
    color: '#409EFF'
  },
  memberItem: {
    height: 40,
    flexDirection: 'row'
  },
  memberItem_text: {
    width: 70, 
    textAlignVertical: 'center', 
    textAlign: 'center'
  },
  memberItem_value: {
    flex: 1, 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3', 
    justifyContent: 'center', 
    marginLeft: 5, 
    paddingLeft: 3
  }
})

export default forwardRef(MemberDetailDialog);