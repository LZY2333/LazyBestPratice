---
title: React个人最佳实践-表单
date: 2024-08-01 10:46:13
categories: 经验帖
tags: 
    - 最佳实践
---

感觉大家还挺爱看这个系列，赶紧补下一篇

接下来将按步骤由简到难举例我对form封装的一些思考

项目级Form字段统一封装技巧

## 按字段直接封装FormItem

将同一字段的 属性 校验 转换 统一封装在FormItem中, 并以字段名命名

表单使用时，直接拼装涉及的 字段名组件，即代表该Form产出哪些字段

```tsx
// gender 字段
export const Gender: React.FC<FormItemProps> = (props) => {
    return (
        <Form.Item label="性别" name="gender" required {...props}>
            <Select
                options={[
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '其他', value: 'other' },
                ]}
            />
        </Form.Item>
    );
};
// 表单增加输出: { gender: xxx }
```

```tsx
// FormDemo使用
export const FormDemo = () => {
    return (
        <Form>
            <Gender />
        <Form>
    );
};
```

业务开发中，同一字段往往需要同样的处理 校验逻辑，按字段封装可统一这些逻辑

所有字段的处理均在字段FormItem组件内进行，不再在外部Form内进行

Form内仅对整体表单校验的前后负责，不对字段负责

引入组件 即 引入字段，即 引入各种校验及其下拉数据等

正常情况下 引入对应字段组件即可获取安全完整的数据

使用便捷 修改统一 表单代码一目了然

接下来我要讲的技巧，其所有目的都是为了服务下面这一理念: 

__按字段封装FormItem，且集成该字段的所有处理__

让字段做到高内聚，字段之间做到低耦合，可随意组合，快速使用。

## 字段联动的FormItem

一个字段的展示，或一个字段的下拉可选范围依赖于其他字段的选择，可以采用以下技巧

```tsx
// customizeGender 字段
export const CustomizeGender: React.FC<FormItemProps> = (props) => {
    const shouldUpdate = (prev: any, curr: any) => prev.gender !== curr.gender;
    return (
        <Form.Item noStyle shouldUpdate={shouldUpdate}>
            {({ getFieldValue }) =>
                getFieldValue('gender') === 'other' ? (
                    <Form.Item
                        name="customizeGender"
                        label="Customize Gender"
                        rules={[{ required: true }]}
                        {...props}
                    >
                        <Input />
                    </Form.Item>
                ) : null
            }
        </Form.Item>
    );
};
// 表单增加输出: { customizeGender: xxx }
```

外层`Form.Item`作用是获取Form中的context内容，内层`Form.Item`才是真正的字段控件

内层`Form.Item`没有渲染时，Form的输出并不会含customizeGender字段

根据业务不同，也可采用其他封装方式，灵活变动: 

1. 字段B 并非全部情况都依赖 字段A

字段B只封装 内层`Form.Item`部分，外层可做二级封装，视业务引用一级或二级

2. 字段B 与 字段A 强绑定，二者必同时出现

```tsx
// a 字段 和 b 字段
export const AB: React.FC<FormItemProps> = (props) => {
    return (
        <>
           <Form.Item name="a" label="A" >
               <Input />
           </Form.Item>
           <Form.Item name="b" label="B" >
               <Input />
           </Form.Item>
        </>
    );
};
```

3. 字段B 并非依赖于 表单内字段，而是依赖于表单外的业务情况

字段B只封装 内层`Form.Item`部分，展示与否由引用时if控制











## 了解源码对开发的帮助

这一节技巧其实不复杂，但观察到实际开发中有些同事总是排斥这一写法

过了很久我才明白，归根结底是不了解，不敢用，开发进度快，有点什么事总怀疑这有问题

最后，干脆老一套的使用额外的外部state状态控制if




至于究竟是什么原理，为什么Form 和 Form.Item 可以多层嵌套，且可以是非直系子组件

## Form 和 Form.Item 的原理

其实其原理非常非常简单，请记住一句话

Form 本质就是 react.createContext 中 Provider，其包裹的子组件可以共享其context内的数据

就是 context.provider的 JSX封装后简化版，Form其内部实现关键就是一个context

使用 context的写法 可完全将其替代，且所有的 `Xxx.XxxItem` 类似的组件均为这种模式。

> 但 Form.Item 和其表单控件必须是直系 子组件












## 接下来是Form的一些使用建议

```tsx
export const FormDemo = () => {
    const [form] = Form.useForm();
    return (
        <Form form={form}>
            <Sex />
        <Form>
    );
};
```

下面的内容带有部分主观色彩，可能有争议，这是自然，每个属性存在必然是有其适合的场景

我会列举出自己的理由，以及做出对比，

## setFieldsValue 代替 initialValues属性

__防止割裂__

__受控与非受控__

我们可以简单笼统地认为，

【新增】功能属于只需输出表单内容，因而

【修改】按钮是

setFieldsValue设置初始值，更显式，更易阅读，

更适合同时具有【新增】【修改】两种状态的弹窗

## validateFields 代替 onFinish属性

__防止割裂__

__受控与非受控__

【确定】按钮点击前校验，以及成功后校验一并做完







## 总结

以上思考源自于:

1. 对antd文档一遍又一遍的阅读

2. 开发时对组件要求逻辑合理，使用简便的自我约束

3. 给同事做代码检视发现的可提高的地方
