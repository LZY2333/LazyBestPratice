import { Form, Input, Modal } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';

export interface ModalDemoForm {
    name: string;
}

export interface ModalDemoRefType {
    show: () => Promise<ModalDemoForm | false>;
}
interface ModalDemoPropsType {}

// 弹窗的开启关闭
const ModalDemo = React.forwardRef<ModalDemoRefType, ModalDemoPropsType>((_props, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    // 弹窗核心逻辑
    const promiseRef = useRef<{ resolve: (value: ModalDemoForm | false) => void }>();
    useImperativeHandle(ref, () => ({
        show: async () => {
            try {
                // 获取到数据可以做一些 与该弹窗业务逻辑相关的预先校验
                // 或对 数据进行处理 根据数据修改弹窗状态 等

                // 打开弹窗，返回Promise，等待用户操作
                setVisible(true);
                return new Promise((resolve) => {
                    promiseRef.current = { resolve };
                });
            } catch (error) {
                console.log('error', error);

                // Modal.error();
                // 相当于 return Promise.resolve(false);
                return false;
            }
        },
    }));

    // 用户操作
    const handleConfirm = async () => {
        try {
            setVisible(false);
            const formResult = await form.validateFields();
            // 获取表单数据后，可 await 更多后端校验等，如果成功，再resolve
            promiseRef.current?.resolve(formResult);
        } catch (error) {
            console.log('error', error);
        }
    };
    const handleCancel = () => {
        setVisible(false);
        // 无论
        promiseRef.current?.resolve(false);
    };

    return (
        <Modal title='ModalDemo' open={visible} onOk={handleConfirm} onCancel={handleCancel}>
            <Form form={form}>
                <Form.Item label='name' name='name' required>
                    <Input maxLength={8} autoComplete='off' />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default ModalDemo;
