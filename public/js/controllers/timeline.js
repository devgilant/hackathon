timelineApp.controller('TimelineController', TimelineController);

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
        var items = events.map(function(timeline){
         var item = {
            start: timeline.startDate;
            content: timeline.name;
            description: timeline.description;
            editable: false;
         };
         if (timeline.endDate)
            item.end = timeline.endDate;
         return item;
        });
        return items;
    };

}
