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
    $scope.addEvent = addEvent;


    function addEvent(timeline_index) {
        // use scope.$index to find out which timeline are we on?
        var timeline = $scope.timelines[timeline_index];
        //console.log('timeline name: ' + timeline.name);
        // show a form for adding event details
        
        $http.post('/rest/events', {
                "startDate": new Date(),
                "description": "a second desc",
                "caption": "second"
            })
            .success(function(data) {
                // get event id and add it to the timeline events
                var event_id = data._id;
                $http.post('/rest/timelines/' + timeline.name + '/events', { "event_id": event_id })
                    .success(function(data) {
                        // update UI
                    });
            });
    }

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
                $.each(data, function(index, timeline) {
                    timeline.events = loadTimelineEvents(timeline.events);
                });
                $scope.timelines = data;
            });
    };

    function loadTimelineEvents(events) {
        // map to vis.js items
        var items = events.map(function(event) {
            var item = {
                "start": new Date(event.startDate),
                "content": event.caption,
                "description": event.description,
                "editable": false
            };
            if (event.endDate)
                item.end = new Date(event.endDate);
            return item;
        });
        return items;
    };

}


function TimelineDirective($compile) {
    return function(scope, element, attrs) {
        new vis.Timeline(element[0], scope.timelines[scope.$index].events, {});
    };
}
