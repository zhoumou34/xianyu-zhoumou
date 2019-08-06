// 数据对象
export const state = () => ({
  history: []
})
// 设置state的值
export const mutations = {
  setHistory(state, arr) {
    state.history = arr
    console.log(state.history)
  }
}
