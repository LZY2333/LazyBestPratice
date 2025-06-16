### ✨ Ant Design Form 组件封装 RangePicker 过程记录

作为一个React业务仔，接触到最多的东西就是form 和 table了

form 和 table 有个最大的特点，就是FormItem 和 Column 绑定字段，而字段在整个项目中有极大的复用性，且一改全改

在各种不同的页面中通常是组合模式，那么是否可以 针对字段的层级，封装FormItem, Column,

封装时，可同时携带其 下拉数据，渲染规则，过滤规则，字段转换，默认值 等所有配置，

封装完成后，在不同的展示页面，可直接根据后端接口字段引用组件，来组合出Form, Table，

form可直接输出校验完成的字段，table可直接输出渲染结果，统一封装也可以将出错概率降为零，业务组件涉及的更清晰，一目了然当前form/table用到了什么属性

接口变更，字段变更，字段渲染规则变更时，可一改具改。


在 React 业务开发中，Form 和 Table 是最常用的组件，它们的核心特点是 FormItem 和 Column 绑定字段，而这些字段在整个项目中具有高度的复用性，并且一旦修改，需要全局生效。

在不同的页面中，我们通常采用组合模式来使用 Form 和 Table，因此可以进一步优化，将字段的所有配置（如下拉数据、渲染规则、过滤逻辑、字段转换等）与 FormItem、Column 进行统一封装。

封装后的组件具备以下优势：

高复用性：不同页面可直接使用封装组件，避免重复定义字段逻辑。
统一管理：所有字段的校验、渲染、转换逻辑都集中在一个地方，减少维护成本。
增强一致性：表单 Form 直接输出校验后的字段，表格 Table 直接渲染最终结果，确保数据一致性。
提升开发效率：使用封装组件可以快速搭建 Form 和 Table，减少重复编码。
降低错误率：字段变更（如接口调整、格式修改、展示规则更新）时，仅需修改封装组件，即可全局生效，避免遗漏或错误。
通过这种方式，业务组件的结构更加清晰，开发体验更流畅，代码维护更加高效。


在 Ant Design 的 `Form` 组件中，`RangePicker` 的默认行为会输出一个 Moment 对象数组，而我们希望让 `Form` 只关注 `startTime` 和 `endTime` 两个字段，格式化为 `YYYY-MM-DD`。为此，我们逐步优化方案，最终封装了一个可复用的 `DateRangeField` 组件。

---

## 🎯 需求分析

我们希望实现以下目标：

1. `Form` 只存 `startTime` 和 `endTime`，不存 `dateRange`。
2. `RangePicker` 自动更新 UI，随 `startTime` 和 `endTime` 变化而更新。
3. `form.validateFields()` 返回的数据仅包含 `startTime` 和 `endTime`，不包含 `dateRange`。
4. `form.setFieldsValue({ startTime, endTime })` 可以直接更新 `RangePicker` 的 UI。
5. 可复用，在多个表单中轻松引入 `startTime` / `endTime`。

---

## 逐步优化方案

### Step 1：使用 `normalize` 处理 `RangePicker`

解决问题：

- `Form` 只会存 `startTime` 和 `endTime`，不会存 `dateRange`。
- `validateFields()` 返回的数据符合预期。

```jsx
<Form.Item
  label="日期区间"
  name="dateRange"
  normalize={(value) => ({
    startTime: value?.[0]?.format("YYYY-MM-DD") || null,
    endTime: value?.[1]?.format("YYYY-MM-DD") || null,
  })}
>
  <RangePicker />
</Form.Item>
```

遗留问题：

- `setFieldsValue({ startTime, endTime })` 时，`RangePicker` 的 UI 不会更新。

---

### Step 2：封装 `CustomRangePicker` 组件

解决问题：

- `setFieldsValue({ startTime, endTime })` 也能更新 `RangePicker` UI。
- `RangePicker` 监听 `startTime` / `endTime` 变化，自动同步 UI。

优化后的 `CustomRangePicker` 组件，提高性能，减少不必要的 `onChange` 调用。

```jsx
const CustomRangePicker = ({ value = {}, onChange }) => {
  // 避免组件每次渲染都重新创建 moment 对象
  const rangeValue = useMemo(() => {
    return value.startTime && value.endTime
      ? [moment(value.startTime), moment(value.endTime)]
      : [];
  }, [value.startTime, value.endTime]);

  const handleChange = useCallback((dates) => {
    onChange({
      startTime: dates?.[0]?.format("YYYY-MM-DD") || null,
      endTime: dates?.[1]?.format("YYYY-MM-DD") || null,
    });
  }, [onChange]);

  return <RangePicker value={rangeValue} onChange={handleChange} />;
};
```

优化点：

1. **使用 `useMemo`**：避免 `moment` 在每次渲染时重复计算。
2. **使用 `useCallback`**：减少 `handleChange` 重新创建的次数，优化性能。
3. **去掉 `useEffect`**：直接依赖 `value` 计算 `rangeValue`，减少不必要的 `onChange` 调用。

---

### Step 3：最终封装 `DateRangeField` 组件

```jsx
const DateRangeField = ({ label = "日期区间" }) => {
  return (
    <>
      <Form.Item
        label={label}
        name="dateRange"
        normalize={(value) => ({
          startTime: value?.startTime || null,
          endTime: value?.endTime || null,
        })}
      >
        <CustomRangePicker />
      </Form.Item>

      <Form.Item name="startTime" hidden>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name="endTime" hidden>
        <Input type="hidden" />
      </Form.Item>
    </>
  );
};
```

---

## 🔥 最终总结

| 需求                                                               | 方案                           |
| ------------------------------------------------------------------ | ------------------------------ |
| `form` 只存 `startTime` 和 `endTime`，不存 `dateRange`             | `normalize` 处理               |
| `setFieldsValue({ startTime, endTime })` 自动更新 `RangePicker` UI | 依赖 `value` 计算 `rangeValue` |
| 在任何 `Form` 里轻松复用                                           | 封装 `DateRangeField` 组件     |

最终，我们通过 `DateRangeField` 组件，完美解决了 `Form` 只关注 `startTime` 和 `endTime`，完全感知不到 `dateRange`！


## modal中tab切换

需求: 在modal中存在多个tab, 每个tab有table, 希望做到点击tab才加载对应table数据, 且切换tab仍然保存加载过的页签数据

### 父组件Modal写法

父组件Modal中使用`stored`的state字段，储存点击加载过的页签`type`，`type`为页签组件Enum值

TSX部分逻辑写成`{stored.includes(当前页签) && (页签组件)}`

加载过的页签会一直保存组件，未加载的组件不会初始化

> 数据不储存在父节点，Modal层只考虑切换逻辑，由各页签自己管理

## 子组件页签写法

子组件`xxxTable`中，接收父组件传入的`type`, 放心使用`useEffect`初始化table数据

各自管理自己的table逻辑，含自己的过滤form控件

TSX部分在最外层使用`type !== 当前页签Type`时, `display: none` 或 `return null`

初始化过的页签，仅从DOM层面隐藏，数据会一直存在，以便tab切换时随时展示

> 没有使用父组件储存数据的方式，后续新增页签时无需修改父组件内容，各自页签管理各自数据，修改时也能更少出错
>

## 自定义控件

我们封装业务组件时，经常会考虑一个问题

就是我希望，这个组件可以直接处理好数据，而不需要我后续再处理

因为对于这个字段来说，这个处理的逻辑是固定的，比如`2025/06/16` 转换为 `2025-06-16` 用于传给后端

那么我希望，这个处理能直接封装在组件内部，跟着组件走。