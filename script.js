document.getElementById('start').addEventListener('click', start_timer);
document.getElementById('skipPauseButton').addEventListener('click', change_timer);

//variabili
let firstPlay = true;
let isPlaying = false, isStudying = true;
let time, studyTime, pauseTime, numRipetizioni;
let actualTime, startTime, timeRemaining;
let remainingAnimation, animationDuration;
let interval, resync = true, delayfix = true;

//elementi 
const styleSheet = document.createElement("style");
const circle = document.querySelector("circle");
const perimeter = circle.getAttribute("r") * 2 * Math.PI;

function init_timer(){
  time = parseInt(document.getElementById('duration').value, 10);
  startTime = Date.now();
  timeRemaining = time * 60; 
  animationDuration = time * 60;
  remainingAnimation = perimeter;
  circle.setAttribute("stroke-dasharray", perimeter);
  interval = setInterval(update_timer, 1000);
}

function update_buttons(){
  if(!isPlaying){
    document.getElementById('icon').className = document.getElementById('icon').className.replace(/(?:^|\s)bi bi-pause-fill(?!\S)/g, '');
    document.getElementById('icon').className += "bi bi-play-fill";
  }else{
    document.getElementById('icon').className = document.getElementById('icon').className.replace(/(?:^|\s)bi bi-play-fill(?!\S)/g, '');
    document.getElementById('icon').className += "bi bi-pause-fill";
  }
}

function start_timer(){
  isPlaying = true;
  init_timer();
  update_buttons();
  document.getElementById('start').removeEventListener('click', start_timer);
  document.getElementById('start').addEventListener('click', pause_on_off);
}

function pause_on_off(){
  if(isPlaying){
    clearInterval(interval);
    update_timer();
    //console.log(actualTime+" , " + timeRemaining);
  }else{
    resync = false;
    startTime = Date.now() - actualTime;
    interval = setInterval(update_timer, 1000 - actualTime%1000);
  }
  isPlaying = !isPlaying;
  update_buttons();
}

function update_timer(){
  //mi server per sincronizzare la set_interval con il timer dopo una pausa
  //(utile nel caso in cui si stoppi il timer a metà tra un secondo e l'altro)
  if(!resync){
    clearInterval(interval);
    interval = setInterval(update_timer, 1000);
    resync = true;
  }

  //necessaria perché la setInterval non è del tutto precisa
  if(!delayfix){
    clearInterval(interval);
    interval = setInterval(update_timer, 1000);
    delayfix = true;
  }

  actualTime = (Date.now() - startTime); //risultato in sec
  if(actualTime % 1000 > 997) actualTime += (12 - actualTime % 10)
  else if(actualTime % 1000 > 995){
    clearInterval(interval);
    interval = setInterval(update_timer, 1006);
    delayfix = false;
  }

  timeRemaining = (time * 60) - Math.floor(actualTime/1000);// Calcola la differenza tra il tempo di fine e il tempo corrente
  remainingAnimation -= perimeter/animationDuration;
  circle.setAttribute("stroke-dashoffset", remainingAnimation);

  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining - minutes * 60;
  document.getElementById('duration').value =  `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if(timeRemaining <= 0)
    change_timer();
}

function change_timer(){

  clearInterval(interval);
  
  if(isStudying){
    document.getElementById('timer').style.backgroundColor = "#8cc95d";
    document.getElementById('duration').style.color = "#ecfae1";
    document.getElementById('note').innerHTML = "PAUSE TIME";
    document.getElementById('duration').value = '5';
    var b = document.getElementById('skipPauseButton');
    b.style.display = "block";  
  }else{
    document.getElementById('timer').style.backgroundColor = "#f54e38";
    document.getElementById('duration').style.color = "#faeae1";
    document.getElementById('note').innerHTML = "STUDY TIME";
    document.getElementById('duration').value = '25'; 
    var b = document.getElementById('skipPauseButton');
    b.style.display = "none";     
  }

  init_timer();
  isStudying = !isStudying;
}




