import React from "react";
import { ScrollView, LayoutAnimation, UIManager, Linking, Image, Alert, AsyncStorage, ImageBackground } from 'react-native';
import { View, List, Text, ListItem, Body, Left, Right, Icon, Item, Input, Button, Grid, Col, Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';

import styles from '../Style';


export default class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.sidecontainer}>
                <Container>
                    <Content>
                        <View style={styles.side_profileBg}></View>
                        <View style={styles.side_profileData}>
                            <Image
                                source={{
                                    uri: "https://reactnativecode.com/wp-content/uploads/2018/01/2_img.png"
                                }}
                                style={styles.side_profile}
                            />
                            <Text style={styles.side_username}>Name Surname</Text>
                        </View>
                        <ListItem icon onPress={() => { Actions.myroute() }}>
                            <Left>
                                <Button style={{ backgroundColor: "#1c2e4a" }}>
                                    <Icon active name="bus" type="FontAwesome5" style={{ size: 12 }} />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Myroute</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { Actions.profile() }}>
                            <Left>
                                <Button style={{ backgroundColor: "#1c2e4a" }}>
                                    <Icon active name="user" type="FontAwesome5" style={{ size: 12 }} />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Profile</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { Actions.password() }}>
                            <Left>
                                <Button style={{ backgroundColor: "#1c2e4a" }}>
                                    <Icon active name="user-lock" type="FontAwesome5" style={{ size: 12 }} />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Change Password</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                        {/* <ListItem icon onPress={() => { Actions.contact() }}>
                            <Left>
                                <Button style={{ backgroundColor: "#1c2e4a" }}>
                                    <Icon active name="contacts" type="MaterialCommunityIcons" style={{ size: 12 }} />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Contact Us</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem> */}
                        <ListItem icon onPress={() => { Actions.login() }}>
                            <Left>
                                <Button style={{ backgroundColor: "#1c2e4a" }}>
                                    <Icon active name="log-out" type="Entypo" style={{ size: 12 }} />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Logout</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </Content>
                </Container>
            </ScrollView >
        );
    }
}

