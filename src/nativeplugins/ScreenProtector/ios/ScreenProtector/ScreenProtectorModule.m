//
//  ScreenProtectorModule.m
//  ScreenProtector
//
//  iOS防录屏插件实现
//

#import "ScreenProtectorModule.h"
#import <UIKit/UIKit.h>

@interface ScreenProtectorModule ()

@property (nonatomic, assign) BOOL isProtectionEnabled;
@property (nonatomic, strong) UIView *protectionOverlay;

@end

@implementation ScreenProtectorModule

- (instancetype)init {
    self = [super init];
    if (self) {
        _isProtectionEnabled = NO;
        _protectionOverlay = nil;
    }
    return self;
}

/**
 * 启用防录屏保护
 * iOS通过监听录屏和截屏事件来实现保护
 */
- (void)enableProtection:(UniModuleKeepAliveCallback)callback {
    @try {
        // 监听录屏状态变化
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(screenRecordingChanged:)
                                                     name:UIScreenCapturedDidChangeNotification
                                                   object:nil];
        
        // 监听截屏事件
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(userDidTakeScreenshot:)
                                                     name:UIApplicationUserDidTakeScreenshotNotification
                                                   object:nil];
        
        // 监听应用进入后台
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationDidEnterBackground:)
                                                     name:UIApplicationDidEnterBackgroundNotification
                                                   object:nil];
        
        // 监听应用将要进入前台
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationWillEnterForeground:)
                                                     name:UIApplicationWillEnterForegroundNotification
                                                   object:nil];
        
        self.isProtectionEnabled = YES;
        
        NSLog(@"[ScreenProtector] iOS防录屏保护已启用");
        
        NSDictionary *result = @{
            @"success": @YES,
            @"message": @"iOS防录屏监听已启用",
            @"platform": @"ios",
            @"features": @[@"录屏检测", @"截屏检测", @"后台保护"]
        };
        
        if (callback) {
            callback(result, NO);
        }
    } @catch (NSException *exception) {
        NSLog(@"[ScreenProtector] 启用防录屏保护失败: %@", exception.reason);
        
        NSDictionary *result = @{
            @"success": @NO,
            @"message": [NSString stringWithFormat:@"启用失败: %@", exception.reason]
        };
        
        if (callback) {
            callback(result, NO);
        }
    }
}

/**
 * 禁用防录屏保护
 */
- (void)disableProtection:(UniModuleKeepAliveCallback)callback {
    @try {
        // 移除所有通知监听
        [[NSNotificationCenter defaultCenter] removeObserver:self];
        
        // 移除保护遮罩
        [self removeProtectionOverlay];
        
        self.isProtectionEnabled = NO;
        
        NSLog(@"[ScreenProtector] iOS防录屏保护已禁用");
        
        NSDictionary *result = @{
            @"success": @YES,
            @"message": @"iOS防录屏监听已禁用",
            @"platform": @"ios"
        };
        
        if (callback) {
            callback(result, NO);
        }
    } @catch (NSException *exception) {
        NSLog(@"[ScreenProtector] 禁用防录屏保护失败: %@", exception.reason);
        
        NSDictionary *result = @{
            @"success": @NO,
            @"message": [NSString stringWithFormat:@"禁用失败: %@", exception.reason]
        };
        
        if (callback) {
            callback(result, NO);
        }
    }
}

/**
 * 检查是否支持防录屏功能
 */
- (void)isSupported:(UniModuleKeepAliveCallback)callback {
    // 检查iOS版本，iOS 11.0+ 支持录屏检测
    BOOL supportsRecordingDetection = @available(iOS 11.0, *);
    
    NSDictionary *result = @{
        @"success": @YES,
        @"supported": @YES,
        @"platform": @"ios",
        @"iosVersion": [[UIDevice currentDevice] systemVersion],
        @"supportsRecordingDetection": @(supportsRecordingDetection),
        @"features": @[@"截屏检测", @"录屏检测", @"后台保护"]
    };
    
    if (callback) {
        callback(result, NO);
    }
}

/**
 * 获取当前保护状态
 */
- (void)getStatus:(UniModuleKeepAliveCallback)callback {
    NSDictionary *result = @{
        @"success": @YES,
        @"isEnabled": @(self.isProtectionEnabled),
        @"platform": @"ios",
        @"iosVersion": [[UIDevice currentDevice] systemVersion],
        @"isRecording": @([UIScreen mainScreen].isCaptured)
    };
    
    if (callback) {
        callback(result, NO);
    }
}

/**
 * 模拟截屏事件（用于测试）
 */
- (void)simulateScreenshot:(UniModuleKeepAliveCallback)callback {
    NSDictionary *eventData = @{
        @"type": @"screenshot",
        @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000),
        @"platform": @"ios",
        @"simulated": @YES
    };
    
    // 触发全局事件
    [self fireGlobalEvent:@"screenshotDetected" params:eventData];
    
    NSDictionary *result = @{
        @"success": @YES,
        @"message": @"截屏事件已模拟"
    };
    
    if (callback) {
        callback(result, NO);
    }
}

