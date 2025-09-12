#!/usr/bin/env node

/**
 * 微信小程序AppID快速修复脚本
 * 使用方法: node fix-appid.js [新的AppID]
 */

const fs = require('fs');
const path = require('path');

// 默认的测试AppID
const DEFAULT_TEST_APPID = 'wxbd687630d9fc7f2d';

// 配置文件路径
const PROJECT_CONFIG_PATH = path.join(__dirname, 'dist', 'build', 'mp-weixin', 'project.config.json');

function fixAppId(newAppId = DEFAULT_TEST_APPID) {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(PROJECT_CONFIG_PATH)) {
            console.error('❌ 错误: 找不到 project.config.json 文件');
            console.log('请确保已执行: npm run build:mp-weixin');
            return false;
        }

        // 读取配置文件
        const configContent = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8');
        const config = JSON.parse(configContent);

        // 备份原AppID
        const oldAppId = config.appid;
        console.log(`📋 当前AppID: ${oldAppId}`);

        // 更新AppID
        config.appid = newAppId;

        // 写回文件
        fs.writeFileSync(PROJECT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');

        console.log(`✅ 成功更新AppID: ${oldAppId} -> ${newAppId}`);
        console.log(`📂 配置文件: ${PROJECT_CONFIG_PATH}`);

        // 显示下一步操作
        console.log('\n🚀 下一步操作:');
        console.log('1. 打开微信开发者工具');
        console.log('2. 导入项目: dist/build/mp-weixin');
        console.log(`3. 使用AppID: ${newAppId}`);
        console.log('4. 开始开发调试');

        return true;

    } catch (error) {
        console.error('❌ 修复失败:', error.message);
        return false;
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    const newAppId = args[0];

    console.log('🔧 微信小程序AppID修复工具\n');

    if (newAppId) {
        console.log(`🎯 使用自定义AppID: ${newAppId}`);
        fixAppId(newAppId);
    } else {
        console.log(`🎯 使用默认测试AppID: ${DEFAULT_TEST_APPID}`);
        fixAppId();
    }
}

// 如果是直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { fixAppId };
