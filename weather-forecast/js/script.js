// clock 
tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function GetClock(){
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


var posLatit, posLongit, urlForecast;
var secretKey = "884587fb9dfa5db46195850678819907";

navigator.geolocation.getCurrentPosition(function(position) {
  posLatit = position.coords.latitude;
  posLongit = position.coords.longitude;
	urlForecast = "https://api.darksky.net/forecast/" + secretKey + "/" + posLatit +","+ posLongit;
	newForecast(urlForecast);
});

//884587fb9dfa5db46195850678819907
//https://api.darksky.net/forecast/[key]/[latitude],[longitude]
/*
if (urlForecast) {
	$.ajax({
		url: urlForecast,
		dataType: 'jsonp',
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
*/

function newForecast (url) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				alert("ok");
			}
		}
	};
	req.open("GET", url, true);
	req.send();
}


