require('../Dr.js');

Dr.loadLocalScript('./file.js', function () {
    Dr.log("All script loaded");
    Dr.LoadAll();

    var File = Dr.Get('File');

    Dr.debugLogLevel = 1;


    Dr.log('[test] File');

    //var TEST_PATH = './test';
    //File.create('./').modify('copy', TEST_PATH);
    //
    //var test_directory = File.create(TEST_PATH);
    //test_directory.walk(function (path, name, type) {
    //    Dr.log('Get', ' - ', path, ' - ', name, ' - ', type);
    //    if (type == File.type.Directory) return 'continue';
    //}, true);
    //
    //test_directory.modify('copy', './test_copy/');
    //
    //test_directory.modify('copy', './test_move/');
    //File.create('./test_move').modify('move', './test_move_to/');
    //
    //test_directory.modify('copy', './test_delete/');
    //File.create('./test_delete').modify('delete');
    //
    //File._delete('Directory', './test_move/');
    //File._delete('Directory', './test_delete/');


    Dr.log('[test] File.modify');

    //var TEST_PATH = './test_modify';
    //File.modify('copy', File.type.Directory, './', TEST_PATH);
    //File.modify('copy', File.type.Directory, TEST_PATH, './test_modify_copy');
    //File.modify('copy', File.type.Directory, TEST_PATH, './test_modify_delete');
    //File.modify('copy', File.type.Directory, TEST_PATH, './test_modify_move');
    //
    //File.modify('delete', File.type.Directory, './test_modify_delete');
    //File.modify('move', File.type.Directory, './test_modify_move', './test_modify_move_to');


    Dr.log('[test] File.getFileList');
    var TEST_PATH = '../';
    Dr.file_list_1 = File.getFileList(TEST_PATH, '.js', 'PREFIX_');
    Dr.file_list_2 = File.getFileList(TEST_PATH, '.js');
    Dr.file_list_3 = File.getFileList(TEST_PATH);


    Dr.log('[test] File.read/write');
    var TEST_PATH = './file.js';
    var buffer = File.readFileSync(TEST_PATH);
    Dr.log(buffer.toString());
    File.writeFileSync(TEST_PATH + '.rewrite', buffer);

    Dr.startREPL();
});