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
    $scope.baselines = [];
    loadTimelines();
    loadBaselines();
    $scope.addEvent = addEvent;
    $scope.addBaseline = addBaseline;
    $scope.activeTimelineindex = -1;

    function addEvent() {
        var timeline = $scope.timelines[$scope.activeTimelineIndex];
        //console.log('timeline name: ' + timeline.name);
        // get event details from form
        var event_date = {};
        event_date.caption = $('#addEventModal #caption').val();
        event_date.description = $('#addEventModal #description').val();
        event_date.startDate = new Date($('#addEventModal #start').val());
        var endDate = new Date($('#addEventModal #end').val());
        if (endDate && endDate.length > 0)
            event_data.endDate = new Date(endDate);

        $http.post('/rest/events', event_data)
            .success(function(data) {
                // get event id and add it to the timeline events
                var event_id = data._id;
                $http.post('/rest/timelines/' + timeline.name + '/events', { "event_id": event_id })
                    .success(function(data) {
                        // update UI
                        $('#addEventModal').modal('hide');
                    });
            });
    }

    function addBaseline() {
        // get baseline details
        var baselineName = $('#addBaselineModal #name option:selected').text();
        $http.get('/rest/baselines/' + baselineName)
            .success(function(data) {
                var baseline = data;
                baseline.events = loadTimelineEvents(baseline.events, 2);
                var timeline = $scope.timelines[$scope.activeTimelineIndex];
                new vis.Timeline($('#timeline_' + $scope.activeTimelineIndex)[0],
                    timeline.events.join(baseline.events), [
                        { "id": 1, "content": timeline.name },
                        { "id": 2, "content": baseline.name }
                    ], {});
                $('#addBaselineModal').modal('hide');
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
                    timeline.events = loadTimelineEvents(timeline.events, 1);
                });
                $scope.timelines = data;
                $scope.activeTimelineIndex = 0;
            });
    };

    function loadBaselines() {
        // call REST backend
        $http.get('/rest/baselines')
            .success(function(data) {
                $scope.baselines = data;
            });
    };

    function loadTimelineEvents(events, group) {
        // map to vis.js items
        var items = events.map(function(event) {
            var item = {
                "start": new Date(event.startDate),
                "content": event.caption,
                "description": event.description,
                "editable": false,
                "group": group
            };
            if (event.endDate)
                item.end = new Date(event.endDate);
            return item;
        });
        return items;
    };

    $scope.accordionOpen = function(i) {
        $scope.activeTimelineIndex = i;
        $('.btn-timeline').addClass('hidden');
        $('#btnAddEvent_' + i).removeClass('hidden');
        $('#btnAddBaseline_' + i).removeClass('hidden');
    };

}


function TimelineDirective($compile) {
    return function(scope, element, attrs) {
        new vis.Timeline(element[0], scope.timelines[scope.$index].events, {});
    };
}
