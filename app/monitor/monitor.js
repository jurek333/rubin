angular.module("RubinApp").controller("MonitorController", [
    "$stateParams", "$scope","socket",
    function($stateParams, $scope, socket){
        $scope.data = [];
        $scope.messages = [{
            time: Date.now(),
            text: "waiting for connection ..."
        }];
        
        var app = $stateParams.app;
        var aspectId = $stateParams.aspectId;
        
        socket.on("refresh_monitor_data", function (msg) {
            var allerts = [];
            if($scope.messages.length > 0) {
               allerts.push($scope.messages[$scope.messages.length-1]);
            }
            allerts.push({
                time: Date.now(),
                text: "new data arrived"
            });
            $scope.messages = allerts;
            $scope.data = msg.new_val.Times;
            $scope.name = msg.new_val.Name;
        });
        $scope.$on("$destroy", function (event) {
            socket.removeAllListeners();
        });
        socket.emit("add_monitor", {
            "app": app,
            "aspectId": aspectId                
        });

    }
])
.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
