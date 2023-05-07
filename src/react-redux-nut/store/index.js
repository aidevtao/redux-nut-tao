// import { createStore, applyMiddleware } from "redux"
import { createStore, applyMiddleware } from '../redux-nut'
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'

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
export default store

function logger({ getState, dispatch }) {
  // 返回的是：
  return (next) => (action) => {
    console.log("-----------------------"); //sy-log

    console.log(action.type + "执行了"); //sy-log

    const prevState = getState();

    console.log("prev state", prevState); //sy-log

    const returnValue = next(action);

    // 等状态值修改之后，再执行getState，拿到了新的状态值
    const nextState = getState();

    console.log("next state", nextState); //sy-log

    console.log("-----------------------"); //sy-log
    return returnValue;
  };
}
// function thunk({ dispatch, getState }) {
//   return next => action => {
//     if (typeof action === "function") {
//       return action(dispatch, getState);
//     }
//     return next(action);
//   };
// }
function thunk({ dispatch, getState }) {
  return function first(next) {
    return function second(action) {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }
      return next(action)
    }
  }
}