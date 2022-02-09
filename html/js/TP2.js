//영화의 평점을 계산하기 위한 전역변수
var temp = 0;

//크롤링에 시간이 다른 경우가 생겨서 슬립을 걸어주기 위해 만듦
function sleep(num){	//[1/1000초]
  var now = new Date();
  var stop = now.getTime() + num;

  while(true){
    now = new Date();
	  if(now.getTime() > stop)return;
	  }
}

//검색을 누르면 호출되는 함수
function onclickSearch(){
  var wrapper = document.getElementById("starWrapper");
  var movie = String(document.getElementById("search").value);

  //아무 값도 입력하지 않았을 시, alert 띄워 줌
  if(movie === ""){
    alert("영화 이름을 검색 해주세요.");
    return;
  }

  //여기서부터 밑으로는 페이지를 깨끗하게 청소해주는 역할. 동적으로
  //정보를 계속 바꿔주기 위하여, 내부 엘리먼트들을 다 지워줌.
  var index1 = document.getElementById("index1");
  var index1_info = document.getElementById("index1_info");
  var index2 = document.getElementById("index2");
  var index2_info = document.getElementById("index2_info");
  var index3 = document.getElementById("index3");
  var index3_info = document.getElementById("index3_info");
  var staff = document.getElementById("staff");
  while(index1.hasChildNodes()){
    index1.removeChild(index1.childNodes[0]);
    index1_info.removeChild(index1_info.childNodes[0]);
  }
  while(index2.hasChildNodes()){
    index2.removeChild(index2.childNodes[0]);
    index2_info.removeChild(index2_info.childNodes[0]);
  }
  while(index3.hasChildNodes()){
    index3.removeChild(index3.childNodes[0]);
    index3_info.removeChild(index3_info.childNodes[0]);
  }
  while(staff.hasChildNodes()){
    staff.removeChild(staff.childNodes[0]);
  }
  while(wrapper.hasChildNodes()){
    wrapper.removeChild(wrapper.childNodes[0]);
  }

  var poster_wrapper = document.getElementById("poster_wrapper");
  var info_wrapper_wrapper = document.getElementById("info_wrapper_wrapper");
  while(poster_wrapper.hasChildNodes()){
    poster_wrapper.removeChild(poster_wrapper.childNodes[0]);
  }
  while(info_wrapper_wrapper.hasChildNodes()){
    info_wrapper_wrapper.removeChild(info_wrapper_wrapper.childNodes[0]);
  }
  var synopsis = document.getElementById("synopsis");
  while(synopsis.hasChildNodes()){
    synopsis.removeChild(synopsis.childNodes[0]);
  }
  var poster_title = document.getElementById("poster_title");
  while(poster_title.hasChildNodes()){
    poster_title.removeChild(poster_title.childNodes[0]);
  }

  //movie는 검색창에서 받은 value이고, 그 value를 파라미터로, crawl 함수 호출
  crawl(movie);
}

