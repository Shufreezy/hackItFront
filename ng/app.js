var HackathonApp = angular.module('HackathonApp', ['ui.calendar']);

HackathonApp.factory('RequestService', ['$http', function($http) {

        function post(url, data, onSuccess, onError) {
             $http({
                    method: 'GET',
                    url: host + "api/token",
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded' }
                    }).then(function successCallback(response) {
                                $http({
                                    method: 'POST',
                                    url: url,
                                    data: $.param(data),
                                    headers: {
                                        'Content-Type':'application/x-www-form-urlencoded' }})
                                        .then(function successCallback(response) {
                                            onSuccess(response);
                                        }, function errorCallback(response) {
                                            onError(response);
                                        });
                                }, function errorCallback(response) {
                                    console.log("ERROR",response)
                            });

                // console.log('SERVICE WORKING');
        }

        function get(url, onSuccess, onError) {
                $http({
                    method: 'GET',
                     url: url,
                     headers: {
                         'Accept': "application/json"
                     }})
                        .then(function successCallback(response) {
                            onSuccess(response.data);
                        }, function errorCallback(response) {
                            onError(response);
                        });
        }

        return {
                post:post,
                get:get
        }

}]);

HackathonApp.constant('API', {});

HackathonApp.controller('HackathonController', ['$scope','RequestService', 'API', function ($scope, RequestService, API) {
   
    $scope.alertEventOnClick = function(e){
        $("#modal-1").click();
        console.log("triggered");
    }

    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            events: [
                {
                    id : 1,
                    title: 'Business Lunch',
                    start: '2017-09-03T13:00:00',
                    className: "privacy"
                },
                {
                    title: 'MEEETING',
                    start: '2017-09-13T11:00:00',
                    constraint: 'availableForMeeting', // defined below
                    color: '#257e4a'
                },
                {
                    title: 'Conference',
                    start: '2017-09-18',
                    end: '2017-09-20'
                },
                {
                    title: 'Party',
                    start: '2017-09-29T20:00:00'
                },

                // areas where "Meeting" must be dropped
                {
                    id: 'availableForMeeting',
                    start: '2017-09-11T10:00:00',
                    end: '2017-09-11T16:00:00',
                    rendering: 'background'
                },
                {
                    id: 'availableForMeeting',
                    start: '2017-09-13T10:00:00',
                    end: '2017-09-13T16:00:00',
                    rendering: 'background'
                }
            ],
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };

    $scope.profileClick = function(){
        $("#modal-2").click();
        console.log("trigger");
    }


    console.log("Controller running...")
}]);