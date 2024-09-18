import { ActivityIndicator, FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import React, { useEffect, useState, useLayoutEffect } from "react";
import ServiceItem from "./ServiceItem";
import ProductItem from "./ProductItem";
import axios from "axios";
import MembershipItem from "./MembershipItem";
import { useSelector } from "react-redux";
import PackageItem from "./PackageItem";
import SearchBar from "../../ui/SearchBar";
import EditMembershipModal from "./EditMembershipModal";

const MembershipsAndPackagesList = (props) => {
    const data = useSelector(state => props.category === "memberships" ? state.catalogue.memberships.items : state.catalogue.packages.items);
    const [filteredData, setFilteredData] = useState(data);


    const searchData = (searchValue) => {
        const lowerCaseFilterValue = searchValue.toLowerCase();
        setFilteredData(data.filter(item => {
            if (props.category === "memberships")
                return item.name.toLowerCase().includes(searchValue) || item.price.toString().includes(searchValue)
            else
                return item.name.toLowerCase().includes(searchValue) || item.price.toString().includes(searchValue) || item.package_cost.toString().includes(searchValue)

        }))
    };

    return (
        <>
            <View style={styles.commonSelectTemplate}>
                <View style={styles.headingAndSearchContainer}>
                    {
                        filteredData.length !== 0 ?
                            <>
                                <Text
                                    style={[textTheme.titleMedium, styles.headingText]}>Select {props.category === "packages" ? "Package" : "Membership"}</Text>
                                <SearchBar filter={true}
                                    onPressFilter={() => {
                                    }}
                                    onChangeText={searchData}
                                    placeholder={"Search by name or prices"} />
                            </>
                            : null
                    }
                </View>
                {
                    filteredData.length === 0 ? <View style={styles.noDataMessage}>
                        {
                            props.category === "memberships" ?
                                <Text style={[TextTheme.titleMedium, styles.message]}>
                                    No Memberships Available
                                </Text>
                                :
                                <Text style={[TextTheme.titleMedium, styles.message]}>
                                    No Packages Available
                                </Text>
                        }
                    </View> :
                        <FlatList
                            data={filteredData}
                            renderItem={({ item }) => {
                                return (props.category === "memberships" ?
                                    <MembershipItem data={item}
                                        closeOverallModal={props.closeOverallModal}
                                    /> :
                                    <PackageItem data={item}
                                        closeOverallModal={props.closeOverallModal}
                                    />)
                            }}
                            keyExtractor={(item) => item.id.toString()}
                        />

                }
            </View>
        </>


    );
};

const styles = StyleSheet.create({
    commonSelectTemplate: {
        flex: 1,
    },
    headingAndSearchContainer: {
        padding: 15,
    },
    headingText: {
        marginBottom: 10
    },
    parentCategoryText: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    flatListContainer: {
        marginBottom: 120,
    },
    noDataMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "-40%"
        // position:'absolute',
        // top:"50%",
        // left:"50%",
        // transform: [{ translateX: -50 }, { translateY: -50 }],
    },
});

export default MembershipsAndPackagesList;