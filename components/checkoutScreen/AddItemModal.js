import React, {useState, useRef} from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
    MaterialIcons,
    Entypo,
    MaterialCommunityIcons,
    AntDesign
} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import ServicesList from "./ServicesList";
import ProductsList from "./ProductsList";
import MembershipsAndPackagesList from "./MembershipsAndPackagesList";
import textTheme from "../../constants/TextTheme";
import {capitalizeFirstLetter} from "../../util/Helpers";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const modalCategoryListData = [
    {id: "services", title: "SERVICES"},
    {id: "products", title: "PRODUCTS"},
    {id: 2, title: "CUSTOM ITEM"},
    {id: "memberships", title: "MEMBERSHIP"},
    {id: 4, title: "PREPAID"},
    {id: "packages", title: "PACKAGES"},
    {id: 6, title: "GIFT VOUCHER"},
];

const AddItemModal = (props) => {
    const dispatch = useDispatch();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(Date.now());
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [womenServicesData, setWomenServicesData] = useState();

    const formattedDate =
        new Date(selectedDate).getDate() +
        " " +
        months[new Date(selectedDate).getMonth()] +
        " " +
        new Date(selectedDate).getFullYear();

    const openDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
        },
        backAndCloseContainer: {
            height: 60,
            flexDirection: "row",
            justifyContent: selectedCategory == null ? "" : "space-between",
            alignSelf: selectedCategory == null ? "flex-end" : "",
        },
        newSaleTextContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: selectedCategory == null ? 50 : 0,
        },
        newSaleText: {
            fontWeight: "500"
        },
        closeButton: {
            alignSelf: "center",
            backgroundColor: Colors.background,
        },
        backContainer: {},
        backButton: {
            alignSelf: "center",
            backgroundColor: Colors.background,
        },
        modalContent: {},
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        dateLabelText: {
            paddingTop: 10,
        },
        datePressable: {
            paddingVertical: 10,
            paddingRight: 10,
            flexDirection: "row",
            gap: 5,
        },
        dateContainer: {
            flex: 1,
            justifyContent: "flex-end",
            gap: 10,
            flexDirection: "row",
        },
        categoryListItemButton: {
            backgroundColor: Colors.background,
            alignSelf: "auto",
        },
        categoryListItemPressable: {
            paddingHorizontal: 25,
            paddingVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        categoryListItemButtonText: {},
    });

    let content;
    if (selectedCategory === null) {
        content = <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <View style={styles.dateContainer}>
                    <Text
                        style={[TextTheme.bodyLarge, styles.dateLabelText]}
                    >
                        Date
                    </Text>
                    <Pressable
                        style={styles.datePressable}
                        android_ripple={{color: Colors.ripple}}
                        onPress={openDatePicker}
                    >
                        <Text style={TextTheme.titleMedium}>
                            {formattedDate}
                        </Text>
                        <MaterialCommunityIcons
                            name="calendar-month-outline"
                            size={24}
                            color={Colors.darkBlue}
                        />
                    </Pressable>
                    {isDatePickerVisible && (
                        <RNDateTimePicker
                            value={new Date(selectedDate)}
                            maximumDate={new Date(Date.now())}
                            mode="date"
                            display="default"
                            onChange={(date) => {
                                setIsDatePickerVisible(false);
                                setSelectedDate(
                                    date.nativeEvent.timestamp
                                );
                            }}
                        />
                    )}
                </View>
            </View>
            <Divider/>
            <FlatList
                data={modalCategoryListData}
                renderItem={({item}) => {
                    return (
                        <>
                            <PrimaryButton
                                buttonStyle={styles.categoryListItemButton}
                                pressableStyle={styles.categoryListItemPressable}
                                onPress={() => {
                                    setSelectedCategory(item.id);
                                }}
                            >
                                <Text
                                    style={[
                                        TextTheme.titleMedium,
                                        styles.categoryListItemButtonText,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Entypo
                                    name="chevron-right"
                                    size={24}
                                    color="black"
                                />
                            </PrimaryButton>
                            <Divider color={Colors.grey600}/>
                        </>
                    );
                }}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    } else if (selectedCategory === "services") {
        content = <ServicesList/>
    } else if (selectedCategory === "products") {
        content = <ProductsList/>
    } else if (selectedCategory === "memberships") {
        content = <MembershipsAndPackagesList category={selectedCategory} />
    } else if (selectedCategory === "packages") {
        content = <MembershipsAndPackagesList category={selectedCategory} />
    }

    return (
        <Modal
            animationType={"slide"}
            visible={props.visible}
            onRequestClose={props.closeModal}
        >
            <View style={styles.backAndCloseContainer}>
                {
                    selectedCategory == null ? null : <PrimaryButton
                        buttonStyle={styles.backButton}
                        onPress={() => {
                            setSelectedCategory(null);
                        }}
                    >
                        <AntDesign name="arrowleft" size={24} color="black"/>
                    </PrimaryButton>
                }
                <View style={styles.newSaleTextContainer}>
                    <Text
                        style={[textTheme.titleLarge, styles.newSaleText]}>{selectedCategory == null ? "New Sale" : capitalizeFirstLetter(selectedCategory)}</Text>
                </View>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    onPress={() => {
                        setSelectedCategory(null);
                        props.closeModal();
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <Divider/>
            {content}
        </Modal>
    );
}


export default AddItemModal;