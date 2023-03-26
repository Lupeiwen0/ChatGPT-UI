import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';

export const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><section class="__code-block-copy-button__">复制代码</section><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (__) { }
    }
    return '<pre class="hljs"><section class="__code-block-copy-button__">复制代码</section><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

export function mdStr2html(str, model = 'render') {
  return md[model](str);
}