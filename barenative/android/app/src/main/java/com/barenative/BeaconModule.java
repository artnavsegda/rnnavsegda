package com.barenative;

import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconConsumer;
import org.altbeacon.beacon.BeaconManager;
import org.altbeacon.beacon.MonitorNotifier;
import org.altbeacon.beacon.Region;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.Identifier;

import android.os.RemoteException;
import android.util.Log;

public class BeaconModule extends ReactContextBaseJavaModule implements BeaconConsumer {
    private static final String TAG = "BeaconModule";
    private BeaconManager beaconManager;
    private Context mApplicationContext;
    private ReactApplicationContext mReactContext;
    BeaconModule(ReactApplicationContext context) {
        super(context);
        this.mReactContext = context;
    }

    @Override
    public void initialize() {
        Log.i(TAG, "Start!");
        this.mApplicationContext = this.mReactContext.getApplicationContext();
        this.beaconManager = BeaconManager.getInstanceForApplication(mApplicationContext);
        // need to bind at instantiation so that service loads (to test more)
        beaconManager.getBeaconParsers().clear();
        beaconManager.getBeaconParsers().add(new BeaconParser().setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24"));
        beaconManager.setDebug(true);
        beaconManager.bind(this);
    }

    @Override
    public String getName() {
        return "BeaconModule";
    }

    @ReactMethod
    public void startMonitoringForRegion(String location) {
        Log.d("BeaconModule", "startMonitoringForRegion for location " + location);
    }

    @Override
    public void onBeaconServiceConnect() {
        Log.i(TAG, "onBeaconServiceConnect");
        beaconManager.removeAllMonitorNotifiers();
        beaconManager.addMonitorNotifier(new MonitorNotifier() {
            @Override
            public void didEnterRegion(Region region) {
                Log.i(TAG, "I just saw an beacon for the first time!");
            }

            @Override
            public void didExitRegion(Region region) {
                Log.i(TAG, "I no longer see an beacon");
            }

            @Override
            public void didDetermineStateForRegion(int state, Region region) {
                Log.i(TAG, "I have just switched from seeing/not seeing beacons: "+state);
            }
        });

        Identifier identifier = Identifier.parse("C7C1A1BF-BB00-4CAD-8704-9F2D2917DED2"); //beacon 1

        try {
            beaconManager.startMonitoringBeaconsInRegion(new Region("myMonitoringUniqueId", identifier, null, null));
        } catch (RemoteException e) {    }
    }

    @Override
    public Context getApplicationContext() {
        return mApplicationContext;
    }

    @Override
    public void unbindService(ServiceConnection serviceConnection) {
        mApplicationContext.unbindService(serviceConnection);
    }

    @Override
    public boolean bindService(Intent intent, ServiceConnection serviceConnection, int i) {
        return mApplicationContext.bindService(intent, serviceConnection, i);
    }
}
