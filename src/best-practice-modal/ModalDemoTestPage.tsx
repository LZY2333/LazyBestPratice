import { Button } from 'antd';
import React, { useRef } from 'react';
import ModalDemo, { ModalDemoRefType } from './ModalDemo';

// 现在我们有一个很常见的业务需求，修改一条表格数据，这需要一个弹窗
// 使用该方案封装后的弹窗使用方式如下


// 怎么样是不是特别简洁
// 且该方案应对多个连续弹窗校验时更能凸显其优势，整个流程可在一个函数内完成，一目了然
// 例如
// 扣款业务，涉及身份验证弹窗,密码验证弹窗,账户状态确认，余额警告确认,扣款结果确认等，多层弹窗的情况
// 以及 各类弹窗校验 与 发起后台请求校验 的情况，均可做统一处理
// 可将逻辑分发至各弹窗组件，保证其复用性的同时，更能灵活使用，可任意改变业务顺序，任意新增组合
// 最终，无论如何改变，在一个函数内可看到整个复杂流程的全貌。
// 试想一下这么一个场景，

// 想出这一操作的根本理念是: 对于当前页面来说，弹窗的用户操作其实可以视为一种异步，与后台请求别无二致
// 能做出这一操作的基础是: 对Promise的理解,
// 在弹窗内 将Promise视为一种简易的发布订阅操作而使用,
// 当page使用modal，modal先返回一个Promise(相当于page订阅了modal)
// modal专注于自己的业务处理，在modal判定自己流程结束后(例如用户点击了确认)
// 同时，利用了 async await 的阻断特性，得以 让整个函数流程



// 另外一个需要注意的点是，点击确认按钮往往意味着数据的保存，那么该请求应该在弹窗内发出，还是由该modal将数据传递到弹窗外，由page页面发出呢
// 个人认为应该在弹窗内发出
// 0. 数据抛出弹窗，应该当视为弹窗整个生命周期结束，属于该弹窗的整个业务逻辑结束
// 1. 假设数据保存的接口报错，此时用户可能需要修改
const ModalDemoTestPage: React.FC = () => {
    // 注意useRef用于挂载只读属性(如原生DOM)时，规范要求传递null
    {/* 第一步 */}
    const demoModalRef = useRef<ModalDemoRefType>(null);

    const longCheck = async () => {
        // do something ...
        // when you need a Modal check
        // 第三步
        const result = await demoModalRef.current!.show();
        if (!result) {
            return;
        }
        console.log('result as ModalDemoForm', result);
        // do something ...
    };
    return (
        <div>
            <h1>ModalDemoTestPage </h1>
            <Button onClick={longCheck}>Click Here!</Button>
            {/* 第二步 */}
            <ModalDemo ref={demoModalRef} />
        </div>
    );
};

export default ModalDemoTestPage;
