package com.nhello;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BeaconModule extends ReactContextBaseJavaModule {
    public String getName() {
        return "BeaconModule";
    }

    BeaconModule(ReactApplicationContext context) {
        super(context);
    }
}
