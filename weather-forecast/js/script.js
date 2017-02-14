// clock 
function GetClock(){
	tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	
	var d=new Date();
	var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
	if(nyear<1000) nyear+=1900;
	var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;


	if(nmin<=9) nmin="0"+nmin;
	if(nsec<=9) nsec="0"+nsec;

	document.getElementById('clockbox').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+"";
	document.getElementById('time').innerHTML=""+nhour+":"+nmin+":"+nsec+"";
}

window.onload=function(){
	GetClock();
	setInterval(GetClock,1000);
}


// km = 1.852 * miles;
// 1 mile per hour (mph) = 1.609344 kilometer per hour (kph)
// 1 mph = 0.44704 м/с

//884587fb9dfa5db46195850678819907
//https://api.darksky.net/forecast/[key]/[latitude],[longitude]

var posLatit, posLongit, urlForecast;
var secretKey = "884587fb9dfa5db46195850678819907";
var jsDate = Date.now();
var todayDate = jsDate;
var dateField;
var era = 86400000;


// getting geolocation and url
navigator.geolocation.getCurrentPosition(function(position) {
  posLatit = position.coords.latitude;
  posLongit = position.coords.longitude;
	urlForecast = "https://api.darksky.net/forecast/" + secretKey + "/" + posLatit +","+ posLongit;
	newForecast(urlForecast);
}, 
	function (error) { 
	  if (error.code == error.PERMISSION_DENIED) {
	  	$("#error-message").show();
	  }
});

function setDate () {
	// set field value
	var localDate = new Date(jsDate);
	
	if (todayDate != jsDate) {
		dateField = localDate.getDate() + "/" + (parseInt(localDate.getMonth()) + 1);
		$("#date-forecast").text(dateField);
	} else {
		$("#date-forecast").text("today");
	}

	var dateDiff = (jsDate - todayDate) / 86400000;

	if (dateDiff > 7) {
		$("#error-message2").show();
		$(".forecast-panel").hide();
		$(".wrapper").css("min-height", "150px");
		return;
	} else {
		$("#error-message2").hide();
		$(".forecast-panel").show();
		$(".wrapper").css("min-height", "480px");
	}
	var jsDateUnix = Math.round(jsDate / 1000);
	var urlForecastTime = urlForecast + "," + jsDateUnix;
	
	// call forecast with time 
	newForecast(urlForecastTime);
}


$("#previous-day").on("click", function(){
	jsDate -= era;	
	setDate();
});

$("#next-day").on("click", function(){
	jsDate += era;	
	setDate();
});


function newForecast(urlForecast){
	if (urlForecast) {
		$.ajax({
			url: urlForecast,
			dataType: 'jsonp'
		})
		.done(function(data) {
			//console.log(data);
			var icon = data.currently.icon;
			var currentClass = $('body').attr('class');
			var backgroundGif;
			switch (icon) {
				case "clear-day":
				case "clear-night": backgroundGif = "clear";
					break;
				case "snow":
				case "sleet":
				case"fog": backgroundGif = "snow";
					break;
				case "cloudy":
				case "partly-cloudy-day":
				case "partly-cloudy-night": backgroundGif = "cloudy";
					break;
				case "rain": backgroundGif = "rain";
					break;
				default:
					backgroundGif = "default";
			}
			// list of available values
			/*
			clear-day, clear-night, rain, 
			snow, sleet, wind, fog, 
			cloudy, partly-cloudy-day, 
			or partly-cloudy-night
			*/

			var summary = data.currently.summary;
		
			var dayTempF = data.daily.data[0].apparentTemperatureMax;
			//var dayTempF = data.currently.temperature;
			var dayTempC = Math.round((dayTempF - 32) * 5/9);
			var nightTempF = data.daily.data[0].apparentTemperatureMin;
			//var nightTempF = data.currently.temperature;
			var nightTempC = Math.round((nightTempF - 32) * 5/9);

			var windSpeed = Math.round(data.currently.windSpeed * 0.44704); // convert from mph to m/s
			var humidity = data.currently.humidity * 100;
			var pressure = Math.round(data.currently.pressure * 0.75006375541921); // convert from milibars to millimeters of mercury

			$("body").removeClass(currentClass).addClass(backgroundGif);
	
			$("#timezone").text(data.timezone);
			$("#summary").text(summary);

			$("#day-temp").html(dayTempC + "<span class='degrees'>°С</span>");
			$("#night-temp").html(nightTempC + "<span class='degrees'>°С</span>");

			$(".wind-speed").text(windSpeed + " m/s");
			$(".humidity").text(humidity + "%");
			$(".pressure").text(pressure + " mmHg");

		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("request complete");
		});
		$(".wrapper").show();
	}
}

