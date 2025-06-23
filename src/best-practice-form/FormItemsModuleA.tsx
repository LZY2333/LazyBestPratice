import { Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
// 日常开发中架构代码写一点，业务代码也要写一点，这个系列是我对自己业务代码的总结
// 分为四大块 Modal、Form、Table、 Form内嵌Table 及 Table内嵌Form
// 这四大场景覆盖了我大部分通用业务场景
// 同时会写很多一些感悟，以及一些给同事做代码检视时发现的可提高的地方
// 多次项目重构

// 1. 组件名即字段名，不同字段使用不同组件，即使为同类型字段
// 使用时直接根据后端接口字段组合form表单
// 2.

// name
export const Name = () => {
    return (
        <Form.Item label="姓名" name="name" required>
            <Input maxLength={8} autoComplete="off" />
        </Form.Item>
    );
};

// gender
export const Gender = () => {
    return (
        <Form.Item label="性别" name="gender" required>
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

// 条件渲染的表单控件
// (很多同学会将gender在form外部储存一个变量，然后根据这个变量来判断是否渲染customizeGender)
// 这样不优雅, 且两份数据源容易出错，请按这个写法
// customizeGender
export const CustomizeGender = () => {
    return (
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
            {({ getFieldValue }) =>
                getFieldValue('gender') === 'other' ? (
                    <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ) : null
            }
        </Form.Item>
    );
};
// 我发现有些同学会害怕这种写法，甚至害怕一些React语法不敢写
// 本质上都是对React原理不熟悉，对组件的实现不熟悉，导致写代码畏手畏脚
// 这里可以明确说 Form.Item 嵌套使用完全不用担心
// 第一个 Form.Item 作用是 获取作为一个context，获取formInstance内部出场的值
// 第二个 Form.Item 才是真正的表单项
// 且 第二个 Form.Item 没有渲染时，Form的输出并不会含customizeGender字段





// 表单输出的是 string 格式的时间（例如：'2025/06/01'）；
// 表单赋值（setFieldsValue） 也使用 '2025/06/01' 字符串；
// DateRange 组件内部自动做 string <=> dayjs 的转换；
// 使用者只关心字段是 dateStart / dateEnd: string，不接触 dayjs 对象。
const { RangePicker } = DatePicker;
const FORMAT = 'YYYY/MM/DD';
type DateRangeFormItem = {
    dateStart: string;
    dateEnd: string;
};
// dateStart/dateEnd
export const DateRange = () => {
    const shouldUpdate = (prev: DateRangeFormItem, curr: DateRangeFormItem) =>
        prev.dateStart !== curr.dateStart || prev.dateEnd !== curr.dateEnd;

    return (
        <>
            <Form.Item noStyle shouldUpdate={shouldUpdate}>
                {({ getFieldValue, setFieldsValue }) => {
                    const startStr = getFieldValue('dateStart');
                    const endStr = getFieldValue('dateEnd');

                    // 转换为 dayjs 对象用于显示
                    const dateStart = startStr ? dayjs(startStr, FORMAT) : undefined;
                    const dateEnd = endStr ? dayjs(endStr, FORMAT) : undefined;

                    return (
                        <Form.Item label="日期范围">
                            <RangePicker
                                value={[dateStart, dateEnd]}
                                format={FORMAT}
                                onChange={(dates) => {
                                    if (!dates) {
                                        setFieldsValue({
                                            dateStart: undefined,
                                            dateEnd: undefined,
                                        });
                                        return;
                                    }

                                    const [start, end] = dates;
                                    setFieldsValue({
                                        dateStart: start?.format(FORMAT) || undefined,
                                        dateEnd: end?.format(FORMAT) || undefined,
                                    });
                                }}
                            />
                        </Form.Item>
                    );
                }}
            </Form.Item>

            <Form.Item name="dateStart" hidden />
            <Form.Item name="dateEnd" hidden />
        </>
    );
};
