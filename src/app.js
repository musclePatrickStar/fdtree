// 示例应用入口
const { greet, farewell, addNumbers } = require('./utils')

function main() {
  const names = ['Ada', 'Bob', 'Cara', 'Dave', 'Eve']
  for (const name of names) {
    console.log(greet(name))
  }
  console.log(farewell('Ada'))
  console.log('1 + 2 = ' + addNumbers(1, 2))
  console.log('2 + 3 = ' + addNumbers(2, 3))
  console.log('总计 ' + names.length + ' 人')
}

main()
