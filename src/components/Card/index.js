import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { WATERMARK_LIST_SMALL } from "../../utils/const";

const Card = ({title, content}) => {
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  return (
    <View style={styles.card}>
      <View style={styles.titleArea}>
        <View style={styles.titleIcon}></View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        <View style={{paddingHorizontal: 30, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden'}} pointerEvents={'none'}>
          {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
            return (
              <View key={itemIndex} style={[{width: '25%', height: 150, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}, {opacity: item} ]}>
                <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 22 }}>{`${memberInfo.store} · ${memberInfo.name}`}</Text>
              </View>
            )
          })}
        </View>
        {content}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 32,
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  titleArea: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, .05)'
  },
  titleIcon: {
    width: 8, 
    height: 30,
    backgroundColor: '#409EFF', 
    borderTopRightRadius: 5, 
    borderBottomRightRadius: 5, 
    marginRight: 20
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#333333'
  },
  content: {
    marginVertical: 20
  }
});

export default Card;