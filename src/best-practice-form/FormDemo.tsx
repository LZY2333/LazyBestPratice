import { Form } from 'antd';
import { DateRange, Gender, Name, CustomizeGender, AmountStartAmountEnd } from './FormItemsModuleA';

const FormDemo = () => {
    const [form] = Form.useForm();
    return (
        <>
            <Form form={form}>
                <Name />
                <Gender />
                <CustomizeGender />
                <AmountStartAmountEnd />
                <DateRange />
            </Form>
            <button
                onClick={() => {
                    console.log(form.getFieldsValue());
                }}
            >
                获取值
            </button>
        </>
    );
};

export default FormDemo;
