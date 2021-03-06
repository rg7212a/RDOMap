/**
 * Created by Jean on 2019-10-09.
 */

var Language = {
    availableLanguages: ['ar-ar', 'de-de', 'en-us', 'es-es', 'fr-fr', 'hu-hu', 'it-it', 'ko', 'pt-br', 'pl', 'ru', 'sv-se', 'th-th', 'zh-hans', 'zh-hant'],

    get: function (value) {
        if (Settings.language == null)
            Settings.language = 'en-us';

        if (Language.data[Settings.language][value])
            return Language.data[Settings.language][value];
        else if (Language.data['en-us'][value])
            return Language.data['en-us'][value];
        else if (Settings.isDebugEnabled)
            return value;
        else
            return '';
    },

    setMenuLanguage: function () {
        $.each($('[data-text]'), function (key, value) {
            var temp = $(value);
            var string = Language.get(temp.data('text'));

            if (string == '') return;

            $(temp).text(string);
        });

        // Special cases:
        $('#search').attr("placeholder", Language.get('menu.search_placeholder'));

        $('.leaflet-control-layers-list span').each(function (key, value) {
            var element = $(value);

            switch (key) {
                case 0:
                    element.text(' ' + Language.get('map.layers.default'));
                    break;
                case 1:
                    element.text(' ' + Language.get('map.layers.detailed'));
                    break;
                case 2:
                    element.text(' ' + Language.get('map.layers.dark'));
                    break;
                default:
                    break;
            }
        });
    },

    // A helper function to "compile" all language files into a single JSON file.
    getLanguageJson: function () {
        var object = {};

        // Loop through all available languages and try to retrieve both the `menu.json` and `item.json` files.
        this.availableLanguages.forEach(language => {
            try {
                // Menu language strings.
                $.ajax({
                    url: `./langs/menu/${language}.json`,
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        object[language] = json;
                    }
                });
            } catch (error) {
                // Do nothing for this language in case of a 404-error.
                return;
            }
        });

        // Download the object to a `language.json` file.
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(object)));
        element.setAttribute('download', 'language.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
};
