import {StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";


const ProductItem = (props) => {
    const dispatch = useDispatch();


    const styles = StyleSheet.create({
        selectProductItemButton: {
            borderWidth: 1,
            borderColor: props.selected ? Colors.blue : Colors.grey400,
            borderRadius: 8,
            marginHorizontal: 15,
            marginVertical: 5,
            backgroundColor: props.data.showAlert ? Colors.errorContainer : Colors.background,
        },
        selectProductItemPressable: {
            borderRadius: 8,
            paddingVertical: 15,
            paddingHorizontal: 25,
            gap: 7,
        },
        nameAndPriceContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between"
        },
        nameText: {
            color: props.data.showAlert ? Colors.white : Colors.black,
        },
        priceContainer: {
            flexDirection: "row",
            gap: 15,
        },
        priceText: {
            color: props.data.showAlert ? Colors.white : Colors.black,
        },
        lineThroughPrice: {
            textDecorationLine: "line-through",
            color: props.data.showAlert ? Colors.white : Colors.highlight
        },
        bottomLineText: {
            alignSelf: "flex-start",
            color: props.data.showAlert ? Colors.white : Colors.grey600
        },
        boldText: {
            fontWeight: "bold",
            color: props.data.showAlert ? Colors.white : Colors.black
        }
    });

    return <PrimaryButton buttonStyle={styles.selectProductItemButton}
            pressableStyle={styles.selectProductItemPressable}
            onPress={() => {
                props.closeOverallModal()
                dispatch(addItemToCart({product_id: props.data.id, quantity: 1}));
            }}
    >
        <View style={styles.nameAndPriceContainer}>
            <Text style={[textTheme.bodyMedium, styles.nameText]}>{props.data.name}</Text>
            <View style={styles.priceContainer}>
                {
                    props.data.price === props.data.discounted_price ? <>
                        <Text style={[textTheme.titleSmall, styles.priceText]}>{"₹ " + (props.data.price).toFixed(2)}</Text>
                    </> : <>
                        <Text style={[textTheme.titleSmall, styles.lineThroughPrice]}>{"₹ " + (props.data.price).toFixed(2)}</Text>
                        <Text
                            style={[textTheme.titleSmall, styles.priceText]}>{"₹ " + (props.data.discounted_price).toFixed(2)}</Text>
                    </>
                }
            </View>
        </View>
        <Text style={styles.bottomLineText}>
            {props.data.barCode !== "" ? props.data.barCode + " •" : null}
            {props.data.available_quantity === 0
                ? "NO STOCK"
                : props.data.available_quantity > 0 ? (
                    <>
                        <Text style={styles.boldText}>{props.data.available_quantity}</Text> {" IN STOCK"}
                    </>
                ) : (
                    "UNLIMITED STOCK"
                )}
        </Text>
    </PrimaryButton>

}

export default ProductItem;