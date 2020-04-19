import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, PermissionsAndroid, ActivityIndicator, FlatList, Alert, ScrollView, ImageBackground } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Form, Grid, Col, Thumbnail, ListItem } from 'native-base';
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Actions } from 'react-native-router-flux';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { webRequest, webRequestWithToken, multipartRequest } from '../Constants/WebRequester';
import { base_url } from '../Constants/Constants';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

import Navbar from '../componet/Header';
import styles from '../Style';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyC2flyC7kN0qrpnrNrNykD9Dq9GPsaQF3g';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.2000;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: null,
            destination: null,
            waypoint: [],
            LATITUDE: 0,
            LONGITUDE: 0,
            mapRender: true,
            routeTitle: '',
            stopList: [],
            regionName: '',
            allowDragging: true,
            location_lat: null,
            location_long: null,
            fRoute_id: 0,
            curent_bus_let: 0,
            curent_bus_long: 0,
            mapNotfound: false,
        };
        this._gotoLocation = this._gotoLocation.bind(this);
    }

    componentDidMount() {
        this.turnonLocationAndUpdateLatlng();
        this._getRouteDetail();
        this.interval = setInterval(() => this._getBusDetail(), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    requestLocationPermission() {
        try {
            PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
            ).then((result) => {
                if (result['android.permission.ACCESS_COARSE_LOCATION']
                    && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
                    this.turnonLocationAndUpdateLatlng()
                }
            });
        } catch (err) {

        }
    }

    turnonLocationAndUpdateLatlng() {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 }).then(data => {
            NetInfo.fetch().then((connectionInfo) => {
                console.log('connectionInfo');
                if (connectionInfo.type === 'wifi') {
                    Geolocation.getCurrentPosition(
                        position => {
                            let latitude = position.coords.latitude
                            let longitude = position.coords.longitude
                            this.setState({
                                LATITUDE: latitude,
                                LONGITUDE: longitude,
                            });
                        },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng()
                        },
                        { enableHighAccuracy: false, timeout: 2000, maximumAge: 0 },
                    );
                    this.watchID = Geolocation.watchPosition(position => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude
                        this.setState({
                            LATITUDE: latitude,
                            LONGITUDE: longitude,
                        });
                    },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng();
                        },
                        { enableHighAccuracy: false, timeout: 20000, maximumAge: 0, distanceFilter: 0.0001 },
                    );
                } else {
                    Geolocation.getCurrentPosition(
                        position => {
                            let latitude = position.coords.latitude
                            let longitude = position.coords.longitude
                            this.setState({
                                LATITUDE: latitude,
                                LONGITUDE: longitude,
                            });
                        },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng();
                        },
                        { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 },
                    );
                    this.watchID = Geolocation.watchPosition(position => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude
                        this.setState({
                            LATITUDE: latitude,
                            LONGITUDE: longitude,
                        });
                    },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng();
                        },
                        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 0.0001 },
                    );
                }
            });
        }).catch(err => {
            this.turnonLocationAndUpdateLatlng();
        })
    }



    render() {
        var left = (
            <Left style={{ flex: 1 }}>
                <Icon name="arrowleft" type="AntDesign" style={{ color: '#fff' }}
                    onPress={() => { Actions.pop() }}
                />
            </Left >
        );
        var right = (
            <Right style={{ flex: 1 }}>
            </Right>
        );
        return (
            <Container>
                <Navbar left={left} right={right} title="VBS" />

                {
                    this.state.mapRender === true ?
                        <ImageBackground
                            resizeMode='cover'
                            source={require('../image/busbk-2.jpeg')} style={{ width: width, height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={{ fontSize: 16, color: '#fff', marginTop: 10 }}>Loading</Text>
                        </ImageBackground>
                        :
                        <View style={{ flex: 1 }}>
                            <Button rounded style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }} onPress={() => { this._mylocation() }}>
                                <Icon name="md-locate" type="Ionicons" style={{ color: '#fff' }}></Icon>
                            </Button>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                ref={el => { this.map = el; }}
                                initialRegion={{
                                    latitude: this.state.location_lat,
                                    longitude: this.state.location_long,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA
                                }}
                                showsUserLocation={true}
                                followsUserLocation={true}
                                showsPointsOfInterest={true}
                                userLocationUpdateInterval={100}
                                showsCompass={false}
                                style={{ height: '100%' }}
                            >
                                {this.state.stopList.map(marker => (
                                    <Marker
                                        coordinate={{ latitude: parseFloat(marker.rlat), longitude: parseFloat(marker.rlong) }}
                                        title={marker.name}
                                        image={require('../image/pin.png')}
                                    />
                                ))}
                                <Marker
                                    coordinate={this.state.origin}
                                    title="Start"
                                    image={require('../image/pin.png')}
                                />
                                {this.state.curent_bus_let && this.state.curent_bus_long ?
                                    <Marker.Animated
                                        ref={marker => {
                                            this.marker = marker;
                                        }}
                                        coordinate={{ latitude: this.state.curent_bus_let, longitude: this.state.curent_bus_long }}
                                        title="Bus"
                                        image={require('../image/transport.png')}
                                    />
                                    :
                                    null
                                }
                                <Marker
                                    coordinate={this.state.destination}
                                    title="Stop"
                                    image={require('../image/pin.png')}
                                />
                                <MapViewDirections
                                    origin={this.state.origin}
                                    destination={this.state.destination}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={4}
                                    strokeColor="#1c2e4a"
                                    waypoints={this.state.waypoint}
                                    precision="high"
                                    mode="DRIVING"
                                />
                            </MapView>
                        </View>

                }
                {
                    this.state.mapRender === true ? null :
                        <SlidingUpPanel
                            ref={c => (this._panel = c)}
                            draggableRange={{ top: height / 1.75, bottom: 60 }}
                            showBackdrop={false}
                            style={styles.slideBox}
                        >
                            {(dragHandler) => (
                                <View style={styles.panel}>
                                    <View style={styles.panelHeader} {...dragHandler}>
                                        <Text style={styles.panelHeaderTitle}> {this.state.routeTitle} Route Detail</Text>
                                        <Button transparent style={styles.panelHeaderButton}>
                                            <Icon name="directions" type="FontAwesome5" style={{ color: '#fff', fontSize: 19 }} />
                                        </Button>
                                    </View>

                                    <View style={styles.panelBody}>
                                        <ScrollView style={{ height: 60 }}>
                                            <View style={styles.boxtop1}>
                                                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', }}>
                                                    <Thumbnail square small source={require('../image/map.png')} />
                                                    <Text style={styles.boxtop1Title}>Region</Text>
                                                    <Text style={styles.boxtop1p}>{this.state.regionName}</Text>
                                                </View>
                                                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', }}>
                                                    <Thumbnail square small source={require('../image/bench.png')} />
                                                    <Text style={styles.boxtop1Title}>Bus Stops</Text>
                                                    <Text style={styles.boxtop1p}>{this.state.stopList.length}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.boxbusTitle}>Bus stop list</Text>
                                            <FlatList
                                                numColumns={1}
                                                data={this.state.stopList}
                                                renderItem={({ item, index }) => this.getRouteListView(item, index)}
                                                style={{ width: '100%' }}
                                            />
                                        </ScrollView>
                                    </View>

                                </View>
                            )}
                        </SlidingUpPanel>
                }

                {
                    this.state.mapNotfound === true ?
                        <View style={{ flex: 1, marginTop: -40 }}>
                            <MapView initialRegion={{
                                latitude: this.state.LATITUDE,
                                longitude: this.state.LONGITUDE,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }} style={{ height: '100%' }}>

                                {this.state.LATITUDE && this.state.LONGITUDE ?
                                    <Marker
                                        coordinate={{ latitude: this.state.LATITUDE, longitude: this.state.LONGITUDE }}
                                        title="Me"
                                        image={require('../image/map-location.png')}
                                    />
                                    :
                                    null
                                }
                            </MapView>
                        </View>
                        :
                        null
                }

            </Container>
        );
    }


    _getRouteDetail() {
        var params = '';
        let url = base_url + "user/get/route/detail/" + this.props.id;
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1' && result.data != '0') {
                    console.log('calll');
                    this.setState({
                        origin: { latitude: parseFloat(result.data.routeDetail.start_lat), longitude: parseFloat(result.data.routeDetail.start_long) },
                        destination: { latitude: parseFloat(result.data.routeDetail.end_lat), longitude: parseFloat(result.data.routeDetail.end_long) },
                        waypoint: JSON.parse(result.data.routeDetail.waypoint),
                        //location_lat: parseFloat(result.data.regionDetail.start_lat),
                        //location_long: parseFloat(result.data.regionDetail.start_long),
                        location_lat: parseFloat(result.data.routeDetail.start_lat),
                        location_long: parseFloat(result.data.routeDetail.start_long),
                        routeTitle: result.data.routeDetail.name,
                        regionName: result.data.regionDetail.name,
                        stopList: result.data.stopDetail,
                        //curent_bus_let: parseFloat(result.data.routeDetail.start_lat),
                        //curent_bus_long: parseFloat(result.data.routeDetail.start_long),
                        mapRender: false,
                    });
                    this._getBusDetail();
                } else {
                    Alert.alert('HII.', 'Your location in not found any route.');
                }
            }
            else {
                Alert.alert('', err.message);
            }
        });
    }


    _mylocation() {
        var oringii = { latitude: this.state.LATITUDE, longitude: this.state.LONGITUDE };
        this.map.animateCamera({ center: oringii, zoom: 12 });
    }

    _getBusDetail() {
        var params = '';
        let url = base_url + "user/get/curent/bus/" + this.props.id;
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1' && result.data != '0' && result.data.status != 'stop') {
                    this.setState({
                        curent_bus_let: parseFloat(result.data.cr_lat),
                        curent_bus_long: parseFloat(result.data.cr_long),
                    });
                }
            }
        });
    }


    getRouteListView(index, num) {
        return (
            <ListItem thumbnail
                onPress={() => this._gotoLocation(parseFloat(index.rlat), parseFloat(index.rlong))}
            >
                <Left>
                    <Thumbnail small square source={require('../image/pin.png')} />
                </Left>
                <Body>
                    <Text>{index.name}</Text>
                </Body>
            </ListItem>
        );
    }

    _gotoLocation(varlet, varlong) {
        var oringii = { latitude: varlet, longitude: varlong };
        this.map.animateCamera({ center: oringii, zoom: 18 });
    }

}