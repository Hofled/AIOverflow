import './Home.css';

import { Component } from 'react'
import Banner from '../Banner/Banner';

type Props = {}

type State = {}

export default class Home extends Component<Props, State> {
    state = {}

    render() {
        return (
            <div className="home">
                <Banner text='AIOverflow' />
                <p>Welcome to the AIOverflow forums!</p>
            </div>
        )
    }
}
