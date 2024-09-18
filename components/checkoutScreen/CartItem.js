import {View, StyleSheet, Text, TextInput, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {Feather} from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {MaterialIcons} from '@expo/vector-icons';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteItemFromCart,
    removeCustomItems,
    removeItemFromCart,
    removeItemFromEditedCart, updateEditedCart,
    updateLoadingState, updateStaffInEditedCart, updateStaffInCustomItemsCart,
    modifyPrepaidDetails, removeMembershipFromEditedCart
} from "../../store/cartSlice";
import DropdownModal from "../../ui/DropdownModal";
import {updateCartItemStaff} from "../../store/staffSlice";
import EditCartModal from "./EditCartModal";
import PrepaidModal from "./PrepaidModal";
import AddCustomItemModal from "./AddCustomItemModal";
import PackageModal from "./PackageModal";

const CartItem = (props) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.cart.isLoading);
    const [isEditCartModalVisible, setIsEditCartModalVisible] = useState(false);
    const [isEditPrepaidModalVisible, setIsEditPrepaidModalVisible] = useState(false);
    const [isEditCustomItemModalVisible, setIsEditCustomItemModalVisible] = useState(false);
    const [isEditMembershipModalVisible, setIsEditMembershipModalVisible] = useState(false);
    const [isEditPackageModalVisible, setIsEditPackageModalVisible] = useState(false);
    const editedCart = useSelector(state => state.cart.editedCart);
    let editedData;
    if (props.data.gender === "membership") {
        editedData = editedCart.filter(item => item.id === props.data.membership_id)[0];
    } else {
        editedData = editedCart.filter(item => item.item_id === props.data.item_id)[0];
    }
    // const edited = editedData.some(item => props.data.item_id === item.item_id);

    const removeItemHandler = async () => {
        if (isLoading) return;
        dispatch(updateLoadingState(true));
        dispatch(await removeItemFromCart(props.data.item_id)).then((res) => {
            dispatch(updateLoadingState(false));
        })
        // dispatch(await removeItemFromCart(props.data.item_id))
    }

    const [isStaffDropdownModalVisible, setIsStaffDropdownModalVisible] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(props.data.resource_id !== null ? props.staffs.filter((staff) => staff.id === props.data.resource_id)[0] : null);

    // console.log(editedData)
    // useEffect(() => {
    //     setSelectedStaff(props.data.resource_id !== null ? props.staffs.filter((staff) => staff.id === props.data.resource_id)[0] : null);
    // }, [props.data]);


    return <>
        <View style={styles.cartItem}>
            {isEditPrepaidModalVisible && <PrepaidModal edited={true}
                                                        data={props.data}
                                                        isVisible={isEditPrepaidModalVisible}
                                                        onCloseModal={() => setIsEditPrepaidModalVisible(false)}/>}
            {isEditCartModalVisible && <EditCartModal isVisible={isEditCartModalVisible}
                                                      onCloseModal={() => setIsEditCartModalVisible(false)}
                                                      data={{...props.data, ...editedData}}/>}
            {isEditCustomItemModalVisible && <AddCustomItemModal edited={true}
                                                                 isVisible={isEditCustomItemModalVisible}
                                                                 data={props.data}
                                                                 onCloseModal={() => setIsEditCustomItemModalVisible(false)}/>}
            {isEditPackageModalVisible && <PackageModal edited={true}
                                                        isVisible={isEditPackageModalVisible}
                                                        onCloseModal={() => setIsEditPackageModalVisible(false)}
                                                        data={props.data}/>}

            <DropdownModal isVisible={isStaffDropdownModalVisible}
                           onCloseModal={() => setIsStaffDropdownModalVisible(false)} dropdownItems={props.staffs}
                           object={true} objectName={"name"} selectedValue={selectedStaff}
                           onChangeValue={(value) => {
                               dispatch(updateCartItemStaff([{item_id: props.data.item_id, resource_id: value.id}]));
                               if (props.data.gender === "custom_item") {
                                   dispatch(updateStaffInCustomItemsCart({
                                       itemId: props.data.item_id,
                                       resource_id: value.id
                                   }));
                               } else if (props.data.gender === "prepaid") {
                                   dispatch(modifyPrepaidDetails({type: "updateResourceId", payload: value.id}));
                               } else {
                                   dispatch(updateStaffInEditedCart({
                                       itemId: props.data.item_id,
                                       resource_id: value.id
                                   }));
                               }
                               setSelectedStaff(value)
                           }}/>
            <View style={styles.itemNameAndDetailsContainer}>
                {props.data.gender === "prepaid" ? <Text
                    style={[TextTheme.bodyLarge, styles.itemNameText]}>Prepaid value
                    ₹{parseFloat(props.data.wallet_amount) + parseFloat(props.data.wallet_bonus)}</Text> : <Text
                    style={[TextTheme.bodyLarge, styles.itemNameText]}>{props.data.resource_category_name === null ? props.data.name : props.data.resource_category_name}</Text>}

                <View style={styles.itemDetailsContainer}>
                    <Text style={[TextTheme.labelLarge, styles.itemQuantityText]}>1x</Text>
                    <View style={styles.amountContainer}>
                        <Text style={[TextTheme.bodyLarge, styles.currencySymbol]}>₹</Text>
                        {/*<Text style={[TextTheme.bodyLarge, styles.amountText]}>{props.data.total_price}</Text>*/}
                        <Text
                            style={[TextTheme.bodyLarge, styles.amountText]}>{editedData ? editedData.price : props.data.price}</Text>
                        {(props.data.gender === "packages" && props.data.package_name !== "") || true ? null :
                            <PrimaryButton onPress={() => {
                                if (props.data.gender === "prepaid") {
                                    setIsEditPrepaidModalVisible(true)
                                } else if (props.data.gender === "custom_item") {
                                    setIsEditCustomItemModalVisible(true);
                                } else if(props.data.gender === "packages"){
                                    setIsEditPackageModalVisible(true);
                                } else {
                                    setIsEditCartModalVisible(true)
                                }
                            }}
                                           buttonStyle={styles.editAmountButton}
                                           pressableStyle={styles.editAmountPressable}>
                                <Feather style={styles.editAmountIcon} name="edit-2" size={15} color="black"/>
                                {/*<Feather  name="edit" size={22} color="black"/>*/}
                            </PrimaryButton>}
                    </View>
                    <PrimaryButton buttonStyle={styles.closeIconButton} pressableStyle={styles.closeIconPressable}
                                   onPress={
                                       async () => {
                                           if (props.data.gender === "prepaid" && props.data) {
                                               dispatch(await removeItemFromCart(props.data.item_id)).then((res) => {
                                                   dispatch(updateLoadingState(false));
                                                   dispatch(removeItemFromEditedCart(props.data.item_id))
                                               })
                                           } else if (props.data.gender === "custom_item")
                                               dispatch(removeCustomItems(props.data.id))
                                           else if (props.data.gender === "membership") {
                                               removeItemHandler()
                                               dispatch(removeMembershipFromEditedCart(props.data.membership_id))
                                           } else
                                               removeItemHandler()
                                       }}>
                        <Ionicons name="close" size={24} color="black"/>
                    </PrimaryButton>
                </View>
            </View>
            <View style={styles.staffAndDiscountContainer}>
                <PrimaryButton buttonStyle={styles.staffButton} pressableStyle={styles.staffPressable}
                               onPress={() => setIsStaffDropdownModalVisible(true)}>
                    <View style={styles.staffContainer}>
                        <Text
                            style={[textTheme.bodyMedium, styles.staffText]}>{selectedStaff !== null ? selectedStaff.name : "Select Staff"}</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black"/>
                    </View>
                </PrimaryButton>

                {props.data.gender === "custom_item" || props.data.price - props.data.discounted_price === props.data.price || props.data.gender === "prepaid" ? null :
                    <Text
                        style={[textTheme.labelLarge, styles.discountText]}>{`Discount ₹${(props.data.price - props.data.discounted_price).toFixed(2)}`}</Text>
                }
            </View>
        </View>
        <Divider/>

    </>
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    cartItem: {
        // flex: 1,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    itemNameAndDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemNameText: {
        maxWidth: "50%",
    },
    itemDetailsContainer: {
        alignItems: "center",
        flexDirection: "row",
    },
    itemQuantityText: {
        fontWeight: "900",
        marginRight: 10,
    },
    amountContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    currencySymbol: {
        paddingRight: 5,
        paddingLeft: 10,
        paddingVertical: 5,
        borderLeftColor: Colors.transparent,
        borderTopColor: Colors.transparent,
        borderBottomColor: Colors.transparent,
        borderRightColor: Colors.grey400,
        borderWidth: 1,
        fontWeight: "500",
    },
    amountText: {
        maxWidth: 80,
        fontWeight: "500",
        color: Colors.black,
        marginRight: 6,
        marginLeft: 10,
        marginVertical: 0,
    },
    editAmountButton: {
        backgroundColor: Colors.transparent,
    },
    editAmountPressable: {
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    editAmountIcon: {
        paddingHorizontal: 5,
        color: Colors.grey600
    },
    closeIconButton: {
        backgroundColor: Colors.transparent,
        marginRight: -15,
        marginLeft: 5,
    },
    closeIconPressable: {
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    staffAndDiscountContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    discountText: {
        color: Colors.button,
        fontWeight: "bold",
        // alignSelf: "flex-end",
        // marginHorizontal: 55,
        // marginTop: 3,
    },
    staffButton: {
        // alignSelf: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey600,
        backgroundColor: Colors.transparent,
        padding: 0,
    },
    staffPressable: {
        padding: 0,
        margin: 0,
    },
    staffText: {
        color: Colors.error
    },
    staffContainer: {
        flexDirection: "row",
        alignItems: "center",
    }


});

export default CartItem;