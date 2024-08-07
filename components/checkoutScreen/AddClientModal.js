import React, { useCallback } from "react";
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import SearchBar from "../../ui/SearchBar";
import Feather from '@expo/vector-icons/Feather';
import { useSelector, useDispatch } from "react-redux";
import ClientCard from "../clientSegmentScreen/ClientCard";
import { loadClientsFromDb } from "../../store/clientSlice";

const AddClientModal = (props) => {
    const isFetching = useSelector(state => state.client.isFetching);
    const clientsList = useSelector(state => state.client.clients);
    const dispatch = useDispatch();

    const loadMoreClients = useCallback(() => {
        if (!isFetching) {
            dispatch(loadClientsFromDb());
        }
    }, [dispatch, isFetching]);

    return (
        <Modal visible={props.isVisible} animationType={"slide"}>
            <View style={styles.closeAndHeadingContainer}>
                <Text style={[textTheme.titleLarge, styles.selectClientText]}>Select Client</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <Divider/>
            <View style={styles.modalContent}>
                <SearchBar placeholder={"Search by email or mobile"} searchContainerStyle={styles.searchContainerStyle}/>
                <Divider/>
                <PrimaryButton buttonStyle={styles.createClientButton} pressableStyle={styles.createClientPressable}>
                    <Feather name="plus" size={24} color={Colors.highlight}/>
                    <Text style={[textTheme.titleMedium, styles.createClientText]}>Create new client</Text>
                </PrimaryButton>
                <Divider/>
                <FlatList
                    data={clientsList}
                    onEndReachedThreshold={0.7}
                    onEndReached={loadMoreClients}
                    renderItem={({item}) => <ClientCard name={item.name} phone={item.mobile_1} email={item.username}/>}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    selectClientText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    modalContent: {
        flex: 1,
    },
    searchContainerStyle: {
        marginVertical: 15,
        marginHorizontal: 15,
    },
    createClientButton: {
        backgroundColor: Colors.background,
    },
    createClientPressable: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 15,
    },
    createClientText: {
        color: Colors.highlight,
    }
});

export default AddClientModal;
