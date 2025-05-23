import React from 'react';
import { Table, type TableColumnsType } from 'antd';

const ModalTable: React.FC = () => {
    const columns:TableColumnsType = [
        {
            title: '中文名',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            fixed: 'left', 
        },
    ];
    return <Table columns={columns} />;
};



// import { Table } from 'antd';
// import type { TableColumnsType } from 'antd';

// interface User {
//   key: number;
//   name: string;
// }

// const columns: TableColumnsType<User> = [
//   {
//     key: 'name',
//     title: 'Name',
//     dataIndex: 'name',
//   },
// ];

// const data: User[] = [
//   {
//     key: 0,
//     name: 'Jack',
//   },
// ];

// const Demo: React.FC = () => (
//   <>
//     <Table<User> columns={columns} dataSource={data} />
//     {/* 使用 JSX 风格的 API */}
//     <Table<User> dataSource={data}>
//       <Table.Column<User> key="name" title="Name" dataIndex="name" />
//     </Table>
//   </>
// );

// export default Demo;


// ------------------------------------------------------------
// 将复杂组件额外封装，避免其他属性的变更导致复杂组件也重新渲染
// 删除最后一页数据时，要改为查询上一页信息 
// 进入详情页，列表页display:none
