import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { WATERMARK_LIST_SMALL } from "../../utils/const";

const WaterMark = ({
  list = WATERMARK_LIST_SMALL,
  waterMarkStyle,
  markItemStyle
}) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  return (
    <View style={[styles.waterMark, waterMarkStyle]} pointerEvents={'none'}>
      {list.map((item, itemIndex) => {
        return (
          <View key={itemIndex} style={[styles.markItem, markItemStyle]}>
            {!!item && <>
              <Text style={styles.markText}>{memberInfo.store}</Text>
              <Text style={styles.markText}>{memberInfo.name}</Text>
            </>}
          </View>
        )
      })}
    </View>
  )
};

const styles = StyleSheet.create({
  waterMark: {
    width: '100%', 
    height: '100%', 
    position: 'absolute', 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    overflow: 'hidden'
  },
  markItem: {
    width: '25%', 
    height: 150, 
    transform: [{ rotateZ: '-15deg' }], 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0)'
  },
  markText: {
    color: 'rgba(0,0,0,0.15)', 
    fontSize: 22
  }
});

export default WaterMark;