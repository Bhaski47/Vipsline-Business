import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {dateFormatter} from "../../util/Helpers";
import {useState} from "react";
import UpdateClientModal from "./UpdateClientModal";

/**
 * ClientDetails Component
 *
 * This component displays detailed information about a client in a scrollable view.
 * It includes sections for client info and personal details, and allows users to edit
 * client information via a modal. The modal is toggled by pressing the 'Edit' button.
 *
 * Props:
 * @param {string} props.title - The title to be displayed at the top of the component.
 *
 * State:
 * @property {boolean} updateModalVisibility - Controls the visibility of the UpdateClientModal.
 *
 * Components:
 * - `UpdateClientModal`: Modal for editing client details.
 *
 * Usage:
 * ```jsx
 * <ClientDetails title="Client Details" />
 * ```
 */



export default function ClientDetails(props) {

    const details = useSelector(state => state.clientInfo.details);
    const name = details.name
    const mobile = details.mobile_1;
    const altPhone =
        details.mobile_2 === null || (details.mobile_2).trim().length === 0 ?
        "Not selected" :
        details.mobile_2;
    const address =
        details.address === null || (details.address).trim().length === 0 ?
            "Not selected" :
            details.address;
    const email = details.username === null || (details.username).trim().length === 0 ?
        "Not selected" :
        details.username;
    const gender =
        details.gender === "" ?
            "Not selected" :
            details.gender;
    const clientSource =
        details.client_source === null || (details.client_source).trim().length === 0 ?
        "Not selected" :
        details.client_source;
    const anniversary =
        details.anniversary === null ?
        "Not selected" :
        dateFormatter(details.anniversary, 'long');
    const clientNotes =
        details.client_notes === null || (details.client_notes).trim.length === 0 ?
        "Add any important client information" :
        details.client_notes;
    const dob =
        details.dob === null || (details.dob).trim().length === 0 ?
        "Not selected" :
        dateFormatter(details.dob, 'long');
    const customerGST =
        details.customer_gst === null || (details.customer_gst).trim().length === 0 ?
        "Not selected" :
        details.customer_gst;


    const [updateModalVisibility, setUpdateModalVisibility] = useState(false);


    return (
        <ScrollView style={styles.clientDetails} contentContainerStyle={{alignItems: "center",}}>
            <View style={styles.titleContainer}>
                <UpdateClientModal
                    isVisible={updateModalVisibility}
                    details={details}
                    onCloseModal={() => setUpdateModalVisibility(false)}
                />
                <Text style={[textTheme.titleMedium, styles.title]}>
                    {props.title}
                </Text>
                <PrimaryButton
                    buttonStyle={styles.editButton}
                    pressableStyle={styles.pressableStyle}
                    onPress={() => setUpdateModalVisibility(true)}

                >
                    <View style={styles.buttonInnerContainer}>
                        <Text style={[textTheme.titleSmall, styles.buttonText]}>
                            Edit
                        </Text>
                        <MaterialCommunityIcons
                            name="pencil-outline"
                            size={18}
                            color="black"
                        />
                    </View>
                </PrimaryButton>
            </View>
            <View style={styles.clientInfoBox}>
                <View style={styles.clientInfoBoxLabelContainer}>
                    <Text style={[textTheme.titleMedium, styles.clientInfoBoxLabel]}>
                        Client Info
                    </Text>
                </View>
                <Text style={[textTheme.bodyMedium, styles.clientInfoText]}>
                    {clientNotes}
                </Text>


            </View>

            <View style={styles.personalDetails}>
                <View style={styles.clientInfoBoxLabelContainer}>
                    <Text style={[textTheme.titleMedium, styles.clientInfoBoxLabel]}>
                        Personal details
                    </Text>
                </View>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Phone</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>+91 {mobile}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Email</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{email}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Alt. Phone</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{altPhone}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Gender</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{gender}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Birthday</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{dob}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Anniversary</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{anniversary}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Client source</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{clientSource}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Client GST</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{customerGST}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Client source</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue]}>{clientSource}</Text>

                <Text style={[textTheme.bodyLarge, styles.personalDetailsLabel]}>Address</Text>
                <Text style={[textTheme.titleMedium, styles.personalDetailsValue, {marginBottom: 32}]}>{address}</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    clientDetails: {
        flex: 1,
    },
    titleContainer: {
        marginTop: 16,
        width: '95%',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    title: {
        marginLeft: 16
    },
    editButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        width: "25%",
        marginRight: 16

    },
    pressableStyle: {
        paddingHorizontal: 0,
        paddingVertical: 8
    },
    buttonInnerContainer: {
        flexDirection: "row",
    },
    buttonText: {
        marginRight: 8
    },
    clientInfoBox: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 8,
        width: '95%',
        marginTop: 32,
        height: 120
    },
    clientInfoTextBox: {
        width: '85%',
        marginLeft: 32,
        marginTop: 8
    },
    clientInfoBoxLabelContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey250,

    },
    clientInfoBoxLabel: {
        paddingVertical: 8,
        paddingLeft: 32
    },
    personalDetailsLabel: {
        marginLeft: 32,
        marginTop: 16,
        color: Colors.grey650
    },
    personalDetailsValue: {
        marginLeft: 32,
        marginTop: 8,
    },
    personalDetails: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 8,
        width: '95%',
        marginTop: 32,
        marginBottom: 40
    },
    clientInfoText: {
        paddingLeft: 32,
        paddingVertical: 8,
    },

})