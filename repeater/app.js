'use strict';

/**
 * App is primarily used for the loading of modules and routing.
 * All functionality should be organized into a module so we have a
 * cleaner separation of concerns
 */
var app = angular.module('app', ['ui.bootstrap', 'ui.date']);

/* Controller for the add-schedule.html partial */
app.controller('main', ['$scope',function($scope) {
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


app.directive('scheduleRepeater', ['$parse','$compile', function ($parse,$compile,$filter) {
	return {
		restrict: 'E',
    		replace: false,
		transclude: false,
    		templateUrl: 'schedule/partials/repeater-directive/repeater.html',
    		scope: {
        		id: '=id',
			startdate:'=startdate',
			result:'=result'
    		},
    		link: function(scope, element, attrs) {
		
			var sd = scope.startdate
			scope.$watch('startdate', function(startdate) { 
				sd = startdate;

				var startdatenum = moment(sd).day();
				console.log(startdatenum);
				
				scope.models={
					repeatFormats:[
						{title:"Daily",value:0},
						{title:"Every weekday (Monday to Friday)",value:1},
						{title:"Every Monday, Wednesday, and Friday",value:2},
						{title:"Every Tuesday, and Thursday",value:3},
						{title:"Weekly",value:4}
					],
					weeks:[1,2,3,4,5],
					days:[
						{label:'S',name:'SUN',title:'Sunday',num:0,checked:startdatenum==0 ? true:false},
						{label:'M',name:'MON',title:'Monday',num:1,checked:startdatenum==1 ? true:false},
						{label:'T',name:'TUE',title:'Tuesday',num:2,checked:startdatenum==2 ? true:false},
						{label:'W',name:'WED',title:'Wednesday',num:3,checked:startdatenum==3 ? true:false},
						{label:'T',name:'THU',title:'Thursday',num:4,checked:startdatenum==4 ? true:false},
						{label:'F',name:'FRI',title:'Friday',num:5,checked:startdatenum==5 ? true:false},
						{label:'S',name:'SAT',title:'Saturday',num:6,checked:startdatenum==6 ? true:false}
					]
				};


				scope.selectedDays();
				scope.summaryBuilder();
			});			


			scope.data={repeatFormat:0,repeatWeeks:1,days:'',times:1,endFormat:'number',endDate:'',summary:''};
			scope.summaryBuilder = function(){
				var message = {total:'',weeks:'',days:'',times:'',date:''};
				
				if(scope.data.repeatWeeks<=1){
					message.weeks = "Weekly on ";
				}else{
					message.weeks = "Every "+scope.data.repeatWeeks+" weeks on ";
				}

				if(scope.data.days.length>0){
					for(var day=0;day<scope.data.days.length;day++){
						message.days = message.days+scope.data.days[day].title+", ";
					}
				}

				if(scope.data.times>=2 && scope.data.endFormat=="number"){
					message.times = " "+scope.data.times+" times.";
				}else if(scope.data.times==1 && scope.data.endFormat=="number"){
					message.times = " "+scope.data.times+" time.";
				}else{
					message.times = '';
				}

				if(scope.data.endDate!='' && scope.data.endFormat=="date"){
					message.date=" until "+scope.data.endDate; 
				}

				if(scope.data.endFormat=="yearly"){
					var now = new Date();
					var oneYr = new Date();
					oneYr.setYear(now.getFullYear() + 1);
					scope.data.endDate = oneYr.getMonth() + 1 + "/" + oneYr.getDate()+ "/"+oneYr.getFullYear();
					message.date = " until "+scope.data.endDate;
				}
	
				message.total = message.weeks+message.days+message.times+message.date;
				scope.data.summary = message.total; 

				scope.buildDates = function(){
					var dates = []; 
					var days = [];
			
					if(scope.data.days.length>0){
						for(var day=0;day<scope.data.days.length;day++){
							days.push(scope.data.days[day].num);
							
							if(scope.data.endFormat=="number"){
								var weeks  = scope.data.repeatWeeks;
								var week = weeks;  
								for(var occurance=1;occurance<scope.data.times+1;occurance++){
									weeks=week*occurance;									
									console.log("dayIndex:"+day+" days[day]:"+days[day]+" Repeat Weeks:"+weeks+" Times:"+occurance);
									dates.push(moment(sd).day(days[day]+(weeks*7)));
									
								}
							}
							if(scope.data.endFormat=="date"){
								var start = moment(sd).day(days[day]);
								var end = moment(scope.data.endDate);
								var daysUntil = end.diff(start, 'days');
								console.log("days[day]:"+days[day]+" Start:"+start+" End:"+end+" daysUntil:"+daysUntil);

								var totalWeeks  = Math.round(daysUntil/7)>1 ? Math.round(daysUntil/7) : 1; 
								var weeks  = scope.data.repeatWeeks;
								var week = weeks;  
								for(var occurance=1;occurance<totalWeeks+1;occurance++){
									weeks=week*occurance;									
									console.log("dayIndex:"+day+" days[day]:"+days[day]+" Repeat Weeks:"+weeks+" Times:"+occurance);
									if(moment(sd).day(days[day]+(weeks*7)) <=end){								
										dates.push(moment(sd).day(days[day]+(weeks*7)));
									}else{
										break;
									}
									
								}
								

							}

							if(scope.data.endFormat=="yearly"){
								var start = moment(sd).day(days[day]);
								var end = moment(scope.data.endDate);
								var daysUntil = end.diff(start, 'days');
								console.log("days[day]:"+days[day]+" Start:"+start+" End:"+end+" daysUntil:"+daysUntil);

								var totalWeeks  = Math.round(daysUntil/7)>1 ? Math.round(daysUntil/7) : 1; 
								var weeks  = scope.data.repeatWeeks;
								var week = weeks;  
								for(var occurance=1;occurance<totalWeeks+1;occurance++){
									weeks=week*occurance;									
									console.log("dayIndex:"+day+" days[day]:"+days[day]+" Repeat Weeks:"+weeks+" Times:"+occurance);
									if(moment(sd).day(days[day]+(weeks*7)) <=end){								
										dates.push(moment(sd).day(days[day]+(weeks*7)));
									}else{
										break;
									}
									
								}
								

							}

						}
					}
					
					scope.dates = dates;
					scope.result = dates; 
				};

			};


		},
		controller: function($scope,$location,$filter){
			
			$scope.selectedDays = function () {
        			$scope.data.days = $filter('filter')($scope.models.days, {checked: true});
			}

			
		}
	}
}]);