/**
 * 获取设备安全信息
 */
- (void)getDeviceSecurityInfo:(UniModuleKeepAliveCallback)callback {
    UIDevice *device = [UIDevice currentDevice];
    
    NSDictionary *result = @{
        @"success": @YES,
        @"model": device.model,
        @"systemName": device.systemName,
        @"systemVersion": device.systemVersion,
        @"name": device.name,
        @"isJailbroken": @([self isDeviceJailbroken])
    };
    
    if (callback) {
        callback(result, NO);
    }
}

#pragma mark - Notification Handlers

/**
 * 录屏状态改变处理
 */
- (void)screenRecordingChanged:(NSNotification *)notification {
    BOOL isCaptured = [UIScreen mainScreen].isCaptured;
    
    NSLog(@"[ScreenProtector] 录屏状态改变: %@", isCaptured ? @"开始录屏" : @"停止录屏");
    
    NSDictionary *eventData = @{
        @"type": @"recording",
        @"status": isCaptured ? @"started" : @"stopped",
        @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000),
        @"platform": @"ios"
    };
    
    // 触发全局事件
    [self fireGlobalEvent:@"screenRecordingDetected" params:eventData];
    
    if (isCaptured) {
        // 录屏开始时可以添加保护措施
        [self showProtectionWarning:@"检测到录屏行为，为保护您的隐私安全，请停止录屏操作。"];
    }
}

/**
 * 截屏事件处理
 */
- (void)userDidTakeScreenshot:(NSNotification *)notification {
    NSLog(@"[ScreenProtector] 检测到截屏");
    
    NSDictionary *eventData = @{
        @"type": @"screenshot",
        @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000),
        @"platform": @"ios"
    };
    
    // 触发全局事件
    [self fireGlobalEvent:@"screenshotDetected" params:eventData];
    
    // 显示警告
    [self showProtectionWarning:@"检测到截屏行为，该操作已被记录。"];
}

/**
 * 应用进入后台处理
 */
- (void)applicationDidEnterBackground:(NSNotification *)notification {
    if (self.isProtectionEnabled) {
        NSLog(@"[ScreenProtector] 应用进入后台，添加隐私保护");
        [self addProtectionOverlay];
    }
}

/**
 * 应用将要进入前台处理
 */
- (void)applicationWillEnterForeground:(NSNotification *)notification {
    if (self.isProtectionEnabled) {
        NSLog(@"[ScreenProtector] 应用进入前台，移除隐私保护");
        [self removeProtectionOverlay];
    }
}

#pragma mark - Private Methods

/**
 * 添加保护遮罩（防止在后台任务切换时显示敏感内容）
 */
- (void)addProtectionOverlay {
    if (self.protectionOverlay) {
        return;
    }
    
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    if (!keyWindow) {
        return;
    }
    
    self.protectionOverlay = [[UIView alloc] initWithFrame:keyWindow.bounds];
    self.protectionOverlay.backgroundColor = [UIColor whiteColor];
    self.protectionOverlay.alpha = 1.0;
    
    // 添加Logo或提示文字
    UILabel *label = [[UILabel alloc] init];
    label.text = @"银行APP\n隐私保护中";
    label.textAlignment = NSTextAlignmentCenter;
    label.numberOfLines = 0;
    label.font = [UIFont systemFontOfSize:24 weight:UIFontWeightMedium];
    label.textColor = [UIColor grayColor];
    label.translatesAutoresizingMaskIntoConstraints = NO;
    
    [self.protectionOverlay addSubview:label];
    
    // 居中约束
    [NSLayoutConstraint activateConstraints:@[
        [label.centerXAnchor constraintEqualToAnchor:self.protectionOverlay.centerXAnchor],
        [label.centerYAnchor constraintEqualToAnchor:self.protectionOverlay.centerYAnchor]
    ]];
    
    [keyWindow addSubview:self.protectionOverlay];
}

/**
 * 移除保护遮罩
 */
- (void)removeProtectionOverlay {
    if (self.protectionOverlay) {
        [self.protectionOverlay removeFromSuperview];
        self.protectionOverlay = nil;
    }
}

/**
 * 显示保护警告
 */
- (void)showProtectionWarning:(NSString *)message {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"安全提示"
                                                                       message:message
                                                                preferredStyle:UIAlertControllerStyleAlert];
        
        UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"知道了"
                                                           style:UIAlertActionStyleDefault
                                                         handler:nil];
        
        [alert addAction:okAction];
        
        UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        if (rootViewController) {
            [rootViewController presentViewController:alert animated:YES completion:nil];
        }
    });
}

/**
 * 检查设备是否越狱
 */
- (BOOL)isDeviceJailbroken {
    // 简单的越狱检测
    NSArray *jailbreakPaths = @[
        @"/Applications/Cydia.app",
        @"/Library/MobileSubstrate/MobileSubstrate.dylib",
        @"/bin/bash",
        @"/usr/sbin/sshd",
        @"/etc/apt"
    ];
    
    for (NSString *path in jailbreakPaths) {
        if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
            return YES;
        }
    }
    
    return NO;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeProtectionOverlay];
}

@end
