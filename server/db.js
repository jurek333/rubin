"use strict";

module.exports = function () {
    let rethinkdbdash = require("rethinkdbdash");
    var dbConfig = require("./config.js");
    let r = rethinkdbdash(dbConfig);

    return {
        getAllApps: function* () {
            var allApps = yield r.tableList();
            return allApps;
        },
        getAspects: function* (app) {
            var allAspects = yield r.table(app).pluck("Name","id");
            return allAspects;
        },
        getMonitoringData: function* (app, aspectId) {
            var monitor = yield r.table(app)
                .get(aspectId);
            return monitor;
        },
        subscribeOnAspectChanges: function (app, aspectId, changeHandler) {
            r.table(app)
                .get(aspectId)
                .changes()
                .run({cursor: true}, changeHandler);
        }
    };
}
