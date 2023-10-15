import "./Banner.css";
import { Component } from 'react';

type Props = {
    text: string,
    media?: string,
    backgroundColor?: string,
}

type State = {}

export default class Banner extends Component<Props, State> {
    state = {}

    getBackground = (): string => this.props.media ? `url(${this.props.media}) no-repeat center center/cover` : this.props.backgroundColor || "#e0e0e0";

    render() {
        return (
            <div className="banner-container mb-4" style={
                { background: this.getBackground() }
            }>
                {this.props.text}
            </div>
        )
    }
}