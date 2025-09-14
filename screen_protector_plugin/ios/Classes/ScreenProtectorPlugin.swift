import Flutter
import UIKit
import AVFoundation

public class ScreenProtectorPlugin: NSObject, FlutterPlugin, FlutterStreamHandler {
    private var eventSink: FlutterEventSink?
    private var isProtectionEnabled = false
    private var detectionTimer: Timer?

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
            enableProtection()
            result(["success": true, "message": "iOS防录屏保护已启用"])
        case "disableSecure":
            disableProtection()
            result(["success": true, "message": "iOS防录屏保护已禁用"])
        case "enableEnhancedProtection":
            enableEnhancedProtection()
            result(["success": true, "message": "iOS增强防录屏保护已启用"])
        case "detectSecurityThreats":
            detectSecurityThreats(result: result)
        case "testPlugin":
            testPlugin(result: result)
        default:
            result(FlutterMethodNotImplemented)
        }
    }

    private func enableProtection() {
        print("🛡️ 启用iOS防录屏保护")
        
        // 监听屏幕录制状态变化
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenCaptureChanged),
            name: UIScreen.capturedDidChangeNotification,
            object: nil
        )
        
        // 监听截屏事件
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(userDidTakeScreenshot),
            name: UIApplication.userDidTakeScreenshotNotification,
            object: nil
        )
        
        // 监听应用状态变化
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillResignActive),
            name: UIApplication.willResignActiveNotification,
            object: nil
        )
        
        isProtectionEnabled = true
        print("✅ iOS防录屏保护已启用")
    }

    private func enableEnhancedProtection() {
        print("🛡️ 启用iOS增强防录屏保护")
        
        // 启用基础保护
        enableProtection()
        
        // 启动定期检测
        startPeriodicDetection()
        
        // 检测当前屏幕录制状态
        checkCurrentScreenCaptureStatus()
        
        print("✅ iOS增强防录屏保护已启用")
    }

    private func startPeriodicDetection() {
        detectionTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
            self.performPeriodicSecurityCheck()
        }
    }

    private func performPeriodicSecurityCheck() {
        // 检查屏幕录制状态
        if UIScreen.main.isCaptured {
            print("🚨 检测到屏幕录制")
            eventSink?([
                "type": "recording",
                "timestamp": Date().timeIntervalSince1970 * 1000,
                "method": "periodic_check"
            ])
        }
        
        // 检查应用状态
        if UIApplication.shared.applicationState != .active {
            print("🔍 应用不在前台")
            eventSink?([
                "type": "app_background",
                "timestamp": Date().timeIntervalSince1970 * 1000,
                "state": "background"
            ])
        }
    }

    private func checkCurrentScreenCaptureStatus() {
        if UIScreen.main.isCaptured {
            print("🚨 当前正在屏幕录制")
            eventSink?([
                "type": "recording",
                "timestamp": Date().timeIntervalSince1970 * 1000,
                "method": "initial_check"
            ])
        }
    }

    private func disableProtection() {
        print("🔓 禁用iOS防录屏保护")
        
        NotificationCenter.default.removeObserver(self)
        detectionTimer?.invalidate()
        detectionTimer = nil
        isProtectionEnabled = false
        
        print("✅ iOS防录屏保护已禁用")
    }

    private func detectSecurityThreats(result: @escaping FlutterResult) {
        print("🔍 检测iOS安全威胁")
        
        var securityChecks: [String: Any] = [:]
        
        // 检查是否在模拟器中运行
        #if targetEnvironment(simulator)
        securityChecks["isSimulator"] = true
        #else
        securityChecks["isSimulator"] = false
        #endif
        
        // 检查越狱状态
        securityChecks["isJailbroken"] = isJailbroken()
        
        // 检查调试状态
        securityChecks["isDebugging"] = isDebugging()
        
        // 检查屏幕录制状态
        securityChecks["isScreenRecording"] = UIScreen.main.isCaptured
        
        // 计算风险等级
        let riskLevel = calculateRiskLevel(securityChecks)
        securityChecks["riskLevel"] = riskLevel
        
        let response = [
            "success": true,
            "platform": "ios",
            "securityChecks": securityChecks,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ] as [String : Any]
        
        print("🔍 安全威胁检测完成: \(response)")
        result(response)
    }

    private func isJailbroken() -> Bool {
        // 检查常见的越狱文件路径
        let jailbreakPaths = [
            "/Applications/Cydia.app",
            "/Library/MobileSubstrate/MobileSubstrate.dylib",
            "/bin/bash",
            "/usr/sbin/sshd",
            "/etc/apt",
            "/private/var/lib/apt/"
        ]
        
        for path in jailbreakPaths {
            if FileManager.default.fileExists(atPath: path) {
                return true
            }
        }
        
        // 检查是否可以写入系统目录
        let testString = "jailbreak_test"
        do {
            try testString.write(toFile: "/private/jailbreak_test.txt", atomically: true, encoding: .utf8)
            try FileManager.default.removeItem(atPath: "/private/jailbreak_test.txt")
            return true
        } catch {
            return false
        }
    }

    private func isDebugging() -> Bool {
        var info = kinfo_proc()
        var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
        var size = MemoryLayout<kinfo_proc>.stride
        let result = sysctl(&mib, u_int(mib.count), &info, &size, nil, 0)
        
        if result != 0 {
            return false
        }
        
        return (info.kp_proc.p_flag & P_TRACED) != 0
    }

    private func calculateRiskLevel(_ checks: [String: Any]) -> String {
        var riskScore = 0
        
        if let isSimulator = checks["isSimulator"] as? Bool, isSimulator {
            riskScore += 3
        }
        
        if let isJailbroken = checks["isJailbroken"] as? Bool, isJailbroken {
            riskScore += 4
        }
        
        if let isDebugging = checks["isDebugging"] as? Bool, isDebugging {
            riskScore += 2
        }
        
        if let isScreenRecording = checks["isScreenRecording"] as? Bool, isScreenRecording {
            riskScore += 3
        }
        
        if riskScore >= 6 {
            return "HIGH"
        } else if riskScore >= 3 {
            return "MEDIUM"
        } else {
            return "LOW"
        }
    }

    private func testPlugin(result: @escaping FlutterResult) {
        print("🧪 测试iOS防录屏插件")
        
        let response = [
            "success": true,
            "message": "iOS防录屏插件加载成功",
            "platform": "ios",
            "pluginVersion": "1.2.0",
            "iosVersion": UIDevice.current.systemVersion,
            "deviceModel": UIDevice.current.model,
            "isProtectionEnabled": isProtectionEnabled,
            "timestamp": Date().timeIntervalSince1970 * 1000
        ] as [String : Any]
        
        print("🧪 插件测试完成: \(response)")
        result(response)
    }

    @objc func screenCaptureChanged() {
        if UIScreen.main.isCaptured {
            print("🚨 检测到屏幕录制开始")
            eventSink?([
                "type": "recording",
                "timestamp": Date().timeIntervalSince1970 * 1000,
                "method": "notification"
            ])
        } else {
            print("✅ 屏幕录制已停止")
            eventSink?([
                "type": "recording_stopped",
                "timestamp": Date().timeIntervalSince1970 * 1000,
                "method": "notification"
            ])
        }
    }

    @objc func userDidTakeScreenshot() {
        print("📸 检测到截屏")
        eventSink?([
            "type": "screenshot",
            "timestamp": Date().timeIntervalSince1970 * 1000,
            "method": "notification"
        ])
    }

    @objc func applicationDidBecomeActive() {
        print("📱 应用进入前台")
        eventSink?([
            "type": "app_foreground",
            "timestamp": Date().timeIntervalSince1970 * 1000,
            "state": "active"
        ])
    }

    @objc func applicationWillResignActive() {
        print("📱 应用进入后台")
        eventSink?([
            "type": "app_background",
            "timestamp": Date().timeIntervalSince1970 * 1000,
            "state": "inactive"
        ])
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
