"use strict";

module.exports = function () {
    let rethinkdbdash = require("rethinkdbdash");
    var dbConfig = require("./config.js");
    let r = rethinkdbdash(dbConfig);
    var _ = require("lodash");

    return {
        getAllApps: function* () {
            console.log("   [i] start getAllApps");
            var allApps = yield r.tableList();
            console.log("   [i] HaveGotAllApps ");
            return allApps;
        },
        getAspects: function* (app) {
            var allAspects = yield r.table(app).pluck("Name","id");
            console.log("HaveGotAspects");
            return allAspects;
        },
        getMonitoringData: function* (app, aspectId) {
            var monitor = yield r.table(app)
                .get(aspectId);
            console.log("HaveGotMonitoringData");
            return monitor;
        },
        subscribeOnAspectChanges: function (app, aspectId) {
            console.log("start subcription");
            r.table(app)
                .get(aspectId)
                .changes()
                .run({cursor: true}, handleChange);
            
            function handleChange(err, cursor) {
                if(err) throw err;
                cursor.each(function(err, row){
                    if(err) throw err;
                    console.log(JSON.stringify(row, null, 2));
                });
            };
            console.log("subcription done");
        }
    };
}
