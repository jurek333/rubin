"use strict";
var koa = require("koa");
var route = require("koa-route");
var app = koa();

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
    console.log("action /");
    this.body = yield db.getAllApps();
    this.status = 200;
    console.log("action / ended");
}));
app.use(route.get("/:app", function* (app){
    this.body = yield db.getAspects(app);
    this.status = 200;
}));
app.use(route.get("/:app/:aspectId", function* (app, aspectId) {
    this.body = yield db.getMonitoringData(app, aspectId);
    this.status = 200;
}));
app.use(route.get("/:app/:aspectId/sub", function*(app, aspectId) {
    db.subscribeOnAspectChanges(app, aspectId);
    this.status = 200;
    this.body = { done: true };
}));

app.listen(PORT);
console.log("Application listens on port %d.", PORT);
console.log("Use Ctrl-C to close it.");
