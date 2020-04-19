import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    /*
    * sidebar 
    */
    sidecontainer: {
        flex: 1,
        backgroundColor: '#fdfdfd'
    },
    side_profile: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#fff",
        flex: 1,
    },
    side_profileData: {
        top: -50,
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    side_profileBg: {
        height: 80,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1c2e4a'
    },
    side_limenu: {
    },
    side_username: {
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#1c2e4a',
        marginTop: 10,
    },

    /*
     * Login 
     */
    login_container: {
        backgroundColor: '#1c2e4a',
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        padding: 10,
    },
    login_box: {
        backgroundColor: '#f7fafc',
        width: '100%',
        borderRadius: 5,
        padding: 20,
        paddingTop: 30,
        paddingBottom: 30,
    },
    login_title: {
        textAlign: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
        color: '#1c2e4a',
    },
    login_btn: {
        backgroundColor: '#1c2e4a',
        width: 80,
        marginTop: 30,
        borderRadius: 5,
    },

    /**
     * profile
     */

    profile_row: {
        padding: 10,
        paddingTop: 0,
        paddingBottom: 5,
    },
    profile_col: {
        padding: 5,
    },
    profile_label: {
        fontSize: 12,
        textTransform: 'uppercase',
        color: '#1c2e4a',
        marginBottom: 10,
    },
    profile_input: {
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 0,
        fontSize: 12,
    },
    profile_btn: {
        backgroundColor: '#1c2e4a',
        width: 120,
        marginTop: 30,
        borderRadius: 5,
    },

    /*
    * Home Page
    */
    home_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        padding: 10,
    },
    slidecontainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    panel: {
        flex: 1,
        position: 'relative',
    },
    panelHeader: {
        height: 60,
        backgroundColor: '#1c2e4a',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeaderTitle: {
        color: '#FFF',
        fontSize: 18,
        textTransform: 'uppercase',
        position: 'relative',
    },
    panelHeaderButton: {
        position: 'absolute',
        top: -40,
        left: width - 100,
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: '#5E72E4',
        textAlign: 'center',
        padding: 0,
        borderWidth: 5,
        borderColor: '#fff',
    },
    panelBody: {
        backgroundColor: '#f5f5f5',
        paddingBottom: 30,
        height: height / 2,
    },
    boxtop1: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingTop: 20,
    },
    boxtop1Title: {
        color: '#1c2e4a',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    boxtop1p: {
        color: '#757575',
    },
    boxbusTitle: {
        backgroundColor: '#1c2e4a',
        padding: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#fff',
        margin: 10,
        marginTop: 20,
    }



});

export default styles