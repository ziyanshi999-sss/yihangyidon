#!/bin/bash

# 银行APP自动部署脚本
# 使用方法: ./deploy.sh [platform] [environment]
# 示例: ./deploy.sh h5 production

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="银行APP"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
BUILD_DIR="$PROJECT_ROOT/dist/build"

# 服务器配置（请根据实际情况修改）
WEB_SERVER_HOST="your-server.com"
WEB_SERVER_USER="root"
WEB_SERVER_PATH="/var/www/html/bank-app"

# 函数：打印消息
print_message() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 函数：检查参数
check_parameters() {
    if [ $# -lt 1 ]; then
        print_error "使用方法: $0 [platform] [environment]"
        print_error "平台选项: h5, app, mp-weixin, all"
        print_error "环境选项: dev, staging, production (默认: production)"
        exit 1
    fi
}

# 函数：检查依赖
check_dependencies() {
    print_message "检查部署依赖..."
    
    # 检查必要的命令
    commands=("node" "npm" "rsync" "ssh")
    for cmd in "${commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            print_error "$cmd 未找到，请先安装"
            exit 1
        fi
    done
    
    print_message "依赖检查完成"
}

# 函数：部署H5版本
deploy_h5() {
    local env=${1:-production}
    print_message "开始部署H5版本到 $env 环境..."
    
    # 检查构建文件
    if [ ! -d "$BUILD_DIR/h5" ]; then
        print_error "H5构建文件不存在，请先运行 npm run build:h5"
        exit 1
    fi
    
    # 创建部署目录
    mkdir -p "$DEPLOY_DIR/h5"
    
    # 复制构建文件
    print_message "复制H5构建文件..."
    cp -r "$BUILD_DIR/h5/"* "$DEPLOY_DIR/h5/"
    
    # 生成版本信息
    cat > "$DEPLOY_DIR/h5/version.json" << EOF
{
    "version": "$(date +'%Y%m%d%H%M%S')",
    "buildTime": "$(date -Iseconds)",
    "environment": "$env",
    "platform": "h5"
}
EOF
    
    # 上传到服务器
    if [ "$env" = "production" ]; then
        print_message "上传到生产服务器..."
        rsync -avz --delete \
            "$DEPLOY_DIR/h5/" \
            "$WEB_SERVER_USER@$WEB_SERVER_HOST:$WEB_SERVER_PATH/"
        
        print_message "重启Nginx服务..."
        ssh "$WEB_SERVER_USER@$WEB_SERVER_HOST" "sudo systemctl reload nginx"
    fi
    
    print_message "H5版本部署完成！"
    print_message "访问地址: https://bank-app.yourbank.com"
}

# 函数：准备APP打包
prepare_app() {
    print_message "准备APP打包文件..."
    
    # 检查构建文件
    if [ ! -d "$BUILD_DIR/app" ]; then
        print_error "APP构建文件不存在，请先运行 npm run build:app-plus"
        exit 1
    fi
    
    # 创建APP部署目录
    mkdir -p "$DEPLOY_DIR/app"
    
    # 复制构建文件
    cp -r "$BUILD_DIR/app/"* "$DEPLOY_DIR/app/"
    
    # 生成HBuilderX导入说明
    cat > "$DEPLOY_DIR/app/README.md" << 'EOF'
# APP打包说明

## HBuilderX云打包步骤

1. 打开HBuilderX
2. 导入项目：文件 -> 导入 -> 从本地文件夹导入
3. 选择当前目录作为项目根目录
4. 发行 -> 原生App-云打包
5. 选择平台：Android 或 iOS
6. 配置证书和签名
7. 提交打包

## 离线打包说明

### Android
- 使用Android Studio导入项目
- 配置原生插件
- 生成签名APK

### iOS  
- 使用Xcode导入项目
- 配置证书和描述文件
- 打包发布到App Store

## 注意事项

- 确保原生插件ScreenProtector正确配置
- 测试防录屏功能是否正常
- 在真机上验证所有功能
EOF
    
    print_message "APP文件准备完成！"
    print_message "位置: $DEPLOY_DIR/app"
}

# 函数：准备小程序打包
prepare_mp_weixin() {
    print_message "准备微信小程序打包文件..."
    
    # 检查构建文件
    if [ ! -d "$BUILD_DIR/mp-weixin" ]; then
        print_error "微信小程序构建文件不存在，请先运行 npm run build:mp-weixin"
        exit 1
    fi
    
    # 创建小程序部署目录
    mkdir -p "$DEPLOY_DIR/mp-weixin"
    
    # 复制构建文件
    cp -r "$BUILD_DIR/mp-weixin/"* "$DEPLOY_DIR/mp-weixin/"
    
    # 生成发布说明
    cat > "$DEPLOY_DIR/mp-weixin/发布说明.md" << 'EOF'
# 微信小程序发布说明

## 发布步骤

1. 打开微信开发者工具
2. 导入项目，选择当前目录
3. 填写AppID
4. 点击"预览"进行真机测试
5. 点击"上传"提交代码
6. 登录微信公众平台
7. 进入版本管理
8. 提交审核
9. 发布上线

## 注意事项

- 确保AppID配置正确
- 检查所有页面功能正常
- 验证支付功能（如果有）
- 确保符合微信小程序规范
EOF
    
    print_message "微信小程序文件准备完成！"
    print_message "位置: $DEPLOY_DIR/mp-weixin"
}

# 函数：创建部署报告
generate_deploy_report() {
    local platform=$1
    local env=${2:-production}
    
    print_message "生成部署报告..."
    
    cat > "$DEPLOY_DIR/deploy-report.md" << EOF
# 银行APP部署报告

## 部署信息
- **项目名称**: $PROJECT_NAME
- **部署平台**: $platform
- **部署环境**: $env
- **部署时间**: $(date +'%Y年%m月%d日 %H:%M:%S')
- **部署版本**: v$(date +'%Y%m%d%H%M%S')

## 部署文件大小
\`\`\`
$(du -sh "$DEPLOY_DIR"/* 2>/dev/null || echo "文件大小统计失败")
\`\`\`

## 验证清单

### H5版本验证
- [ ] 网站可以正常访问
- [ ] HTTPS证书正常
- [ ] 防录屏功能正常
- [ ] 所有页面加载正常
- [ ] API接口正常

### APP版本验证  
- [ ] APK/IPA文件正常
- [ ] 真机安装正常
- [ ] 防录屏功能正常
- [ ] 所有功能正常

### 小程序版本验证
- [ ] 小程序预览正常
- [ ] 所有页面正常
- [ ] 功能测试正常

## 后续步骤
1. 功能验证测试
2. 性能监控配置
3. 用户反馈收集
4. 版本迭代计划

---
部署完成时间: $(date +'%Y-%m-%d %H:%M:%S')
EOF
    
    print_message "部署报告已生成: $DEPLOY_DIR/deploy-report.md"
}

# 主函数
main() {
    local platform=${1:-h5}
    local env=${2:-production}
    
    print_message "开始部署 $PROJECT_NAME - $platform 平台"
    
    check_parameters "$@"
    check_dependencies
    
    case $platform in
        "h5")
            deploy_h5 "$env"
            ;;
        "app")
            prepare_app
            ;;
        "mp-weixin")
            prepare_mp_weixin
            ;;
        "all")
            deploy_h5 "$env"
            prepare_app
            prepare_mp_weixin
            ;;
        *)
            print_error "不支持的平台: $platform"
            print_error "支持的平台: h5, app, mp-weixin, all"
            exit 1
            ;;
    esac
    
    generate_deploy_report "$platform" "$env"
    
    print_message "🎉 部署完成！"
    print_message "检查部署报告: $DEPLOY_DIR/deploy-report.md"
}

# 运行主函数
main "$@"
