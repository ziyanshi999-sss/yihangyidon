# 防录屏插件混淆规则
-keep class io.dcloud.uniplugin.ScreenProtectorModule { *; }
-keep class com.alibaba.fastjson.** { *; }
-dontwarn com.alibaba.fastjson.**

# 保持UniApp相关类
-keep class io.dcloud.feature.uniapp.** { *; }
-dontwarn io.dcloud.feature.uniapp.**

# 保持Android系统API
-keep class android.view.WindowManager { *; }
-keep class android.view.WindowManager$LayoutParams { *; }
