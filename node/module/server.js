Dr.Declare('Server', 'class');
Dr.Implement('Server', function (global, module_get) {
    var node_module_http = Dr.require('http');

    var Module = function () {
        //
    };

    Module.prototype.init = function (callback, port, host_name) {
        this.callback = callback;
        this.port = port;
        this.host_name = host_name;
        this.is_active = false;

        var _this = this;
        this.server = node_module_http.createServer(function (request, response) {
            _this.onRequest(request, response);
        });

    };

    Module.prototype.start = function () {
        if (this.is_active) return;
        this.server.listen(this.port, this.host_name);
        this.is_active = true;
        Dr.log('Server running at port', this.port, 'host_name', this.host_name);
    };

    Module.prototype.stop = function () {
        if (!this.is_active) return;
        this.server.close();
        this.is_active = false;
        Dr.log('Server stopped');
    };

    Module.prototype.onRequest = function (request, response) {
        var buffer = '';
        var _this = this;
        request.addListener('data', function (chunk) {
            //console.log('Get data', arguments);
            buffer += chunk;
        });
        request.addListener('end', function () {
            //console.log('Get message', buffer.toString());
            _this.onRequestEnd(request, response, buffer);
        });
    };


    Module.prototype.onRequestEnd = function (request, response, buffer) {
        if (this.callback) {
            this.callback(request, response, buffer);
            //force end the response pending
            response.end();
        }
        else {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
            });

            response.write('url:' + request.url + '\n');
            response.write('method:' + request.method + '\n');
            response.write('message:' + buffer.toString() + '\n');
            response.end();
        }
    };


    Module.create = function (callback, port, host_name) {
        var instance = new Module;
        instance.init(callback, port, host_name);
        return instance;
    };

    return Module;
});




