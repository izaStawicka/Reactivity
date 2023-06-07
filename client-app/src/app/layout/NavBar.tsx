import React from 'react';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';


export default observer(function NavBar()
{
    const {userStore: {user, logout}} = useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header as = {NavLink} to = '/'>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities'/>
                <Menu.Item name='Errors' as={NavLink} to='/errors'/>
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity'/>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right'/>
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item text='My Profile' as={Link} to={`/profiles/${user?.userName}`} icon='user'/>
                            <Dropdown.Item text='Logout' icon='power' onClick={logout}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})