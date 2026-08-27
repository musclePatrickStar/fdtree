// 工具函数
function greet(name) {
  return 'Hello, ' + name + '!'
}

function farewell(name) {
  return 'Goodbye, ' + name + '!'
}

function addNumbers(a, b) {
  return a + b
}

// 新增：乘法（演示 git 模式下与 HEAD 的差异）
function multiplyNumbers(a, b) {
  return a * b
}

module.exports = { greet, farewell, addNumbers, multiplyNumbers }
