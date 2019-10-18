
var basicParams={}; //传参
var yuData=[];
var iBtn=false;
var iClick=false;

var $echoUserID= userID;//
var $echoSmallIncome=matchIncomeStart; // 程序输出 收入第一个值
var $echoBigIncome=matchIncomeEnd;// 程序输出 收入第二个值
var $echoSmallEdu=matchEducationStart; // 程序输出 学历第一个值
var $echoBigEdu=matchEducationEnd;// 程序输出 学历第二个值
var $echoHome=matchCity;

var noLoginArr=[];
var noLoginBtn=false;
var iScrollBtn=true;
var iNameBtn=false;
var scrollNum=1;
var scrollHappen=false;

$(function(){
	baihe.bhtongji.tongji({
		'event': '3',
		'spm': '4.4.1219.262.11504'
	});
	newSearch.init();
})
var loading=$('#imloading');
// 初始化loading状态
loading.data("on",true);
newSearch={
	init:function(){
		var _this = this;
		_this.noLogin();
		_this.clickMenu();
	},
	noLogin:function(){
		var _this = this;

		//创建搜索条件span
		var $searchSpan='<span></span>';
		for(var i=0;i<12;i++){
			$('.criteria').append($searchSpan);
		}
		//点击回到顶部
		$('#searchTool .top').click(function(){
			$(window).scrollTop(0);
		});
		//最后一个span 去掉逗号
		var $lastTxt=$('.criteria span').not('span:empty').last().text();
		$('.criteria span').not('span:empty').last().text($lastTxt.substring(0,$lastTxt.length-1));
		/*
		**************		一刷新页面，根据生成的搜索条件定位条件        ***************
		*/
		//月收入  5000-7000~>50000
		var $spanIncome=$('.criteria').find('span').eq(6).text().replace(/\s+/g,"");
		if($spanIncome!=''){
			if($spanIncome.indexOf('~')>-1){
				var $txt1=$spanIncome.split('~')[0].split('-')[0];
				var $txt2=$spanIncome.split('~')[1];
				if($txt2.indexOf('>')>-1){
					$('.criteria').find('span').eq(6).text($txt1+'以上'+'，');
				}else{
					$('.criteria').find('span').eq(6).text($txt1+'~'+$txt2);
				}
			}else{
				if($spanIncome.replace(/\s+/g,"").indexOf('2000以下')>-1){
					$('.criteria').find('span').eq(6).text('2000以下'+'，');
				}else if($spanIncome.replace(/\s+/g,"").indexOf('>')>-1){
					$('.criteria').find('span').eq(6).text('50000以上'+'，');
				}else{
					var $txt1=$spanIncome.split('-')[0];
					var $txt2=$spanIncome.split('-')[1];
					$('.criteria').find('span').eq(6).text($txt1+'~'+$txt2);
				}
			}
			//月收入   3000~30000元， 2000以下   50000以上
			$echoFun($('.smallmonthlyIncome'),$('.bigmonthlyIncome'),$echoSmallIncome,$echoBigIncome);
		}else{
			$('.smallmonthlyIncome,.bigmonthlyIncome').prev().prev().find('span').text('不限');
			$('.smallmonthlyIncome,.bigmonthlyIncome').prev().removeClass('selected');
			$('.smallmonthlyIncome,.bigmonthlyIncome').prev().find('li').first().find('a').addClass('selected');
		}

		//年龄
		var $span2=$('.criteria').find('span').eq(2).text().replace(/\s+/g,"");
		var $spanAge=$span2.substring(0,$span2.length-2);
		if($spanAge!=''){
			if($spanAge.indexOf('~')==-1){	//没有区间值
				$('.smallAge').prev().prev().find('span').text($spanAge);
				$('.bigAge').prev().prev().find('span').text($spanAge);
				gainParamsNo('.smallAge','.bigAge',$spanAge);
			}else{		//有区间值
				gainParams($span2,'.smallAge','.bigAge',$span2.length-2);
			}
		}
		//身高
		var $span3=$('.criteria').find('span').eq(3).text().replace(/\s+/g,"")
		var $spanHeight=$span3.substring(0,$span3.length-3);
		if($spanHeight!=''){
			if($spanHeight.indexOf('~')==-1){	//没有区间值
				$('.smallHigh').prev().prev().find('span').text($spanHeight);
				$('.bigHigh').prev().prev().find('span').text($spanHeight);
				gainParamsNo('.smallHigh','.bigHigh',$spanHeight);
			}else{		//有区间值
				gainParams($span3,'.smallHigh','.bigHigh',$span3.length-3);
			}
		}

		//居住地区
		$('.liveCity').find('.city_input').attr('data-val',$echoHome);
		var $oneSpan=$('.criteria').find('span').eq(1).text().replace(/\s+/g,"");
		$('.liveCity').find('.city_input').val($oneSpan.substring(0,$oneSpan.length-1));

		//学历  初中~博士  初中
		var $spanEdu=$('.criteria').find('span').eq(5).text().replace(/\s+/g,"");
		if($spanEdu!=''){
			$echoFun($('.smallEducation'),$('.bigEducation'),$echoSmallEdu,$echoBigEdu);
		}else{
			$('.smallEducation,.bigEducation').prev().prev().find('span').text('不限');
			$('.smallEducation,.bigEducation').prev().removeClass('selected');
			$('.smallEducation,.bigEducation').prev().find('li').first().find('a').addClass('selected');
		}

		function $echoFun($small,$big,num1,num2){
			$big.prev().find('li').find('a').removeClass('selected');
			$small.prev().find('li').find('a').removeClass('selected');

			$big.prev().find('li').eq(num2).find('a').addClass('selected');
			$small.prev().find('li').eq(num1).find('a').addClass('selected');
			$big.prev().prev().find('span').text($big.prev().find('.selected').text());
			$small.prev().prev().find('span').text($small.prev().find('.selected').text());
		}

		//默认有照片
		$('.search_photo').prev().children().find('a').removeClass('selected');
		$('.search_photo').prev().children().find('a').eq(1).addClass('selected');
		$('.search_photo').prev().prev().find('span').text('有照片');

		//婚姻状况
		var $spanMarrige=$('.criteria').find('span').eq(4).text();
		var $spanMarrigeTxt=$spanMarrige.substring(0,$spanMarrige.length-1);
		var span4=[];
		var $MarriageArr=[];
		if($spanMarrige!=''){  //不限,未婚，
			span4=$spanMarrigeTxt.split('，');  //变成数组
			$('.marriageStatus').prev().text($spanMarrigeTxt);
			$('.marriageStatus').attr('selecttext',span4);
			$('.marriageStatus').find('li').each(function(i,elem){
				if(span4.length==1){
					if(span4==$('.marriageStatus').find('li').eq(i).text()){
						$('.marriageStatus').attr('selectid',i);
					}
				}else{
					$(span4).each(function(m,elem){
						if(span4[m]==$('.marriageStatus').find('li').eq(i).text()){
							$MarriageArr.push(i);
							$('.marriageStatus').attr('selectid',$MarriageArr);
						}
					});
				}
			});
		}else{
			$('.marriageStatus').prev().text('不限');
		}
		//有无照片
		var $spanMarrige=$('.search_photo').find('span').eq(7).text();
		if($('.search_photo').find('span').eq(7).text()=='有照片'){
			$('.search_photo').prev().find('li').find('a').removeClass('selected');
			$('.search_photo').prev().find('li').eq(1).find('a').addClass('selected');
			$('.search_photo').prev().prev().find('span').text('有照片');
		}

		//=============================================== end ======================================================
		if($echoUserID==0){
			$.ajax({
				url:'http://search.baihe.com/search/noLogin?&jsonCallBack=?',
				type:'post',
				dataType:'jsonp',
				async : true,
				success:function(data){
					if(data.state!=-1){
						if(data.code==200){
							if(data.data.length>0){
								$('.noRrsult').hide();
								var totalData=data.data;

								//剩余的userID数组
								yuData=totalData.slice(8);

								//截取8个传入接口 展示第一屏数据
								var $data=totalData.splice(0,8);

								//根据$data 填入数据
								_this.noLoginCon($data,'2');

								_this.scrollEvent(yuData); //调取滚动  将剩余的userID传入滚动函数
								waterfull();
							}else{
								$('#waterfull ul').html('');
								$('.noRrsult').show();
								$('#imloading').fadeOut(300);
							}
						}
					}else{
						window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
					}
				}
			});
		}else{
			_this.basicParams();
			_this.getPerson();
			_this.starToday();
			_this.getSelf();
			_this.searchClick();
		}

	},
	noLoginCon:function($data,$num){
		var _this = this;
		for(var i=0;i<$data.length;i++){
			var html='';
			html+="<li class='item' >";
			html+="	<div class='memberS'>";
			html+="		<a href='http://profile1.baihe.com?oppID="+$data[i].userID+"' target='_blank' class='pic'>";
			html+=$data[i].gender==1?"<img data-original='"+$data[i].headPhotoUrl+"' height='239' src='http://images6.baihe.com/icon/loadingS.gif' alt='' /><span class='online' style='display:none;'>在线</span><em style='display:none;'>今日明星</em>":"<img  data-original='"+$data[i].headPhotoUrl+"' src='http://images6.baihe.com/icon/loadingS.gif' height='239' alt=''/><span class='online' style='display:none;'>在线</span><em style='display:none;'>今日明星</em>";
			html+="		</a>";
			html+="		<div class='txt'>";
			html+="			<a href='http://profile1.baihe.com?oppID="+$data[i].userID+"' target='_blank' class='hy'>"+$data[i].nickname+"</a>";
			html+="			<p>"+$data[i].age+"岁<span>|</span>"+$data[i].height+"cm<span>|</span>"+$data[i].educationChn+"<span>|</span>"+$data[i].incomeChn+"</p>";
			html+="		</div>";
			html+="		<div class='icon'>";
			html+="			<a class='say sayHello' event='3' spm='4.4.1219.971.11505' href='http://profile1.baihe.com?oppID="+$data[i].userID+"' target='_blank'>打招呼</a>";
			html+="			<a class='send' event='3' spm='4.4.1219.970.11506' href='http://profile1.baihe.com?oppID="+$data[i].userID+"' target='_blank'>发消息</a>";
			html+="		</div>";
			html+="	</div>";
			html+="</li>";

			$(html).find('img').each(function(index){
				$(this).css('min-height','239px');
				loadImage($(this).attr('data-original'));
				$(this).attr('data-original','');
			})
			var $newElems = $(html).css({ opacity: 0});


			$('#imloading').fadeOut(300);
			$newElems.animate({ opacity: 1},800).appendTo($('#waterfull ul'));
			getTop();
			$('#waterfull ul').children().length%8==0?noLoginBtn=true:noLoginBtn=false;
			var $lastBox=$('#waterfull li').last();
			$('#waterfull').height($lastBox.offset().top-$('.iHeight').height()-$('#bhHeader').height()-50);

			identiSign($('#waterfull'),$data,$num);
			$('#waterfull').find('.pic img').click(function(){
				baihe.bhtongji.tongji({
					'event': '3',
					'spm': '4.4.1219.4213.11507'
				});
			});

			$('#waterfull').find('.pic img').removeAttr('data-original');
			errorImg(img,$data);
			$('#waterfull').css('minHeight','700px');
			$('#waterfull').height($lastBox.offset().top-$('.iHeight').height()-$('#bhHeader').height()+359);
		};
	},
	//判断自己身份 和 照片
	getSelf:function(){
		var _this = this;
		$.ajax({
			url:'http://search.baihe.com/search/getUserList?userIDs='+$echoUserID+'&jsonCallBack=?',
			type:'post',
			async : true,
			dataType:'jsonp',
			success:function(data){
				if(data.code==200){
					var $data = data.data[0];
					if($data.headPhotoUrl==''){
						if(baihe.cookie.getCookie("hasphoto")){
							return;
						}
						baihe.cookie.setCookie('hasphoto', '1','','/','.baihe.com');
						uploadPhotos();
					}
				}
			}
		});
	},
	//传参
	basicParams:function(){
		//年龄
		var $span2=$('.criteria').find('span').eq(2).text().replace(/\s+/g,"");
		var $spanAge=$span2.substring(0,$span2.length-2);
		if($spanAge!=''){
			if($spanAge.indexOf('~')==-1){	//没有区间值
				$('.smallAge').prev().prev().find('span').text($spanAge);
				$('.bigAge').prev().prev().find('span').text($spanAge);
				gainParamsNo('.smallAge','.bigAge',$spanAge);
			}else{		//有区间值
				gainParams($span2,'.smallAge','.bigAge',$span2.length-2);
			}
		}
		//身高
		var $span3=$('.criteria').find('span').eq(3).text().replace(/\s+/g,"")
		var $spanHeight=$span3.substring(0,$span3.length-3);
		if($spanHeight!=''){
			if($spanHeight.indexOf('~')==-1){	//没有区间值
				$('.smallHigh').prev().prev().find('span').text($spanHeight);
				$('.bigHigh').prev().prev().find('span').text($spanHeight);
				gainParamsNo('.smallHigh','.bigHigh',$spanHeight);
			}else{		//有区间值
				gainParams($span3,'.smallHigh','.bigHigh',$span3.length-3);
			}
		}
		//年龄
		var $smallAge=$('.smallAge').prev().find('.selected').text()=='不限'?'':$('.smallAge').prev().find('.selected').text();
		var $bigAge=$('.bigAge').prev().find('.selected').text()=='不限'?'0':$('.bigAge').prev().find('.selected').text();
		//身高
		var $smallHigh=$('.smallHigh').prev().find('.selected').text()=='不限'?'':$('.smallHigh').prev().find('.selected').text();
		var $bigHigh=$('.bigHigh').prev().find('.selected').text()=='不限'?'':$('.bigHigh').prev().find('.selected').text();
		//学历
		var $smallEducation=$('.smallEducation').prev().prev().text()=='不限'?'1':$('.smallEducation').prev().find('.selected').attr('index');
		var $bigEducation=$('.bigEducation').prev().prev().text()=='不限'?'8':$('.bigEducation').prev().find('.selected').attr('index');
		//恋爱类型
		var $loveType=$('.loveType').prev().text().indexOf('不限')>-1?'':$('.loveType').attr('selectid');
		//婚姻状况
		var $marriageStatus=$('.marriageStatus').prev().text().indexOf('不限')>-1?'':$('.marriageStatus').attr('selectid');
		//月收入
		var $smallmonthIncome=$('.smallmonthlyIncome').prev().find('.selected').text()=='不限'?'1':$('.smallmonthlyIncome').prev().find('.selected').attr('index');
		var $bigmonthIncome=$('.bigmonthlyIncome').prev().find('.selected').text()=='不限'?'12':$('.bigmonthlyIncome').prev().find('.selected').attr('index');
		if($bigmonthIncome=='50000以上'){
			$bigmonthIncome='12';
		}
		//居住地
		var $liveCity=$('.liveCity').find('.city_input').attr('data-val')?$('.liveCity').find('.city_input').attr('data-val'):'';
		//民族
		var $search_nation=$('.search_nation').prev().text().indexOf('不限')>-1?'':$('.search_nation').attr('selectid');
		//职业
		var $search_career=$('.search_career').prev().text().indexOf('不限')>-1?'':$('.search_career').attr('selectid');
		//有无子女
		var $search_children=$('.search_children').prev().text().indexOf('不限')>-1?'':$('.search_children').attr('selectid');
		//星座
		var $search_constellation=$('.search_constellation').prev().text().indexOf('不限')>-1?'':$('.search_constellation').attr('selectid');
		//血型
		var $search_blood=$('.search_blood').prev().text().indexOf('不限')>-1?'':$('.search_blood').attr('selectid');
		//宗教
		var $search_religion=$('.search_religion').prev().text().indexOf('不限')>-1?'':$('.search_religion').attr('selectid');
		//是否为会员
		var $search_member=$('.search_member').prev().find('.selected').text()=='不限'?'':$('.search_member').prev().find('.selected').attr('index');
		//是否在线
		var $search_online=$('.search_online').prev().find('.selected').text()=='不限'?'':$('.search_online').prev().find('.selected').attr('index');
		//是否实名
		var $search_indentify=$('.search_indentify').prev().find('.selected').text()=='不限'?'':$('.search_indentify').prev().find('.selected').attr('index');
		//是否有照片
		var $search_photo=$('.search_photo').prev().find('.selected').text()=='不限'?'0':$('.search_photo').prev().find('.selected').attr('index');
		//购房情况
		var $search_house=$('.search_house').prev().text().indexOf('不限')>-1?'':$('.search_house').attr('selectid');
		//购车情况
		var $search_car=$('.search_car').prev().text().indexOf('不限')>-1?'':$('.search_car').attr('selectid');
		//家乡
		var $homeCity=$('.search_home').find('.city_input').attr('data-val')?$('.search_home').find('.city_input').attr('data-val'):'';

		/*
		*	传参
		*/
		basicParams = {
			"minAge" : $smallAge,
			"maxAge" : $bigAge,
			"minHeight" : $smallHigh,
			"maxHeight" : $bigHigh,
			"education" : $smallEducation+'-'+$bigEducation,
			"loveType" : $loveType,
			"marriage" : $marriageStatus,
			"income" : $smallmonthIncome+'-'+$bigmonthIncome,
			"city" : $liveCity,
			"nationality" : $search_nation,  //高级begin
			"occupation" : $search_career,
			"children" : $search_children,
			"bloodType" : $search_blood,
			"constellation" : $search_constellation,
			"religion" : $search_religion,
			"online" : $search_online,
			"isPayUser" : $search_member,
			"isCreditedByAuth" : $search_indentify,
			"hasPhoto" : $search_photo,
			"housing" : $search_house,
			"car" : $search_car,
			"homeDistrict" : $homeCity,
			"page" : scrollNum,
			'sorterField' : $('#sortLayer').find('.active').index(),
		};
		if($echoUserID==0){  //没有登录，也没有搜索过
			basicParams='';
		}
	},
	//获取userID
	getPerson:function(){
		var _this = this;
		$.ajax({
			url:'http://search.baihe.com/Search/getUserID?&jsonCallBack=?',
			type:'post',
			data:basicParams,
			async : true,
			dataType:'jsonp',
			success:function(data){
				if(data.state!=-1){
					if(data.code==200){
						if(data.data.length>0){
							$('.noRrsult').hide();
							$('#waterfull').show();
							//根据获取的userID 调取获取资料接口
							totalData=data.data;

							//剩余的userID数组
							yuData=totalData.slice(8);

							//截取8个传入接口 展示第一屏数据
							var $data1=totalData.splice(0,8);

							//根据userID 取用户资料
							_this.getInfo($data1,'2');
							waterfull();
							_this.scrollEvent(yuData); //调取滚动  将剩余的userID传入滚动函数
						}else{
							if(scrollHappen){ //已经发生了滚动，则不需要清空页面
								return;
								alert('没有数据了');
							}else{
								$('#waterfull ul').html('');
								$('.noRrsult').show();
								$('#waterfull').hide();
								$('#imloading').fadeOut(300);
							}
						}
					}else if(data.code==500){  //同盾
						baihe.block({
							title: '提示',
							text: '您搜索过于频繁，请稍后再试~'
						});
					}
				}else{
					window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
				}
			}
		});

	},
	//根据userID 取用户资料
	getInfo:function($data,$num){
		var _this=this;
		$.ajax({
			url:'http://search.baihe.com/search/getUserList?userIDs='+$data+'&jsonCallBack=?',
			type:'post',
			dataType:'jsonp',
			async : true,
			success:function(data){
				if(data.state!=-1){
					if(data.code==200){
						if(data.data.length>0){
							$(data.data).each(function(i,elem){
								var $data=data.data[i];
								_this.getInfoContent($data,$num,i);
							});
						}else{
							$('#imloading').fadeOut(300);
						}
					}
				}else{
					window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
				}
			}
		});
	},
	getInfoContent:function($data,$num,i){
		var html='';
			html+=$num=='1'?"":"<li class='item' >";
			html+="	<div class='memberS'>";
			html+="		<a href='http://profile1.baihe.com?oppID="+$data.userID+"' target='_blank' class='pic'>";
			html+=$data.gender==1?"<img data-original='"+$data.headPhotoUrl+"' src='http://images6.baihe.com/icon/loadingS.gif' alt='' height='239'/><span class='online' style='display:none;'>在线</span><em style='display:none;'>今日明星</em>":"<img  data-original='"+$data.headPhotoUrl+"' src='http://images6.baihe.com/icon/loadingS.gif' height='239' alt=''/><span class='online' style='display:none;'>在线</span><em style='display:none;'>今日明星</em>";
			html+="		</a>";
			html+="		<div class='txt'>";
			html+="			<a href='http://profile1.baihe.com?oppID="+$data.userID+"' target='_blank' class='hy'>"+$data.nickname+"</a>";
			html+="			<p>"+$data.age+"岁<span>|</span>"+$data.height+"cm<span>|</span>"+$data.educationChn+"<span>|</span>"+$data.incomeChn+"</p>";
			html+="		</div>";
			html+="		<div class='icon'>";
			html+=$num=='1'?"<a href='javascript:;' class='say sayHello' onclick='greet(\""+$data.userID+"\",\"02.00.10404\"); baihe.bhtongji.tongji({\"event\": \"3\",\"spm\": \"4.4.1158.971.11522\"})'>打招呼</a>":"<a href='javascript:;' class='say sayHello' onclick='greet(\""+$data.userID+"\",\"02.00.10401\"); baihe.bhtongji.tongji({\"event\": \"3\",\"spm\": \"4.4.1219.971.11505\"})'>打招呼</a>";
			html+=$num=='1'?"<a href='javascript:;' class='send' onclick='sendMessage(\""+$data.userID+"\",\"01.00.10405\"); baihe.bhtongji.tongji({\"event\": \"3\",\"spm\": \"4.4.1158.970.11523\"})' class='send'>发消息</a>":"<a href='javascript:;' class='send' onclick='sendMessage(\""+$data.userID+"\",\"01.00.10402\");baihe.bhtongji.tongji({\"event\": \"3\",\"spm\": \"4.4.1219.970.11506\"})' class='send'>发消息</a>";
			html+="		</div>";
			html+="	</div>";
			html+=$num=='1'?"":"</li>";
			$(html).find('img').each(function(index){
				loadImage($(this).attr('data-original'));
			})

			var $newElems = $(html).css({ opacity: 0});
			if($num=='1'){
				$(html).animate({opacity: 1},800);
				$(html).appendTo($('.stars'));
				$(".stars .pic img").lazyload({
					placeholder : "",
					effect: "fadeIn"
				});
			}else{
				$('#imloading').fadeOut(300);
				$newElems.animate({ opacity: 1},800).appendTo($('#waterfull ul'));
				getTop();
				$('#waterfull ul').children().length%8==0?iScrollBtn=true:iScrollBtn=false;
				waterfull();
				var $lastBox=$('#waterfull li').last();
				$('#waterfull').height($lastBox.offset().top-$('.iHeight').height()-$('#bhHeader').height()-50);
			}

			if($num==1){
				identiSign($('.stars'),$data,$num);
				$('.stars').find('.pic em').show();
				$('.stars').find('.pic img').click(function(){
					baihe.bhtongji.tongji({
						'event': '3',
						'spm': '4.4.1158.4213.11524'
					});
				});

			}else{
				identiSign($('#waterfull'),$data,$num);
				$('#waterfull').find('.pic img').click(function(){
					baihe.bhtongji.tongji({
						'event': '3',
						'spm': '4.4.1219.4213.11507'
					});
				});
			}
			$('#waterfull').find('.pic img').removeAttr('data-original');
			//--默认图片
			var img=document.getElementsByTagName('img');
			errorImg(img,$data);
			$('#waterfull').css('minHeight','500px');
	},

	//今日明星
	starToday:function(){
		var _this=this;
		var $total=[];
		if($echoUserID!=0){
			$('.starsMore').show();
			var $yuData = []; //空JSON 数据集
			var $yu=[];
			$.ajax({
				url:'http://search.baihe.com/Search/todayStarList?&jsonCallBack=?',
				type:'post',
				async : true,
				dataType:'jsonp',
				success:function(data){
					if(data.state!=-1){
						if(data.code==200){
							$total=data.data;

							//剩余的userID数组
							$yuData=$total.slice(4);

							//截取4个传入接口 展示第一屏数据
							var $data1=$total.splice(0,4);

							//根据userID 取用户资料
							_this.getInfo($data1,'1');

							_this.clickStar($yuData);


						}
					}else{
						window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
					}
				}
			});
		}else{
			$('.starsMore').hide();
		}

	},
	//点击更换今日明星
	clickStar:function($data){
		var _this=this;
		var $yuData=[];
		$('.starsMore').click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1158.4218.11525'
			});
			$('.stars').html('').height(358);
			//剩余的userID数组
			$yuData=$data.slice(4);
			//截取4个传入接口 展示第一屏数据
			var $data1=$data.splice(0,4);

			if($yuData.length>0){
				//根据userID 取用户资料
				_this.getInfo($data1,'1');
			}else{
				_this.starToday();
			}

		});

	},
	scrollEvent:function($data){
		var _this=this;
		var dataNum=1;

		//$data 除去第一屏之外剩余的userid
		var dataArr=$data;
		var $yuData = []; //空JSON 数据集
		var $yu=[];
		$(window).on('scroll',function(){

			if($echoUserID==0 && checkScrollSlide() && iScrollBtn){		//没有登录时滚动
				scrollHappen=true;	//判断已经发生了滚动
				noLoginBtn=false;
				//剩余的userID数组
				$yu=yuData.slice(8);
				getTop();
				//每次点击获取userID数组
				$yuData=yuData.splice(0,8);
				if($yuData.length==0){
					scrollNum+=1; //滚动页面 页码重新设为1
					console.log('没有了！！！！');
					$('#imloading').fadeOut(300);
					_this.basicParams();
					_this.getPerson();	//没有了 再重新获取userID 再取人
					window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
				}else{
					$('#imloading').fadeIn(300);
					_this.noLoginCon($yuData,'2');
					waterfull();
				}
			}else{
				if(checkScrollSlide() && iScrollBtn){
					scrollHappen=true;//判断已经发生了滚动
					iScrollBtn=false;
					//剩余的userID数组
					$yu=yuData.slice(8);
					getTop();
					//每次点击获取userID数组
					$yuData=yuData.splice(0,8);

					if($yuData.length==0){
						scrollNum+=1;
						$('#imloading').fadeOut(300);
						_this.basicParams();
						_this.getPerson();//没有了 再重新获取userID 再取人
					}else{
						$('#imloading').fadeIn(300);
						_this.getInfo($yuData,'2');
						waterfull();
					}
				}
			}
			function checkScrollSlide() {
				var $lastBox=$('#waterfull li').last();
				if($lastBox.length>0){
					var lastBoxDis=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
					var scrollTop=$(window).scrollTop();
					var documentH=$(window).height();
					if($echoUserID==0){
						$('#waterfull').height($lastBox.offset().top-$('.iHeight').height()-$('#bhHeader').height()+350);
					}else{
						$('#waterfull').height($lastBox.offset().top-$('.iHeight').height()-$('#bhHeader').height()-50);
					}
				}
				return (lastBoxDis<scrollTop+documentH)?true:false;
			}
		});
	},
	/*
	*   ---------搜索按钮点击
	*/
	searchClick:function(){
		var _this=this;
		//点击 男女按钮
		$('#nicknameLayer').find('label').click(function(){
			$('#nicknameLayer').find('label').find('a').removeClass('radioChecked');
			$(this).find('a').addClass('radioChecked');
		});
		/*
		*	两个选择框  如果选择比前一个值小 则不能选
		*/
		$('.smallEducation').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect($index,$(this),$('.bigEducation'));
		});
		$('.smallHigh').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect($index,$(this),$('.bigHigh'));
			$('.bigHigh').prev().height(250).css('overflow-y','scroll');

		});
		$('.smallAge').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect($index,$(this),$('.bigAge'));
		});
		$('.smallmonthlyIncome').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect($index,$(this),$('.bigmonthlyIncome'));
		});

		/*
		*	两个选择框  如果先选择后面的值 则前面的值不能有大于后面的值
		*/
		$('.bigHigh').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect2($index,$(this),$('.smallHigh'));
			$('.bigHigh').prev().height(250).css('overflow-y','scroll');
		});
		$('.bigEducation').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect2($index,$(this),$('.smallEducation'));
		});
		$('.bigAge').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect2($index,$(this),$('.smallAge'));
			$('.bigAge').prev().height(250).css('overflow-y','scroll');
		});
		$('.bigmonthlyIncome').prev().find('a').click(function(){
			var $index=$(this).parent().index();
			twoSelect2($index,$(this),$('.smallmonthlyIncome'));
		});
		function twoSelect2($index,$this,obj){
			obj.prev().find('li').show();
			obj.prev().height('auto');
			if(parseFloat($this.attr('index'))<parseFloat(obj.prev().find('.selected').attr('index'))){  //针对一刷新的时候 后面可以选择比前面小的
				obj.prev().find('li').find('a').removeClass('selected');
				obj.prev().find('li').eq($index).find('a').addClass('selected');
				obj.prev().prev().find('span').text(obj.prev().find('.selected').text());
			}
			obj.prev().height(250).css('overflow-y','scroll');
			$('.smallEducation').prev().height('auto');
		}
		function twoSelect($index,$this,obj){
			obj.prev().find('li').show();
			obj.prev().height('auto');
			obj.prev().find('li:lt('+$index+')').hide();
			if(parseFloat($this.attr('index'))>parseFloat(obj.prev().find('.selected').attr('index'))){
				obj.prev().children().find('a').removeClass('selected');
				obj.prev().find('li').eq($index).find('a').addClass('selected');
				obj.prev().prev().find('span').text(obj.prev().find('.selected').text());
			}
			obj.prev().height(250).css('overflow-y','scroll');
		}
		//=========================================================================
		/*
		*	------------------搜索按钮点击 begin
		*/
		//智能排序
		$('#sortLayer').find('a').click(function(){
			scrollNum=1; //滚动页面 页码重新设为1
			$(this).addClass('active').siblings().removeClass('active');
			_this.basicParams();
			automaticSort($(this).index());
			scrollHappen=false;  //点击将滚动参数设为false
		});

		function automaticSort($index){
			$.ajax({
				url:'http://search.baihe.com/Search/getUserID?&jsonCallBack=?',
				type:'post',
				data:basicParams,
				dataType:'jsonp',
				async : true,
				success:function(data){
					if(data.state!=-1){
						if(data.code==200){
							if(data.data.length>0){
								$('.noRrsult').hide();
								$('#waterfull ul').html('');
								$('#waterfull').show();
								//根据获取的userID 调取获取资料接口
								//console.log(data.data);
								var totalData=data.data;
								//剩余的userID数组
								yuData=totalData.slice(8);
								//截取8个传入接口 展示第一屏数据
								var $data1=totalData.splice(0,8);

								_this.getInfo($data1,'2');
							}else{
								$('#waterfull ul').html('');
								$('.noRrsult').show();
								$('#waterfull').hide();
								$('#imloading').fadeOut(300);
							}
						}
					}else{
						window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
					}
				}
			})
		}
		//基本资料按钮点击
		$('.basicSearch').click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.89.684.11510'
			});
			if(iNameBtn){
				$('.criteria').find('span').text('');
				iNameBtn=false;
			}
			scrollHappen=false;  //点击将滚动参数设为false

			scrollNum=1;  //滚动页面 页码重新设为1
			//搜索按钮点击设置 搜索条件值
			getValue();

			$('#basicLayer').slideUp(300);
			$('#waterfull ul').html('');

			_this.basicParams();
			_this.getPerson();
			iClick=true;
		});
		//高级资料按钮点击
		$('.seniorSearch').click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1220.684.11512'
			});
			scrollNum=1; //滚动页面 页码重新设为1
			scrollHappen=false;  //点击将滚动参数设为false
			if(iNameBtn){
				$('.criteria').find('span').text('');
				iNameBtn=false;
			}
			$('#seniorLayer').slideUp(300);
			$('#waterfull ul').html('');

			_this.basicParams();
			getValue();

			_this.getPerson();
			iClick=true;
		});

		/*
		*************************		搜索按钮点击设置 搜索条件值       ************************
		*/
		function getValue(){
			//居住地
			if($('.liveCity').find('.city_input').val()=='不限'){
				$('.criteria').find('span').eq(1).text('中国'+$('.liveCity .provinceAll').find('.current').text()+'，');
			}else{
				$('.criteria').find('span').eq(1).text($('.liveCity').find('.city_input').val()+'，');
			}
			//年龄
			if($('.smallAge').prev().find('.selected').text()==$('.bigAge').prev().find('.selected').text()){
				$('.criteria').find('span').eq(2).text($('.smallAge').prev().find('.selected').text()+'岁，');
			}else{
				$('.criteria').find('span').eq(2).text($('.smallAge').prev().find('.selected').text()+'~'+$('.bigAge').prev().find('.selected').text()+'岁，');
			}

			//身高
			if($('.smallHigh').prev().find('.selected').text()==$('.bigHigh').prev().find('.selected').text()){
				$('.criteria').find('span').eq(3).text($('.smallHigh').prev().find('.selected').text()+'cm'+'，');
			}else{
				$('.criteria').find('span').eq(3).text($('.smallHigh').prev().find('.selected').text()+'~'+$('.bigHigh').prev().find('.selected').text()+'cm'+'，');
			}

			//婚姻状况
			if($('.marriageStatus').prev().text()!='不限'){
				$('.criteria').find('span').eq(4).text($('.marriageStatus').prev().text()+'，');
			}else{
				$('.criteria').find('span').eq(4).text('');
			}
			//学历
			if($('.smallEducation').prev().find('.selected').text()!='不限' && $('.bigEducation').prev().find('.selected').text()!='不限'){
				if($('.smallEducation').prev().find('.selected').text()==$('.bigEducation').prev().find('.selected').text()){
					$('.criteria').find('span').eq(5).text($('.smallEducation').prev().find('.selected').text()+'，');
				}else{
					$('.criteria').find('span').eq(5).text($('.smallEducation').prev().find('.selected').text()+'~'+$('.bigEducation').prev().find('.selected').text()+'，');
				}

			}else if($('.smallEducation').prev().find('.selected').text()=='不限' && $('.bigEducation').prev().find('.selected').text()!='不限'){
				$('.criteria').find('span').eq(5).text($('.bigEducation').prev().find('.selected').text()+'以下，');
			}else if($('.smallEducation').prev().find('.selected').text()!='不限' && $('.bigEducation').prev().find('.selected').text()=='不限'){
				$('.criteria').find('span').eq(5).text($('.bigEducation').prev().find('.selected').text()+'以上，');
			}else{
				$('.criteria').find('span').eq(5).text('');
			}
			//收入
			var $smallTxt=$('.smallmonthlyIncome').prev().find('.selected').text();
			var $bigTxt=$('.bigmonthlyIncome').prev().find('.selected').text();
			if($smallTxt!='不限' && $smallTxt!='2000以下' && $bigTxt!='不限' && $bigTxt!='50000以上'){
				if($smallTxt==$bigTxt){
					$('.criteria').find('span').eq(6).text($('.smallmonthlyIncome').prev().find('.selected').text());
				}else{
					$('.criteria').find('span').eq(6).text($('.smallmonthlyIncome').prev().find('.selected').text()+'~'+$('.bigmonthlyIncome').prev().find('.selected').text()+'，');
				}

			}else if($smallTxt=='不限' && $bigTxt!='不限' && $bigTxt!='50000以上'){
				$('.criteria').find('span').eq(6).text($('.bigmonthlyIncome').prev().find('.selected').text()+'以下，');
			}else if($smallTxt=='2000以下' && $bigTxt!='不限' && $bigTxt!='50000以上'){
				$('.criteria').find('span').eq(6).text($('.bigmonthlyIncome').prev().find('.selected').text()+'以下，');
			}else if($smallTxt!='不限' && $smallTxt!='2000以下' && $smallTxt!='50000以上' && $bigTxt!='不限'){
				$('.criteria').find('span').eq(6).text($('.smallmonthlyIncome').prev().find('.selected').text()+'以上，');
			}else if($smallTxt!='不限' && $smallTxt!='2000以下' && $smallTxt!='50000以上' && $bigTxt!='50000以上'){
				$('.criteria').find('span').eq(6).text($('.smallmonthlyIncome').prev().find('.selected').text()+'以上，');
			}else if($smallTxt=='50000以上' && $bigTxt=='50000以上'){
				$('.criteria').find('span').eq(6).text('50000以上，');
			}else if($smallTxt=='不限' && $bigTxt=='50000以上'){
				$('.criteria').find('span').eq(6).text('');
			}else if($smallTxt=='2000以下' && $bigTxt=='50000以上'){
				$('.criteria').find('span').eq(6).text('');
			}else{
				$('.criteria').find('span').eq(6).text('');
			}

			//照片
			if($('.search_photo').prev().find('.selected').text()!='不限'){
				$('.criteria').find('span').eq(7).text($('.search_photo').prev().find('.selected').text()+'，');
			}else{
				$('.criteria').find('span').eq(7).text('');
			}
			//恋爱类型
			if($('.loveType').prev().text()!='不限' || $('.loveType').prev().text()==''){
				$('.criteria').find('span').eq(8).text($('.loveType').attr('selecttext')+'，');
			}else{
				$('.criteria').find('span').eq(8).text('');
			}

			//民族
			$prevF($('.search_nation'),'9');
			//职业
			$prevF($('.search_career'),'10');
			//有无子女
			$prevF($('.search_children'),'11');
			//星座
			$prevF($('.search_constellation'),'12');
			//血型
			$prevF($('.search_blood'),'13');
			//宗教
			$prevF($('.search_religion'),'14');
			//购房
			$prevF($('.search_house'),'15');
			//购车
			$prevF($('.search_car'),'16');
			//会员
			$prevF2($('.search_member'),'17');
			//在线
			$prevF2($('.search_online'),'18');
			//实名
			$prevF2($('.search_indentify'),'19');
			//家乡
			$addressF($('.search_home'),'20');
			//户口
			//$addressF($('.search_city'),'21');

			function $addressF(obj,$num){
				if(obj.find('.city_input').attr('data-val')){
					if(obj.find('.city_input').attr('data-val').length==4){
						$('.criteria').find('span').eq($num).text('中国-'+obj.find('.provinceAll').find('.current').text()+'，');
					}else if(obj.find('.city_input').attr('data-val').length==6){
						$('.criteria').find('span').eq($num).text('中国'+obj.find('.provinceAll').find('.current').text()+'-'+obj.find('.cityAll').find('.current').text()+'，');
					}
				}
			}
			function $prevF2(obj,$num){
				if(obj.prev().prev().text()!='不限' && obj.prev().prev().text()!=''){
					$('.criteria').find('span').eq($num).text(obj.prev().prev().text().replace(/\s+/g,"")+'，');
				}else{
					$('.criteria').find('span').eq($num).text('');
				}
			}
			function $prevF(obj,$num){
				if(obj.prev().text()!='不限' && obj.prev().text()!=''){
					$('.criteria').find('span').eq($num).text(obj.prev().text().replace(/\s+/g,"")+'，');
				}else{
					$('.criteria').find('span').eq($num).text('');
				}
			}
		}
		//昵称搜索按钮点击
		$('.nickSearch').click(function(){
			iNameBtn=true;
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1221.684.11514'
			});
			scrollHappen=false;  //点击将滚动参数设为false
			scrollNum=1;  //滚动页面 页码重新设为1
			if($('.searchName').val()!='' && $('.searchName').val()!='请输入昵称'){
				//搜索条
				$('.criteria').find('span').text('');
				$('.criteria').find('span').eq(8).text('性别：'+$('#nicknameLayer .radioChecked').parent().parent().text()+'，昵称：'+$('.searchName').val()+'，');
				//最后一个span 去掉逗号
				var $lastTxt=$('.criteria').find('span').eq(8).text();
				$('.criteria').find('span').eq(8).text($lastTxt.substring(0,$lastTxt.length-1));

				var $val=$('.searchName').val();
				var $gender=$('#nicknameLayer').find('.radioChecked').next().val();
				$('#nicknameLayer').slideUp(300);
				var $dataParam = {
					'nickname' : $val,
					'gender' : $gender,
				}
				$('#waterfull ul').html('');
				$.ajax({
					url:'http://search.baihe.com/Search/getUserID?&jsonCallBack=?',
					type:'post',
					data:$dataParam,
					dataType:'jsonp',
					async : true,
					success:function(data){
						if(data.state!=-1){
							if(data.code==200){
								if(data.data.length>0){
									$('.noRrsult').hide();
									$('.noRrsult').hide();
									//根据获取的userID 调取获取资料接口
									var totalData=data.data;

									//剩余的userID数组
									yuData=totalData.slice(8);

									//截取8个传入接口 展示第一屏数据
									var $data1=totalData.splice(0,8);

									//根据userID 取用户资料
									_this.getInfo($data1,'2');
									waterfull();
									_this.scrollEvent(yuData); //调取滚动  将剩余的userID传入滚动函数
								}else{
									$('.noRrsult').show();
								}
							}else if(data.code==500){
								baihe.block({
									title: '提示',
									text: '您搜索过于频繁，请稍后再试~'
								});
							}
						}else{
							window.location.href='http://my.baihe.com/login/?ReturnUrl=http://search.baihe.com/';
						}
					}
				})
			}
			iClick=true;
		});
	},
	clickMenu:function(){
		//智能排序
		$('#sort').click(function(event){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1219.4214.11508'
			});
			if($echoUserID==0){
				window.location.href='http://my.baihe.com';
			}else{
				if($('#sortLayer')[0].style.display=='block'){
					$('.dataHide').hide();
				}else{
					$('.dataHide').hide();
					$('#sortLayer').slideDown();
				}
				$(this).addClass('active').siblings().removeClass('active');
			}
			event.stopPropagation();
		});
		//基本

		$('#basic').click(function(event){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1219.3936.11509'
			});
			if($echoUserID==0){
				window.location.href='http://my.baihe.com';
			}else{
				//点击根据搜索 设置
				if($('#basicLayer')[0].style.display=='block'){
					$('.dataHide').hide();
				}else{
					$('.dataHide').hide();
					$('#basicLayer').slideDown();
				}
			}
			$(this).addClass('active').siblings().removeClass('active');
			event.stopPropagation();
		});
		//没有结果页 点击设置搜索条件
		$('.noRrsult').find('a').eq(0).click(function(event){
			$('#basic').trigger('click');
			event.stopPropagation();
		});
		//高级
		$('#senior').click(function(event){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1219.4215.11511'
			});

			event.stopPropagation();
		});
		//昵称
		$('#nickname').click(function(event){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1219.4216.11513'
			});
			event.stopPropagation();
		});

		//点击面板时不隐藏
		$('#sortLayer,#basicLayer,#seniorLayer,#nicknameLayer').click(function(event){
			$('.clickShow,.provinceCityAll').hide();
			event.stopPropagation();
		});
		//收起
		$('.retract').click(function(){
			$(this).parent().parent().slideUp();
		});
		//多选
		$('.iconA').click(function(event){
			$('.clickShow,.provinceCityAll').hide();
			$(this).next().show();
			event.stopPropagation();
		});
		$('.searchName').focus(function(){
			if($(this).val()=='请输入昵称'){
				$(this).val('');
			}
		});
		/*
		*	多选
		*	恋爱类型、婚姻状况等面板点击
		*/
		//默认第一个勾选
		//$('.loveType,.marriageStatus').find('li').eq(0).find('a').addClass('checkboxChecked');
		var $selectClass='';
		var $selectArr=[];		//存放文字
		var $selectValue=[];	//存放value值
		var iBtn=false;
		$('.clickShow').find('li').click(function(event){
			if($selectClass!=$(this).parent().parent().attr('class')){ //如果点击的class 不是当前的class，说明点的不是一个 则数组要清空
				$selectClass=$(this).parent().parent().attr('class');
				$selectValue=[];
				$selectArr=[];
				if($(this).parent().parent().attr('iBtn')=='iBtn'){  //如果之前点击过，则不能被清空
					if($(this).parent().parent().attr('selectid')!=''){
						$selectValue=$(this).parent().parent().attr('selectid').split(',');
						$selectArr=$(this).parent().parent().attr('selectText').split(',');
					}
				}
			}
			//如果选择不限，则其他勾选的要取消
			if($(this).find('label').text().replace(/\s+/g,"")=='不限' || $(this).find('label').text().replace(/\s+/g,"")=='不　限'){
				//如果点击不限之前已经选择其他，则其他勾选要去掉，否则去掉不限选择框
				$selectValue=[];
				$selectArr=['不限'];
				if($(this).parent().find('li:gt(0)').find('.checkboxChecked').length>=1){
					$(this).parent().find('li:gt(0)').find('.checkboxChecked').trigger('click');
					$(this).parent().find('li').eq(0).find('a').removeClass('checkboxChecked');
				}
				$(this).parent().find('li').find('a').removeClass('checkboxChecked');
				$selectValue=[];
				$selectArr=['不限'];
				$(this).parent().parent().prev().text($selectArr);
			}else{
				if($(this).find('a').hasClass('checkboxChecked')){ //表示已经存在
					$selectArr.removeByValue($(this).find('label').text());
					$selectValue.removeByValue($(this).find('input').attr('value'));

				}else{
					$(this).find('a').addClass('checkboxChecked');
					//如果点击完这个就全部选中，则取消所有 勾选不限
					if($(this).parent().children().length-1==$(this).parent().find('.checkboxChecked').length){
						$selectValue=[];
						$selectArr=['不限'];
						$(this).parent().find('li').slice(0).find('.checkboxChecked').trigger('click');
						$(this).parent().children().first().find('a').addClass('checkboxChecked');
					}else{   //如果选择一个 没有选择全部 则不限勾选框去掉
						$selectArr.removeByValue($(this).parent().find('li').eq(0).text().replace(/\s+/g,""));
						$(this).parent().find('li').eq(0).find('a').removeClass('checkboxChecked');
						$selectArr.push($(this).find('label').text());
						$selectArr.removeByValue('不限');
						$selectArr.removeByValue('不　限');

						$selectValue.push($(this).find('input').attr('value'));
					}
				}
			}

			$(this).parent().parent().prev().text($selectArr);
			if($selectValue.length<=0){  //如果一个都没有选的时候  默认不限
				$(this).parent().parent().prev().text('不限');
			}
			$(this).parent().parent().attr('selectText',$selectArr);
			$(this).parent().parent().attr('selectid',$selectValue);
			$(this).parent().show();
			$(this).parent().parent().attr('iBtn','iBtn');
			event.stopPropagation();
		});
		$('.clickShow').find('li').eq(0).click(function(){
			$(this).find('a').addClass('checkboxChecked');
		});
		$('.selectWrapper').click(function(event){
			$('.clickShow,.provinceCityAll').hide();
			event.stopPropagation();
		});
		$('.city_input').click(function(){
			$('.clickShow').hide();
			event.stopPropagation();
		});
		//点击地区
		$('.selCity .invis').click(function(){
			var $adress=$('.provinceAll').find('.current').text();
			if($adress){
				$('.criteria span').eq(2).text($adress);
			}else{
				$('.criteria span').eq(2).text('地区不限');
			}
		});

		$('#sortLayer a').click(function(){
			$(this).parent().slideUp();
		});
		$(document).click(function(){
			if($('.clickShow:visible').length>0){
				$('.clickShow').hide();
				$(this).parents('.data').show();
			}else{
				$('#sortLayer,#basicLayer,#seniorLayer,#nicknameLayer').hide();
			}
		});
	},
}
//年龄和身高 没有区间 封装函数
function gainParamsNo($small,$big,$num){
	$($big).prev().find('a').removeClass('selected');
	$($small).prev().find('a').removeClass('selected');
	var $index;
	$($small).prev().find('li').each(function(i,elem){
		if($($small).prev().find('li').eq(i).text()==$num){
			$index=$($small).prev().find('li').index();
			$($small).prev().find('li').eq(i).find('a').addClass('selected');
			$($big).prev().find('li').eq(i).find('a').addClass('selected');
		}
	});

}
//年龄和身高 有区间 封装函数
function gainParams(obj,$small,$big,$length){
	if(obj!=''){
		$($small).prev().children().find('a').removeClass('selected');
		$($big).prev().children().find('a').removeClass('selected');
		var smallSpanH=obj.substring(0,$length).split('~')[0];
		var bigSpanH=obj.substring(0,$length).split('~')[1];
		$($small).prev().prev().find('span').text(smallSpanH);
		$($big).prev().prev().find('span').text(bigSpanH);
		var $index01=$($small).find('option[value='+smallSpanH+']').index();
		$($small).prev().children().eq($index01).find('a').addClass('selected');
		var $index02=$($big).find('option[value='+bigSpanH+']').index();
		$($big).prev().children().eq($index02).find('a').addClass('selected');
	}
}
//数组删除指定元素
Array.prototype.removeByValue = function(val) {
  for(var i=0; i<this.length; i++) {
	if(this[i] == val) {
	  this.splice(i, 1);
	  break;
	}
  }
}

