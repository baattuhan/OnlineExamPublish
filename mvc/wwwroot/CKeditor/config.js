/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	// %REMOVE_START%
	config.plugins =
		'about,' +
		'audio,' +
		'a11yhelp,' +
		'basicstyles,' +
		'bidi,' +
		'blockquote,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		'copyformatting,' +
		'contextmenu,' +
		'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'floatingspace,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
		'image,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
		'magicline,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromgdocs,' +
		'pastefromlibreoffice,' +
		'pastefromword,' +
		'pastetext,' +
		'editorplaceholder,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'selectall,' +
		'showblocks,' +
		'showborders,' +
		'smiley,' +
		'sourcearea,' +
		'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tableselection,' +
		'tabletools,' +
		'templates,' +
		'toolbar,' +
		'undo,' +
		'uploadimage,' +
		'wysiwygarea';
	// %REMOVE_END%
};
CKEDITOR.plugins.add('audio', {
    icons: 'audio',
    init: function (editor) {

        editor.addCommand('insertAudio', {
            exec: function (editor) {

                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'audio/*';

                input.onchange = function () {
                    const file = input.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('audio', file);

                    fetch('/upload-audio', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        editor.insertHtml(`
                            <audio controls>
                                <source src="${data.url}" type="${file.type}">
                                Tarayıcı audio desteklemiyor.
                            </audio>
                        `);
                    });
                };

                input.click();
            }
        });

        editor.ui.addButton('Audio', {
            label: 'Ses Ekle',
            command: 'insertAudio',
            toolbar: 'insert'
        });
    }
});

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
