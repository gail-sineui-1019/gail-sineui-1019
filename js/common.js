$(function(){
	$("#dday").delay(1000).fadeIn(3000);
	//$("#sand").fadeIn(5000).animate(
	//	{left:"90%"},7000
	//).fadeOut(1000);
	function FontSize(){
		$("body").css({
			'font-size':$(window).width()/24+'px'
		});
	};
	FontSize();
	$(".add").click(function(){
		//$("#listview").html('');
		onAdd();
	})
	$('.top a').bind('click', function(){
		$('body, html').stop().animate({ scrollTop: 0 }, 500);
		return false;
	})
	$('#default_navi').bind('click', function(){
		$("body").css({overflow:'hidden'}).bind('touchmove',function(e){e.preventDefault()});
		$('#open_navi').fadeIn(0, function(){
		$('.navibox').delay(200).animate(
			{'right':0+'px'},{
				duration: 400
			})
		});
		$(this).css({display:'none'});
		return false;
	})
	var navi_idx = null;
	var navi_arr = [$('#content'), $('#photo'), $('#direction'), $('#guest') ];
	$('#open_navi ul li').on('mousedown',function(){
		navi_idx = $(this).index();
		naviClose();
		return false;
	});
	$('#open_navi ul li a').on('click', function(){return false;})
	function naviClose(){
		$("body").css({overflow:'visible'}).unbind('touchmove');
		$('.navibox').stop().animate(
			{'right':-60+'%'},100,function(){
				$('#open_navi').fadeOut(100, function(){
				naviMove();
			});
		});
		$('#default_navi').css({display:'block'});
	};
	function naviMove(){
		if(navi_idx >= 0 && navi_idx < $('#open_navi ul li').length){
			$('body, html').stop().animate({ scrollTop: navi_arr[navi_idx].offset().top }, 500);
		}
	};
	$('#open_navi .close a').on('click', function(){
		navi_idx = -1;
		naviClose();
		return false;
	});
	$('#open_navi .dark').on('click', function(){
		navi_idx = -1;
		naviClose();
		return false;
	});
	$(window).load(function(){
		document.body.style.height = (document.documentElement.clientHeight + 5) + 'px';
		window.scrollTo(0, 1);
	});
});
var SNSWriter = {
	Link: "",
	Contents: "",
	Twitter: function(){
		var url = "http://twitter.com/";
		url += "?status=" + encodeURIComponent(this.Contents);
		url += encodeURIComponent(" " + this.Link);
		window.open(url,'','');
	},
	Facebook: function(){
	var url = "http://www.facebook.com/sharer.php";
	url += "?u=" + encodeURIComponent(this.Link);
	window.open(url,'','');
	},
	Band: function(){
	var url = "http://www.band.us/plugin/share?";
	url += "body=" + encodeURIComponent(this.Contents);
	url += encodeURIComponent(this.Link);
	window.open(url,'','');
	}
}
var ncount = 0;
var recordSize = 5;
function onAdd(){
	ncount++;
	var order_seq = "107161";
	var html = "";
	$.ajax({
		type: 'get',
		url: 'select_proc.asp?order_seq='+order_seq+'&cpage=' + ncount+'&recordSize=' + recordSize,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response){
			var data = response.data;
			var totRecord = response.tot;
			var t_page = parseInt(totRecord/recordSize)+1;
			for (var i = (ncount-1)*5; i < data.length; i++){
				html += "<li>";
				html += "<p class='msg'>"+data[i].guest_msg+"</p>";
				html += "<div class='rDate'>";
				html += data[i].guest_name+" <span>"+data[i].date+"</span>";
				html += "</div>";
				html += "</li>";
			}
			$("#listview").append(html);
			if (ncount == t_page){
				$(".add").hide();
			}
		},
		error: function (data, status, err){
			//alert('서버와의 통신이 실패했습니다.');
			$("#listview").append('error');
		}
	});
}
function regist_msg(){
	var order_seq = "107161";
	var guest_name = $("#guest_name").val();
	var guest_msg = $("#guest_msg").val();
	var AlertMessage = "아래항목을 기입해주세요.\n \n";
	var Count = 0;
	if (guest_name === ""){ AlertMessage = AlertMessage + (Count + 1) + ". 작성자 \n"; Count++;}
	if (guest_msg === ""){ AlertMessage = AlertMessage + (Count + 1) + ". 메세지\n"; Count++;}
	if (Count > 0){
		alert(AlertMessage);
		return false;
	}
	$.ajax({
		type: "POST",
		url: "regist_proc.asp?order_seq=" + order_seq + "&guest_name=" + guest_name + "&guest_msg=" + guest_msg,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response){
			alert('메시지가 방명록에 등록되었습니다');
			ncount = 0;
			$("#listview").html('');
			onAdd();
		},
		error: function(){
			alert('에러');
			ncount = 0;
			$("#listview").html('');
			onAdd();
		}
	});
}
function snsLink(a){
	SNSWriter.Link = snsForm.link.value == null ? "http://momocard.co.kr" : snsForm.link.value == "" ? "http://momocard.co.kr" : snsForm.link.value;
	SNSWriter.Contents = snsForm.content.value;
	if (a == "1") SNSWriter.Twitter();
	else if (a == "2") SNSWriter.Facebook();
	else if (a == "3") SNSWriter.Band();
}
function KakaoStoryLink(){
	kakao.link("story").send({   
		post : "http://momocard.co.kr/wwwmomo/mobile/index.html",
		appid : "momocard.co.kr",
		appver : "1.0",
		appname : "청첩장 모모카드",
		urlinfo : JSON.stringify({title:"병민" + "&" + "종민", desc:"http://momocard.co.kr/wwwmomo/mobile/index.html", imageurl:["http://momocard.co.kr/wwwmomo/mobile/img/aqw_1324.jpg"], type:"article"})
	});
}