import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import Cart from "../components/checkoutScreen/Cart";
import AddClientButton from "../components/checkoutScreen/AddClientButton";
import {useNavigation} from "@react-navigation/native";
import title from "react-native-paper/src/components/Typography/v2/Title";
import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb
} from '../store/catalogueSlice';
import AddClientModal from "../components/checkoutScreen/AddClientModal";


const CheckoutScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);

    useEffect(() => {
        dispatch(loadServicesDataFromDb("women"));
        dispatch(loadServicesDataFromDb("men"));
        dispatch(loadServicesDataFromDb("kids"));
        dispatch(loadServicesDataFromDb("general"));
        dispatch(loadProductsDataFromDb());
        dispatch(loadPackagesDataFromDb());
        dispatch(loadMembershipsDataFromDb());
    }, []);

    return (
        <View style={styles.checkoutScreen}>
            <AddClientModal closeModal={() => {
                setIsAddClientModalVisible(false)
            }} isVisible={isAddClientModalVisible}/>
            <AddClientButton onPress={() => {
                setIsAddClientModalVisible(true)
            }}/>
            <Cart/>
        </View>
    );
}

const styles = StyleSheet.create({
    checkoutScreen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
});

export default CheckoutScreen;