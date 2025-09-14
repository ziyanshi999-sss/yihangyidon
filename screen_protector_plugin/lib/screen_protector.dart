import 'dart:async';
import 'package:flutter/services.dart';

class ScreenProtector {
  static const MethodChannel _channel = MethodChannel('screen_protector');
  static const EventChannel _screenshotEvent = EventChannel('screen_protector/screenshot');

  /// 启用防录屏、截屏
  static Future<void> enableSecure() async {
    await _channel.invokeMethod('enableSecure');
  }

  /// 关闭防录屏、截屏
  static Future<void> disableSecure() async {
    await _channel.invokeMethod('disableSecure');
  }

  /// 监听截屏事件
  static Stream<void> onScreenshot() {
    return _screenshotEvent.receiveBroadcastStream().map((_) => null);
  }
}
