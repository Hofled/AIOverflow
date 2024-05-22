import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Media } from 'reactstrap';
import authService from '../../services/auth/service';
import './Avatar.css';
import { Link } from 'react-router-dom';
import { RootState } from '../../state/reducers';
import { connect } from 'react-redux';

interface AvatarState {
    dropdownOpened: boolean
}

interface AvatarProps {
    username?: string;
    size: 'sm' | 'md' | 'lg'; // Optional size prop for small, medium, or large avatars
}

const mapStateToProps = (state: RootState) => ({
    username: state.identity.username,
});

class Avatar extends Component<AvatarProps, AvatarState> {
    constructor(props: AvatarProps) {
        super(props);

        this.state = {
            dropdownOpened: false
        }
    }

    // Function to extract the initial from the username
    getInitial = (username?: string) => {
        if (!username) return '';

        const words = username.split(' ');
        return words.length === 1
            ? username.charAt(0).toUpperCase()
            : words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    };

    handleLogout = () => {
        authService.logout();
    }

    toggleDropdown = () => {
        this.setState({ dropdownOpened: !this.state.dropdownOpened });
    }

    render() {
        return (
            <Dropdown isOpen={this.state.dropdownOpened} toggle={this.toggleDropdown}>
                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpened}>
                    <Media className={`avatar-circle avatar-${this.props.size}`}>
                        <div className={`avatar-circle-inner bg-primary text-light font-weight-bold`}>
                            <span>{this.getInitial(this.props.username)}</span>
                        </div>
                    </Media>
                </DropdownToggle>
                <DropdownMenu end>
                    <DropdownItem header>{this.props.username}</DropdownItem>
                    {/* <Link to="/profile">
                        <DropdownItem>Profile</DropdownItem>
                    </Link> */}
                    <DropdownItem divider />
                    <DropdownItem onClick={this.handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
};

export default connect(mapStateToProps)(Avatar);