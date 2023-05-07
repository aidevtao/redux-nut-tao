// import {createReducer} from "@reduxjs/toolkit";
import createReducer from "./createReducer";

import createAction from "./createAction";
// 首先参数是一个对象，在这里解构一下
export default function createSlice({ name, initialState, reducers }) {
  const reducerNames = Object.keys(reducers);
  // createSlice本身并没有action对象，需要创建
  const actionCreators = {};

  const sliceCaseReducersByType = {};

  reducerNames.forEach((reducerName) => {
    const maybeReducerWithPrepare = reducers[reducerName];

    const type = `${name}/${reducerName}`;

    sliceCaseReducersByType[type] = maybeReducerWithPrepare;
    actionCreators[reducerName] = createAction(type);
  });

  function buildReducer() {
    return createReducer(initialState, (builder) => {
      for (let key in sliceCaseReducersByType) {
        builder.addCase(key, sliceCaseReducersByType[key]);
      }
    });
  }

  let _reducer;

  //返回一个对象 
  return {
    name,
    actions: actionCreators,
    reducer: (state, action) => {
      if (!_reducer) _reducer = buildReducer();

      return _reducer(state, action);
    },
  };
}
