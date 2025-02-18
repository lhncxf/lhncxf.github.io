# React

## 一、React简介
React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它专注于视图层，能够高效地更新和渲染用户界面，特别适合构建单页面应用（SPA）。React 使用 JSX（JavaScript XML）语法扩展，使编写组件更加直观。

## 二、安装与环境搭建
- **使用 Create React App**：这是官方推荐的创建新 React 应用的方式。
    ```bash
    npx create-react-app my-app
    cd my-app
    npm start
    ```
- **手动配置**：对于有经验的开发者或者需要自定义配置的情况，可以考虑使用 Webpack 或 Parcel 等工具手动配置项目。

## 三、基础概念
1. **JSX**：一种 JavaScript 的语法扩展，允许你在 JavaScript 中书写类似 HTML 的结构。
2. **组件**：React 应用的基本构建块。分为函数组件和类组件两种形式。
3. **Props**：父组件向子组件传递数据的方式。
4. **State**：每个组件内部维护的状态，当状态发生变化时会触发重新渲染。

## 四、快速开始
创建一个简单的组件：
```jsx
import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;
```
在主应用中使用该组件：
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './Welcome';

ReactDOM.render(<Welcome name="Sara" />, document.getElementById('root'));
```

## 五、生命周期方法（仅适用于类组件）
- **挂载阶段**：`constructor()`, `componentDidMount()`
- **更新阶段**：`shouldComponentUpdate()`, `componentDidUpdate()`
- **卸载阶段**：`componentWillUnmount()`

## 六、Hooks
Hooks 是 React 16.8 引入的新特性，允许你在不编写类的情况下使用 state 和其他 React 特性。
- **useState**：声明状态变量。
    ```jsx
    const [count, setCount] = useState(0);
    ```
- **useEffect**：执行副作用操作，如数据获取、订阅或手动 DOM 操作。
    ```jsx
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });
    ```

## 七、路由管理
使用 React Router 来处理前端路由。
- 安装依赖：
    ```bash
    npm install react-router-dom
    ```
- 基本使用：
    ```jsx
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
    import Home from './Home';
    import About from './About';

    function App() {
      return (
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </Router>
      );
    }
    ```

## 八、状态管理
随着应用规模的增长，单一组件内的状态管理可能变得复杂。此时可以引入 Redux 或 MobX 这样的状态管理库。
- **Redux**：通过集中式的 store 来管理所有组件的状态。
    - 创建 Store
    - Reducers 处理动作并返回新的状态
    - 使用 Provider 将 store 提供给 React 组件树
- **MobX**：基于响应式编程思想的状态管理模式，更轻量级且易于上手。

## 九、表单处理
- **受控组件**：输入框的值由 React 控制。
    ```jsx
    class NameForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) { this.setState({value: event.target.value}); }
      handleSubmit(event) { alert('A name was submitted: ' + this.state.value); }

      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
      }
    }
    ```
- **非受控组件**：直接操作 DOM 获取表单值。

## 十、性能优化
- **shouldComponentUpdate**：决定是否需要重新渲染组件。
- **React.memo**：为函数组件提供类似的机制。
- **虚拟列表**：处理大量数据时避免性能瓶颈。

## 十一、测试
- **单元测试**：Jest 和 Enzyme 是常用的测试框架。
    ```jsx
    import React from 'react';
    import { shallow } from 'enzyme';
    import App from './App';

    it('renders without crashing', () => {
      shallow(<App />);
    });
    ```

## 十二、部署
- **生产构建**：使用 `npm run build` 创建优化后的生产版本。
- **托管服务**：可以选择 Netlify、Vercel 或 GitHub Pages 等平台进行部署。

## 结语
React 提供了一个灵活而强大的方式来构建动态用户界面。无论是初学者还是有经验的开发者，深入理解和掌握 React 都将极大地提升你的开发效率和产品质量。希望这篇笔记能为你提供一个全面的学习路径，助你在 React 的世界里不断探索和成长。记住，实践是掌握任何技术的关键，尝试将所学知识应用于实际项目中吧！
