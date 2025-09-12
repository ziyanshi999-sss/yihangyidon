package io.dcloud.uniplugin;

import android.app.Activity;
import android.view.WindowManager;
import android.content.Context;
import android.util.Log;
import android.os.Build;

import com.alibaba.fastjson.JSONObject;

import io.dcloud.feature.uniapp.annotation.UniJSMethod;
import io.dcloud.feature.uniapp.bridge.UniJSCallback;
import io.dcloud.feature.uniapp.common.UniModule;

/**
 * Android防录屏插件
 * 使用FLAG_SECURE标志阻止截屏和录屏
 */
public class ScreenProtectorModule extends UniModule {
    
    private static final String TAG = "ScreenProtector";
    private boolean isProtectionEnabled = false;
    
    /**
     * 启用防录屏保护
     * 设置FLAG_SECURE标志，阻止截屏、录屏和在最近任务中显示内容
     */
    @UniJSMethod(uiThread = true)
    public void enableProtection(UniJSCallback callback) {
        try {
            Context context = mUniSDKInstance.getContext();
            Log.d(TAG, "========== 开始启用防录屏保护 ==========");
            Log.d(TAG, "API Level: " + Build.VERSION.SDK_INT);
            Log.d(TAG, "Device Model: " + Build.MODEL);
            Log.d(TAG, "Manufacturer: " + Build.MANUFACTURER);
            
            if (context instanceof Activity) {
                Activity activity = (Activity) context;
                Log.d(TAG, "Activity实例获取成功: " + activity.getClass().getSimpleName());
                
                // 获取Window对象
                android.view.Window window = activity.getWindow();
                if (window != null) {
                    Log.d(TAG, "Window对象获取成功");
                    
                    // 设置FLAG_SECURE标志
                    try {
                        window.addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                        Log.d(TAG, "FLAG_SECURE设置成功 - 0x" + Integer.toHexString(WindowManager.LayoutParams.FLAG_SECURE));
                        
                        // 验证标志是否已设置
                        int currentFlags = window.getAttributes().flags;
                        boolean isSecure = (currentFlags & WindowManager.LayoutParams.FLAG_SECURE) != 0;
                        Log.d(TAG, "FLAG_SECURE验证结果: " + isSecure);
                        Log.d(TAG, "当前Window标志: 0x" + Integer.toHexString(currentFlags));
                        
                        isProtectionEnabled = true;
                        
                        JSONObject result = new JSONObject();
                        result.put("success", true);
                        result.put("message", "Android防录屏保护已启用");
                        result.put("platform", "android");
                        result.put("method", "FLAG_SECURE");
                        result.put("apiLevel", Build.VERSION.SDK_INT);
                        result.put("deviceModel", Build.MODEL);
                        result.put("manufacturer", Build.MANUFACTURER);
                        result.put("flagVerified", isSecure);
                        result.put("windowFlags", "0x" + Integer.toHexString(currentFlags));
                        result.put("timestamp", System.currentTimeMillis());
                        
                        Log.d(TAG, "防录屏保护启用完成，返回结果: " + result.toString());
                        
                        if (callback != null) {
                            callback.invoke(result);
                        }
                        
                    } catch (Exception flagException) {
                        Log.e(TAG, "设置FLAG_SECURE失败", flagException);
                        JSONObject result = new JSONObject();
                        result.put("success", false);
                        result.put("message", "设置FLAG_SECURE失败: " + flagException.getMessage());
                        result.put("platform", "android");
                        result.put("error", flagException.getClass().getSimpleName());
                        result.put("apiLevel", Build.VERSION.SDK_INT);
                        
                        if (callback != null) {
                            callback.invoke(result);
                        }
                    }
                    
                } else {
                    Log.e(TAG, "Window对象为null");
                    JSONObject result = new JSONObject();
                    result.put("success", false);
                    result.put("message", "Window对象为null，无法设置防录屏");
                    result.put("platform", "android");
                    
                    if (callback != null) {
                        callback.invoke(result);
                    }
                }
            } else {
                Log.e(TAG, "Context不是Activity实例，类型: " + (context != null ? context.getClass().getSimpleName() : "null"));
                JSONObject result = new JSONObject();
                result.put("success", false);
                result.put("message", "Context不是Activity实例: " + (context != null ? context.getClass().getSimpleName() : "null"));
                result.put("platform", "android");
                
                if (callback != null) {
                    callback.invoke(result);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "启用防录屏保护失败", e);
            JSONObject result = new JSONObject();
            result.put("success", false);
            result.put("message", "启用失败: " + e.getMessage());
            result.put("platform", "android");
            result.put("error", e.getClass().getSimpleName());
            result.put("stackTrace", Log.getStackTraceString(e));
            
            if (callback != null) {
                callback.invoke(result);
            }
        }
    }
    
    /**
     * 禁用防录屏保护
     * 清除FLAG_SECURE标志，恢复正常的截屏和录屏功能
     */
    @UniJSMethod(uiThread = true)
    public void disableProtection(UniJSCallback callback) {
        try {
            Activity activity = mUniSDKInstance.getContext();
            if (activity != null) {
                // 清除FLAG_SECURE标志
                activity.getWindow().clearFlags(
                    WindowManager.LayoutParams.FLAG_SECURE
                );
                
                isProtectionEnabled = false;
                Log.d(TAG, "防录屏保护已禁用");
                
                JSONObject result = new JSONObject();
                result.put("success", true);
                result.put("message", "Android防录屏保护已禁用");
                result.put("platform", "android");
                
                if (callback != null) {
                    callback.invoke(result);
                }
            } else {
                Log.e(TAG, "Activity为空，无法禁用防录屏保护");
                JSONObject result = new JSONObject();
                result.put("success", false);
                result.put("message", "Activity为空，无法禁用防录屏保护");
                
                if (callback != null) {
                    callback.invoke(result);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "禁用防录屏保护失败", e);
            JSONObject result = new JSONObject();
            result.put("success", false);
            result.put("message", "禁用失败: " + e.getMessage());
            
            if (callback != null) {
                callback.invoke(result);
            }
        }
    }
    
    /**
     * 检查是否支持防录屏功能
     */
    @UniJSMethod
    public void isSupported(UniJSCallback callback) {
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("supported", true);
        result.put("platform", "android");
        result.put("version", android.os.Build.VERSION.SDK_INT);
        result.put("features", new String[]{"FLAG_SECURE", "防截屏", "防录屏", "防最近任务显示"});
        
        if (callback != null) {
            callback.invoke(result);
        }
    }
    
    /**
     * 获取当前保护状态
     */
    @UniJSMethod
    public void getStatus(UniJSCallback callback) {
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("isEnabled", isProtectionEnabled);
        result.put("platform", "android");
        result.put("sdkVersion", android.os.Build.VERSION.SDK_INT);
        
        if (callback != null) {
            callback.invoke(result);
        }
    }
    
    /**
     * 模拟截屏事件（用于测试）
     */
    @UniJSMethod
    public void simulateScreenshot(UniJSCallback callback) {
        JSONObject eventData = new JSONObject();
        eventData.put("type", "screenshot");
        eventData.put("timestamp", System.currentTimeMillis());
        eventData.put("platform", "android");
        eventData.put("simulated", true);
        
        // 触发全局事件
        mUniSDKInstance.fireGlobalEventCallback("screenshotDetected", eventData);
        
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("message", "截屏事件已模拟");
        
        if (callback != null) {
            callback.invoke(result);
        }
    }
    
    /**
     * 检查设备安全信息
     */
    @UniJSMethod
    public void getDeviceSecurityInfo(UniJSCallback callback) {
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("manufacturer", android.os.Build.MANUFACTURER);
        result.put("model", android.os.Build.MODEL);
        result.put("sdkVersion", android.os.Build.VERSION.SDK_INT);
        result.put("release", android.os.Build.VERSION.RELEASE);
        
        // 检查是否为开发者模式
        boolean isDeveloper = android.provider.Settings.Secure.getInt(
            mUniSDKInstance.getContext().getContentResolver(),
            android.provider.Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0
        ) != 0;
        result.put("isDeveloperMode", isDeveloper);
        
        if (callback != null) {
            callback.invoke(result);
        }
    }
    
    /**
     * 测试插件是否加载成功
     */
    @UniJSMethod
    public void testPlugin(UniJSCallback callback) {
        try {
            Log.d(TAG, "========== 防录屏插件测试开始 ==========");
            
            // 收集环境信息
            Context context = mUniSDKInstance.getContext();
            boolean isActivityContext = context instanceof Activity;
            
            Log.d(TAG, "插件类名: " + this.getClass().getName());
            Log.d(TAG, "Context类型: " + (context != null ? context.getClass().getSimpleName() : "null"));
            Log.d(TAG, "是否为Activity: " + isActivityContext);
            Log.d(TAG, "API Level: " + Build.VERSION.SDK_INT);
            Log.d(TAG, "设备型号: " + Build.MODEL);
            Log.d(TAG, "制造商: " + Build.MANUFACTURER);
            Log.d(TAG, "Android版本: " + Build.VERSION.RELEASE);
            
            // 测试Window访问
            String windowStatus = "无法访问";
            if (isActivityContext) {
                Activity activity = (Activity) context;
                android.view.Window window = activity.getWindow();
                if (window != null) {
                    windowStatus = "可以访问";
                    int currentFlags = window.getAttributes().flags;
                    Log.d(TAG, "当前Window标志: 0x" + Integer.toHexString(currentFlags));
                } else {
                    windowStatus = "Window为null";
                }
            }
            Log.d(TAG, "Window访问状态: " + windowStatus);
            
            // 测试FLAG_SECURE常量
            try {
                int flagSecureValue = WindowManager.LayoutParams.FLAG_SECURE;
                Log.d(TAG, "FLAG_SECURE常量值: 0x" + Integer.toHexString(flagSecureValue));
            } catch (Exception flagEx) {
                Log.e(TAG, "无法访问FLAG_SECURE常量", flagEx);
            }
            
            JSONObject result = new JSONObject();
            result.put("success", true);
            result.put("message", "防录屏插件加载成功 - 详细环境信息已输出到日志");
            result.put("platform", "android");
            result.put("pluginVersion", "1.1.0");
            result.put("apiLevel", Build.VERSION.SDK_INT);
            result.put("deviceModel", Build.MODEL);
            result.put("manufacturer", Build.MANUFACTURER);
            result.put("androidVersion", Build.VERSION.RELEASE);
            result.put("isActivityContext", isActivityContext);
            result.put("windowStatus", windowStatus);
            result.put("flagSecureValue", "0x" + Integer.toHexString(WindowManager.LayoutParams.FLAG_SECURE));
            result.put("timestamp", System.currentTimeMillis());
            
            Log.d(TAG, "插件测试完成，返回结果: " + result.toString());
            
            if (callback != null) {
                callback.invoke(result);
            }
        } catch (Exception e) {
            Log.e(TAG, "插件测试失败", e);
            JSONObject result = new JSONObject();
            result.put("success", false);
            result.put("message", "插件测试失败: " + e.getMessage());
            result.put("platform", "android");
            result.put("error", e.getClass().getSimpleName());
            result.put("stackTrace", Log.getStackTraceString(e));
            
            if (callback != null) {
                callback.invoke(result);
            }
        }
    }
}
