package com.my.package;

import android.os.Bundle;
import android.content.Context;
import android.content.Intent;
import android.app.Activity;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;

public class BridgeModule extends ReactContextBaseJavaModule {
    static final int VIDEO_PROGRESS_REQUEST = 13214;  // The request code
    private static final String E_FAILED_TO_SHOW_VIDEO = "E_FAILED_TO_SHOW_VIDEO";

    private Promise mBridgePromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == VIDEO_PROGRESS_REQUEST) {
                if (mBridgePromise != null) {
                    if (resultCode == Activity.RESULT_OK) {
                        int position = intent.getIntExtra("VIDEO_POSITION", -1);
                        Context context = getReactApplicationContext();
                        if (position <= 0) {
                            mBridgePromise.resolve(0);
                        } else {
                            mBridgePromise.resolve(position);
                        }
                    }
                    mBridgePromise = null;
                }
            }
        }
    };

    public BridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "BridgeModule";
    }

    @ReactMethod
    public void showFullscreen(String videoUri, int position, final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        Context context = getReactApplicationContext();

        // Store the promise to resolve/reject when video returns data
        mBridgePromise = promise;

        try {
            Intent intent = new Intent(context, VideoActivity.class); // mContext got from your overriden constructor
            Bundle extras = new Bundle();
            extras.putString("VIDEO_URL",videoUri);
            extras.putInt("VIDEO_POSITION",position);
            intent.putExtras(extras);
            currentActivity.startActivityForResult(intent, VIDEO_PROGRESS_REQUEST);
        } catch (Exception e) {
            mBridgePromise.reject(E_FAILED_TO_SHOW_VIDEO, e);
            mBridgePromise = null;
        }
    }
}
