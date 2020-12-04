// 入口引入others的css文件
import './css/other.css'
// 入口引入一个公共JS文件的方法
import {
    hello
} from './js/common/two'
import _ from 'lodash'
console.log('这里是others入口文件');
// 执行引入的公共JS方法
hello();
console.log('我是lodsh生成的随机数： ' + _.random(3, 10, false));