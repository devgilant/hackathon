timelineApp.controller('TimelineController', TimelineController);

function TimelineController($scope, $http) {
    $scope.timelines = [];
    loadTimelines();

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Build list of timelines with populated events
     */
    function loadTimelines() {
        // call REST backend
        $http.get('/rest/timelines')
            .success(function(data) {
                $scope.timelines = data;
            });
    };
}
