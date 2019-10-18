// JavaScript Document
var oLink=$('<link/>');
	oLink.attr({
	  href: 'http://static3.baihe.com/pop/greet.css',
	  rel: 'stylesheet',
	  type: 'text/css'});

function greet($userId,pathID){

	$('head').append(oLink);

	var dhtml = '';
		dhtml += '	<div class="greetLayer" >';
		dhtml += '		<a href="javascript:;" class="close" id="close_box_01">关闭</a>';
		dhtml += '		<div class="data">';
		dhtml += '			<dl>';
		dhtml += '				<dt>';
		dhtml += '					<img src="" alt="" class="pic" />';
		dhtml += '					<a href="javascript:;" style="display:none;" class="add"><em></em>加关注</a>';
		dhtml += '					<a href="javascript:;" class="cancel"><em></em>取消关注</a>';
		dhtml += '				</dt>';
		dhtml += '				<dd>';
		dhtml += '					<div class="info">';
		dhtml += '						<p class="name"></p>';
		dhtml += '						<p class="rz_icon"><img title="实名认证" src="http://images6.baihe.com/icon/icon_01.gif"><img src="http://images6.baihe.com/icon/icon_08.gif" title="已进行手机认证"><img src="http://images6.baihe.com/icon/icon_02.gif" title="已通过芝麻信用认证" border="0px"><img src="http://images6.baihe.com/icon/icon_21.gif" title="高级会员"><img src="http://images6.baihe.com/icon/icon_18.gif" title="水晶会员"><img src="http://images6.baihe.com/icon/icon_19.gif" title="金至尊"><img src="http://images6.baihe.com/icon/icon_23.gif" title="金至尊牵线"><img src="http://images6.baihe.com/icon/icon_20.gif" title="至尊"><img src="http://images6.baihe.com/icon/icon_05.gif" title="已进行身份认证"><img src="http://images6.baihe.com/icon/icon_04.gif" title="已进行学历认证"><img src="http://images6.baihe.com/icon/icon_06.gif" title="已进行财产认证"><img src="http://images6.baihe.com/icon/icon_07.gif" title="已进行视频认证"><img src="http://images6.baihe.com/icon/star_level1.gif" title="认证等级"><img src="http://images6.baihe.com/icon/icon_03.gif" title="已进行生育认证"></p>';
		dhtml += '					</div>';
		dhtml += '					<div class="txt"><em>31岁</em><span>/</span><em>179cm</em><span>/</span><em>本科本科本科</em><span>/</span><em>北京朝阳</em><span>/</span></div>';
		dhtml += '				</dd>';
		dhtml += '			</dl>';
		dhtml += '		</div>';
		dhtml += '		<div class="list" >';
		dhtml += '			<label class="active"><input name="" type="radio" value="" style="display:none;" /><span></span></label>';
		dhtml += '			<label><input name="" type="radio" value="" style="display:none;" /><span></span></label>';
		dhtml += '			<label><input name="" type="radio" value="" style="display:none;" /><span></span></label>';
		dhtml += '			<label><input name="" type="radio" value="" style="display:none;" /><span></span></label>';
		dhtml += '			<label><input name="" type="radio" value="" style="display:none;" /><span></span></label>';
		dhtml += '			<div class="clear"></div>';
		dhtml += '			<a href="javascript:;" class="link">打招呼</a>';
		dhtml += '		</div>';
		dhtml += '	</div>';

	$.blockUI({
        message:dhtml
    });

    $("[id^=close_box_]").click(function(){
        $.unblockUI();
		//$('head').remove(oLink);
    });
	newGreet.init($userId,pathID);
}
//随机打招呼
function greet2($userId,pathID){

	$('head').append(oLink);
	$.getJSON('http://msg.baihe.com/owner/api/randGreet?jsonCallBack=?',{
		toUserID: $userId,
		type:'1',
		pathID:pathID}, function(data) {
		//601 同性 -602已婚 -603 账号状态停权 -604 黑名单
		if(data.code==200){
			$.unblockUI();
		}else{
			alert(data.msg);
		}
	});
}
//批量打招呼
function greetAll($userId,pathID){

	$('head').append(oLink);
	$.getJSON('http://msg.baihe.com/owner/api/batchGreet?jsonCallBack=?',{
		toUserIDs: $userId,
		type:'1',
		pathID:pathID}, function(data) {
		//601 同性 -602已婚 -603 账号状态停权 -604 黑名单
		if(data.code==200){
			$.unblockUI();
		}else{
			alert(data.msg);
		}

	});
}

