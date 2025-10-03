import AsyncStorage from "@react-native-async-storage/async-storage"
import { ASYNC_STORAGES } from "./Storage"

export const getdata = async (keyname:string) => {
    const data = await AsyncStorage.getItem(keyname)
    return data ;
}

export const savedata = async (keyname:string,data:any) => {
    const data2 = await AsyncStorage.setItem(keyname,data)
    return true ;
}

export const deletekeydata = async (keyname:string) => {
    const data2 = await AsyncStorage.removeItem(keyname)
    return true ;
}

export const deletedata = async () => {
    const data2 = await AsyncStorage.clear()
    return true ;
}