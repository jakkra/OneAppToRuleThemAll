package com.reminders;

import com.facebook.react.ReactActivity;
import com.zyu.ReactNativeWheelPickerPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import android.content.Intent; // <--- Import Intent
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Reminders";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        ((MainApplication) getApplication()).onNewIntent(intent);
    }
}
