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

// getting geolocation and url

//var km = 1.852 * miles;
// 1 mile per hour (mph) = 1.609344 kilometer per hour (kph)
// 1 mph = 0.44704 м/с

var posLatit, posLongit, urlForecast;
var secretKey = "884587fb9dfa5db46195850678819907";

navigator.geolocation.getCurrentPosition(function(position) {
  posLatit = position.coords.latitude;
  posLongit = position.coords.longitude;

	urlForecast = "https://api.darksky.net/forecast/" + secretKey + "/" + posLatit +","+ posLongit;
	newForecast(urlForecast);
});

var jsDate = Date.now();
var date = new Date(jsDate);

//884587fb9dfa5db46195850678819907
//https://api.darksky.net/forecast/[key]/[latitude],[longitude]
function newForecast(urlForecast){
	if (urlForecast) {
		$.ajax({
			url: urlForecast,
			dataType: 'jsonp'
		})
		.done(function(data) {
			console.log(data);
			var dayTempF = data.currently.temperature;
			var dayTempC = Math.round((dayTempF - 32) * 5/9);

			var nightTempF = data.currently.temperature;
			var nightTempC = Math.round((nightTempF - 32) * 5/9);

			var windSpeed = Math.round(data.currently.windSpeed * 0.44704); // convert from mph to m/s
			var humidity = data.currently.humidity * 100;
			var pressure = Math.round(data.currently.pressure * 0.75006375541921); // convert from milibars to millimeters of mercury

			$("#timezone").text(data.timezone);

			$("#day-temp").text(dayTempC);
			$("#night-temp").text(nightTempC);

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
	}	else {
		$("#error-message").css("display", "block");
	}
}

