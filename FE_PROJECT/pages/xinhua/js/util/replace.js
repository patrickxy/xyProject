// 用于替换页面参数
import $ from 'webpack-zepto';

// 参数格式
let config = {
  title: '',
  nodes: [
    {
      id: 'dsad4234ds3',
      nodeType: 'text',
      content: '111',
      top: '',
      left: '',
      opactiy: '0.5',
      color: '#456',
    }
  ]
}

config.nodes.forEach((item, index)=>{
  console.log(item)
})



export default function replace(){


}