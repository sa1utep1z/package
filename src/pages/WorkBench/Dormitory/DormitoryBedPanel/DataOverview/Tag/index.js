import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { THIS_WEEK_START, THIS_WEEK_END, THIS_MONTH_START, THIS_MONTH_END, TODAY } from "../../../../../../utils/const";

const Tag = ({
  lastButton = false,
  tagList = [],
  filterMore,
  rangeDate,
  setTime,
  searchOther = false //是否筛选了更多
}) => {
  const [selectTag, setSelectTag] = useState('today');

  useEffect(()=>{
    rangeDate && setSelectedTag();
  },[rangeDate])

  const setSelectedTag = () => {
    const startDate = rangeDate.startDate;
    const endDate = rangeDate.endDate;
    if(startDate === TODAY && endDate === TODAY){
      setSelectTag('today');
      return;
    }else if (startDate === THIS_WEEK_START && endDate === THIS_WEEK_END){
      setSelectTag('thisWeek');
      return;
    }else if (startDate === THIS_MONTH_START && endDate === THIS_MONTH_END){
      setSelectTag('thisMonth');
      return;
    }else{
      setSelectTag('');
    }
  };

  const chooseTag = (tag) => {
    setSelectTag(tag.value);
    setTime(tag);
  };

  return (
    <>
      <View style={styles.tagsArea}>
        <View style={{flexDirection: 'row'}}>
          {tagList.map((tag, tagIndex) => {
            const isSelected = selectTag === tag.value;
            return (
              <TouchableOpacity key={tagIndex} style={[styles.tag, isSelected && styles.selectedTag]} onPress={() => chooseTag(tag)}>
                <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{tag.title}</Text>
              </TouchableOpacity>
          )})}
        </View>
        {lastButton && (
          <TouchableOpacity style={[styles.lastButtonStyle, searchOther && {backgroundColor: '#409EFF', borderColor: '#fff'}]} onPress={filterMore}>
            <Text style={[styles.lastButtonText, searchOther && {color: '#fff'}]}>筛选更多</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  tagsArea: {
    height: 70, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 20
  },
  tag: {
    height: 40,
    paddingHorizontal: 10,
    marginRight: 30, 
    borderRadius: 5, 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E5E5E5'
  },
  selectedTag: {
    backgroundColor: '#409EFF', 
    borderWidth: 0
  },
  tagText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#999999'
  },
  selectedTagText: {
    color: '#fff'
  },
  lastButtonStyle: {
    height: 40, 
    width: 160, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999999'
  },
  lastButtonText: {
    fontSize: 26, 
    color: '#999999'
  }
});

export default Tag;