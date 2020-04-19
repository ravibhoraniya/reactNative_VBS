/**
* This is the Main file
* This file contains the routes of all the pages
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { Root } from 'native-base';
import { Scene, Router, Actions } from 'react-native-router-flux';


// Our custom files and classes import
import Loding from './screen/Loading';
import Home from './screen/Home';
import Detail from './screen/Detail';
import Popup from './screen/Popup';



export default class Main extends Component {

    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', () => Actions.pop());
    };

    render() {
        console.disableYellowBox = true;
        return (
            <Root>
                <Router>
                    <Scene key="root">
                        <Scene initial key="loding" component={Loding} hideNavBar />
                        <Scene key="home" component={Home} hideNavBar type='reset' />
                        <Scene key="detail" component={Detail} hideNavBar />
                        <Scene key="popup" component={Popup} hideNavBar />
                    </Scene>
                </Router>
            </Root>
        );
    }

}
