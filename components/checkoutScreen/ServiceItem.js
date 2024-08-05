import {StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";

const ServiceItem = (props) => {
    const dispatch = useDispatch();
    const styles = StyleSheet.create({
        selectServiceItemButton: {
            // padding: 15,
            borderRadius: 8,
            marginHorizontal: 15,
            marginVertical: 5,
            backgroundColor: Colors.background,
            borderColor: props.selected ? Colors.blue : Colors.grey400,
            borderWidth: 1,
            // borderWidth: 1

        },
        selectServiceItemPressable: {
            borderRadius: 8,
            paddingVertical: 0,
            paddingHorizontal: 0,
        },
        nameAndPriceContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
        },
        leftBar: {
            position: "absolute",
            backgroundColor: props.leftBarColor,
            width: 5,
            height: "100%",
            left: 0,
        },
        priceContainer: {
            flexDirection: "row",
            gap: 15,
        },
        lineThroughPrice: {
            textDecorationLine: "line-through",
            color: Colors.blue
        }
    });

    return <PrimaryButton buttonStyle={styles.selectServiceItemButton}
                          pressableStyle={styles.selectServiceItemPressable}
                          onPress={() => {
                              props.addToTempSelectedItems(props.data);
                              dispatch(addItemToCart(props.data));
                          }}
    >
        <View style={styles.leftBar}></View>
        <View style={styles.nameAndPriceContainer}>
            <Text style={textTheme.bodyMedium}>{props.data.name}</Text>

            <View style={styles.priceContainer}>
                {
                    props.data.discount === 0 ? <>
                        <Text style={[textTheme.titleSmall,]}>{"₹ " + props.data.price}</Text>
                    </> : <>
                        <Text style={[textTheme.titleSmall, styles.lineThroughPrice]}>{"₹ " + props.data.price}</Text>
                        <Text style={[textTheme.titleSmall,]}>{"₹ " + props.data.discounted_price}</Text>
                    </>
                }
            </View>
        </View>
    </PrimaryButton>

}


export default ServiceItem;