//받은 파라미터를 이용하여, 그 파라미터로 검색을 하고 필요한 정보를 가져 와서 표시해주는 함수
function crawl(value){

  //XMLHttpRequest 객체를 생성.
  var xhr = new XMLHttpRequest();

  //xhr 객체의 readyState가 바뀌었을 때
  xhr.onreadystatechange = function() {
    if(xhr.readyState==4 && xhr.status==200) {

      //DOMParser 객체를 만들고, XMLHttpRequest객체를 DOM트리로 파싱 함
      var parser = new DOMParser();
      var parsedxhr = parser.parseFromString(xhr.responseText, "text/html");
      parsedxhr.type = "document";

      //이 객체는 네이버 영화에 대한 객체인데, r_grade 클래스가 없다면, 영화 검색이 아니라는 뜻,
      //따라서 alert를 띄워 준다.
      if(parsedxhr.getElementsByClassName("r_grade")[0] === undefined){
        alert("해당 검색어에 대한 정보가 없습니다.")
        return;
      }

      //네이버 영화의 평점 부분을 가져와서 temp에 더해준다.
      temp=temp+Number(parsedxhr.getElementsByClassName("r_grade")[0].childNodes[3].childNodes[3].innerHTML);

      //이 부분은 리뷰들을 가져오는 부분으로, 가져 온 리뷰들을 테이블에 append 해준다.
      //리뷰들을 가져올 때도 마찬가지로, 영화를 가져온 것 처럼 DOM객체이기 때문에, 노드로 찾아서 가져온다.
      var index1 = document.getElementById("index1");
      var index1_info = document.getElementById("index1_info");
      index1.appendChild(parsedxhr.getElementsByClassName("sh_movie_title")[0]);
      index1_info.appendChild(parsedxhr.getElementsByClassName("txt_inline")[0].childNodes[0]);
      var index2 = document.getElementById("index2");
      var index2_info = document.getElementById("index2_info");
      index2.appendChild(parsedxhr.getElementsByClassName("sh_movie_title")[0]);
      index2_info.appendChild(parsedxhr.getElementsByClassName("txt_inline")[1].childNodes[0]);
      var index3 = document.getElementById("index3");
      var index3_info = document.getElementById("index3_info");
      index3.appendChild(parsedxhr.getElementsByClassName("sh_movie_title")[0]);
      index3_info.appendChild(parsedxhr.getElementsByClassName("txt_inline")[2].childNodes[0]);
      }
  }

  xhr.onerror = function() {
    alert("Error while getting XML.");
  }

  //밑에 url을 XMLHttpRequest객체로 만드는 부분, 마지막 부분에 value를 넣어 줌으로써, 어떤 영화던 검색이 가능하다.
  xhr.open("GET","https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query="+value);
  //send를 하면 위에 함수들이 실행이 된다.
  xhr.send();

  //영화 포스터와 간단한 정보를 가져오는 부분이다.
  var xhr_image = new XMLHttpRequest();
  xhr_image.onreadystatechange = function() {
    if(xhr_image.readyState==4 && xhr_image.status==200) {
      //위에서와 마찬가지로 돔 트리로 파싱
      var parser = new DOMParser();
      var parsedxhr = parser.parseFromString(xhr_image.responseText, "text/html");
      parsedxhr.type = "document";
      var wrapper = document.getElementById("poster_wrapper");
      var title = document.getElementById("poster_title");
      //해당 정보 부분을 크롤링 하여, append 해준다.
      wrapper.appendChild(parsedxhr.getElementsByClassName("sp_thmb")[0].childNodes[1]);
      title.appendChild(parsedxhr.getElementsByClassName("sh_movie_link")[0]);
      }
  }

  //naver에서 정보를 가져 옴.
  xhr_image.open("GET","https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query="+value);
  xhr_image.send();

  //이 부분은 youtube 에서 크롤링 하여서, 동영상을 동적으로 바꿔주는 부분이다.
  var xhr3 = new XMLHttpRequest();
  xhr3.onreadystatechange = function() {
    if(xhr3.readyState==4 && xhr3.status==200) {
      //돔 객체 파싱
      var parser = new DOMParser();
      var parsedxhr = parser.parseFromString(xhr3.responseText, "text/html");
      parsedxhr.type = "document";
      //href 부분에 유튜브 동영상의 주소가 저장된다.
      var href = String(parsedxhr.getElementsByClassName("yt-lockup-thumbnail contains-addto")[0].childNodes[0].outerHTML);
      //유튜브 동영상을 계속 바꿔주는 데 있어서, 필요한 정보는 video_id이기 때문에, 그 부분을 잘라준다.
      //video_id는 항상 v= 다음에 나오고 "로 끝난다.
      var video_id = href.split('v=');
      var parsed_video_id = video_id[1].split('"');

      //이렇게 얻어낸 video_id를 플레이어에 src 값으로 준다.
      var ytplayer = document.getElementById("ytplayer");
      ytplayer.setAttribute("src","http://www.youtube.com/embed/"+parsed_video_id[0]);
    }
  }

  xhr3.onerror = function() {
    "Error while getting XML.";
  }

  xhr3.open("GET","https://www.youtube.com/results?search_query="+value);
  xhr3.send();

  //daum에서 정보를 크롤링하는 부분
  var xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function() {
    if(xhr2.readyState==4 && xhr2.status==200) {
      var parser = new DOMParser();
      var parsedxhr = parser.parseFromString(xhr2.responseText, "text/html");
      parsedxhr.type = "document";
      var href = parsedxhr.getElementsByClassName("tit_name")[0].href;

      //daum의 html 구조가, 한번의 크롤링으로는 안되어서 이중으로 하였다.
      var xhr2_in = new XMLHttpRequest();
      xhr2_in.onreadystatechange = function() {
        if(xhr2_in.readyState==4 && xhr2_in.status==200) {

          //돔 객체 파싱
          var parser = new DOMParser();
          var parsedxhr = parser.parseFromString(xhr2_in.responseText, "text/html");
          parsedxhr.type = "document";

          //영화 평점 값을 temp에 저장
          temp = temp + Number(parsedxhr.getElementsByClassName("emph_grade")[0].innerHTML);

          //staff 부분에 정보를 띄워 줌
          var staff = document.getElementById("staff");
          staff.appendChild(parsedxhr.getElementsByClassName("movie_join movie_staff #crew")[0]);

          //synopsis 부분과, 간단한 영화 정보 부분을 가져오고 띄워 준다.
          var synopsis = document.getElementById("synopsis");
          var info_wrapper = document.getElementById("info_wrapper_wrapper");
          info_wrapper.appendChild(parsedxhr.getElementsByClassName("list_movie list_main")[0]);
          synopsis.appendChild(parsedxhr.getElementsByClassName("desc_movie")[0]);

          //평점의 평균을 계산하고 별을 찍어주는 score 함수 호출
          score();
          }
      }

      xhr2_in.onerror = function() {
        "Error while getting XML.";
      }

      xhr2_in.open("GET",href);
      xhr2_in.send();
      }
  }

  xhr2.onerror = function() {
    "Error while getting XML.";
  }

  //daum에서 크롤링
  xhr2.open("GET","http://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q="+value);
  xhr2.send();
}

