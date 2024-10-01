import React, {useState, useRef, useEffect} from "react";
import {
    BackHandler,
    FlatList,
    Modal, Platform,
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
import {capitalizeFirstLetter, formatDate, shadowStyling, showToast} from "../../util/Helpers";
import AddCustomItemModal from "./AddCustomItemModal";
import PrepaidModal from "./PrepaidModal";
import {updateAppointmentDate} from "../../store/cartSlice";
import * as Haptics from "expo-haptics";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

const modalCategoryListData = [
    {id: "services", title: "SERVICES"},
    {id: "products", title: "PRODUCTS"},
    {id: "customItem", title: "CUSTOM ITEM"},
    {id: "memberships", title: "MEMBERSHIP"},
    {id: "prepaid", title: "PREPAID"},
    {id: "packages", title: "PACKAGES"},
    // {id: 6, title: "GIFT VOUCHER"},
];

const AddItemModal = (props) => {
    const dispatch = useDispatch();
    const appointmentDate = useSelector(state => state.cart.appointment_date);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(appointmentDate);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [womenServicesData, setWomenServicesData] = useState();

    const businessDetails = useSelector(state => state.businesses);

    useEffect(() => {
        if (selectedCategory === "products") {

            const backAction = () => {

                // if (selectedCategory==="products") {
                //     setIsModalVisible(false);
                // onCloseModal();
                return true;
                // }
                // return false;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => {
                return backHandler.remove()
            };
        }
    }, [selectedCategory]);
    const openDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
        },
        backAndCloseContainer: {
            // marginTop: Platform.OS === "ios" ? 50 : 0,
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
            borderBottomColor: Colors.grey500,
            borderBottomWidth: 1,
            backgroundColor: Colors.transparent,
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
                            {formatDate(selectedDate, "dd short-month year")}
                        </Text>
                        <MaterialCommunityIcons
                            name="calendar-month-outline"
                            size={24}
                            color={Colors.darkBlue}
                        />
                    </Pressable>
                    {isDatePickerVisible && (
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            minimumDate={businessDetails.businessNotificationDetails.data[0].back_date_invoice_allowed === false
                                ? new Date(Date.now()) : undefined}
                            maximumDate={new Date(Date.now())}
                            date={new Date(selectedDate)}
                            onConfirm={(date) => {
                                const now = new Date();
                                const formatForComparison = (date) => {
                                    return new Date(date).toISOString().split(':').slice(0, 2).join(':') + ':00.000Z';
                                };
                                const formattedCurrentDate = formatForComparison(now);
                                const formattedSelectedDate = formatForComparison(date);
                                if (formattedCurrentDate !== formattedSelectedDate) {
                                    const selectedDateLocal = new Date(date);
                                    const isSameDay =
                                        now.getDate() === selectedDateLocal.getDate() &&
                                        now.getMonth() === selectedDateLocal.getMonth() &&
                                        now.getFullYear() === selectedDateLocal.getFullYear();

                                    if (!isSameDay) {
                                        // TODO
                                    }
                                }
                                setIsDatePickerVisible(false);
                                setSelectedDate(new Date(date).getTime());
                                dispatch(updateAppointmentDate(new Date(date).getTime()));
                            }}
                            onCancel={() => setIsDatePickerVisible(false)}
                            themeVariant="light"
                        />
                    )}
                </View>
            </View>
            <Divider/>
            <FlatList
                bounces={false}
                data={modalCategoryListData}
                // contentContainerStyle={{borderBottomColor:Colors.grey500,borderBottomWidth:1}}
                renderItem={({item}) => {
                    return (
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

                    );
                }}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    } else if (selectedCategory === "services") {
        content = <ServicesList closeOverallModal={() => {
            setSelectedCategory(null)
            props.closeModal()
        }}/>
    } else if (selectedCategory === "products") {
        content = <ProductsList selectedCategory={selectedCategory}
                                onCloseModal={() => setSelectedCategory(null)}
                                closeOverallModal={() => {
                                    setSelectedCategory(null)
                                    props.closeModal()
                                }}/>
    } else if (selectedCategory === "memberships") {
        content =
            <MembershipsAndPackagesList category={"memberships"} closeOverallModal={() => {
                setSelectedCategory(null)
                props.closeModal()
            }}/>
    } else if (selectedCategory === "packages") {
        content =
            <MembershipsAndPackagesList category={"packages"} closeOverallModal={() => {
                setSelectedCategory(null)
                props.closeModal()
            }}/>
    } else if (selectedCategory === "customItem") {
        content = <AddCustomItemModal isVisible={true} onCloseModal={() => {
            setSelectedCategory(null)
        }} closeOverallModal={props.closeModal}/>
    } else if (selectedCategory === "prepaid") {
        content = <PrepaidModal isVisible={true} onCloseModal={() => {
            setSelectedCategory(null)
        }} closeOverallModal={props.closeModal}/>
    }

    return (
        <Modal
            animationType={"slide"}
            visible={props.visible}
            presentationStyle="pageSheet"
            onRequestClose={
                () => {
                    props.closeModal()
                    setSelectedCategory(null)
                }
            }
        >
            <View style={[styles.backAndCloseContainer, shadowStyling]}>
                {
                    selectedCategory == null || selectedCategory === "customItem" ? null : <PrimaryButton
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
                        style={[textTheme.titleLarge, styles.newSaleText]}>{selectedCategory == null || selectedCategory === "customItem" ? "New Sale" : capitalizeFirstLetter(selectedCategory)}</Text>
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
            {content}
            <Toast/>
        </Modal>
    );
}


export default AddItemModal;
