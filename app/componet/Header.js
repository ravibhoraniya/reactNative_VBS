/**
* This is the navbar component
* example of usage:
*   var left = (<Left><Button transparent><Icon name='menu' /></Button></Left>);
*   var right = (<Right><Button transparent><Icon name='menu' /></Button></Right>);
*   <Navbar left={left} right={right} title="My Navbar" />
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image } from 'react-native';
import { Header, Body, Title, Left, Right, Icon } from 'native-base';

// Our custom files and classes import 

export default class Navbar extends Component {
    render() {
        return (
            <Header noShadow={true} style={styles.header}>
                {this.props.left ? this.props.left : <Left style={{ flex: 1 }} />}
                <Body style={styles.body}>
                    <Image
                        source={require('../image/logo.png')}
                        style={{ width: '100%', height: 38, resizeMode: 'contain', justifyContent: "space-around" }}
                        resizeMethod="resize"
                    />
                </Body>
                {this.props.right ? this.props.right : <Right style={{ flex: 1 }} />}
            </Header>
        );
    }
}

const styles = {
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: '#5a6cd7',
    }
};
