//
//  ScreenProtectorModule.h
//  ScreenProtector
//
//  iOS防录屏插件头文件
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "DCUniModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface ScreenProtectorModule : DCUniModule

/**
 * 启用防录屏保护
 */
- (void)enableProtection:(UniModuleKeepAliveCallback)callback;

/**
 * 禁用防录屏保护
 */
- (void)disableProtection:(UniModuleKeepAliveCallback)callback;

/**
 * 检查是否支持防录屏功能
 */
- (void)isSupported:(UniModuleKeepAliveCallback)callback;

/**
 * 获取当前保护状态
 */
- (void)getStatus:(UniModuleKeepAliveCallback)callback;

/**
 * 模拟截屏事件（用于测试）
 */
- (void)simulateScreenshot:(UniModuleKeepAliveCallback)callback;

/**
 * 获取设备安全信息
 */
- (void)getDeviceSecurityInfo:(UniModuleKeepAliveCallback)callback;

@end

NS_ASSUME_NONNULL_END
