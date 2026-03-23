

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ar',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

function loadGoogleTranslateScript() {
  if (!document.getElementById('google-translate-script')) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.id = 'google-translate-script';
    document.head.appendChild(script);
  }
}

// Function to replace specific Arabic translations
function replaceArabicTranslations() {
  // Wait for the translation to complete
  setTimeout(function () {
    // Get all text nodes in the document
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    var node;
    var replacements = {
      // 'بيت': 'adarsh',
      // 'لتطوير المهارات المحدودة': '123',
      // 'شركة أسماكس لتطوير المهارات المحدودة ': "xyz",
      // 'شركة أسماكس لتطوير المهارات المحدودة': 'xzy',
      // 'المحدودة': '123',

    };

    while (node = walker.nextNode()) {
      var text = node.nodeValue;
      var modified = false;

      // Replace each occurrence
      for (var original in replacements) {
        if (text.includes(original)) {
          text = text.replace(new RegExp(original, 'g'), replacements[original]);
          modified = true;
        }
      }

      if (modified) {
        node.nodeValue = text;
      }
    }
  }, 1000); // Adjust delay if needed (1000ms = 1 second)
}

// Monitor for language changes
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      var htmlElement = document.documentElement;
      if (htmlElement.classList.contains('translated-rtl') ||
        htmlElement.lang === 'ar') {
        replaceArabicTranslations();
      }
    }
  });
});

// Start observing
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class', 'lang']
});

// Also run on initial load if already translated
window.addEventListener('load', function () {
  if (document.documentElement.classList.contains('translated-rtl') ||
    document.documentElement.lang === 'ar') {
    replaceArabicTranslations();
  }
});

loadGoogleTranslateScript();

window.addEventListener('popstate', function () {
  googleTranslateElementInit();
});

