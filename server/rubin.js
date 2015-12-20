"use strict";
let koa = require("koa"),
    serve = require("koa-static"),
    http = require("http"),
    route = require("koa-route"),
    socketIo = require("socket.io");

var app = koa();

console.log("dir: %s", __dirname);
app.use(serve(__dirname + '/../app'));

var db = require("./db.js")();

var PORT = 9007;

app.use(function* (next) {
    try {
        yield next;
    } catch (e) {
        this.body = {
            error: e
        };
        this.status = 500;
    }
});
app.use(route.get("/", function*() {
    this.body = yield db.getAllApps();
    this.status = 200;
}));
app.use(route.get("/:app", function* (app){
    this.body = yield db.getAspects(app);
    this.status = 200;
}));
app.use(route.get("/:app/:aspectId", function* (app, aspectId) {
    this.body = yield db.getMonitoringData(app, aspectId);
    this.status = 200;
}));

var server = http.Server(app.callback());
var io = socketIo(server);

setupIo(io);

server.listen(PORT);
console.log("Application listens on port %d.", PORT);
console.log("Use Ctrl-C to close it.");

function rethinkdbChangesHandler(err, cursor) {
    if(err) throw err;
    cursor.each(function(err, row){
        if(err) throw err;
        console.log(JSON.stringify(row, null, 2));
    });
}

function setupIo(io) {
    io.on("connection", function(socket) {
        console.log("  [i] socket connected...");
        socket.on("add_monitor", function(data) {
            console.log("   [i] add new monitor %s %s", data.app, data.aspectId);
            db.subscribeOnAspectChanges(
                    data.app,
                    data.aspectId,
                    passDBPullBySocket);

            function passDBPullBySocket(err, cursor) {
                if(err) throw err;
                if(cursor) {
                    cursor.each(function (err, row) {
                        if(err) throw err;
                        socket.emit('refresh_monitor_data', row);
                    });
                }
                socket.on('del_monitor', unsubscribeAspectChanges);
                socket.on('disconnect', unsubscribeAspectChanges);

                function unsubscribeAspectChanges() {
                    console.log("  [i] close conection");
                    if(cursor) {
                        cursor.close();
                    }
                    socket.removeListener('del_monitor', unsubscribeAspectChanges);
                    socket.removeListener('disconnect', unsubscribeAspectChanges);
                }
            }
        });
    });
}
