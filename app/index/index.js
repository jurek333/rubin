var RubinApp = angular.module("RubinApp", ["ui.router"]);

RubinApp.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/apps");
            $stateProvider
                .state("apps", {
                    url: "/apps",
                    template: "<div>Apps</div><ul><li ng-repeat='app in appsList'><a href='javascript:void(0)' ng-click='chooseApp(app)'>{{app}}</a></li></ul>",
                    controller: "AppsListController"
                })
                .state("aspects",{
                    url: "/:app",
                    template: "<div>Aspects</div><ul><li ng-repeat='asp in aspectList'><a href='javascript:void(0)' ng-click='chooseAspect(asp.id)' >{{asp.Name}} -- {{asp.id}}</a></li></ul>",
                    controller: "AspectListController"
                })
                .state("monitor",{
                    url: "/:app/:aspectId/monitor",
                    templateUrl: "../monitor/monitor.html",
                    controller: "MonitorController"
                });
    }
])
.controller("AppsListController",[
    "$scope","$http","$state",
    function($scope, $http, $state) {
        $scope.appsList = [];
        $scope.chooseApp = function (app) {
            $state.go("aspects", {"app": app});
        }

        $http.get("/").then(function(data) {
            $scope.data2Text = JSON.stringify(data);
            $scope.appsList = data.data;
        });
    }
])
.controller("AspectListController",[
    "$stateParams", "$scope","$http","$state",
    function($stateParams, $scope, $http, $state) {
        var app = $stateParams.app;

        $scope.chooseAspect = function(id) {
            $state.go("monitor", {
                "app" : app,
                "aspectId" : id
            });
        };

        $scope.aspectList = [];
        $http.get("/"+app).then(function(data) {
            $scope.data2Text = JSON.stringify(data);
            $scope.aspectList = data.data;
        });
    }
]);
