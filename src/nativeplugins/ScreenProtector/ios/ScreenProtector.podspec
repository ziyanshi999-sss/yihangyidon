Pod::Spec.new do |s|
  s.name         = "ScreenProtector"
  s.version      = "1.0.0"
  s.summary      = "防录屏截屏插件"
  s.description  = "uni-app防录屏截屏原生插件，支持iOS截屏录屏检测"
  s.homepage     = "https://github.com/example/screen-protector"
  s.license      = "MIT"
  s.author       = { "Developer" => "developer@example.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/example/screen-protector.git", :tag => s.version }
  s.source_files = "ScreenProtector/*.{h,m}"
  s.frameworks   = "UIKit", "Foundation"
  s.requires_arc = true
end
