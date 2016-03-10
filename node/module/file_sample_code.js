require('../Dr.js');

Dr.loadLocalScript('./file.js', function () {
    Dr.log("All script loaded");
    Dr.LoadAll();

    var Directory = Dr.Get('Directory');

    Dr.debugLogLevel = 1;


    Dr.log('[test] Directory');

    var TEST_PATH = './test';
    Directory.create('./').modify('copy', TEST_PATH);

    var test_directory = Directory.create(TEST_PATH);
    test_directory.walk(function (path, name, type) {
        Dr.log('Get', ' - ', path, ' - ', name, ' - ', type);
        if (type == 'Directory') return 'continue';
    }, true);

    test_directory.modify('copy', './test_copy/');

    test_directory.modify('copy', './test_move/');
    Directory.create('./test_move').modify('move', './test_move_to/');

    test_directory.modify('copy', './test_delete/');
    Directory.create('./test_delete').modify('delete');

    Directory._delete('Directory', './test_move/');
    Directory._delete('Directory', './test_delete/');


    Dr.log('[test] Directory.modify');

    var TEST_PATH = './test_modify';
    Directory.modify('copy', 'Directory', './', TEST_PATH);
    Directory.modify('copy', 'Directory', TEST_PATH, './test_modify_copy');
    Directory.modify('copy', 'Directory', TEST_PATH, './test_modify_delete');
    Directory.modify('copy', 'Directory', TEST_PATH, './test_modify_move');

    Directory.modify('delete', 'Directory', './test_modify_delete');
    Directory.modify('move', 'Directory', './test_modify_move', './test_modify_move_to');


    Dr.log('[test] Directory.getFileList');
    var TEST_PATH = '../';
    Dr.file_list_1 = Directory.getFileList(TEST_PATH, '.js', 'PREFIX_');
    Dr.file_list_2 = Directory.getFileList(TEST_PATH, '.js');
    Dr.file_list_3 = Directory.getFileList(TEST_PATH);


    Dr.startREPL();
});