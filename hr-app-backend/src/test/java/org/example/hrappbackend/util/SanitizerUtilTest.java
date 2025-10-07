package org.example.hrappbackend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SanitizerUtilTest {

    @Test
    void sanitize_returnsNull_whenInputIsNull() {
        String result = SanitizerUtil.sanitize(null);

        assertNull(result);
    }

    @Test
    void sanitize_returnsBlankString_whenInputIsBlank() {
        String result = SanitizerUtil.sanitize("");

        assertEquals("", result);
    }

    @Test
    void sanitize_returnsWhitespace_whenInputIsOnlyWhitespace() {
        String result = SanitizerUtil.sanitize("   ");

        assertEquals("   ", result);
    }

    @Test
    void sanitize_returnsPlainText_whenInputContainsNoHtml() {
        String input = "Hello World";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello World", result);
    }

    @Test
    void sanitize_removesSimpleHtmlTags() {
        String input = "<p>Hello World</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello World", result);
    }

    @Test
    void sanitize_removesScriptTags() {
        String input = "<script>alert('XSS')</script>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_removesScriptTagsWithContent() {
        String input = "Hello <script>alert('XSS')</script> World";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello  World", result);
    }

    @Test
    void sanitize_removesMultipleHtmlTags() {
        String input = "<div><p>Hello</p><span>World</span></div>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("HelloWorld", result);
    }

    @Test
    void sanitize_removesInlineStyles() {
        String input = "<p style=\"color: red;\">Hello</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello", result);
    }

    @Test
    void sanitize_removesEventHandlers() {
        String input = "<button onclick=\"alert('XSS')\">Click me</button>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Click me", result);
    }

    @Test
    void sanitize_removesImgTags() {
        String input = "<img src=\"evil.jpg\" onerror=\"alert('XSS')\">";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_removesAnchorTags() {
        String input = "<a href=\"https://evil.com\">Click here</a>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Click here", result);
    }

    @Test
    void sanitize_removesIframeTags() {
        String input = "<iframe src=\"https://evil.com\"></iframe>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_handlesNestedTags() {
        String input = "<div><p><span><strong>Hello</strong></span></p></div>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello", result);
    }

    @Test
    void sanitize_preservesSpecialCharacters() {
        String input = "Hello & goodbye < > \"quotes\"";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello &amp; goodbye &lt; &gt; \"quotes\"", result);
    }

    @Test
    void sanitize_handlesHtmlEntities() {
        String input = "&lt;script&gt;alert('XSS')&lt;/script&gt;";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("&lt;script&gt;alert('XSS')&lt;/script&gt;", result);
    }

    @Test
    void sanitize_removesFormTags() {
        String input = "<form action=\"/evil\"><input type=\"text\"></form>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_handlesMixedContent() {
        String input = "Normal text <b>bold</b> more text <script>evil()</script> end";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Normal text bold more text  end", result);
    }

    @Test
    void sanitize_handlesUnclosedTags() {
        String input = "<p>Hello <b>World";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello World", result);
    }

    @Test
    void sanitize_handlesMalformedHtml() {
        String input = "<p>Hello</b><span>World</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("HelloWorld", result);
    }

    @Test
    void sanitize_removesStyleTags() {
        String input = "<style>body { background: red; }</style>Hello";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello", result);
    }

    @Test
    void sanitize_removesObjectTags() {
        String input = "<object data=\"evil.swf\"></object>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_removesEmbedTags() {
        String input = "<embed src=\"evil.swf\">";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }

    @Test
    void sanitize_handlesLongStrings() {
        String input = "<p>" + "a".repeat(10000) + "</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("a".repeat(10000), result);
    }

    @Test
    void sanitize_handlesUnicodeCharacters() {
        String input = "<p>你好世界 مرحبا العالم Привет мир</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("你好世界 مرحبا العالم Привет мир", result);
    }

    @Test
    void sanitize_handlesEmojis() {
        String input = "<p>Hello 👋 World 🌍</p>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello 👋 World 🌍", result);
    }

    @Test
    void sanitize_removesDataAttributes() {
        String input = "<div data-evil=\"payload\">Hello</div>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("Hello", result);
    }

    @Test
    void sanitize_handlesSvgTags() {
        String input = "<svg><script>alert('XSS')</script></svg>";

        String result = SanitizerUtil.sanitize(input);

        assertEquals("", result);
    }
}

