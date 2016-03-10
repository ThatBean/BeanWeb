require('../Dr.js');

Dr.loadLocalScript('./command.js', function () {
    Dr.log("All script loaded");
    Dr.LoadAll();
    var Command = Dr.Get('Command');

    Command.run('cd', {
        callbackOutput: function (event, from, data) {
            Dr.log(arguments);
            if (data) Dr.log(data.toString());
        },
    });

    //Dr.startREPL();
});