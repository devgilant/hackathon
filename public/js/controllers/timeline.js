timelineApp.controller('TimelineController', TimelineController);

function TimelineController() {
    var self = this;
    // list of `service` value/display objects
    self.timelines = [];
    loadTimelines();
    self.newTimeline = newTimeline;

    function newTimeline(timeline) {
        alert("Sorry! creating a new timeline " + timeline + " is not yet supported!");
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Build list of timelines with populated events
     */
    function loadServices() {
        // call REST backend
        $.getJSON('/rest/timelines', function(data) {
            self.timelines = JSON.parse(data);
        });
    });
}
