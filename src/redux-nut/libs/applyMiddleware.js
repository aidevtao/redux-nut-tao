import compose from "./compose";

export default function applyMiddleware(...middlewares) {
  return function enhancer(createStore) {
    return function createStoreWithMiddleware(reducer, preloadedState, enhancer) {
      const store = createStore(reducer, preloadedState, enhancer);
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      const chainComposed = compose(...chain)
      const dispatch = chainComposed(store.dispatch)
      return { ...store, dispatch };
    };
  };
}
function thunk1({ dispatch, getState }) {
  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }
      return next(action)
    }
  }
}
function compose1(...funcs) {
  return funcs.reduce((a, b) => {
    return (...arg) => {
      return a(b(...arg))
    }
  })
}




// export default function applyMiddleware(...middlewares) {
//   // applyMiddleware返回的就是createStore函数接受的第二个参数enhancer
//   return (createStore) =>
//     (reducer) => {
//       // 我们的目标是加强dispatch,来自store
//       const store = createStore(reducer);
//       let dispatch = store.dispatch;

//       // todo 加强dispatch

//       const midAPI = { // 把store的权限传递给中间件(redux-thunk等)
//         getState: store.getState,
//         // dispatch, 不能传递给store原本的dispatch，因为这个并没有加强
//         dispatch: (action, ...args) => dispatch(action, ...args), //这个dispatch是中间件上下文中的dispatch,即加强后的。
//       };
//       // 要想加强dispatch就是要挨个执行每个中间件，并把权限给他们。返回一个新的中间件数组，它和旧版的区别是拿到了store权限
//       const middlewareChain = middlewares.map((middleware) => middleware(midAPI));

//       // 加强版的dispatch
//       // 把所有的中间件的函数都执行了，同时还执行store.dispatch
//       dispatch = compose(...middlewareChain)(store.dispatch);

//       return {
//         ...store,
//         // 加强版的dispatch
//         dispatch,
//       };
//     };
// }