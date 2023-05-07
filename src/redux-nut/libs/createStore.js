// 第二个参数是一个applyMiddleware(redux-thunk,redux-logger)的执行结果，也就是说是一个加强器，它是一个函数，加强的是dispatch
export default function createStore(reducer, enhancer) {
  // 加强器加强的是dispatch，而dispatch来自creareStore,所以需要把createStore传入，而createStore的执行又需要reducer
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  // 当前状态值
  let state;
  let listeners = [];

  // 返回当前状态值
  function getState() {
    return state;
  }

  // 组件注册 listener是一个函数:()=>this.forceUpdate()
  function subscribe(listener) {
    listeners.push(listener);
    // 取消注册
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  // 根据reducer修改状态值
  function dispatch(action) {
    state = reducer(state, action);
    // 状态改变 更新所有已注册的组件 
    listeners.forEach(listener => listener());
  }

  // 自动执行一次reducer,将默认的state状态值，渲染到页面中
  dispatch({ type: '@@redux/INIT' });

  return {
    dispatch,
    getState,
    subscribe,
  };
}
