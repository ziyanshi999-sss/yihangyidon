import Flutter
import UIKit

public class ScreenProtectorPlugin: NSObject, FlutterPlugin, FlutterStreamHandler {
    private var eventSink: FlutterEventSink?

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "screen_protector", binaryMessenger: registrar.messenger())
        let instance = ScreenProtectorPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)

        let eventChannel = FlutterEventChannel(name: "screen_protector/screenshot", binaryMessenger: registrar.messenger())
        eventChannel.setStreamHandler(instance)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "enableSecure":
            NotificationCenter.default.addObserver(self, selector: #selector(screenCaptureChanged), name: UIScreen.capturedDidChangeNotification, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(userDidTakeScreenshot), name: UIApplication.userDidTakeScreenshotNotification, object: nil)
            result(nil)
        case "disableSecure":
            NotificationCenter.default.removeObserver(self)
            result(nil)
        default:
            result(FlutterMethodNotImplemented)
        }
    }

    @objc func screenCaptureChanged() {
        if UIScreen.main.isCaptured {
            eventSink?(["type": "recording"])
        }
    }

    @objc func userDidTakeScreenshot() {
        eventSink?(["type": "screenshot"])
    }

    public func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        self.eventSink = events
        return nil
    }

    public func onCancel(withArguments arguments: Any?) -> FlutterError? {
        self.eventSink = nil
        return nil
    }
}
