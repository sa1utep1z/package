
/**
 * 
 * @param {*} obj 传进来的所有页面的列表，是一个对象；
 * @returns 把每个键对应的值上的方法（default）提取出来放到一个对象并返回出去。
 */
export const FilterNavigationList = (obj) => {
  let NAVIGATION_PAGES = {};
  Object.keys(obj).map(name => {
    return NAVIGATION_PAGES[name] = obj[name].default
  });
  return NAVIGATION_PAGES;
}

/**
 * @params {*} date 传进来的时间；
 * @returns 把'xxxx-xx-xx'的时间格式返回出去。
 */
export const getYMD = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month.toString().length === 1) {
    month = '0' + month;
  }

  if (day.toString().length === 1) {
    day = '0' + day;
  }

  return year + '-' + month + '-' + day;
}

/**
 * @params {*} weekNumber 传进来的星期，为0123456；
 * @returns 把‘周几’的时间格式返回出去。
 */
export const getWeekName = (weekNumber) => {
  switch (weekNumber){
    case 0: 
      return '周日';
    case 1: 
      return '周一';
    case 2: 
      return '周二';
    case 3: 
      return '周三';
    case 4: 
      return '周四';
    case 5: 
      return '周五';
    case 6: 
      return '周六';
  }
};

// 检测数据类型
export const checkedType = target => Object.prototype.toString.call(target).slice(8, -1)

/**
 *
 * @param {*} target
 * @return {*} 返回复制的结果
 */
// 简易深复制（可复制对象、数组
export const deepCopy = target => {
    //判断拷贝的数据类型
    //初始化变量result 成为最终克隆的数据
    let result, targetType = checkedType(target)
    if (targetType === 'Object') {
        result = {}
    } else if (targetType === 'Array') {
        result = []
    } else {
        return target
    }
    //遍历目标数据
    for (let i in target) {
        //获取遍历数据结构的每一项值。
        let value = target[i]
        //判断目标结构里的每一值是否存在对象/数组
        if (checkedType(value) === 'Object' ||
            checkedType(value) === 'Array') { //对象/数组里嵌套了对象/数组
            //继续遍历获取到value值
            result[i] = deepCopy(value)
        } else { //获取到value值是基本的数据类型或者是函数。
            result[i] = value;
        }
    }
    return result
}