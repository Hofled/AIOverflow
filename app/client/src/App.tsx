import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import './custom.css';

import { Component } from 'react'

type Props = {}

type State = {}

export default class App extends Component<Props, State> {
  state = {}

  render() {
    return (
      <Layout>
        <Outlet />
      </Layout>
    )
  }
}
