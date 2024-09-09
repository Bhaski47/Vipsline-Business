import PrimaryButton from "../../ui/PrimaryButton";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import {Pressable, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {useDispatch, useSelector} from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ClientCard from "../clientSegmentScreen/ClientCard";
import Entypo from '@expo/vector-icons/Entypo';
import {clearClientInfo, loadClientInfoFromDb} from "../../store/clientInfoSlice";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import React, {useState} from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import ClientInfoModal from "../clientSegmentScreen/ClientInfoModal";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AddClientButton = (props) => {
    const clientInfo = useSelector(state => state.clientInfo);
    const [isClientInfo, setIsClientInfo] = useState(false)
    const [isVisibileModal, setIsVisibleModal] = useState(false)
    const dispatch = useDispatch();
    return (
        <>
            {
                clientInfo.isClientSelected ?
                    <View style={{borderBottomWidth: 1, borderColor: Colors.highlight}}>
                        <ClientInfoModal
                            visible={isVisibileModal}
                            setVisible={setIsVisibleModal}
                            closeModal={() => {
                                setIsVisibleModal(false);
                            }}
                            phone={clientInfo.details.mobile_1}
                            name={clientInfo.details.firstName}
                            id={clientInfo.details.id}
                            onClose={() => setIsVisibleModal(false)}
                        />
                        <View style={styles.clientCardContainer}>
                            <ClientCard
                                phone={clientInfo.details.mobile_1}
                                name={clientInfo.details.firstName}
                                email={clientInfo.details.username}
                                onPress={() => {
                                    return null;
                                }}
                                rippleColor={Colors.transparent}
                                card={styles.clientCard}


                            />
                            <View style={styles.actionMenu}>
                                {clientInfo.details &&
                                clientInfo.details.wallet_balance !== 0 &&
                                clientInfo.membershipDetails.length !==0 &&
                                clientInfo.packageDetails.length !== 0 ? (
                                    isClientInfo ? (
                                        <Pressable style={[styles.activePlan,{flexDirection:'row',alignItems:"center",
                                            borderColor: Colors.transparent}]} onPress={() => {
                                            setIsVisibleModal(true);
                                        }}>
                                            <MaterialIcons name="sort" size={17} color={Colors.highlight} />
                                            <Text
                                                style={{color: Colors.highlight}}
                                            >
                                                client info
                                            </Text>
                                        </Pressable>
                                    ) : (
                                        <SimpleLineIcons
                                            name="options"
                                            size={24}
                                            color="black"
                                            onPress={() => setIsClientInfo(true)}
                                        />
                                    )
                                ) :
                                    <Pressable style={[styles.activePlan,{flexDirection:'row',alignItems:"center",
                                        borderColor: Colors.transparent}]} onPress={() => {
                                        setIsVisibleModal(true);
                                    }}>
                                        <MaterialIcons name="sort" size={17} color={Colors.highlight} />
                                        <Text
                                            style={{color: Colors.highlight}}
                                        >
                                            client info
                                        </Text>
                                    </Pressable>
                                }

                                <Ionicons name="close" size={24} color="black" onPress={() => dispatch(clearClientInfo())}/>


                            </View>
                        </View>
                        {isClientInfo ?
                            <View style={styles.clientDetailContainer}>
                                {
                                    clientInfo.details.wallet_balance !== 0 &&
                                    clientInfo.details.wallet_balance !== undefined &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}>
                                        <Text style={styles.activePlanText}>
                                            Bal <Text style={{color: Colors.highlight}}> -
                                            ₹{clientInfo.details.wallet_balance}</Text>
                                        </Text>
                                    </PrimaryButton>
                                }
                                {clientInfo.membershipDetails.length !== 0 &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}>
                                        <Feather name="user-check" size={17} color="black"/>
                                        <Text> Membership</Text>
                                    </PrimaryButton>}
                                {clientInfo.packageDetails.length !== 0 &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}>
                                        <MaterialCommunityIcons name="clipboard-list-outline" size={17} color="black"/>
                                        <Text style={styles.activePlanText}> Package</Text>
                                    </PrimaryButton>
                                }
                            </View>
                            : null
                        }
                    </View>
                    :
                    <PrimaryButton buttonStyle={styles.addClientButton} onPress={props.onPress}>
                        <View style={styles.addClientButtonInnerContainer}>
                            <FontAwesome name="plus-square-o" size={24} color={Colors.highlight}/>
                            <Text
                                style={[TextTheme.bodyLarge, styles.addClientButtonText]}>{
                                clientInfo.isClientSelected ?
                                clientInfo.details.name : "Add Client"}</Text>
                        </View>
                    </PrimaryButton>
            }
        </>
    )
};

const styles = StyleSheet.create({
    addClientButton: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.highlight,
        borderWidth: 1.5,
        marginVertical: 15,
        marginHorizontal: "auto",
        width: '85%',
    },
    addClientButtonInnerContainer: {
        gap: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
    },
    addClientButtonText: {
        color: Colors.highlight,
    },
    clientCardContainer: {
        flexDirection: "row",
    },
    clientCard: {
        flex: 0.60,
    },
    actionMenu: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flex: 0.40
    },
    clientDetailContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    activePlan: {
        borderColor: Colors.grey200,
        borderWidth: 1,
        marginTop: "-2%",
        marginBottom: "2%",
        alignSelf: "center",
        backgroundColor: Colors.background,
    },
    activePlanPressable: {
        backgroundColor: Colors.background,
        justifyContent: "flex-start",
        flexDirection: "row",
        // flex:1
    }
});

export default AddClientButton;