//---------弹层
function openMember(){
	baihe.bhtongji.tongji({
		'event': '3',
		'spm': '4.4.1222.262.11515'
	});
	var dhtml = '';
		dhtml += '<div class="searchLayer">';
		dhtml += '	<a href="javascript:;" class="close" id="close_box_1">关闭</a>';
		dhtml += '	<div class="bt">精准搜索</div>';
		dhtml += '	<p>开通水晶会员即可享受筛选特权<br />帮你更快找到合适的TA</p>';
		dhtml += '	<a href="http://product.baihe.com/vipcrystal" target="_blank" class="icon openMember">开通会员</a>';
		dhtml += '</div>';

		$.blockUI({
			message:dhtml
		});

		$("[id^=close_box_]").click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1222.999.11516'
			});
			$.unblockUI();
		});
		$('.openMember').click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1222.4217.11517'
			});
			baihe.cookie.setCookie('orderSource', '10040701','','/','.baihe.com');
		});

};

function uploadPhotos(){
	baihe.bhtongji.tongji({
		'event': '3',
		'spm': '4.4.1223.262.11518'
	});
	var dhtml = '';
		dhtml += '<div class="searchLayer">';
		dhtml += '	<a href="javascript:;" class="close" id="close_box_1">关闭</a>';
		dhtml += '	<div class="btA">想有更高的人气？<br />想向更多人展示自我？</div>';
		dhtml += '	<p>快上传照片<br />你也会出现在这里</p>';
		dhtml += '	<a href="http://my.baihe.com/myphoto/uploadPhotos" target="_blank" class="icon uploadImg">上传照片</a>';
		dhtml += '</div>';

		$.blockUI({
			message:dhtml
		});
		$('.uploadImg').click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1223.147.11520'
			});
		});
		$("[id^=close_box_]").click(function(){
			baihe.bhtongji.tongji({
				'event': '3',
				'spm': '4.4.1223.999.11519'
			});
			$.unblockUI();
		});
};

