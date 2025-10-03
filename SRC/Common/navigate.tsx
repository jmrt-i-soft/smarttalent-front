import { CommonActions, NavigationProp, ParamListBase } from "@react-navigation/native"
import { BackHandler } from "react-native"

export const goBack = async (navigation: NavigationProp<ParamListBase>) => {
    // AsyncStorage.removeItem(ASYNC_STORAGES.NOTIFICATION_DATA)
    if (navigation.canGoBack()) {
        return navigation.goBack()
    } else {
        return BackHandler.exitApp()
    }
}

export const navigate = (
    navigation: NavigationProp<ParamListBase>,
    routeNames: string,
) => {
    return navigation.navigate(routeNames)
}


export const navigateParams = (
    navigation: NavigationProp<ParamListBase>,
    routeNames: string,
    params?: Object
) => {
    return navigation.navigate(routeNames, params)
}

export const nestingNavigateParams = (
    navigation: NavigationProp<ParamListBase>,
    parentRouteNames: string,
    childRouteNames: string,
    params?: Object
) => {
    return navigation.navigate(parentRouteNames, {
        screen: childRouteNames, params
    });
}


export const nestingNavigate = (
    navigation: NavigationProp<ParamListBase>,
    parentRouteNames: string,
    childRouteNames: string,
) => {
    return navigation.navigate(parentRouteNames, {
        screen: childRouteNames
    });
}


export const navigateReset = (
    navigation: NavigationProp<ParamListBase>,
    routeNames: string,
) => {

    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [{ name: routeNames }],     // your screen name
            // params: {
            //     user: 'jane',     //your params
            // },
        })
    )

}

export const navigateResetParam = (
    navigation: NavigationProp<ParamListBase>,
    routeNames: string,
    params: object
) => {
    navigation.dispatch(
        CommonActions.navigate({
            name: routeNames,     // your screen name
            params
            // params: {
            //     user: 'jane',     //your params
            // },
        })
    );
}
