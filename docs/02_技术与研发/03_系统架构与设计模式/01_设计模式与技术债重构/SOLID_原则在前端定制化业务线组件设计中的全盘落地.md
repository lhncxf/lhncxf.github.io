# 单点实战与最佳实践 [SOLID 原则在前端定制化业务线组件设计中的全盘落地]

> **使用场景**：在开发 B 端 SaaS 平台时，往往会遇到“不同租户（客户）要求不同的表单和列表”的定制化需求。如果不遵循设计原则，前端代码会充斥着 `if (tenant === 'A') else if (tenant === 'B')`，导致组件变得几千行且无法维护，牵一发而动全身。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **大泥球组件 (God Component)**：一个 `<UserList>` 包含了接口请求、分页逻辑、各客户定制的弹窗逻辑，甚至包含 `switch-case` 渲染不同的列。一旦某客户提个小需求修改，可能把核心逻辑搞崩。
  - **违反开闭原则 (OCP)**：每次加一个新客户或新功能，都要去修改原始的通用组件，极易引发回归 Bug。
* **预期目标**：
  - **职责单一 (SRP)**：UI 组件只管渲染，不管取数；容器组件（Container/Smart Component）管取数，不管渲染。
  - **依赖倒置 (DIP)**：组件不应依赖具体的 API 实现（`axios.get('/users')`），而应依赖抽象（例如通过 Props 或 React Hooks/Vue Composables 传入的接口方法）。
  - **扩展而非修改**：通过插槽（Slots / Render Props）、高阶组件（HOC）或组合式 API（Composition）实现定制逻辑，而非 `if-else`。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **单一职责原则 (Single Responsibility Principle)**：
  - 一个组件/函数只负责一件事。例如：`useFetchUsers` 负责请求；`<UserTable>` 负责画表格；`<UserPage>` 负责组合它俩。
* **开闭原则 (Open-Closed Principle)**：
  - 核心组件对扩展开放（提供插槽、暴露 Context），对修改关闭（不要在核心库里直接改代码）。
* **依赖倒置原则 (Dependency Inversion Principle)**：
  - 高层模块不应该依赖低层模块。比如，通用表格组件 `<Table>` 不能依赖 `import { fetchList } from 'api.js'`，而是应该接受一个 `fetchData` 的 Prop，把接口请求的控制权交还给调用方（控制反转 IoC）。

## 3. 开箱即用：核心代码骨架 (Implementation)

以 React 为例，演示一个重构掉大泥球的标准化业务组件设计。

### 3.1 违反 SRP 与 OCP 的大泥球 (反面教材)
```tsx
// 反面教材：所有东西揉在一起，且强耦合具体客户
function UserList() {
  const [users, setUsers] = useState([]);
  const [tenant, setTenant] = useState('A'); // 租户 A

  useEffect(() => {
    // 违背单一职责：请求写死在组件里
    axios.get(`/api/users?tenant=${tenant}`).then(res => setUsers(res.data));
  }, [tenant]);

  return (
    <table>
      {users.map(u => (
        <tr key={u.id}>
          <td>{u.name}</td>
          {/* 违背开闭原则：通过 if-else 写死了租户的特殊逻辑 */}
          {tenant === 'A' ? <td>{u.companyName}</td> : null}
          {tenant === 'B' ? <td>{u.nickname}</td> : null}
          <td>
            <button onClick={() => axios.post(`/delete/${u.id}`)}>删除</button>
          </td>
        </tr>
      ))}
    </table>
  );
}
```

### 3.2 遵循 SOLID 的重构方案

**1. 抽离纯渲染组件 (Dumb Component)**
只负责展示，不关心业务，高度可复用。
```tsx
// components/UserTable.tsx
type UserTableProps = {
  data: User[];
  columns: ColumnDef[];
  onDelete: (id: string) => void;
};

// 纯展示，完全依赖外部传入的 Props，不含任何副作用
export function UserTable({ data, columns, onDelete }: UserTableProps) {
  return (
    <table>
      <thead>
        <tr>{columns.map(c => <th key={c.key}>{c.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(c => (
              <td key={c.key}>{c.render ? c.render(row[c.key], row) : row[c.key]}</td>
            ))}
            <td><button onClick={() => onDelete(row.id)}>删除</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**2. 抽离业务逻辑 Hooks (SRP & 依赖倒置)**
将“请求数据”、“处理分页”抽离为一个 Hook，这样它可以在任何组件复用，并且极其方便做单元测试。
```tsx
// hooks/useUsers.ts
export function useUsers(fetchStrategy: () => Promise<User[]>) {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    // 依赖倒置：我不关心你怎么取数，我只调用你传给我的抽象方法
    const res = await fetchStrategy();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  return { data, loading, reload: loadData };
}
```

**3. 在容器层实现针对客户的扩展 (OCP 落地)**
现在，我们要为客户 B 定制一个专门的列表页，我们不需要修改 `<UserTable>`。
```tsx
// pages/CustomerB_UserPage.tsx
import { UserTable } from '@/components/UserTable';
import { useUsers } from '@/hooks/useUsers';
import { apiGetCustomerBUsers, apiDeleteUser } from '@/api/users';

export function CustomerBUserPage() {
  // 注入获取客户 B 数据的具体策略
  const { data, loading, reload } = useUsers(apiGetCustomerBUsers);

  const handleDelete = async (id: string) => {
    await apiDeleteUser(id);
    reload();
  };

  // 通过配置列（Columns）来扩展不同客户的展示逻辑，而不需要在组件内部写 if-else
  const columns = [
    { key: 'name', title: '姓名' },
    { key: 'nickname', title: '花名(客户B特有)' }, // 扩展字段
    {
      key: 'status',
      title: '状态',
      // 通过 render props 注入定制化 UI
      render: (val: number) => <span style={{ color: val === 1 ? 'green' : 'red' }}>{val === 1 ? '在职' : '离职'}</span>
    }
  ];

  if (loading) return <Spin />;

  return <UserTable data={data} columns={columns} onDelete={handleDelete} />;
}
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **过度设计的陷阱 (Over-engineering)**：不要教条地为了 SOLID 而 SOLID。如果一个项目只有几百行，纯内部使用且明确未来没有任何扩展需求，写个大泥球反而能提高初期交付速度（YAGNI 原则：You Aren't Gonna Need It）。只有在业务线膨胀、维护成本变高（闻到坏味道代码）时，才是重构的最佳时机。
* **里氏替换原则 (LSP) 的隐蔽性**：在前端，由于我们多采用组合（Composition）而非继承（Inheritance），LSP 原则通常体现为“任何接受 `Button` 属性的地方，都必须能无缝接受一个被包装过的 `PrimaryButton`”。如果你重写了基础组件的 props 导致签名变化（比如把 `onClick` 换成了 `onTap`），这就是违背了 LSP，会导致替换组件时发生崩溃。
