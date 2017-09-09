var HackathonApp = angular.module('HackathonApp', ['ui.calendar','LocalStorageModule']);

HackathonApp.factory('RequestService', ['$http', function($http) {

        function post(url, data, onSuccess, onError) {
                                $http({
                                    method: 'POST',
                                    url: url,
                                    data: data
                                })
                                        .then(function successCallback(response) {
                                            onSuccess(response);
                                        }, function errorCallback(response) {
                                            onError(response);
                                        });


                // console.log('SERVICE WORKING');
        }

        function get(url, onSuccess, onError) {
                $http({
                    method: 'GET',
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

HackathonApp.factory('AuthenticationService', ['localStorageService', '$window', '$location', function(localStorageService, $window, $location) {

    function login(data){

        localStorageService.set('token', data);
        $window.location.href = '/calendar';
    
    }

    function logout(){

        localStorageService.remove('token');
        $window.location.href = '/login'; 

    }

    function checkIfLoggedIn() {

        if(localStorageService.get('token'))
            return true;
        else
            return false;

    }

    function loggedIn(){

        var loggedInFlag = checkIfLoggedIn();
        var hostName = 'http://localhost:8000';
        
        if(loggedInFlag && angular.equals($location.absUrl(), hostName + '/login') || loggedInFlag && angular.equals($location.absUrl(), hostName + '/register')){
            $window.location.href = '/'; 
        } else if(!loggedInFlag && !angular.equals($location.absUrl(), hostName + '/login')){
            if(!angular.equals($location.absUrl(), hostName + '/register'))
                $window.location.href = '/login';
        }

    }

    function getTokenData(){

        return localStorageService.get('token');

    }

    function isAdmin(){

        var data = getTokenData();

        return data.adminFlag;

    }

    function hasAdminPrivilege(isAdmin){

        if(isAdmin){
            $window.location.href = '/';            
            console.log('ye')
        }

    }

    return {
        checkIfLoggedIn: checkIfLoggedIn,
        login:login,
        logout:logout,
        getTokenData:getTokenData,
        loggedIn:loggedIn,
        isAdmin:isAdmin,
        hasAdminPrivilege:hasAdminPrivilege
    }

}]);


HackathonApp.constant('API', {});

HackathonApp.controller('HackathonController', ['$scope','$window','RequestService', 'API', 'AuthenticationService', function ($scope, $window, RequestService, API, AuthenticationService) {
   
    $scope.alertEventOnClick = function(e){
        $("#modal-1").click();
        console.log("triggered",e);
        $scope.event = e;

        RequestService.get('http://localhost:8090/get-event-tags/' + e.id,
            function (response) {
                $scope.event.tags = response; // TODO: change to consume server
            }, function (response) {
                console.log(response);
            });

        RequestService.get('http://localhost:8090/get-participant-list/' + e.id,
            function (response) {
                $scope.event.participants = response; // TODO: change to consume server
            }, function (response) {
                console.log(response);
            });

        RequestService.get('http://localhost:8090/get-user/' + e.userid,
            function (response) {
                $scope.event.organizer = response; // TODO: change to consume server
            }, function (response) {
                console.log(response);
            });
    }

    var onSuccess = function (response) {
        response.forEach(function (event) {
            $scope.uiConfig.calendar.events.push({
                    id: event.id,
                    title: event.name,
                    start: event.dateStart,
                    end: event.dateEnd,
                    location: event.location
                });
        });
    }

    var onError = function (response) {
        console.log(response);
    }

    // Please place {userid} after /get-events
    RequestService.get('http://localhost:8090/get-events/1', onSuccess, onError);

    $scope.login = function(){
           console.log("triggered");

        AuthenticationService.login($scope.username+$scope.password);
    }

    if(AuthenticationService.checkIfLoggedIn() && $window.location.href != "https://localhost:8090/login" ){
        console.log("success");
    }else
        $window.location.href = '/login';
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


    $scope.profileClick = function(e){
        $("#modal-2").click();
        console.log(e);
    }

    $scope.addHobbies = function(){
        $("#modal-3").click();
        console.log("trigger");
    }

    $scope.createHobbies = function(){
        // $("#modal-3").click();
        console.log("trigger");
    }

    $scope.addEvents = function(){
        $("#modal-4").click();
        console.log("trigger");
    }

    $scope.createEvents = function(){
        console.log()
        RequestService.post("http://10.0.0.104:8090/create-event",
        {
            date_start : $scope.createEventStart,
               date_end  : $scope.createEventEndDate,
               name: $scope.createEventName,
               description : $scope.createEventDescription,
               pic  : "",
               fee : 0, 
               privacy : $scope.createEventPrivate,
               organization : 1,
               Location : $scope.createEventLocation,
               id : 0
        },
        function(){alert("success")},
        function(){alert("failed")})
    }

}]);