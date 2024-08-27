import {Modal, Text, View, StyleSheet, ScrollView} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {AntDesign, Feather, Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import ClientCard from "./ClientCard";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ClientSaleInfo from "./ClientSalesInfo";
import ClientInfoCategories from "./ClientInfoCategories";
import {useEffect, useState} from "react";
import Divider from "../../ui/Divider";
import ClientStatistics from "./ClientStatistics";
import ClientDetails from "./ClientDetails";
import MoreOptionDropDownModal from "./MoreOptionDropDownModal";
import UpdateClientModal from "./UpdateClientModal";
import DeleteClient from "./DeleteClientModal";
import {useDispatch, useSelector} from "react-redux";
import {dateFormatter} from "../../util/Helpers";



const getCategoryTitle =
    {"clientDetails": "Client details",
        "billActivity": "Bill activity",
        "appointments": "Appointments",
        "memberships": "Memberships",
        "packageSales": "Package sales",
        "prepaidSales": "Prepaid sales",
        "review": "Review",
        "giftVoucher": "Gift Voucher",
        "seeMoreStats": "Statistics"
    }


export default function clientInfoModal(props) {

    const dispatch = useDispatch();

    const analyticDetails = useSelector(state => state.clientInfo.analyticDetails);
    const details = useSelector(state => state.clientInfo.details);


    const [totalSales, setTotalSales] = useState("");
    const [lastVisit, setLastVisit] = useState("");
    const [completedAppointments, setCompletedAppointment] = useState(0);
    const [cancelledAppointments, setCancelledAppointment] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [noShows, setNoShows] = useState(0);
    const [totalVisits, setTotalVisits] = useState(0);




    useEffect(() => {
        setTotalSales(analyticDetails.total_sales === undefined ? "" : analyticDetails.total_sales);
        setLastVisit(
            analyticDetails.history_appointmentList !== undefined ?
            analyticDetails.history_appointmentList.length !== 0 ?
                dateFormatter(analyticDetails.history_appointmentList[0].appointment_date, 'short') :
                "" : "");
        setCompletedAppointment(analyticDetails.completed_appointments === undefined ? "" : analyticDetails.completed_appointments);
        setCancelledAppointment(analyticDetails.cancelled_appointments === undefined ? "" : analyticDetails.cancelled_appointments);
        setFeedbackCount(analyticDetails.feedbacks);
        setNoShows(0);
        setTotalVisits(analyticDetails.total_visits === undefined ? "" : analyticDetails.total_visits);

    }, [analyticDetails]);


    const [clientMoreDetails, setClientMoreDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");

    const [modalVisibility, setModalVisibility] = useState(false)

    const [editClientModalVisibility, setEditClientModalVisibility] = useState(false);
    const [deleteClientModalVisibility, setDeleteClientModalVisibility] = useState(false);

    useEffect(() => {
        if(selectedOption === "editClient") {
            setEditClientModalVisibility(true);
            setSelectedOption("");
        }
        else if(selectedOption === "deleteClient") {
            setDeleteClientModalVisibility(true);
            setSelectedOption("");
            setModalVisibility(false);
        }
    }, [selectedOption]);


    function clientInfoCategoryPressHandler(id) {
        console.log(id);
        setClientMoreDetails(id);
    }
    function seeMoreStatisticsHandler() {
        console.log("seeMoreStatisticsHandler");
        setClientMoreDetails("seeMoreStats");
    }
    let content;

    if(clientMoreDetails === null) {
        content = <ScrollView>
            <MoreOptionDropDownModal
                isVisible={modalVisibility}
                onCloseModal={() => setModalVisibility(false)}
                dropdownItems={[
                    "Edit client",
                    "Delete client",
                ]}
                setOption={setSelectedOption}

            />

            <UpdateClientModal
                isVisible={editClientModalVisibility}
                onCloseModal={() => {
                    setEditClientModalVisibility(false);
                    setModalVisibility(false);
                }}
                details={details}

            />

            <DeleteClient
                isVisible={deleteClientModalVisibility}
                onCloseModal={() => {
                    setDeleteClientModalVisibility(false)
                    setModalVisibility(false);
                }}
                onCloseClientInfoAfterDeleted={() => {
                    props.setVisible(false);
                    props.setSearchQuery("");
                    props.setFilterPressed("all_clients_count");
                }}

            />
            <View style={styles.modalContent}>
                <ClientCard
                    name={props.name}
                    phone={props.phone}
                    card={styles.clientDetailsContainer}
                    nameText={[textTheme.titleSmall, styles.name]}
                    phoneText={[textTheme.titleSmall, styles.phone]}
                />
                <View style={styles.optionsContainer}>
                    <PrimaryButton
                        buttonStyle={styles.updateOrDeleteOption}
                        onPress={() => {
                            setModalVisibility(true);
                        }}
                    >
                        <SimpleLineIcons name="options" size={24} color="black" />
                    </PrimaryButton>
                    <PrimaryButton buttonStyle={styles.callButton} pressableStyle={styles.pressableStyle}>
                        <View style={{flexDirection: "row"}}>
                            <Feather name="phone" size={18} color="black" />
                            <Text style={[textTheme.bodyMedium, {marginLeft: 8}]}>Call</Text>
                        </View>

                    </PrimaryButton>
                    <PrimaryButton buttonStyle={styles.bookButton} pressableStyle={styles.pressableStyle}>
                        <Text style={[textTheme.bodyMedium, {color: Colors.white}]}>
                            Book now
                        </Text>
                    </PrimaryButton>
                </View>

                <ClientSaleInfo
                    totalSales={totalSales}
                    lastVisit={lastVisit}
                    salesCard={styles.salesCard}
                    onPress={seeMoreStatisticsHandler}
                />

                <View style={styles.clientInfoCategoryContainer}>
                    <ClientInfoCategories
                        onPress={clientInfoCategoryPressHandler}
                    />
                </View>
            </View>
        </ScrollView>

    }
    else if(clientMoreDetails === "seeMoreStats") {
        content =
            <ClientStatistics
                title={getCategoryTitle[clientMoreDetails]}
                lastVisit={lastVisit}
                totalSales={totalSales}
                completedAppointment={completedAppointments}
                cancelledAppointment={cancelledAppointments}
                feedbackCount={feedbackCount}
                noShows={noShows}
                totalVisits={totalVisits}
            />
    }
    else if(clientMoreDetails === "clientDetails") {
        content =
            <ClientDetails
                title={getCategoryTitle[clientMoreDetails]}

            />
    }

    return (
        <Modal visible={props.visible} animationType={"slide"}>
            <View style={styles.closeAndHeadingContainer}>
                {
                    clientMoreDetails === null ?
                        null :
                        <PrimaryButton
                            buttonStyle={styles.backButton}
                            onPress={() => {
                                setClientMoreDetails(null);
                            }}
                        >
                            <AntDesign name="arrowleft" size={24} color="black"/>
                        </PrimaryButton>
                }

                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={() => {
                        props.closeModal();
                        setClientMoreDetails(null);
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
                {
                    clientMoreDetails === null ?
                        null :
                    <ClientCard
                        name={props.name}
                        card={styles.clientProfileCard}
                        cardInnerContainer={styles.cardInnerContainer}
                        rippleColor={Colors.white}
                    />
                }

            </View>
            {
                clientMoreDetails === null ?
                    null :
                    <>
                    <Divider />
                    </>
            }
            {content}

        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        alignItems: 'center',
    },
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
    titleText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    clientDetailsContainer: {
        width: "auto",
    },
    name: {
        fontWeight: '600',
    },
    phone: {
    },
    optionsContainer: {
        flexDirection: "row",
        width: "85%",
        justifyContent: "space-around"
    },
    updateOrDeleteOption: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    callButton: {
        width: '30%',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    bookButton: {
        width: '30%'
    },
    pressableStyle: {
        flex: 1
    },
    salesCard: {
        marginTop: 64
    },
    clientInfoCategoryContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 12,
        width: '90%',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 32
    },
    backButton: {
        position: "absolute",
        left: 0,
        backgroundColor: Colors.background,
    },
    clientProfileCard: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: 'auto'
    },
    cardInnerContainer: {
        marginLeft: 0
    },
})