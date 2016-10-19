$(document).ready(function() {
	var workDuration = $('#workDuration');
	var restDuration = $('#restDuration');
	
	//Adds functionality to plus and minus buttons
	$('#workMinus').click(function() {
		if (parseInt(workDuration.text()) <= 1) return;
		else workDuration.text(parseInt(workDuration.text()) - 1);
	});
	$('#workPlus').click(function() {
		if (parseInt(workDuration.text()) >= 90) return; //90 minute maximum 
		else workDuration.text(parseInt(workDuration.text()) + 1);
	});
	$('#restMinus').click(function() {
		if (parseInt(restDuration.text()) <= 1) return;
		else restDuration.text(parseInt(restDuration.text()) - 1);
	});
	$('#restPlus').click(function() {
		if (parseInt(restDuration.text())  >= 30) return; //30 minute maximum
		else restDuration.text(parseInt(restDuration.text()) + 1);
	});
	
	var minutes, seconds, countdown, current;
	var timeRunning = false;
	var breakTime = false;
	var initialStart = false;

	function timer() {
		if (initialStart) return;
		initialStart = true;	
		current = parseInt(workDuration.text()) * 60
		$('#start').removeClass('btn-success start').addClass('btn-info'); //changes look of start button
		$('#play-button').removeClass('fa-play').addClass('fa-pause'); 
		updateClock(); //run updateClock once so we don't have to wait a second before timer starts
		countdown = setInterval(updateClock, 1000); //updateClock every second 
		timeRunning = true;
	}

	function updateClock() {
		minutes = current / 60 | 0;
		seconds = current % 60 | 0;
		if (current === 0 && breakTime === false) { //if timer runs down from period of work, play alarm and start rest clock
			clearInterval(countdown);
			alarm();
			setTimeout(function() { //wait 5 seconds, then start rest clock
				breakTime = true;
				current = parseInt(restDuration.text()) * 60;
				countdown = setInterval(updateClock, 1000)
			}, 5000); 
			
		}
		if (current === 0 && breakTime === true) { 
			clearInterval(countdown);
			alarm();
			setTimeout(function() { //wait 5 seconds, then reset
				breakTime = false;	
				reset() 
			}, 5000); 
		}
		if (!breakTime) {
			$('#workStatus').css('color', '#FFFF4E');
			$('#restStatus').css('color', 'white');
		} else { 
			$('#workStatus').css('color', 'white');
			$('#restStatus').css('color', '#FFFF4E');
		}
		if (minutes < 10) minutes = '0' + minutes;
		if (seconds < 10) seconds = '0' + seconds;
		$('#display').text(minutes + ':' + seconds);
		current -= 1; 
	}
	
	function pause() {
		if (timeRunning) { //pause
			clearInterval(countdown);
			timeRunning = false;
		} else { //unpause
			countdown = setInterval(updateClock, 1000);
			timeRunning = true;
		}
	}
	
	function reset() {
		$('#start').removeClass('btn-info').addClass('btn-success start');
		$('#play-button').removeClass('fa-pause').addClass('fa-play');
		$('#display').text('00:00');
		$('#title').text('');
		$('#workStatus').css('color', 'white');
		$('#restStatus').css('color', 'white');
		clearInterval(countdown);
		breakTime = false;
		timeRunning = false;
		initialStart = false;
	}

	function alarm() {
		var alarmSound = new Audio('alarm.mp3');
		var alarmTimer = 4;
		alarmSound.play();
		$('#display').text('00:00');
		displayFlash = setInterval(function() {
			if (alarmTimer === 0) clearInterval(displayFlash)
			$('#display').text('')
			setTimeout(function() { $('#display').text('00:00'); }, 500);
			alarmTimer -= 1;
		}, 1000);
	}
	
	$('#start').click(function() {
		if ($(this).hasClass('start')){
			timer();
		} else {
			pause();
		}
	});
	$('#reset').click(reset)
});