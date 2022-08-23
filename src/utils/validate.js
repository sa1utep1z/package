//这是针对验证表单的正则表达式库

/**
 * 是否不是正整数
 */
export const isNotPositiveInteger = (value) => (typeof value !== 'number' || !/^(([1-9][0-9]*))$/.test(value));

/**
  * 是否是正整数
  */
export const isPositiveInteger = (value) => /^(([1-9][0-9]*))$/.test(value);

/**
  * 是否不是正数（两位小数）
  */
export const isNotPositiveDecimal = (value) => (typeof value !== 'number' || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value));

/**
  * 是否不是非负数（两位小数）
  */
export const isNotNonNegativeDecimal = (value) => (typeof value !== 'number' || !/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[0-9][0-9]*\.\d{1,2})))$/.test(value));

/**
  * 是否是是正数（两位小数）
  */
export const isPositiveDecimal = (value) => /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value);

/**
  * 是否是手机号
  */
export const isPhoneNumber = (value) => /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/.test(value);
export const phone = /^1[3-9]\d{9}$/;

/**
  * 是否是身份证
  */
export const isIDCard = (value) => /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
export const IDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;