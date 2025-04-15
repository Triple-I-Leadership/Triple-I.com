function googleTranslateElementInit() {
  new google.translate.TranslateElement({
  pageLanguage: 'en', // Change to 'de' if your default is German
  includedLanguages: 'en,de,es,fr,it,ja,zh-CN,ru,ar,ko', // Choose the languages you want
  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}
