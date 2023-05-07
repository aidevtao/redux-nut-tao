// import { createStore, applyMiddleware } from "redux"
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from '../libs'
import { logger, thunk } from '../middleware'

function countReducer(state = 0, action) {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}
const store = createStore(countReducer, applyMiddleware(thunk, logger))
// const store = createStore(countReducer,)
export default store

const actionCreator = (type) => ({ type })
// 加强
// function dispatchAndLog(actionOBJ) {
//   console.log('prevState:', store.getState());
//   store.dispatch(actionOBJ)
//   console.log('nextState', store.getState())
// }

// 中间件原理
// dispatchAndLog(actionCreator('ADD'))
// 这里面有一个指针移动的过程
// 替换原生的dispatch并保留原来的指针
// function replace() {
//   // 保留原生的dispatch
//   let raw = store.dispatch
//   // 把原生的指向我们增强的dispatch函数，
//   store.dispatch = function (actionOBJ) {
//     console.log('prevState:', store.getState());
//     // 执行保存的原生dispatch
//     raw(actionOBJ)
//     console.log('nextState', store.getState())
//   }
//   store.dispatch(actionCreator('ADD'))

// }
// replace()

// 指针的替换是实现中间件最关键的部分。--------------start-----------------------------------
// 接下来实现在redux内部提供一个store.dispatch辅助方法，
// 返回增强的store.dispatch.而不是里面更改它的指针。
// function onlyReturn() {
//   // 保留原生的dispatch
//   let raw = store.dispatch
//   // 返回我们增强的dispatch函数，
//   return function (actionOBJ) {
//     console.log('prevState:', store.getState());
//     // 执行保存的原生dispatch
//     raw(actionOBJ)
//     console.log('nextState', store.getState())
//   }
// }
// store.dispatch = onlyReturn()
// store.dispatch(actionCreator('ADD'))
// ------------------------------------end--------------------------------

// 下面我们参照中间件最核心的部分实现三个中间件-----------start-------------------------
function mdw_01() {
  // 保留原生的dispatch
  let raw = store.dispatch
  // 返回我们增强的dispatch函数，
  return function (actionOBJ) {
    console.log('actionOBJ_001:', actionOBJ);
    // 执行保存的原生dispatch
    raw(actionOBJ)
    console.log('nextState_01', store.getState())
  }
}

function mdw_02() {
  // 保留原生的dispatch
  let raw = store.dispatch
  // 返回我们增强的dispatch函数，
  return function (actionOBJ) {
    console.log('actionOBJ_02:', actionOBJ);
    // 执行保存的原生dispatch
    raw(actionOBJ)
    console.log('nextState_02', store.getState())
  }
}

function mdw_03() {
  // 保留原生的dispatch
  let raw = store.dispatch
  // 返回我们增强的dispatch函数，
  return function (actionOBJ) {
    console.log('actionOBJ_03:', actionOBJ);
    // 执行保存的原生dispatch
    raw(actionOBJ)
    console.log('nextState_03', store.getState())
  }
}

// 定义一个chain函数，把多个中间件串起来
// 我们的每个中间件都增强了dispatch,如何把他们串起来。
// 分别执行每个console.log('prevState:', store.getState());
// 然后在执行reducer，处理action
function chain(mdws) {
  // 反转数组，可以是执行顺序按照我们传入的顺数
  mdws = mdws.reverse()
  mdws.forEach(mdw => {
    // 改变指针，把dispatch指向前一个dmw
    return store.dispatch = mdw()
  });
}
// chain([mdw_01, mdw_02, mdw_03])
// store.dispatch(actionCreator('ADD'))
// -----------------------------------------end---------------------------

// 以上我们的每个中间件都生命了raw并把原生的dispatch指针保存---------start---------------
// 看来非常不雅观，可以使用闭包思想，利用函数柯理化技术把原生的指针作为参数传进去
function mdw_04() {
  // raw是传进来的保留原生的dispatch
  return function (raw) {
    return function (actionOBJ) {
      console.log('actionOBJ_04:', actionOBJ);
      // 执行保存的原生dispatch
      raw(actionOBJ)
      console.log('nextState_04', store.getState())
    }
  }
}
function mdw_05() {
  // raw是传进来的保留原生的dispatch
  return function (raw) {
    return function (actionOBJ) {
      console.log('actionOBJ_05:', actionOBJ);
      // 执行保存的原生dispatch
      raw(actionOBJ)
      console.log('nextState_05', store.getState())
    }
  }
}
function chain_raw(mdws) {
  // 反转数组，可以是执行顺序按照我们传入的顺数
  mdws = mdws.reverse()
  mdws.forEach(mdw => {
    // 改变指针，把dispatch指向前一个dmw
    return store.dispatch = mdw()(store.dispatch)
    //后一个dispatch是我们传入原生的dispatch
  });
}
chain_raw([mdw_04, mdw_05])
store.dispatch(actionCreator('ADD'))
// ----------------------end--------------------------------------
