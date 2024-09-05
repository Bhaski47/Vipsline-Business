import axios from "axios";
import { ToastAndroid } from "react-native";

export default async function sendSMSAPI(name, mobile) {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/appointment/sendInvoiceLink`,
            {
                business_id: "2db7d255-7797-4cce-9590-fc59d2019577",
                booking_id: "2e54d6dd-3fd4-4962-b481-b801c8e0c53c",
                user_mobile: mobile,
                name: name
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.EXPO_PUBLIC_AUTH_KEY,
                }
            }
        );

        ToastAndroid.show("SMS send successfully!", ToastAndroid.LONG);
    } catch (error) {
        console.log(error + "SMS");
        ToastAndroid.show("Failed to send SMS.", ToastAndroid.LONG);
    }
}
