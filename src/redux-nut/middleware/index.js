function logger({ getState, dispatch }) {
  // 返回的是：
  return (next) => (action) => {

    console.log(action.type + "执行了"); //sy-log

    const prevState = getState();

    console.log("prev state", prevState); //sy-log

    const returnValue = next(action);

    // 等状态值修改之后，再执行getState，拿到了新的状态值
    const nextState = getState();

    console.log("next state", nextState); //sy-log

    return returnValue;
  };
}
function thunk({ dispatch, getState }) {
  return next => action => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    return next(action);
  };
}

export {
  thunk,
  logger,
}