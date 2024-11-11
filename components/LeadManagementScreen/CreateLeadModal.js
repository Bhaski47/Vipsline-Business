import {KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import {useSelector} from "react-redux";

const CreateLeadModal = (props) => {
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [phoneNo, setPhoneNo] = useState(["+91", ""]);
    const [email, setEmail] = useState();
    const [leadDate, setLeadDate] = useState(new Date())
    const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date())
    const [enquiryDetails, setEnquiryDetails] = useState()
    const [leadStatus, setLeadStatus] = useState()
    const [followUpTime, setFollowUpTime] = useState();
    const [gender, setGender] = useState();
    const [leadSource, setLeadSource] = useState()
    const [leadCampaign, setLeadCampaign] = useState()
    const [leadOwner, setLeadOwner] = useState()
    const [address, setAddress] = useState()
    const [location, setLocation] = useState()
    const [pincode, setPincode] = useState()
    const [view, setView] = useState("smart");


    return <Modal style={styles.createLeadModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>Create Lead</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <ScrollView>
            <View style={styles.modalContent}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>Lead
                        Information</Text>
                </View>
                <CustomTextInput placeholder={"Enter Client's First Name"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={firstName}
                                 label={"First Name"}
                                 onChangeText={setFirstName}
                                 type={"text"}/>
                <CustomTextInput placeholder={"Enter Client's Last Name"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={lastName}
                                 label={"Last Name"}
                                 onChangeText={setLastName}
                                 type={"text"}/>
                <CustomTextInput placeholder={"1234567890"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 label={"Mobile"}
                                 value={phoneNo[1]}
                                 onChangeText={setPhoneNo}
                                 type={"phoneNo"}/>
                <CustomTextInput placeholder={"Enter Email Address"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 label={"Email"}
                                 value={email}
                                 onChangeText={setEmail}
                                 type={"email"}/>
                <CustomTextInput type="dropdown"
                                 label="Gender"
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={gender}
                                 onChangeValue={setGender}
                                 dropdownItems={["Male", "Female", "Others"]}/>
                <CustomTextInput type="dropdown"
                                 label="Lead Source"
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={leadSource}
                                 onChangeValue={setLeadSource}
                                 dropdownItems={["Male", "Female", "Others"]}/>
                <CustomTextInput type="dropdown"
                                 label="Campaign"
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={leadCampaign}
                                 onChangeValue={setLeadCampaign}
                                 dropdownItems={["Male", "Female", "Others"]}/>
                <CustomTextInput type="dropdown"
                                 label="Lead Owner"
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={leadOwner}
                                 onChangeValue={setLeadOwner}
                                 dropdownItems={["Male", "Female", "Others"]}/>
                <View style={styles.sectionTitleContainer}><Text style={styles.sectionTitleText}>Lead Follow-up
                    Details</Text></View>
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="date"
                    label="Lead Date"
                    value={leadDate === null || leadDate === undefined ? null : new Date(leadDate)}
                    onChangeValue={(value) => {
                        setLeadDate(value)
                    }}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="multiLine"
                    label="Enquiry Details"
                    placeholder="Enter Client's Enquiry Details"
                    value={enquiryDetails}
                    onChangeText={setEnquiryDetails}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="dropdown"
                    label="Lead Status"
                    value={leadStatus}
                    onChangeValue={setLeadStatus}
                    dropdownItems={useSelector(state => state.leads.leadStatuses).map(status => status.name)}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="date"
                    label="Next Follow up Date"
                    value={nextFollowUpDate === null || nextFollowUpDate === undefined ? null : new Date(nextFollowUpDate)}
                    onChangeValue={(value) => {
                        setNextFollowUpDate(value);
                    }}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="dropdown"
                    label="Follow up time"
                    value={followUpTime}
                    onChangeValue={setFollowUpTime}
                    dropdownItems={useSelector(state => state.leads.leadStatuses).map(status => status.name)}
                />
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>Address
                        Information</Text>
                </View>
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="multiLine"
                    label="Address Details"
                    placeholder="Enter client address details"
                    value={address}
                    onChangeText={setAddress}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="text"
                    label="Location"
                    placeholder="Enter Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="text"
                    label="Enter pincode"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChangeText={setPincode}
                />
                <View style={styles.fieldToggle}>
                    <Text style={styles.fieldToggleText}>{ view === "smart" ? "Show all fields" : "Switch to smart view"}</Text>
                </View>
            </View>
        </ScrollView>
        <KeyboardAvoidingView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton onPress={() => {
                }} label="Save"/>
            </View>
        </KeyboardAvoidingView>
    </Modal>
}

const styles = StyleSheet.create({
    createLeadModal: {
        flex: 1,
    },
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
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
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitleContainer: {
        marginBottom: 10,
        marginHorizontal: -20,
        backgroundColor: "#F8F8FB",
        paddingVertical: 5,
        paddingHorizontal: 13,
    },
    sectionTitleText: {
        fontWeight: "bold",
        fontSize: 16
    },
    fieldToggle: {
        backgroundColor: "#F8F8FB",
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 30,
        marginHorizontal:-20,
    },
    fieldToggleText: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.highlight,
    },
    saveButtonContainer:{
        paddingHorizontal:15,
        paddingVertical:15,
        borderTopWidth:1,
        borderTopColor:Colors.grey300,
    }

})

export default CreateLeadModal