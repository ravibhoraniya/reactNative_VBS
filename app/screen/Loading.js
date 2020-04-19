import React, { Component } from 'react';
import { View, Image, PermissionsAndroid, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';

import { webRequest, webRequestWithToken, multipartRequest } from '../Constants/WebRequester';
import { base_url } from '../Constants/Constants';

export default class AnatomyExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location_lat: null,
            location_long: null,
        };
    }

    componentDidMount() {
        this._getDeviceInfo();
        setTimeout(() => {
            Actions.home();
        }, 1500);
    }

    render() {
        return (
            <ImageBackground
                resizeMode='cover'
                source={require('../image/busbk-1.jpeg')} style={{ width: '100%', height: '100%', flex: 1 }}>
                <View style={styles.container}>
                    <Image source={require('../image/logo.png')}
                        style={{ width: '100%', height: 60, resizeMode: 'contain', justifyContent: "space-around" }}
                        resizeMethod="resize"
                    >
                    </Image>
                </View>
            </ImageBackground >
        );
    }

    _getDeviceInfo() {
        const device_id = DeviceInfo.getUniqueId();
        const device_type = DeviceInfo.getDeviceName();

        var params = 'device_id=' + device_id + '&device_type=' + JSON.stringify(device_type);
        let url = base_url + "user/get/device/info";
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1') {
                    console.log(result);
                }
            }
        });
    }

}



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        height: '100%',
    },
});