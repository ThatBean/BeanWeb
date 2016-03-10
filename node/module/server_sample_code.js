require('../Dr.js');

Dr.loadLocalScript('./server.js', function () {
    Dr.log("All script loaded");
    Dr.LoadAll();
    var Server = Dr.Get('Server');

    var server = Server.create(function (request, response, buffer) {
        //Dr.log(arguments);

        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
        });

        response.write('message:');
        response.write(buffer.toString());

        response.write('\n');
        response.end();
    }, 888);
    server.start();

    //Dr.startREPL();
});