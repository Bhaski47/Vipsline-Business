import {createSlice} from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import axios from "axios";
import {updateClientsList, updateFetchingState} from "./clientFilterSlice";
import calculateCartPriceAPI from "../util/apis/calculateCartPriceAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {formatDate} from "../util/Helpers";
import {useState} from "react";

const initialCartState = {
    prepaidClientId: "",
    items: [],
    isLoading: false,
    editedCart: [],
    calculatedPrice: [],
    customItems: [],
    additionalDiscounts: [],
    chargesData: [{
        name: "",
        amount: 0,
        index: 0,
    }],
    salesNotes: "",
    totalChargeAmount: 0.0,
    clientMembershipID: undefined,
    prepaid_wallet: [{
        bonus_value: "",
        description: "",
        mobile: "",
        resource_id: "",
        source: "",
        wallet_amount: "",
    }]
};

async function getBusinessId() {
    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
    }
}


export const addItemToCart = (data) => async (dispatch, getState) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error.(inside cartSlice addItemsToCart)" + e);
    }


    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/addItemsToCheckout`,
            {
                business_id: `${await getBusinessId()}`,
                ...data
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(await loadCartFromDB())
    } catch (error) {
    }
}

export const checkStaffOnCartItems = () => (dispatch, getState) => {
    const {cart} = getState();
    return cart.items.every(item => item.resource_id !== null) && cart.customItems.every(item => item.resource_id !== null);
}

export const loadCartFromDB = (clientId) => async (dispatch, getState) => {
    const {clientInfo} = getState();
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (cartSlice loadCartFromDb)" + e);
    }

    const {cart} = getState();
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/getCheckoutItemsInCart2ByBusiness`,
            {
                business_id: `${await getBusinessId()}`,
                client_membership_id: cart.clientMembershipID
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateItem(response.data.data));
        if (clientId !== undefined) {
            dispatch(modifyClientId({ type: "update", payload: clientId }));
        }
        dispatch(updateCalculatedPrice(clientId !== undefined || null || "" ? clientId : clientInfo.clientId !== undefined || null || "" ? clientInfo.clientId : clientId));
        dispatch(updateTotalChargeAmount(cart.calculatedPrice.data[0].extra_charges_value));
    } catch (error) {
    }
}

export const updateCalculatedPrice = (clientId, prepaid, prepaidAmount) => async (dispatch, getState) => {
    const {cart} = getState();

    calculateCartPriceAPI({
        additional_discounts: cart.additionalDiscounts,
        additional_services: cart.customItems,
        cart: cart.items
            .filter(item => {
                    if (item.gender === "membership") {
                        if (cart.editedCart.length === 0) return true;
                        else {
                            return !cart.editedCart.some(editedShips => item.membership_id === editedShips.id)
                        }
                    } else {
                        return !cart.editedCart.some(edited =>
                            item.item_id === edited.item_id
                        )
                    }
                }
            )
            .map(item => {
                return {id: item.item_id};
            }),
        coupon_code: "",
        edited_cart: [
            ...cart.editedCart.map(item => {
                if (item.gender === "membership") {
                    const originalData = cart.items.filter(ele => ele.membership_id === item.id)[0];
                    return {
                        amount: item.price,
                        bonus_value: 0,
                        disc_value: 0,
                        itemId: originalData.item_id,
                        membership_id: item.id,
                        membership_number: "",
                        res_cat_id: originalData.resource_category_id,
                        resource_id: item.resource_id,
                        type: "AMOUNT",
                        valid_from: item.valid_from,
                        valid_till: item.valid_until,
                        wallet_amount: 0,
                    }
                } else if (item.gender === "Products")
                    return {
                        amount: item.amount,
                        bonus_value: 0,
                        disc_value: item.disc_value,
                        itemId: item.item_id,
                        membership_id: 0,
                        product_id: item.product_id,
                        resource_id: item.resource_id,
                        type: "AMOUNT",
                        valid_from: "",
                        valid_till: "",
                        wallet_amount: 0,
                    }
                else if (item.gender === "prepaid")
                    return {
                        amount: 0,
                        bonus_value: item.wallet_bonus,
                        disc_value: 0,
                        itemId: item.item_id,
                        membership_id: 0,
                        resource_id: item.resource_id,
                        type: "AMOUNT",
                        valid_from: "",
                        valid_till: "",
                        wallet_amount: item.wallet_amount,
                        wallet_description: item.wallet_description
                    }
                else
                    return item
            })
        ],
        extra_charges: cart.chargesData[0].amount === 0 ? [] : cart.chargesData,
        isWalletSelected: prepaid === undefined ? false : prepaid,
        wallet_amt: prepaidAmount === undefined ? 0 : prepaidAmount,
        client_membership_id: cart.clientMembershipID === undefined || null ? null : cart.clientMembershipID,
        // client_membership_id:clientMembershipID,
        walkInUserId: cart.prepaidClientId !== "" ? cart.prepaidClientId : clientId === "" ? undefined : clientId,
        promo_code: "",
        user_coupon: "",
        walkin: "yes",
    }).then(response => {
        dispatch(setCalculatedPrice(response))
    })

}

