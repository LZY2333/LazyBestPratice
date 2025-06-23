---
title: React个人最佳实践-表单
date: 2024-08-01 10:46:13
categories: 经验帖
tags: 
    - 最佳实践
---

感觉大家还挺爱看这个系列，赶紧补下一篇

接下来将按步骤由简到难举例我对form封装的一些思考

## 直接封装FormItem

```tsx
// sex
export const Sex = () => {
    return (
        <Form.Item label="性别" name="sex" required>
            <Select
                options={[
                    { label: "男", value: "male" },
                    { label: "女", value: "female" },
                ]}
            />
        </Form.Item>
    );
};
```

```tsx
// 使用
export const FormDemo = () => {
    return (
        <Form>
            <Sex />
        <Form>
    );
};
```






















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
