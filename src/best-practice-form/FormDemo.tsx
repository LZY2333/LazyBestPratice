import { Form } from "antd";
import { DateRange } from "./FormItemsModuleA";

const FormDemo = () => {
    const [form] = Form.useForm();
    return (
        <>
            <Form form={form} initialValues={{ dateStart: "2025/06/01", dateEnd: "2025/06/02" }}>
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
