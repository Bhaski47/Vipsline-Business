import {Modal, View, StyleSheet, Text, FlatList, Platform, BackHandler} from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import Divider from "../../ui/Divider";
import PrimaryButton from "../../ui/PrimaryButton";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

const MemberShipDetailModal = React.memo((props) => {
    const insets = useSafeAreaInsets();
    const [isModalVisible, setIsModalVisible] = useState(props.isMembershipModalVisible);
    const dispatch = useDispatch();
    useEffect(() => {
        setIsModalVisible(props.isMembershipModalVisible);
    }, [props.isMembershipModalVisible]);

    useEffect(() => {
        if (isModalVisible && props.membershipDetails.length === 1) {
            console.log("length: 1");
            
            props.onApplyMembership( props.membershipDetails[0].id,props.membershipDetails[0].client_id);
        }
    }, [props.membershipDetails, isModalVisible]);

    useEffect(() => {
        const backAction = () => {
            if (isModalVisible) {
                setIsModalVisible(false);
                props.closeModal();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [isModalVisible]);

    return (
        <Modal visible={isModalVisible} animationType="slide" onRequestClose={props.closeModal}>
            <View style={[styles.modalContainer]}>
                <View style={[
                    styles.modalContainer,
                    {
                        paddingTop: Platform.OS === 'ios' ? insets.top : 0,
                        paddingBottom: insets.bottom, // Apply bottom padding on both platforms
                    },
                ]}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.header, TextTheme.bodyLarge]}>Available Membership</Text>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{position: "absolute", right: 10}}
                            onPress={() => {
                                setIsModalVisible(false);
                                props.closeModal();
                            }}
                        />
                    </View>
                    <Divider/>
                    <FlatList
                        data={props.membershipDetails}
                        renderItem={({item}) => {

                            return <View style={styles.membershipDetails} key={item.membership_id}>
                                <View style={styles.membershipNameAndButton}>
                                    <Text style={TextTheme.titleSmall}>{item.membership_name}</Text>
                                    <Text>This Membership will expire on
                                        <Text style={{color: Colors.error}}> {item.validTill}</Text>
                                    </Text>
                                </View>
                                <PrimaryButton
                                    pressableStyle={{flex: 1}}
                                    buttonStyle={props.storedMembershipId === item.id ? styles.selectedMembership : styles.primaryButtonStyle}
                                    onPress={() => {
                                        props.onApplyMembership(item.id, item.client_id);
                                        setIsModalVisible(false);
                                        props.closeModal();
                                    }}
                                >
                                    <Text
                                        style={[
                                            props.storedMembershipId === item.id
                                                ? {color: Colors.white}
                                                : {color: Colors.black},
                                            {alignItems: "center", alignContent: "center", alignSelf: "center"}
                                        ]}
                                    >
                                        {props.storedMembershipId === item.id ? "Applied" : "Apply"}
                                    </Text>
                                </PrimaryButton>
                            </View>
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 10,
    },
    membershipDetails: {
        flexDirection: "row",
        paddingVertical: 20,
        borderBottomWidth: 1,
        paddingHorizontal: 15
    },
    membershipNameAndButton: {
        flex: 1,
        marginRight: 10,
    },
    primaryButtonStyle: {
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.ripple,
        width: "35%",
    },
    selectedMembership: {
        backgroundColor: Colors.green,
        borderWidth: 1,
        borderColor: Colors.ripple,
        width: "35%",
    }
});

export default MemberShipDetailModal;
