import moment from "moment";
const oneYearBefore = moment().subtract(1, 'years').format('YYYY-MM-DD');
const oneYearLater = moment().add(1, 'years').format('YYYY-MM-DD');

import { MODE_LIST, FEE_WAY_MODE } from "../../../../../../../utils/const";
import { originRule } from "./const";

export const transformFormValue = (rulesList, values) => {
  let rulesArray = [];
  if(rulesList.length){
    const FieldNameListOfRule = Object.keys(values).filter(name => name.includes('mode'));
    
    for(const rule of FieldNameListOfRule){
      const ruleObj = {};

      const ruleIndex = rule.substring(rule.length - 1, rule.length);
      const orderRangeDate = values[`orderRangeDate${ruleIndex}`]; //适用日期；
      const mode = values[`mode${ruleIndex}`]; //结算模式；
      const wagesAndSalary = values[`wagesAndSalary${ruleIndex}`]; //工价/底薪；
      const differenceAndReturnMoney = values[`differenceAndReturnMoney${ruleIndex}`]; //差价/返费；

      ruleObj.startDate = Number(moment(orderRangeDate.startDate).format('x')); //适用日期-开始；
      ruleObj.endDate = Number(moment(orderRangeDate.endDate).format('x')); //适用日期-结束；

      if(!!mode.length){
        ruleObj.type = mode[0].value; //模式；
      }else{
        toast.show('会员结算规则结算模式未选择！', {type: 'warning'});
        return;
      }

      if(wagesAndSalary.status){ //工价底薪已选
        ruleObj.punch = {};
        ruleObj.punch.type = 'root';
        ruleObj.punch.nextNodes = [];
        if(wagesAndSalary.value[0].value === 'NOT_DISTINGUISH'){ //不区分男女
          ruleObj.punch.nextNodes[0] = {
            type: 'next',
            condition: {
              varComputerCode: "var-pass",
              operator: null,
              constantValue: null
            },
            nextNodes: []
          }
          const modeValue = wagesAndSalary.not_distinguish.fee_mode.value[0].value; //不区分男女下的模式；
          const modeChildren = wagesAndSalary.not_distinguish.fee_mode.children; //不区分男女下的节点；
          switch(modeValue){
            case 'PURE':
              ruleObj.punch.nextNodes[0].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeChildren.pure.mode[0].value,
                  amount: Number(modeChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeChildren.working.time
                  },
                  result: {
                    type: modeChildren.working.mode1.mode[0].value,
                    amount: Number(modeChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeChildren.working.time
                  },
                  result: {
                    type: modeChildren.working.mode2.mode[0].value,
                    amount: Number(modeChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.card_day.value
                  },
                  result: {
                    type: modeChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.card_day.value
                  },
                  result: {
                    type: modeChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.card_hour.value
                  },
                  result: {
                    type: modeChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.card_hour.value
                  },
                  result: {
                    type: modeChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.working_day.value
                  },
                  result: {
                    type: modeChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.working_day.value
                  },
                  result: {
                    type: modeChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.working_hour.value
                  },
                  result: {
                    type: modeChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.working_hour.value
                  },
                  result: {
                    type: modeChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
        }else{ //区分男女
          ruleObj.punch.nextNodes = [
            {
              type: 'next',
              condition: {
                varComputerCode: "var-gender",
                operator: "EQUAL",
                constantValue: "male"
              },
              nextNodes: []
            },{
              type: 'next',
              condition: {
                varComputerCode: "var-gender",
                operator: "EQUAL",
                constantValue: "female"
              },
              nextNodes: []
            }
          ];
          const modeMaleValue = wagesAndSalary.distinguish.male.fee_mode.value[0].value; //区分男女下男的模式；
          const modeMaleChildren = wagesAndSalary.distinguish.male.fee_mode.children; //区分男女下男的节点；
          const modeFemaleValue = wagesAndSalary.distinguish.female.fee_mode.value[0].value; //区分男女下女的模式；
          const modeFemaleChildren = wagesAndSalary.distinguish.female.fee_mode.children; //区分男女下男的节点；
          switch(modeMaleValue){
            case 'PURE':
              ruleObj.punch.nextNodes[0].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeMaleChildren.pure.mode[0].value,
                  amount: Number(modeMaleChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeMaleChildren.working.time
                  },
                  result: {
                    type: modeMaleChildren.working.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeMaleChildren.working.time
                  },
                  result: {
                    type: modeMaleChildren.working.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.card_day.value
                  },
                  result: {
                    type: modeMaleChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.card_day.value
                  },
                  result: {
                    type: modeMaleChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.card_hour.value
                  },
                  result: {
                    type: modeMaleChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.card_hour.value
                  },
                  result: {
                    type: modeMaleChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.working_day.value
                  },
                  result: {
                    type: modeMaleChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.working_day.value
                  },
                  result: {
                    type: modeMaleChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.punch.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.working_hour.value
                  },
                  result: {
                    type: modeMaleChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.working_hour.value
                  },
                  result: {
                    type: modeMaleChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
          switch(modeFemaleValue){
            case 'PURE':
              ruleObj.punch.nextNodes[1].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeFemaleChildren.pure.mode[0].value,
                  amount: Number(modeFemaleChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.punch.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeFemaleChildren.working.time
                  },
                  result: {
                    type: modeFemaleChildren.working.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeFemaleChildren.working.time
                  },
                  result: {
                    type: modeFemaleChildren.working.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.punch.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.card_day.value
                  },
                  result: {
                    type: modeFemaleChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.card_day.value
                  },
                  result: {
                    type: modeFemaleChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.punch.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.card_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.card_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.punch.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.working_day.value
                  },
                  result: {
                    type: modeFemaleChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.working_day.value
                  },
                  result: {
                    type: modeFemaleChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.punch.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.working_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.working_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
        }
      }else{
        ruleObj.punch = null;
      }

      if(differenceAndReturnMoney.status){ //差价返费已选
        ruleObj.date = {};
        ruleObj.date.type = 'root';
        ruleObj.date.nextNodes = [];
        if(differenceAndReturnMoney.value[0].value === 'NOT_DISTINGUISH'){ //不区分男女
          ruleObj.date.nextNodes[0] = {
            type: 'next',
            condition: {
              varComputerCode: "var-pass",
              operator: null,
              constantValue: null
            },
            nextNodes: []
          }
          const modeValue = differenceAndReturnMoney.not_distinguish.fee_mode.value[0].value; //不区分男女下的模式；
          const modeChildren = differenceAndReturnMoney.not_distinguish.fee_mode.children; //不区分男女下的节点；
          switch(modeValue){
            case 'PURE':
              ruleObj.date.nextNodes[0].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeChildren.pure.mode[0].value,
                  amount: Number(modeChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeChildren.working.time
                  },
                  result: {
                    type: modeChildren.working.mode1.mode[0].value,
                    amount: Number(modeChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeChildren.working.time
                  },
                  result: {
                    type: modeChildren.working.mode2.mode[0].value,
                    amount: Number(modeChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.card_day.value
                  },
                  result: {
                    type: modeChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.card_day.value
                  },
                  result: {
                    type: modeChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.card_hour.value
                  },
                  result: {
                    type: modeChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.card_hour.value
                  },
                  result: {
                    type: modeChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.working_day.value
                  },
                  result: {
                    type: modeChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.working_day.value
                  },
                  result: {
                    type: modeChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeChildren.working_hour.value
                  },
                  result: {
                    type: modeChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeChildren.working_hour.value
                  },
                  result: {
                    type: modeChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
        }else{ //区分男女
          ruleObj.date.nextNodes = [
            {
              type: 'next',
              condition: {
                varComputerCode: "var-gender",
                operator: "EQUAL",
                constantValue: "male"
              },
              nextNodes: []
            },{
              type: 'next',
              condition: {
                varComputerCode: "var-gender",
                operator: "EQUAL",
                constantValue: "female"
              },
              nextNodes: []
            }
          ];
          const modeMaleValue = differenceAndReturnMoney.distinguish.male.fee_mode.value[0].value; //区分男女下男的模式；
          const modeMaleChildren = differenceAndReturnMoney.distinguish.male.fee_mode.children; //区分男女下男的节点；
          const modeFemaleValue = differenceAndReturnMoney.distinguish.female.fee_mode.value[0].value; //区分男女下女的模式；
          const modeFemaleChildren = differenceAndReturnMoney.distinguish.female.fee_mode.children; //区分男女下男的节点；
          switch(modeMaleValue){
            case 'PURE':
              ruleObj.date.nextNodes[0].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeMaleChildren.pure.mode[0].value,
                  amount: Number(modeMaleChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeMaleChildren.working.time
                  },
                  result: {
                    type: modeMaleChildren.working.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeMaleChildren.working.time
                  },
                  result: {
                    type: modeMaleChildren.working.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.card_day.value
                  },
                  result: {
                    type: modeMaleChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.card_day.value
                  },
                  result: {
                    type: modeMaleChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.card_hour.value
                  },
                  result: {
                    type: modeMaleChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.card_hour.value
                  },
                  result: {
                    type: modeMaleChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.working_day.value
                  },
                  result: {
                    type: modeMaleChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.working_day.value
                  },
                  result: {
                    type: modeMaleChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.date.nextNodes[0].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeMaleChildren.working_hour.value
                  },
                  result: {
                    type: modeMaleChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeMaleChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeMaleChildren.working_hour.value
                  },
                  result: {
                    type: modeMaleChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeMaleChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
          switch(modeFemaleValue){
            case 'PURE':
              ruleObj.date.nextNodes[1].nextNodes = [{
                type: 'settlementResult',
                condition: {
                  varComputerCode: "var-pass",
                  operator: null,
                  constantValue: null
                },
                result: {
                  type: modeFemaleChildren.pure.mode[0].value,
                  amount: Number(modeFemaleChildren.pure.value)
                }
              }]
              break;
            case 'WORKING':
              ruleObj.date.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_CONTAINS',
                    constantValue: modeFemaleChildren.working.time
                  },
                  result: {
                    type: modeFemaleChildren.working.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-onJob',
                    operator: 'DATE_NOT_CONTAINS',
                    constantValue: modeFemaleChildren.working.time
                  },
                  result: {
                    type: modeFemaleChildren.working.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_DAY':
              ruleObj.date.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.card_day.value
                  },
                  result: {
                    type: modeFemaleChildren.card_day.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.card_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.card_day.value
                  },
                  result: {
                    type: modeFemaleChildren.card_day.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.card_day.mode2.value)
                  }
                }
              ]
              break;
            case 'CARD_HOUR':
              ruleObj.date.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.card_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.card_hour.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.card_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-punch-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.card_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.card_hour.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.card_hour.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_DAY':
              ruleObj.date.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.working_day.value
                  },
                  result: {
                    type: modeFemaleChildren.working_day.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working_day.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-day',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.working_day.value
                  },
                  result: {
                    type: modeFemaleChildren.working_day.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working_day.mode2.value)
                  }
                }
              ]
              break;
            case 'WORKING_HOUR':
              ruleObj.date.nextNodes[1].nextNodes = [
                {
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'GTE', //打卡满>
                    constantValue: modeFemaleChildren.working_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.working_hour.mode1.mode[0].value,
                    amount: Number(modeFemaleChildren.working_hour.mode1.value)
                  }
                },{
                  type: 'settlementResult',
                  condition: {
                    varComputerCode: 'var-work-hour',
                    operator: 'LT', //打卡不满<
                    constantValue: modeFemaleChildren.working_hour.value
                  },
                  result: {
                    type: modeFemaleChildren.working_hour.mode2.mode[0].value,
                    amount: Number(modeFemaleChildren.working_hour.mode2.value)
                  }
                }
              ]
              break;
          }
        }
      }else{
        ruleObj.date = null;
      }
      rulesArray.push(ruleObj);
    }
  }
  return rulesArray;
};

export const setFormValue = (res) => {
  let newValue = {}, newArr = [];
  res.data.map((rule, ruleIndex) => {
    newArr.push({ruleLocation: ruleIndex + 1, startDateLimit: oneYearBefore, endDateLimit: oneYearLater});
    newValue[`orderRangeDate${ruleIndex + 1}`] = {
      startDate: moment(rule.startDate).format('YYYY-MM-DD'),
      endDate: moment(rule.endDate).format('YYYY-MM-DD')
    };
    newValue[`mode${ruleIndex + 1}`] = [MODE_LIST.find(item => item.value === rule.type)];
    newValue[`wagesAndSalary${ruleIndex + 1}`] = {
      status: false,
      value: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
      not_distinguish: {
        fee_mode: {
          value: [{ label: '纯', value: 'PURE' }],
          children: {
            pure: {
              mode: [{ label: '工价', value: 'WAGE' }],
              value: ''
            },
            working: {
              time: '',
              mode1: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              }
            },
            card_day: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              }
            },
            card_hour: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              }
            },
            working_day: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              }
            },
            working_hour: {
              value: '',
              mode1: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              mode2: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              }
            }
          }
        }
      },
      distinguish: {
        male: {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              }
            }
          }
        },
        female: {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              }
            }
          }
        }
      }
    };
    newValue[`differenceAndReturnMoney${ruleIndex + 1}`] = {
      status: false,
      value: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
      distinguish: {
        male: {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              }
            }
          }
        },
        female: {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              }
            }
          }
        }
      },
      not_distinguish: {
        fee_mode: {
          value: [{ label: '纯', value: 'PURE' }],
          children: {
            pure: {
              mode: [{ label: '返费', value: 'REBATE' },],
              value: ''
            },
            working: {
              time: '',
              mode1: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              mode2: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              }
            },
            card_day: {
              value: '',
              mode1: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              mode2: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              }
            },
            card_hour: {
              value: '',
              mode1: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              mode2: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              }
            },
            working_day: {
              value: '',
              mode1: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              mode2: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              }
            },
            working_hour: {
              value: '',
              mode1: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              mode2: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              }
            }
          }
        }
      }
    };
    //工价/底薪
    if(rule.punch) {
      newValue[`wagesAndSalary${ruleIndex + 1}`].status = true;
      newValue[`wagesAndSalary${ruleIndex + 1}`].value = [rule.punch.nextNodes.length > 1 ? { label: '区分男女', value: 'DISTINGUISH' } : { label: '不区分男女', value: 'NOT_DISTINGUISH' }];
      //区分男女；
      if(rule.punch.nextNodes.length > 1){
        const new_distinguish = {
          male: {
            fee_mode: {
              value: [{ label: '纯', value: 'PURE' }],
              children: {
                pure: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                working: {
                  time: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                card_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                card_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                working_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                working_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                }
              }
            }
          },
          female: {
            fee_mode: {
              value: [{ label: '纯', value: 'PURE' }],
              children: {
                pure: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                working: {
                  time: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                card_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                card_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                working_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                },
                working_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '工价', value: 'WAGE' }],
                    value: ''
                  }
                }
              }
            }
          }
        };
        rule.punch.nextNodes.map(item => {
          const sex = item.condition.constantValue;
          //男模式
          if(sex === 'male'){
            switch(rule.punch.nextNodes[0].nextNodes[0].condition.varComputerCode){
              case 'var-pass':
                new_distinguish.male.fee_mode.value = [{ label: '纯', value: 'PURE' }];
                new_distinguish.male.fee_mode.children.pure.mode = [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)];
                new_distinguish.male.fee_mode.children.pure.value = String(item.nextNodes[0].result.amount);
                break;
              case 'var-onJob':
                new_distinguish.male.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
                new_distinguish.male.fee_mode.children.working.time = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
                  new_distinguish.male.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-day': 
                new_distinguish.male.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
                new_distinguish.male.fee_mode.children.card_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-hour':
                new_distinguish.male.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
                new_distinguish.male.fee_mode.children.card_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-day':
                new_distinguish.male.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
                new_distinguish.male.fee_mode.children.working_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-hour':
                new_distinguish.male.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
                new_distinguish.male.fee_mode.children.working_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
            }
          }else{
            //女模式
            switch(rule.punch.nextNodes[1].nextNodes[0].condition.varComputerCode){
              case 'var-pass':
                new_distinguish.female.fee_mode.value = [{ label: '纯', value: 'PURE' }];
                new_distinguish.female.fee_mode.children.pure.mode = [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)];
                new_distinguish.female.fee_mode.children.pure.value = String(item.nextNodes[0].result.amount);
                break;
              case 'var-onJob':
                new_distinguish.female.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
                new_distinguish.female.fee_mode.children.working.time = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[1].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
                  new_distinguish.female.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-day': 
                new_distinguish.female.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
                new_distinguish.female.fee_mode.children.card_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-hour':
                new_distinguish.female.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
                new_distinguish.female.fee_mode.children.card_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-day':
                new_distinguish.female.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
                new_distinguish.female.fee_mode.children.working_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-hour':
                new_distinguish.female.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
                new_distinguish.female.fee_mode.children.working_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.punch.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                new_distinguish.female.fee_mode.children.working_hour.mode1 = {
                  mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                  value: String(item.nextNodes[0].result.amount)
                };
                new_distinguish.female.fee_mode.children.working_hour.mode2 = {
                  mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                  value: String(item.nextNodes[1].result.amount)
                };
                }else{
                new_distinguish.female.fee_mode.children.working_hour.mode1 = {
                  mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[1].result.type)],
                  value: String(item.nextNodes[1].result.amount)
                };
                new_distinguish.female.fee_mode.children.working_hour.mode2 = {
                  mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === item.nextNodes[0].result.type)],
                  value: String(item.nextNodes[0].result.amount)
                };
                }
                break;
            }
          }
        })
        newValue[`wagesAndSalary${ruleIndex + 1}`].distinguish = new_distinguish;
      }else{ //不区分男女
        const new_not_distinguish = {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '工价', value: 'WAGE' }],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '工价', value: 'WAGE' }],
                  value: ''
                }
              }
            }
          }
        };
        switch(rule.punch.nextNodes[0].nextNodes[0].condition.varComputerCode){
          case 'var-pass':
            new_not_distinguish.fee_mode.value = [{ label: '纯', value: 'PURE' }];
            new_not_distinguish.fee_mode.children.pure.mode = [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)];
            new_not_distinguish.fee_mode.children.pure.value = String(rule.punch.nextNodes[0].nextNodes[0].result.amount);
            break;
          case 'var-onJob':
            new_not_distinguish.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
            new_not_distinguish.fee_mode.children.working.time = rule.punch.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
              new_not_distinguish.fee_mode.children.working.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-punch-day': 
            new_not_distinguish.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
            new_not_distinguish.fee_mode.children.card_day.value = rule.punch.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.card_day.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_day.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.card_day.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_day.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-punch-hour':
            new_not_distinguish.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
            new_not_distinguish.fee_mode.children.card_hour.value = rule.punch.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
            new_not_distinguish.fee_mode.children.card_hour.mode1 = {
              mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
              value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
            };
            new_not_distinguish.fee_mode.children.card_hour.mode2 = {
              mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
              value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
            };
            }else{
            new_not_distinguish.fee_mode.children.card_hour.mode1 = {
              mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
              value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
            };
            new_not_distinguish.fee_mode.children.card_hour.mode2 = {
              mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
              value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
            };
            }
            
            break;
          case 'var-work-day':
            new_not_distinguish.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
            new_not_distinguish.fee_mode.children.working_day.value = rule.punch.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.working_day.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_day.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working_day.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_day.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-work-hour':
            new_not_distinguish.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
            new_not_distinguish.fee_mode.children.working_hour.value = rule.punch.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.punch.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.working_hour.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_hour.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working_hour.mode1 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_hour.mode2 = {
                mode: [FEE_WAY_MODE.wagesAndSalary.find(mode => mode.value === rule.punch.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.punch.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            
            break;
        }
        newValue[`wagesAndSalary${ruleIndex + 1}`].not_distinguish = new_not_distinguish;
      }
    }
    //差价/返费
    if(rule.date) {
      newValue[`differenceAndReturnMoney${ruleIndex + 1}`].status = true;
      newValue[`differenceAndReturnMoney${ruleIndex + 1}`].value = [rule.date.nextNodes.length > 1 ? { label: '区分男女', value: 'DISTINGUISH' } : { label: '不区分男女', value: 'NOT_DISTINGUISH' }];
      //区分男女；
      if(rule.date.nextNodes.length > 1){
        const new_distinguish = {
          male: {
            fee_mode: {
              value: [{ label: '纯', value: 'PURE' }],
              children: {
                pure: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                working: {
                  time: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                card_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                card_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                working_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                working_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                }
              }
            }
          },
          female: {
            fee_mode: {
              value: [{ label: '纯', value: 'PURE' }],
              children: {
                pure: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                working: {
                  time: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                card_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                card_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                working_day: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                },
                working_hour: {
                  value: '',
                  mode1: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  },
                  mode2: {
                    mode: [{ label: '返费', value: 'REBATE' },],
                    value: ''
                  }
                }
              }
            }
          }
        };
        rule.date.nextNodes.map(item => {
          const sex = item.condition.constantValue;
          //男模式
          if(sex === 'male'){
            switch(rule.date.nextNodes[0].nextNodes[0].condition.varComputerCode){
              case 'var-pass':
                new_distinguish.male.fee_mode.value = [{ label: '纯', value: 'PURE' }];
                new_distinguish.male.fee_mode.children.pure.mode = [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)];
                new_distinguish.male.fee_mode.children.pure.value = String(item.nextNodes[0].result.amount);
                break;
              case 'var-onJob':
                new_distinguish.male.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
                new_distinguish.male.fee_mode.children.working.time = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
                  new_distinguish.male.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-day': 
                new_distinguish.male.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
                new_distinguish.male.fee_mode.children.card_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-hour':
                new_distinguish.male.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
                new_distinguish.male.fee_mode.children.card_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-day':
                new_distinguish.male.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
                new_distinguish.male.fee_mode.children.working_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-hour':
                new_distinguish.male.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
                new_distinguish.male.fee_mode.children.working_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.male.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.male.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.male.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
            }
          }else if(sex === 'female'){
            //女模式
            switch(rule.date.nextNodes[1].nextNodes[0].condition.varComputerCode){
              case 'var-pass':
                new_distinguish.female.fee_mode.value = [{ label: '纯', value: 'PURE' }];
                new_distinguish.female.fee_mode.children.pure.mode = [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)];
                new_distinguish.female.fee_mode.children.pure.value = String(item.nextNodes[0].result.amount);
                break;
              case 'var-onJob':
                new_distinguish.female.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
                new_distinguish.female.fee_mode.children.working.time = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[1].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
                  new_distinguish.female.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.working.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-day': 
                new_distinguish.female.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
                new_distinguish.female.fee_mode.children.card_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.card_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-punch-hour':
                new_distinguish.female.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
                new_distinguish.female.fee_mode.children.card_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.card_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.card_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-day':
                new_distinguish.female.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
                new_distinguish.female.fee_mode.children.working_day.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.working_day.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_day.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
              case 'var-work-hour':
                new_distinguish.female.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
                new_distinguish.female.fee_mode.children.working_hour.value = item.nextNodes[0].condition.constantValue;
                if(rule.date.nextNodes[1].nextNodes[0].condition.operator === 'GTE'){
                  new_distinguish.female.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                }else{
                  new_distinguish.female.fee_mode.children.working_hour.mode1 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[1].result.type)],
                    value: String(item.nextNodes[1].result.amount)
                  };
                  new_distinguish.female.fee_mode.children.working_hour.mode2 = {
                    mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === item.nextNodes[0].result.type)],
                    value: String(item.nextNodes[0].result.amount)
                  };
                }
                break;
            }
          }
        })
        newValue[`differenceAndReturnMoney${ruleIndex + 1}`].distinguish = new_distinguish;
      }else{ //不区分男女
        const new_not_distinguish = {
          fee_mode: {
            value: [{ label: '纯', value: 'PURE' }],
            children: {
              pure: {
                mode: [{ label: '返费', value: 'REBATE' },],
                value: ''
              },
              working: {
                time: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              card_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_day: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              },
              working_hour: {
                value: '',
                mode1: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                },
                mode2: {
                  mode: [{ label: '返费', value: 'REBATE' },],
                  value: ''
                }
              }
            }
          }
        };
        switch(rule.date.nextNodes[0].nextNodes[0].condition.varComputerCode){
          case 'var-pass':
            new_not_distinguish.fee_mode.value = [{ label: '纯', value: 'PURE' }];
            new_not_distinguish.fee_mode.children.pure.mode = [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)];
            new_not_distinguish.fee_mode.children.pure.value = String(rule.date.nextNodes[0].nextNodes[0].result.amount);
            break;
          case 'var-onJob':
            new_not_distinguish.fee_mode.value = [{ label: '是否在职', value: 'WORKING' }];
            new_not_distinguish.fee_mode.children.working.time = rule.date.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'DATE_CONTAINS'){
              new_not_distinguish.fee_mode.children.working.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-punch-day': 
            new_not_distinguish.fee_mode.value = [{ label: '打卡是否满（单位：天）', value: 'CARD_DAY' }];
            new_not_distinguish.fee_mode.children.card_day.value = rule.date.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.card_day.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_day.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.card_day.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_day.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-punch-hour':
            new_not_distinguish.fee_mode.value = [{ label: '打卡是否满（单位：时）', value: 'CARD_HOUR' }];
            new_not_distinguish.fee_mode.children.card_hour.value = rule.date.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.card_hour.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_hour.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.card_hour.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.card_hour.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-work-day':
            new_not_distinguish.fee_mode.value = [{ label: '在职是否满（单位：天）', value: 'WORKING_DAY' }];
            new_not_distinguish.fee_mode.children.working_day.value = rule.date.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.working_day.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_day.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working_day.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_day.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
          case 'var-work-hour':
            new_not_distinguish.fee_mode.value = [{ label: '在职是否满（单位：时）', value: 'WORKING_HOUR' }];
            new_not_distinguish.fee_mode.children.working_hour.value = rule.date.nextNodes[0].nextNodes[0].condition.constantValue;
            if(rule.date.nextNodes[0].nextNodes[0].condition.operator === 'GTE'){
              new_not_distinguish.fee_mode.children.working_hour.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_hour.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
            }else{
              new_not_distinguish.fee_mode.children.working_hour.mode1 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[1].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[1].result.amount)
              };
              new_not_distinguish.fee_mode.children.working_hour.mode2 = {
                mode: [FEE_WAY_MODE.differenceAndReturnMoney.find(mode => mode.value === rule.date.nextNodes[0].nextNodes[0].result.type)],
                value: String(rule.date.nextNodes[0].nextNodes[0].result.amount)
              };
            }
            break;
        }
        newValue[`differenceAndReturnMoney${ruleIndex + 1}`].not_distinguish = new_not_distinguish;
      }
    }
  })
  return {newValue, newArr};
};