import moment from "moment";

export const originRule = {
  orderRangeDate1: {
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  },
  mode1: [],
  wagesAndSalary1: {
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
  },
  differenceAndReturnMoney1: {
    status: false,
    value: [{ label: '不区分男女', value: 'NOT_DISTINGUISH' }],
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
    },
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
    }
  }
};