function signIn(){
	var dhtml = '';
		dhtml += '<div class="searchLayer">';
		dhtml += '	<a href="javascript:;" class="close" id="close_box_1">关闭</a>';
		dhtml += '	<div class="bt">精准搜索</div>';
		dhtml += '	<p>更精准地寻找意中人，请先登录!</p>';
		dhtml += '	<a href="http://my.baihe.com/login/" class="icon">我要登录</a>';
		dhtml += '</div>';

		$.blockUI({
			message:dhtml
		});

		$("[id^=close_box_]").click(function(){
			$.unblockUI();
		});
};

function waterfull(){
	var $boxs=$('#waterfull li');
	var w=$('#waterfull li').eq(0).outerWidth();;
	var hArr=[];
	$boxs.each(function(index,value){
		var h=$boxs.eq(index).outerHeight();
		if(index<4){
			hArr.push(h);
		}else {
			minH=Math.min.apply(null,hArr);
			var minHeightIndex=$.inArray(minH,hArr);
			$(value).css({
				'position':'absolute',
				'top':minH+'px',
				'left':minHeightIndex==0?0+'px':minHeightIndex*w+'px'
			});
			hArr[minHeightIndex]+=$boxs.eq(index).outerHeight();
		}
	});
}
function identiSign(obj,$data,$num){
	//判断今日明星和其他
	if($num==1){
		var $num=$('.stars').children().length-1;
	}else{
		var $num=$('#waterfull ul').children().length-1;
	}
	if($data.identitySign=='VIP_JSUPER_LovePull'){  //=> 'jzzqx
		obj.find('.txt').eq($num).find('a').after("<em class='jzzqx'>金至尊牵线</em>");
	}else if($data.identitySign=='VIP_JSUPER'){		//=> 'jzz'
		obj.find('.txt').eq($num).find('a').after("<em class='jzz' >金至尊</em>");
	}else if($data.identitySign=='VIP_ADV'){		//=> 'gjhy'
		obj.find('.txt').eq($num).find('a').after("<em class='gjhy'>高级会员</em>");
	}else if($data.identitySign=='VIP_SUPER'){		//=> 'jz'
		obj.find('.txt').eq($num).find('a').after("<em class='jz' >至尊</em>");
	}else if($data.identitySign=='VIP_CLY'){		//=> 'sjhy'
		obj.find('.txt').eq($num).find('a').after("<em class='sjhy'>水晶</em>");
	}else{
		obj.find('.txt').eq($num).find('a').removeClass('hy');
	}

	if($data.isCreditedBySesame>=1){        //	isCreditedBySesame-->芝麻信用
		obj.find('.txt').eq($num).find('a').after("<em class='zm'>芝麻信用为0</em>");
	}

	if($data.online!=0){
		obj.find('.memberS').eq($num).find('.pic span').show();
	}else{
		obj.find('.memberS').eq($num).find('.pic span').hide();
	}
	if($data.popular=='1'){			//--> 超人气    sesameScore
		obj.find('.txt').eq($num).find('a').after("<em class='crq superStar'>超人气</em>");
	}else if($data.popular=='2'){	//2-->人气
		obj.find('.txt').eq($num).find('a').after("<em class='rq star'>人气</em>");
	}
	if($data.isCreditedByAuth=='1'){			//--> 实名
		obj.find('.txt').eq($num).find('a').after("<em class='smrz'>实名认证</em>");
	}
	if($data.isCreditedByMobile=='1'){			//--> 手机
		obj.find('.txt').eq($num).find('a').after("<em class='sjzx'>手机在线</em>");
	}
}
function getTop(){
	var scrollY=document.documentElement.scrollTop || document.body.scrollTop;
	var iH=document.documentElement.clientHeight+scrollY;
	$('#waterfull li').each(function(i,elem){
		if($('#waterfull li').eq(i).position().top<=iH && !$('#waterfull li').eq(i).attr('isLoaded')){
			$('#waterfull li').eq(i).find('img').attr('src',$('#waterfull li').eq(i).find('img').attr('data-original'));
			$('#waterfull li').eq(i).find('img').css('opacity','0');
			$('#waterfull li').eq(i).find('img').animate({opacity:1},500);
			$('#waterfull li').eq(i).attr('isLoaded',true);
		}
	});
}

function loadImage(url) {
	 var img = new Image();
	 //创建一个Image对象，实现图片的预下载
	  img.src = url;
	  if (img.complete) {
		 return img.src;
	  }
	  img.onload = function () {
		return img.src;
	  };
 };

 loadImage('');

function errorImg(img,$data){
	(function(root) {
		var x = root.xlk  || {};
			if($data.gender==1){
				x.IMG_DEFAULT_SRC = "http://images7.baihe.com/pic/nopic_male.jpg";
			}else{
				x.IMG_DEFAULT_SRC = "http://images7.baihe.com/pic/nopic_female.jpg";
			}

		x.imgErr = function(img, src) {
			img.src = src || x.IMG_DEFAULT_SRC;
		}
		root.xlk = x;
	})(window);

	for(var i=0;i<img.length;i++){
		img[i].onerror=function(){
			xlk.imgErr(this);
		}
	}
}

//三目运算如何写多个

//全选------------------