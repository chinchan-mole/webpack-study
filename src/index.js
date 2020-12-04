// import引入图片 （图片也是模块）
import img1 from './img/img1.jpg'
import img2 from './img/img2.jpg'
// 入口引入CSS
import './css/index.css'
// 入口引入一个公共JS文件的方法
import {
    hello
} from './js/common/two'
// 引入lodash
import _ from 'lodash'
console.log('这里是index入口文件');
// 执行引入的公共JS方法
hello();
// 使用lodash
console.log('我是第三方lodash执行6 + 4的结果: ' + _.add(6, 4));
// JS懒加载(延时加载)
// JS使用export导出，res这个模块对象下面可以直接取得各种数据
// JS使用export default，res.default下面才能取得各种数据
setTimeout(() => {
    import('./js/lazy-load.js').then(res => {
        console.log(res.default.number);
        res.default.fn();
    })
}, 3000)
// 入口文件中设置一个向class=warp的dom节点插入图片的函数
function appendImage(imgFile) {
    const img = document.createElement('img');
    img.src = imgFile
    document.querySelector('.wrap').appendChild(img)
}

// 执行插入图片
appendImage(img1)
appendImage(img2)

// babel ES6代码的处理
// 箭头函数
const arrow = () => {
    console.log('箭头函数')
}
arrow()

// async/await
async function slow() {
    console.log('this is async function')
    await new Promise(function (resolve, reject) {
        console.log('this is promise');
        setTimeout(function () {
            resolve('to then');
        }, 5000)
    }).then(function (val) {
        console.log(val);
    });
    console.log('async function is end')
}
slow()