import { Form, Input, Select, DatePicker } from 'antd'

// 1. 组件名即字段名，不同字段使用不同组件，即使为同类型字段
// 使用时直接根据后端接口字段组合form表单
// 2. 



// name
export const Name = () => {
    return (
        <Form.Item label='姓名' name='name' required>
            <Input maxLength={8} autoComplete='off' />
        </Form.Item>
    )
}

// sex
export const Sex = () => {
    return (
        <Form.Item label='性别' name='sex' required>
            <Select
                options={[
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                ]}
            />
        </Form.Item>
    )
}

// dateStart/dateEnd
export const DateRange = () => {
    return (
        <Form.Item label='日期范围' name='dateRange' required>
            <DatePicker.RangePicker />
        </Form.Item>
    )
}