newGreet={
	init:function($userId,pathID){
		var _this = this;
		_this.iLabel();
		_this.createL($userId);
		_this.iSayHi();
		_this.doSayHi($userId,pathID);

	},
	/*
	*	打招呼
	*/
	doSayHi:function($userId,pathID){
		var _this = this;
		$('.greetLayer').find('.link').on('click',function(){
			$.getJSON('http://msg.baihe.com/owner/api/greet?jsonCallBack=?',{
                toUserID: $userId,
				contentID:$('.greetLayer .list').find('.active').attr('content_id'),
				type:'1',
				pathID:pathID}, function(data) {
				//601 同性 -602已婚 -603 账号状态停权 -604 黑名单
				if(data.code==200){
					$.unblockUI();
				}else{
					alert(data.msg);
				}

			});
		});
	},

	/*
	*	左侧个人用户资料
	*/
	createL:function($userId){
		var iFous=false;
		//$("#userID").attr('href', );
		$.getJSON('http://msg.baihe.com/owner/api/getOneUserInfo?jsonCallBack=?',{
			userID:$userId
		},function(data){
			//$('.msgLeft').find('.pic img').attr('src',data.data.);
			//名字
			$('.greetLayer dl dd .name').text(data.data.nickname);
			//照片
			$('.greetLayer .data').find('.pic').attr('src',data.data.headPhotoUrl);
			//年龄
			$('.greetLayer .txt').find('em').eq(0).text(data.data.age+'岁');
			//身高
			$('.greetLayer .txt').find('em').eq(1).text(data.data.height+'cm');
			//学历
			$('.greetLayer .txt').find('em').eq(2).text(data.data.educationChn);
			//地区
			$('.greetLayer .txt').find('em').eq(3).text(data.data.cityChn);
			if(data.data.isCreditedById5=='1'){
				$('.greetLayer dl dd .rz_icon').find('img[title*="实名认证"]').show();
			}
			if(data.data.isCreditedByMobile=='1'){
				$('.greetLayer dl dd .rz_icon').find('img[title*="手机"]').show();
			}
			if(data.data.isCreditedBySesame=='1'){
				$('.greetLayer dl dd .rz_icon').find('img[title*="芝麻"]').show();
			}
			if(data.data.identitySign=='VIP_ADV'){
				$('.greetLayer dl dd .rz_icon').find('img[title*="高级"]').show();
				$('.greetLayer dl dd p').addClass('redCol');
			}else if(data.data.identitySign=='VIP_CLY'){
				$('.greetLayer dl dd .rz_icon').find('img[title*="水晶会员"]').show();
				$('.greetLayer dl dd p').addClass('redCol');
			}else if(data.data.identitySign=='VIP_SUPER'){
				$('.greetLayer dl dd .rz_icon').find('img[title="至尊"]').show();
				$('.greetLayer dl dd p').addClass('redCol');
			}else if(data.data.identitySign=='VIP_JSUPER'){
				$('.greetLayer dl dd .rz_icon').find('img[title="金至尊"]').show();
				$('.greetLayer dl dd p').addClass('redCol');
			}else if(data.data.identitySign=='VIP_JSUPER_LovePull'){
				$('.greetLayer dl dd .rz_icon').find('img[title="金至尊牵线"]').show();
				$('.greetLayer dl dd p').addClass('redCol');
			}else{
				$('.greetLayer dl dd p').removeClass('redCol');
			}

			//关注
			if(data.data.myfocus==0){  //没有加关注
				$('.greetLayer dl dt a.cancel').hide();
				$('.greetLayer dl dt a.add').show();
			}else{
				$('.greetLayer dl dt a.add').hide();
				$('.greetLayer dl dt a.cancel').show();
			}

			if($('.greetLayer dl dd .rz_icon').width()>100){
				$('.greetLayer dl dd .rz_icon').css('overflow','hidden');
				$('.greetLayer dl dd .rz_icon').css('width','100px');
				$('.greetLayer dl dd .rz_icon').css('height','20px');
			}

		});
		/*
		*	加关注
		*/

		$('.greetLayer .add').on('click',function(){
			$.getJSON('http://msg.baihe.com/owner/api/addMyFocus?jsonCallBack=?',{
				targetUserID:$userId
			},function(data){
				if(data.code==200){
					$('body').attr('iFous','add');
					//控制profile页
					$('#focussign').removeClass('w01').addClass('w01a');
					$('#focussign').html('<em></em> 取消关注');

					$('.greetLayer dl dt a.add').hide();
					$('.greetLayer dl dt a.cancel').show();
				}else{
					alert(data.msg);
				}
			});
		});
		/*
		*	取消关注
		*/
		$('.greetLayer .cancel').on('click',function(){
			$.getJSON('http://msg.baihe.com/owner/api/deleteMyFocus?jsonCallBack=?',{
				targetUserID:$userId
			},function(data){
				if(data.code==200){
					$('body').attr('iFous','cencel');
					//控制profile页
					$('#focussign').removeClass('w01a').addClass('w01');
					$('#focussign').html('<em></em> 加关注');

					$('.greetLayer dl dt a.cancel').hide();
					$('.greetLayer dl dt a.add').show();
				}else{
					alert(data.msg);
				}
			});
		});


	},
	/*
	*	点击选中文字
	*/
	iLabel:function(){
		var _this = this;
		$('.greetLayer .list label').eq(0).find('input').attr('checked','checked');
		$('.greetLayer .list').find('label').on('click',function(){
			$('.greetLayer .list').find('label').removeClass('active');
			$('.greetLayer .list label').find('input').removeAttr('checked');
			$(this).addClass('active');
			$(this).find('input').attr('checked','checked');
		});

	},
	/*
	*	打招呼列表
	*/
	iSayHi:function(){
		console.log();
		$.getJSON('http://msg.baihe.com/owner/api/getHiMsgTempletList?jsonCallBack=?',function(data){

			var i=0;
			for(var j in $(data.data).eq(0)[0]){
				//$('.msgLike').find('em').eq(i).text($(data.data).eq(0)[0][j]);
				$('.list').find('label').eq(i).attr('content_id',j);
				$('.list').find('label').eq(i).find('span').text(data.data[j]);
				$('.list').find('label').eq(i).attr('title',data.data[j]);
				i++;
			}

			/*$('.list').find('label').eq(0).text(data.data[1]);
			console.log(data.data[0]);
			for(var i=0;i<$('.list').find('label').length;i++){
				$('.list').find('label').eq(i).text(data.data[i+1]);
				$('.list').find('label').eq(i).attr('content_id',i+1);
			}*/
		});
	}}