export const removeItemFromCart = (itemId) => async (dispatch, getState) => {
    console.log(itemId)
    const {cart} = getState();

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (cartSlice loadCartFromDb)" + e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/removeFromCart2`,
            {
                business_id: `${await getBusinessId()}`,
                item_id: itemId
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        if (cart.editedCart.some(ele => ele.itemId === itemId)) {
            dispatch(removeItemFromEditedCart(itemId));
        }
        dispatch(await loadCartFromDB());
    } catch (error) {
        console.error(e.response.data)
    }
}

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        updateItem(state, action) {
            const transformed = action.payload
            state.items = action.payload.map(item => {
                return {
                    ...item,
                    edited: false
                }
            })
        },
        updateLoadingState(state, action) {
            state.isLoading = action.payload;
        },
        addItemToEditedCart(state, action) {
            if (state.editedCart.some(item => item.item_id === action.payload.item_id))
                state.editedCart = state.editedCart.map(edited => {
                    if (edited.item_id === action.payload.item_id) {
                        return {
                            edited,
                            ...action.payload
                        }
                    }
                    return edited;
                })
            else
                state.editedCart = [...state.editedCart, action.payload];
        },
        updateStaffInEditedCart(state, action) {
            state.editedCart = state.editedCart.map(item => {
                if (action.payload.itemId === item.item_id) {
                    return {
                        ...item,
                        resource_id: action.payload.resource_id
                    }
                }
                return item;
            })
        },
        removeItemFromEditedCart(state, action) {
            state.editedCart = state.editedCart.filter(item => item.itemId !== action.payload);
        },
        removeMembershipFromEditedCart(state, action) {
            state.editedCart = state.editedCart.filter(item => item.id !== action.payload);
        },
        editMembership(state, action) {
            if (state.editedCart.some(edited => edited.membership_id === action.payload.id)) {
                state.editedCart = state.editedCart.map(edited => {
                    if (edited.membership_id === action.payload.id) {
                        return {...edited, ...action.payload.data}
                    }
                    return edited;
                })
            } else {
                const originalData = state.items.filter(item => item.membership_id === action.payload.id)[0];
                const validFrom = new Date(Date.now()).setHours(0, 0, 0, 0)
                const validUntil = validFrom + (originalData.duration * 24 * 60 * 60 * 1000)
                console.log({...originalData, ...action.payload.data})
                state.editedCart = [...state.editedCart, {
                    ...originalData, ...action.payload.data,
                    valid_from: formatDate(validFrom, "yyyy-mm-dd"),
                    valid_until: formatDate(validUntil, "yyyy-mm-dd"),
                }];
            }
        },
        clearLocalCart(state, action) {
            state.items = [];
            state.editedCart = [];
            state.customItems = [];
            state.additionalDiscounts = [];
            state.chargesData = initialCartState.chargesData;
        },
        updateCustomItem(state, action) {
            state.customItems = state.customItems.map(item => {
                if (item.item_id === action.payload.item_id) {
                    return {
                        ...item,
                        ...action.payload
                    }
                }
                return item;
            })
        },
        clearCustomItems(state, action) {
            state.customItems = [];
        },
        setCalculatedPrice(state, action) {
            state.calculatedPrice = action.payload;
        },
        addCustomItems(state, action) {
            const id = Math.floor(Math.random() * 90000) + 10000;
            const data = {
                ...action.payload,
                id: id,
                item_id: id
            }
            state.customItems = [...state.customItems, data];
        },
        updateStaffInCustomItemsCart(state, action) {
            state.customItems = state.customItems.map(item => {
                if (action.payload.itemId === item.item_id) {
                    return {
                        ...item,
                        resource_id: action.payload.resource_id
                    }
                }
                return item;
            })
        },
        removeCustomItems(state, action) {
            state.customItems = state.customItems.filter(oldItem => oldItem.id !== action.payload);
        },
        //Bhaski reducers
        updateDiscount(state, action) {
            state.additionalDiscounts.pop();
            state.additionalDiscounts = action.payload.length === 0 ? [] : [action.payload];
        },
        updateChargeData(state, action) {
            state.chargesData = action.payload;
        },

        updateSalesNotes(state, action) {
            state.salesNotes = action.payload;
        },
        clearSalesNotes(state, action) {
            state.salesNotes = "";
        },
        updateTotalChargeAmount(state, action) {
            state.totalChargeAmount = action.payload;
        },
        clearCalculatedPrice(state, action) {
            state.calculatedPrice = [];
        },
        modifyClientMembershipId(state, action) {
            const {type, payload} = action.payload;
            switch (type) {
                case "clear":
                    state.clientMembershipID = undefined;
                    break;
                case "add":
                    state.clientMembershipID = payload;
                    break;
            }
        },
        modifyClientId(state, action) {
            const { type, payload } = action.payload;
            switch (type) {
                case "clear":
                    state.prepaidClientId = undefined;
                    break;
                case "update":
                    state.prepaidClientId = payload;
                    break;
            }
        },
        modifyPrepaidDetails(state, action) {
            const {type, payload} = action.payload;
            switch (type) {
                case "clear":
                    state.prepaid_wallet = [{
                        bonus_value: "",
                        description: "",
                        mobile: "",
                        resource_id: "",
                        source: "",
                        wallet_amount: "",
                    }];
                    break;
                case "add":
                    state.prepaid_wallet = payload;
                    break;
                case "updateMobile":
                    if (state.prepaid_wallet.length > 0) {
                        // state.prepaid_wallet[0].mobile = payload;
                        state.prepaid_wallet = [{
                            ...state.prepaid_wallet[0],
                            mobile: payload
                        }]
                    } else {
                        console.error("No prepaid_wallet entry to update mobile");
                    }
                    break;
                case "updateResourceId":
                    // if (state.prepaid_wallet.length > 0 && state.prepaid_wallet[0]?.source === "Add prepaid") {
                    if (state.prepaid_wallet.length > 0) {
                        // state.prepaid_wallet[0].source = "add_prepaid";
                        state.prepaid_wallet = [{
                            ...state.prepaid_wallet[0],
                            source: "add_prepaid"
                        }]
                    }
                    if (state.prepaid_wallet.length > 0) {
                        // state.prepaid_wallet[0].resource_id = payload;
                        state.prepaid_wallet = [{
                            ...state.prepaid_wallet[0],
                            resource_id: payload
                        }]
                    } else {
                        console.error("No prepaid_wallet entry to update resource_id");
                    }
                    break;
                default:
                    console.error("Unknown action type:", type);
            }
        },

    }
});

export const {
    updateItem,
    updateLoadingState,
    addItemToEditedCart,
    removeItemFromEditedCart,
    setCalculatedPrice,
    addCustomItems,
    removeCustomItems,
    updateCustomItem,
    updateDiscount,
    updateChargeData,
    updateSalesNotes,
    clearCalculatedPrice,
    updateStaffInEditedCart,
    updateStaffInCustomItemsCart,
    removeMembershipFromEditedCart,
    editMembership,
    clearLocalCart,
    clearSalesNotes,
    updateTotalChargeAmount,
    modifyClientMembershipId,
    modifyPrepaidDetails,
    modifyClientId,
    clearCustomItems
} = cartSlice.actions;

export default cartSlice.reducer;
