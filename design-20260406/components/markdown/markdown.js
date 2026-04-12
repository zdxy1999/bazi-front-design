/**
 * Markdown解析器组件脚本
 * 使用Marked.js解析Markdown，Highlight.js进行代码高亮
 */

class MarkdownRenderer {
  constructor(options = {}) {
    this.options = {
      breaks: options.breaks !== undefined ? options.breaks : true,
      gfm: options.gfm !== undefined ? options.gfm : true,
      highlight: options.highlight !== undefined ? options.highlight : true,
      mermaid: options.mermaid !== undefined ? options.mermaid : true,
      ...options
    };

    this.init();
  }

  init() {
    // 配置Marked渲染器
    const renderer = new marked.Renderer();

    // 自定义代码块渲染（支持Mermaid）
    renderer.code = function(code, infostring, escaped) {
      // 兼容不同版本的marked.js
      const language = infostring || '';

      // 检查是否是mermaid代码
      if (language.trim() === 'mermaid' && typeof mermaid !== 'undefined') {
        return `<div class="mermaid">${code}</div>`;
      }

      // 普通代码高亮
      const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';

      try {
        const result = hljs.highlight(code, { language: validLang });
        const highlighted = result.value || result;
        return `<pre class="hljs"><code class="language-${validLang}">${highlighted}</code></pre>`;
      } catch (error) {
        console.error('代码高亮错误:', error);
        return `<pre><code class="language-${validLang}">${code}</code></pre>`;
      }
    };

    // 自定义链接渲染（添加target="_blank"）
    renderer.link = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    // 配置Marked选项
    marked.setOptions({
      renderer: renderer,
      breaks: this.options.breaks,
      gfm: this.options.gfm,
      headerIds: true,
      mangle: false
    });
  }

  /**
   * 解析Markdown文本为HTML
   * @param {string} markdown - Markdown文本
   * @returns {string} HTML字符串
   */
  parse(markdown) {
    try {
      return marked.parse(markdown);
    } catch (error) {
      console.error('Markdown解析错误:', error);
      return `<p>解析错误: ${error.message}</p>`;
    }
  }

  /**
   * 渲染Markdown到指定元素
   * @param {string} markdown - Markdown文本
   * @param {HTMLElement|string} target - 目标元素或选择器
   */
  async render(markdown, target) {
    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!element) {
      console.error('目标元素不存在:', target);
      return;
    }

    element.innerHTML = this.parse(markdown);

    // 渲染Mermaid图表
    if (this.options.mermaid && typeof mermaid !== 'undefined') {
      await this.renderMermaid(element);
    }
  }

  /**
   * 渲染Mermaid图表
   * @param {HTMLElement} element - 包含mermaid图表的元素
   */
  async renderMermaid(element) {
    const mermaidDivs = element.querySelectorAll('.mermaid');
    if (mermaidDivs.length === 0) return;

    try {
      await mermaid.init(undefined, mermaidDivs);
    } catch (error) {
      console.error('Mermaid渲染错误:', error);
    }
  }

  /**
   * 从URL加载并渲染Markdown文件
   * @param {string} url - Markdown文件URL
   * @param {HTMLElement|string} target - 目标元素或选择器
   */
  async loadFromUrl(url, target) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      const markdown = await response.text();
      await this.render(markdown, target);
    } catch (error) {
      console.error('加载Markdown文件错误:', error);
      const element = typeof target === 'string'
        ? document.querySelector(target)
        : target;
      if (element) {
        element.innerHTML = `<p>加载失败: ${error.message}</p>`;
      }
    }
  }

  /**
   * 实时预览模式
   * @param {HTMLTextAreaElement} textarea - 输入文本框
   * @param {HTMLElement} preview - 预览元素
   */
  livePreview(textarea, preview) {
    if (!textarea || !preview) {
      console.error('文本框或预览元素不存在');
      return;
    }

    const updatePreview = () => {
      const markdown = textarea.value;
      preview.innerHTML = this.parse(markdown);
    };

    // 监听输入事件
    textarea.addEventListener('input', updatePreview);

    // 初始渲染
    updatePreview();

    // 返回清理函数
    return () => {
      textarea.removeEventListener('input', updatePreview);
    };
  }
}

// ============================================
// 全局初始化
// ============================================

// 初始化所有带data-markdown属性的元素
function initMarkdownElements() {
  const elements = document.querySelectorAll('[data-markdown]');
  const renderer = new MarkdownRenderer();

  elements.forEach(element => {
    const markdown = element.getAttribute('data-markdown') || element.textContent;
    element.innerHTML = renderer.parse(markdown);
    element.removeAttribute('data-markdown');
  });

  console.log(`已初始化 ${elements.length} 个Markdown元素`);
}

// 初始化所有带data-markdown-url属性的元素（从URL加载）
function initMarkdownFromUrls() {
  const elements = document.querySelectorAll('[data-markdown-url]');
  const renderer = new MarkdownRenderer();

  elements.forEach(async element => {
    const url = element.getAttribute('data-markdown-url');
    if (url) {
      await renderer.loadFromUrl(url, element);
    }
  });

  console.log(`已从URL加载 ${elements.length} 个Markdown文件`);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMarkdownElements();
    initMarkdownFromUrls();
  });
} else {
  initMarkdownElements();
  initMarkdownFromUrls();
}

// 导出供外部使用
window.MarkdownRenderer = MarkdownRenderer;
window.initMarkdownElements = initMarkdownElements;
window.initMarkdownFromUrls = initMarkdownFromUrls;
