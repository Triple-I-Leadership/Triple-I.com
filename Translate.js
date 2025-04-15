  function googleTranslateElementInit() {
    new google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,de,ru,es,fr,it,ja,ko,zh-CN,ar',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 
      'google_translate_element'
    );
  }