//평점의 평균을 구하고, 그 평균에 맞는 별의 갯수를 출력해주는 함수.
function score(){

  //2개 사이트에서 평점을 가져왔기 때문에, /2를 해주고, 별을 최대 5개로 찍을 것이기 때문에 /2를 해서 /4가 됨
  temp = temp/4;
  var p = document.createElement("p");

  //스트링으로 찍어줄 때는 10점 만점 기준으로 찍어주고, 소수점 2자리까지 나오게 함
  p.innerHTML = String(temp*2).substring(0,4)+"/10";
  var wrapper = document.getElementById("starWrapper");
  wrapper.appendChild(p);
  //starWrapper div에 별을 출력하는 부분.
  //v는 반 별을 찍기 위해서 만듦. 찍힌 별의 갯수
  var v = 0;

  //temp에서 1을 뺀 것만큼 별을 찍어주고, V++을 해 줌
  for(var i = 0; i<temp-1;i++){
    var img = document.createElement("img");
    var wrapper = document.getElementById("starWrapper");
    img.setAttribute("src","./img/blue.png");
    img.setAttribute("class","star");
    wrapper.insertBefore(img, wrapper.childNodes[0]);
    v++;
  }

  //temp에서 찍힌 별의 갯수(v)를 빼준 값
  var halfStar=temp-v;

  //halfStar가 0.5보다 크면 반 별을 하나 찍어 줌.
  if(halfStar > 0.5){
    var img = document.createElement("img");
    var wrapper = document.getElementById("starWrapper");
    img.setAttribute("src","./img/blue_half.png");
    img.setAttribute("class","halfStar");
    var len = wrapper.childNodes.length;
    wrapper.insertBefore(img, wrapper.childNodes[len-1]);
  }

  temp=0;
}

/**
 * Youtube API 로드
 */
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * onYouTubeIframeAPIReady 함수는 필수로 구현해야 한다.
 * 플레이어 API에 대한 JavaScript 다운로드 완료 시 API가 이 함수 호출한다.
 * 페이지 로드 시 표시할 플레이어 개체를 만들어야 한다.
 */
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('gangnamStyleIframe', {
        height: '315',            // <iframe> 태그 지정시 필요없음
        width: '560',             // <iframe> 태그 지정시 필요없음
        videoId: '_OgCeA-tPGM',   // <iframe> 태그 지정시 필요없음
        playerVars: {             // <iframe> 태그 지정시 필요없음
            controls: '2'
        },
        events: {
            'onReady': onPlayerReady,               // 플레이어 로드가 완료되고 API 호출을 받을 준비가 될 때마다 실행
            'onStateChange': onPlayerStateChange    // 플레이어의 상태가 변경될 때마다 실행
        }
    });
}
function onPlayerReady(event) {
    console.log('onPlayerReady 실행');
    // 플레이어 자동실행 (주의: 모바일에서는 자동실행되지 않음)
//            event.target.playVideo();
}

var playerState;

function onPlayerStateChange(event) {
    playerState = event.data == YT.PlayerState.ENDED ? '종료됨' :
            event.data == YT.PlayerState.PLAYING ? '재생 중' :
            event.data == YT.PlayerState.PAUSED ? '일시중지 됨' :
            event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' :
            event.data == YT.PlayerState.CUED ? '재생준비 완료됨' :
            event.data == -1 ? '시작되지 않음' : '예외';

    console.log('onPlayerStateChange 실행: ' + playerState);

    // 재생여부를 통계로 쌓는다.
    collectPlayCount(event.data);
}

var played = false;
function collectPlayCount(data) {
    if (data == YT.PlayerState.PLAYING && played == false) {
        // todo statistics
        played = true;
        console.log('statistics');
    }
}
