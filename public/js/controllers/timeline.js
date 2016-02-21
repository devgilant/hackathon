timelineApp.controller('TimelineController', TimelineController);
timelineApp.directive('tmTimeline', TimelineDirective);

/*
* Using vis.js, timelines have a data set of items, and optionally groups
* for baselines.
* Items are regular objects and can contain the properties 
* start, end (optional), content, group (optional), className (optional), 
* editable (optional), and style (optional)
*/

function TimelineController($scope, $http) {
    $scope.timelines = [];
    loadTimelines();
    $scope.createTimeline = createTimeline;

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
                $.each(data, function(index, timeline){
                    timeline.events = loadTimelineEvents(timeline.events);
                });
                $scope.timelines = data;
            });
    };

    function loadTimelineEvents(events) {
        // map to vis.js items
        var items = events.map(function(event){
         var item = {
            "start": event.startDate,
            "content": event.caption,
            "description": event.description,
            "editable": false
         };
         if (event.endDate)
            item.end = event.endDate;
         return item;
        });
        return items;
    };

}


function TimelineDirective($compile) {
    return function (scope, element, attrs) {
        new vis.Timeline(element[0], scope.timelines[scope.$index].events, {});
    };
}