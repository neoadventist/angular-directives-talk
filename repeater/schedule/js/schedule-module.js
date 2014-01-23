
/* Controller for the add-schedule.html partial */
app.controller('main', ['$scope',($scope) {
	/* Object to hold view data in */
    $scope.data = {
        shift: {
		date:[new Date()],
		start: new Date(),
         	end: new Date()
        }
    }
		
	/* Sets the earliest date (today) that can be added to the schedule */ 
	$scope.minDate = ( $scope.minDate ) ? null : new Date();
}]);


