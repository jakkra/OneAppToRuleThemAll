package com.reminders;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package
import android.content.Intent; // <--- Import Intent



import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private Application mApplication = this;
  private ReactNativePushNotificationPackage mReactNativePushNotificationPackage; // <------ Add Package Variable

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(); // <------ Initialize the Package

      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactMaterialKitPackage(),
          new VectorIconsPackage(),
          mReactNativePushNotificationPackage
      );
    }
  };

  // Add onNewIntent
 public void onNewIntent(Intent intent) {
    if ( mReactNativePushNotificationPackage != null ) {
        mReactNativePushNotificationPackage.newIntent(intent);
    }
 }
  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
