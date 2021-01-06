import { BleManager } from 'react-native-ble-plx'

export default manager = new BleManager()

const subscription = manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
        subscription.remove()
    }
    else
        console.log("BLE: " + JSON.stringify(state))
}, true)
