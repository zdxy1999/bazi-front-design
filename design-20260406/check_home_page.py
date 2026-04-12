#!/usr/bin/env python3
"""检查home页面的渲染情况"""
from playwright.sync_api import sync_playwright

html_file = "file:///Users/zdxy/codes/bazi-mini-programme/bazi-front-design/design-20260406/src/pages/home/home.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # 显示浏览器窗口以便调试
    page = browser.new_page()

    # 记录控制台日志
    def log_console(msg):
        print(f"Console: {msg.text}")
    page.on("console", log_console)

    print("正在加载页面...")
    page.goto(html_file)
    page.wait_for_load_state("networkidle")
    print("页面加载完成")

    # 截图
    screenshot_path = "/tmp/home-page-debug.png"
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"截图已保存到: {screenshot_path}")

    # 检查.profile-content元素
    try:
        profile_content = page.locator(".profile-content").first
        if profile_content.count() > 0:
            print("\n=== Profile Content 元素信息 ===")

            # 获取计算样式
            styles = page.evaluate("""
                (element) => {
                    const computed = window.getComputedStyle(element);
                    return {
                        width: computed.width,
                        height: computed.height,
                        paddingLeft: computed.paddingLeft,
                        justifyContent: computed.justifyContent,
                        alignItems: computed.alignItems,
                        display: computed.display,
                        flexDirection: computed.flexDirection
                    };
                }
            """, profile_content.element_handle())

            print(f"Width: {styles['width']}")
            print(f"Height: {styles['height']}")
            print(f"Padding Left: {styles['paddingLeft']}")
            print(f"Justify Content: {styles['justifyContent']}")
            print(f"Align Items: {styles['alignItems']}")
            print(f"Display: {styles['display']}")
            print(f"Flex Direction: {styles['flexDirection']}")

            # 检查父元素
            print("\n=== 父元素信息 ===")
            parent_info = page.evaluate("""
                (element) => {
                    const parent = element.parentElement;
                    if (!parent) return null;
                    const computed = window.getComputedStyle(parent);
                    return {
                        tagName: parent.tagName,
                        className: parent.className,
                        width: computed.width,
                        maxWidth: computed.maxWidth,
                        margin: computed.margin
                    };
                }
            """, profile_content.element_handle())

            if parent_info:
                print(f"Parent: {parent_info['tagName']}.{parent_info['className']}")
                print(f"Parent Width: {parent_info['width']}")
                print(f"Parent Max Width: {parent_info['maxWidth']}")
                print(f"Parent Margin: {parent_info['margin']}")

            # 检查五行图容器
            wuxing_container = page.locator(".wuxing-chart-container").first
            if wuxing_container.count() > 0:
                print("\n=== 五行图容器信息 ===")
                wuxing_styles = page.evaluate("""
                    (element) => {
                        const computed = window.getComputedStyle(element);
                        return {
                            width: computed.width,
                            maxWidth: computed.maxWidth,
                            margin: computed.margin
                        };
                    }
                """, wuxing_container.element_handle())

                print(f"Width: {wuxing_styles['width']}")
                print(f"Max Width: {wuxing_styles['maxWidth']}")
                print(f"Margin: {wuxing_styles['margin']}")

                # 获取SVG实际尺寸
                svg = page.locator(".wuxing-chart").first
                if svg.count() > 0:
                    bbox = svg.bounding_box()
                    print(f"SVG 实际尺寸: {bbox['width']}x{bbox['height']}")
        else:
            print("未找到.profile-content元素")

    except Exception as e:
        print(f"检查元素时出错: {e}")

    # 保持浏览器打开一段时间以便手动检查
    print("\n浏览器将保持打开30秒，你可以手动检查...")
    page.wait_for_timeout(30000)

    browser.close()
    print("\n检查完成")
