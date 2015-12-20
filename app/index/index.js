var RubinApp = angular.module("RubinApp", ["ui.router"]);

RubinApp.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/apps");
            $stateProvider
                .state("apps", {
                    url: "/apps",
                    template: "<div>Apps</div><ul><li ng-repeat='app in appsList'>{{app}}</li></ul>",
                    controller: "AppsListController"
                })
                .state("aspects",{
                    url: "/:app",
                    template: "<div>Aspects</div><ul><li ng-repeat='asp in aspectList'>{{asp.Name}} -- {{asp.id}}</li></ul>",
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
    "$scope","$http",
    function($scope, $http) {
        $scope.appsList = [];
        $http.get("/").then(function(data) {
            $scope.appsList = data;
        });
    }
])
.controller("AspectListController",[
    "$stateParams", "$scope","$http",
    function($stateParams, $scope, $http) {
        var app = $stateParams.app;
        $scope.aspectList = [];
        $http.get("/"+app).then(function(data) {
            $scope.aspectList = data;
        });
    }
]);
