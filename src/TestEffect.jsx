import { useEffect, useState } from "react"


const TestEffect = () => {

    const [a, setA] = useState('a') // 前端input onchange事件时会修改
    const [b, setB] = useState('b') // 前端input onchange事件时会修改
    const [c, setC] = useState('c') // 依赖后端数据，需初始化

    useEffect(() => {
        // 查询后端C的数据
        setTimeout(() => {
            setC('ccc')
        }, 100);
    }, [])

    useEffect(() => {
        // 【解决方案】:在这里加条件return
        query(a, b, c)
        // query首屏被触发了两次
        // 第一次是 a b c 初始化触发
        // 第二次是 setC 触发
        // 有没有什么优雅的写法让首屏只触发一次这个useEffect
    }, [a,b,c])

    // 根据 abc查询首屏 展示 的数据
    const query = () => {
        console.log('首屏被触发了两次');
    }

    return <div />
}

export default TestEffect