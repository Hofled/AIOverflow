import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavMenu />
            <Container fluid style={{padding: 0}}>
                {children}
            </Container>
        </div>
    )
}

export default Layout;