import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View
} from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Divider from "../../ui/Divider";
import { checkNullUndefined, formatDate } from "../../util/Helpers";
import RNDateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addItemToCart, addItemToEditedMembership } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomTextInput from "../../ui/CustomTextInput";

const EditMembershipModal = (props) => {
    const dispatch = useDispatch();
    const editedMembership = useSelector(state => state.cart.editedMembership);
    const [date, setDate] = useState(new Date(Date.now()).setHours(0, 0, 0, 0));
    const [validFromDate, setValidFromDate] = useState(date);
    const [validUntilDate, setValidUntilDate] = useState(date + (props.data.duration * 24 * 60 * 60 * 1000));
    const [membershipPrice, setMembershipPrice] = useState(props.data.price);
    const [membershipId, setMembershipId] = useState(props.data.id);

    const handleSave = () => {
        if (editedMembership.some(ele => ele.id === props.data.id)) {
            ToastAndroid.show("Item already in the cart", ToastAndroid.LONG);
            return;
        }

        // if (new Date(validFromDate).getTime() !== new Date(date).getTime() ||
        //     new Date(validUntilDate).getTime() !== new Date(date + (props.data.duration * 24 * 60 * 60 * 1000)).getTime() ||
        //     membershipPrice !== props.data.price ||
        //     membershipId !== props.data.id) {
        //             //     dispatch(addItemToCart({membership_id: props.data.id, membership_number: ""}));
        //     dispatch(addItemToEditedMembership({
        //         ...props.data,
        //         price: membershipPrice,
        //         total_price: membershipPrice,
        //         amount: membershipPrice,
        //         resource_id:null,
        //         "id": membershipId,
        //         "valid_from": formatDate(validFromDate, "yyyy-d-m"),
        //         "valid_until": formatDate(validUntilDate, "yyyy-d-m"),
        //     }));
        //     props.onCloseModal();
        //     props.closeOverallModal()
        //     return;
        // }
        dispatch(addItemToEditedMembership({
            ...props.data,
            price: membershipPrice,
            total_price: membershipPrice,
            amount: membershipPrice,
            resource_id: null,
            item_id: checkNullUndefined(props.data.item_id) ? Math.floor(Math.random() * 90000) + 10000 : props.data.item_id,
            "id": membershipId,
            "valid_from": formatDate(validFromDate, "yyyy-mm-dd"),
            "valid_until": formatDate(validUntilDate, "yyyy-mm-dd"),
        }));
        dispatch(addItemToCart({ membership_id: props.data.id, membership_number: "" }));
        props.onCloseModal();
        props.closeOverallModal()
    }
    return <>
        <Modal visible={props.isVisible} style={styles.editMembershipModal} animationType={"slide"}>
            <View style={styles.headingAndCloseContainer}>
                <Text style={[textTheme.titleLarge, styles.heading]}>{props.data.name}</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    onPress={props.onCloseModal}
                >
                    <Ionicons name="close" size={25} color="black" />
                </PrimaryButton>
            </View>
            <Divider />
            <ScrollView style={{ flex: 1, }}>
                <View style={styles.modalContent}>
                    <CustomTextInput label={"Valid from"} type={"date"} value={new Date(validFromDate)}
                        minimumDate={new Date()}
                        onChangeValue={setValidFromDate} />
                    <CustomTextInput label={"Valid until"} type={"date"} value={new Date(validUntilDate)}
                        minimumDate={new Date()}
                        onChangeValue={setValidUntilDate} />
                    <CustomTextInput label={"Membership Price"} type={"price"} value={membershipPrice.toString()}
                        onChangeText={(price) => {
                            if (price === "") setMembershipPrice(0)
                            else setMembershipPrice(parseFloat(price))
                        }} />
                    <CustomTextInput type={"number"} readOnly={true} label={"Membership ID"} value={membershipId.toString()}
                        onChangeText={(_id) => setMembershipId(_id)} />
                </View>
            </ScrollView>
            <View style={styles.addToCartButtonContainer}>
                <PrimaryButton onPress={handleSave} label={"Add to cart"} />
            </View>
        </Modal>
    </>

}

const styles = StyleSheet.create({
    editMembershipModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    heading: {
        fontWeight: 500
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: Colors.background,
    },
    modalContent: {
        flex: 1,
        padding: 30,
    },
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 20,
    }
})

export default EditMembershipModal