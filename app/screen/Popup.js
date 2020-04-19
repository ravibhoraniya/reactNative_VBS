import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, PermissionsAndroid, RefreshControl, FlatList, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { Container, Header, Title, Content, ListItem, List, Button, Left, Right, Body, Icon, Text, Form, Thumbnail, Item, Input, Picker } from 'native-base';
import { Actions } from 'react-native-router-flux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

import { webRequest, webRequestWithToken, multipartRequest } from '../Constants/WebRequester';
import { base_url } from '../Constants/Constants';

import Navbar from '../componet/Header';
import styles from '../Style';

const { width, height } = Dimensions.get('window');

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location_lat: null,
            location_long: null,
            routeList: null,
            refreshing: false,
            loadin: true,
            search: '',
            select_region: 0,
            all_region: null,
        };
    }

    componentDidMount() {
        //this._getRegionlist();
        this.getRouteListLatest();
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
                {/* <Header searchBar rounded hasSegment>
                    <Item style={{ width: width }}>
                        <Picker
                            note
                            mode="dropdown"
                            style={{ width: 120 }}
                            selectedValue={this.state.select_region}
                            onValueChange={(data) => { this.setState({ select_region: data }, () => { this.getRouteListLatest() }) }}
                        >
                            <Picker.Item label="Current Location" value="0" />
                            {
                                this.state.all_region ?
                                    this.state.all_region.map((data) =>
                                        <Picker.Item label={data.name} value={data.id} />
                                    )
                                    :
                                    null
                            }
                        </Picker>
                    </Item>
                    <Item> 
                        <Input placeholder="Search"
                            onChangeText={(text) => {
                                this.setState({
                                    search: text
                                })
                            }}
                        />
                        <Button transparent onPress={() => this._search()}><Icon name="ios-search" /></Button>
                    </Item>
                </Header>  */}
                <View style={styles.home_container}>

                    {
                        this.state.loadin === true ?
                            <View style={{ width: width, height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                <ActivityIndicator size="large" color="#000" />
                                <Text style={{ fontSize: 16, color: '#000', marginTop: 10 }}>Loading</Text>
                            </View>
                            :
                            <FlatList
                                numColumns={1}
                                data={this.state.routeList}
                                renderItem={({ item, index }) => this.getRouteListView(item, index)}
                                style={{ width: '100%' }}
                                ListEmptyComponent={this.listempty()}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                            />
                    }

                </View>
            </Container>
        );
    }


    getRouteListLatest() {
        //var params = 'location_lat=' + this.state.location_lat + '&location_long=' + this.state.location_long + '&search=' + this.state.search + '&region=' + this.state.select_region; 
        var params = '';
        let url = base_url + "user/get/near/route/list";
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1') {
                    if (result.data) {
                        console.log(result.data);
                        this.setState({
                            routeList: result.data,
                            loadin: false,
                        });
                    } else {
                        this.setState({
                            loadin: false,
                        });
                    }

                }
            }
            else {
                Alert.alert('', err.message);
            }
        });
    }

    _getRegionlist() {
        var params = '';
        let url = base_url + "user/get/all/region";
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1') {
                    if (result.data) {
                        this.setState({
                            all_region: result.data,
                        });
                    }
                }
            }
        });
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.getRouteListLatest();
        this.setState({ refreshing: false })
    }

    _search() {
        this.setState({ loadin: true });
        this.getRouteListLatest();
    }

    getRouteListView(index, num) {
        return (
            <ListItem thumbnail
                onPress={() => Actions.detail({ id: index.id })}
                style={{ borderColor: "596bd7" }}
            >
                <Left>
                    <Thumbnail square source={require('../image/pinnew.png')} />
                </Left>
                <Body>
                    <Text>{index.name}</Text>
                    <Text note numberOfLines={1}>
                        <Text style={{ fontWeight: '900' }}>Region :</Text> {index.regname}
                    </Text>
                    <Text note numberOfLines={2}>
                        <Text style={{ fontWeight: '900' }}>Stops :</Text> {index.stop_count}
                    </Text>
                </Body>
                <Right>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        );
    }

    listempty() {
        return (
            <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center' }}>
                <Text style={{ width: '100%', textAlign: 'center' }}>Your location on route not found.</Text>
            </View>
        );
    }

}