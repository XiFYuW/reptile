var validArr2 = [];
var errTips = new Array(0);
var tmpId_index,tmpId_indexPop,tmpId_indexLogin;
var p_isFirstSave=true;
var mobileCodeDated=false;


var isMobileSend = false;
var isEmailSend = false;
var isMsgSend = false;
var isVoiceSend = false;

var mobileCodeDated=false;
var emailCodeDated=false;

var phonePicCode_index, emailPicCode_index;

var iNum=0;
var iCode=false;
var isClick=false;
var zu_timer=null;
var bClick=false;

var land = window.location.href.indexOf('betatest_landpage');


errTips['ok'] = '<div class="ok">正确</div>';
errTips['account'] = '请填写您的注册邮箱或手机号';
errTips['password'] = '请输入6-16位英文或数字';
errTips['nikename'] = '最多可输入12个汉字、字母或数字';
errTips['mobile'] = '请输入您的手机号';
// errTips['mybirth'] = '请选择您的生日';
// errTips['mycity'] = '请输入您所在地区';
errTips['code'] = '请填写验证码';
errTips['photoCode'] = '请填写验证码';
errTips['mobileValiCode']='请输入正确的验证码';
errTips['zu_code']='请输入正确的验证码';
var isMobileSend = false; //没有发送验证码之前默认为false;
var p_blur=false;
var p_btn=false;

//页面打点
var tongjiType = baihe.cookie.getCookie('tongjiType');
/*
	---------------------------------------     防刷验证码 js begin    ---------------------------------------
*/


function PreventData(dataP){
	var dhtml = "";
	dhtml += "<div class='preventData'>";
	dhtml += "	<div class='content'>";
	dhtml += "		<a href='javascript:;' class='close' id='close_box_01'>关闭</a>";
	dhtml += "		<div class='bt'>您的账号存在被盗风险，已被系统临时冻结！</div>";
	dhtml += "		<p>请完成短信校验来激活帐号，并更换您的密码</p>";
	dhtml += "		<dl>";
	dhtml += "			<dt>手机号</dt>";
	dhtml += "			<dd>\
							<input name='' type='text' value='输入您的手机号' id='zu_account'/>\
							<div class='ok' style='display:none;'>正确</div><div class='error' id='zu_account_msg'>请输入您的手机号码</div>";
	dhtml += "			</dd>";
	dhtml += "			<dt>验证码</dt>";
	dhtml += "			<dd class='dd_height'>\
							<input name='' type='text' style='width:88px;' id='zu_code' value='输入验证码' /><a href='javascript:;' msg-type='1' class='zu_code_btn' id='zu_code_btn' class='gray'>获取短信验证码</a><div class='ok' style='display:none;'>正确</div><div class='error' id='zu_code_msg'>请输入验证码</div>";
	dhtml += "				<div class='info'><span class='change_pre'>若没收到短信请使用</span> <a id='change' href='javascript:;' class='f13'>语音验证码</a></div>";
	dhtml += "			</dd>";

	dhtml += "			<dt>输入新密码</dt>";
	dhtml += "			<dd>\
							<input name='' type='text' value='6-16位数字字母' id='zu_password1'/>\
							<input maxlength='16' id='userPassWord1' value='' type='password' style='display:none;' /><div class='ok' style='display:none;'>正确</div><div class='error' id='zu_password1_msg'>6-16位的数字或字母</div>";
	dhtml += "			</dd>";
	dhtml += "			<dt>确认新密码</dt>";
	dhtml += "			<dd>\
							<input name='' type='text' value='再次输入新密码' id='zu_password2'/>\
							<input maxlength='16' id='userPassWord2' value='' type='password' style='display:none;' /><div class='ok' style='display:none;'>正确</div><div class='error' id='zu_password2_msg'>6-16位的数字或字母</div>";
	dhtml += "			</dd>";
	dhtml += "		</dl>";
	dhtml += "		<div class='successful' id='zu_successful' style='display:none;'>";
	dhtml += "			<img src='http://images6.baihe.com/icon/icon_12d.gif' alt='' /><strong>您的账号激活成功！</strong><br />请牢记您的新密码，并使用新密码重新登录";
	dhtml += "		</div>";
	dhtml += "		<div class='successful' id='zu_loser' style='display:none;'>";
	dhtml += "			<img src='http://images6.baihe.com/icon/icon_11a.gif' alt='' /><strong>您的账号激活失败！</strong><br />";
	dhtml += "		</div>";
	dhtml += "		<div class='icon'>";
	dhtml += "			<a href='javascript:;' class='iconA' id='confirm_box_02'>确定</a><a href='javascript:;' class='iconB' id='close_box_02'>取消</a>";
	dhtml += "			<a href='javascript:;' class='iconC' id='close_box_03' style='display:none;'>确定</a>";
	dhtml += "		</div>";
	dhtml += "	</div>";
	dhtml += "</div>";

	$.blockUI({
        message:dhtml
    });
    $("[id^=close_box_]").click(function(){
        $.unblockUI();
    });
	$('.preventData .error').hide();
	noCookiePrevent.init(dataP);
}



/*
*		注册的验证码tmpId必须保持一致，否则验证码会出现错误
*/
var timer = new Date();
var PreventId_index = parseInt(timer.getTime() + Math.random() * 10000);
noCookiePrevent = {
    init: function(dataP) {
        var _this = this;
		_this.validArr2=new Array(0);
        _this.Account();
        _this.passWord1();
		_this.passWord2();
        _this.Code();
        _this.zu_codeShow();
        _this.p_firstSubmit(dataP);
		_this.zu_change();
    },
	p_firstSave:function (dataP) {
		p_btn=true;
		if(!p_isFirstSave){
			return;
		}
		var _this=$(this);

		console.log(dataP);
		p_isFirstSave=false;  //如果为true,就注册失败

		var isSubmit = 0;  //如果有错误，isSubmit就增加，如果isSubmit大于1则不调用接口

		for (var ele in validArr2) {
			if (validArr2[ele] == false) {
				if (ele != 'promit') {
					$('#' + ele + '_msg').css('display', 'block').html(errTips[ele]);
					$('.' + ele + '_msg').css('display', 'block').html(errTips[ele]);
				}
				isSubmit++;
			}
		}
		/*
		*	如果正确则取值，否则为空
		*/
		if(validArr2['zu_account']){
			var account=$('#zu_account').val();
		}else{
			var account='';
		}
		if(validArr2['zu_code']){
			var phoneCode=$('#zu_code').val();
		}else{
			var phoneCode='';
		}
		if(validArr2['zu_password1']){
			var passWORD1=$('#userPassWord1').val();
		}else{
			var passWORD1='';
		}
		if(validArr2['zu_password2']){
			var passWORD2=$('#userPassWord2').val();
		}else{
			var passWORD2='';
		}
		if (isSubmit <= 1) {
			$.ajax({
				url: 'http://my.baihe.com/Getinterlogin/activateAccount?jsonCallBack=?',
				dataType: 'jsonp',
				data: {
					'phone': account,
					'checkcode' : phoneCode,
					'pwd1': passWORD1,
					'pwd2': passWORD2,
					'userID': dataP,
				},
				success: function(data) {
					if (data.state == 1 ) {
						baihe.cookie.setCookie('tongjiType', 'noCookie', '', '/', 'baihe.com');
						$('.preventData dl,.preventData p,.preventData .icon a').hide();
						$('#zu_successful,.preventData .icon a.iconC').show();
					}else{
						p_isFirstSave=true;
						_this.removeClass('gray');
						$('.preventData dl,.preventData p,.preventData .icon a').hide();
						$('#zu_successful,.preventData .icon a.iconC').hide();
						$('#zu_loser').show();
						console.log(data.data);
						//$('#zu_loser').append(data.data);
						//$('#zu_loser').append('012');
					}
				}
			});
			p_btn=false;
		}else{
			p_isFirstSave=true;
			$('.preventData dl,.preventData p,.preventData .icon a').show();
			$('#zu_successful,.preventData .icon a.iconC').hide();
			p_btn=false;
		}
	},
    p_firstSubmit: function(dataP) {
		var _this=this;
        $('#confirm_box_02').on('click',function(){
			_this.p_firstSave(dataP);
		});
    },
	/*
	*	参数：错误提示名(默认为错误提示名)  isOK  错误提示  作用焦点
	*/
    tips: function(obj, is, str, sub) {
        var _this = this;
        if (is == true) {
            obj.css('display', 'none');
            sub ? (validArr2[sub] = true) : '';
			obj.prev().show();  //ok显示
        } else {
            obj.css('display', 'block').html(str);
            sub ? (validArr2[sub] = false) : '';
			obj.prev().hide();  //错误提示
        }
    },
	Account:function(){
		var _this = this;
        var oTips = $('#zu_account_msg');
        validArr2['zu_account'] = false;
		var isOk = false;
        $('#zu_account').on('focus', function() {
            var str = $(this).val().replace(/(^\s+)|(\s+$)/g,"");
            if (str == '输入您的手机号') {
                $(this).val('');
				$('#zu_code_btn').addClass('gray');
            }
        });
        $('#zu_account').on('blur', function() {
			if($(this).val().replace(/(^\s+)|(\s+$)/g,"")==''){
				$(this).val('输入您的手机号');
				oTips.css('display', 'none');
				$('#zu_code_btn').addClass('gray');
				return;
			}
            _this.re_Account($(this).val(), '手机格式填写错误');
            //validArr2['code'] = false;
        });
	},
	re_Account:function(val,tip){
		var _this = this;
		var str = val.replace(/(^\s+)|(\s+$)/g,"");
		var oTips = $('#zu_account_msg');
		var isOk = false;
		validArr2['zu_account'] = false;

		isOk = baihe.validateRules.isMobile(str);
		_this.tips(oTips, isOk, tip, 'zu_account');

		if (isOk == true) {
			$('#zu_code_btn').removeClass('gray'); // 电话号码正确则验证码移除灰色
			$('#zu_code_btn').val('获取验证码');
			_this.tips(oTips, true, '', 'zu_account');
			validArr2['zu_account']=true;
			/*$.getJSON('http://my.baihe.com/register/emailCheckForXs?jsonCallBack=?', {
				email: str
			}, function(data) {
				if (data.state == 1) {

				} else {

				}
			});*/
		}else{
			_this.tips(oTips, false, '手机格式填写错误', 'zu_account');
			$('#zu_code_btn').addClass('gray');
		}
	},
	//密码传参： text文本框  密码框  错误提示  id
	re_Password:function(pass,obj,msg,idName){
		var _this = this;
		var isOk = new RegExp(baihe.validateRegExp.password).test(pass.val());
		if (obj.val() == '') {
			$(this).hide();
			obj.show().val('6-12位英文字母或数字').css('color','#ccc');
			validArr2[idName] = false;

		}else if($("#userPassWord1").val()!='' && $("#userPassWord2").val()!='' && $("#userPassWord1").val()!=$("#userPassWord2").val() ){
			_this.tips($("#zu_password1_msg"), false, '密码请填写一致', 'zu_password1');
			_this.tips($("#zu_password2_msg"), false, '密码请填写一致', 'zu_password2');
			validArr2[idName] = false;
		}else {
			//判断手机中的电话是否显示
			if(isOk){  //判断如果都输对了且短信和语音的验证码不存在的时候
				_this.tips(msg, true, '', idName);
				$("#zu_password1_msg,#zu_password2_msg").hide();
				validArr2[idName] = true;
			}
		}
		_this.tips(msg, isOk, errTips['password'], idName);

	},
	passWord1:function(){
		var _this = this;
        validArr2['zu_password1'] = false;

		$("#zu_password1").on('focus',function(){
			$(this).hide();
			$("#userPassWord1").show().val('').focus().css('color','#666');
		});
		$('#userPassWord1').on('blur',function(){
			if($(this).val()==''){
				$(this).hide();
				$("#zu_password1").show();
				validArr2['zu_password1'] = false;
			}
			_this.re_Password($('#userPassWord1'),$("#zu_password1"),$("#zu_password1_msg"),'zu_password1');

		});
	},
	passWord2:function(){
		var _this = this;
        validArr2['zu_password2'] = false;

		$("#zu_password2").on('focus',function(){
			$(this).hide();
			$("#userPassWord2").show().val('').focus().css('color','#666');
		});
		$('#userPassWord2').on('blur',function(){
			if($(this).val()==''){
				$(this).hide();
				$("#zu_password2").show();
				validArr2['zu_password2'] = false;
			}
			_this.re_Password($('#userPassWord2'),$("#zu_password2"),$("#zu_password2_msg"),'zu_password2');

		});
	},
	//倒计时
	time:function(){
		var P = 60;

		$("#zu_code_btn").addClass('gray').text(P+'秒').die();

		zu_timer = window.setInterval(function() {
			if (--P <= 0) {
				window.clearInterval(zu_timer);
				$("#zu_code_btn").die().removeClass('gray').on('click', zu_sendValiCode);
				$("#zu_code_msg").html('').hide();
				$('#zu_account').attr('disabled',false);

				if($('#zu_code_btn').attr('msg-type')=='1'){
					$("#zu_code_btn").removeClass('gray').text('获取短信验证码');
				}else if($('#zu_code_btn').attr('msg-type')=='2'){
					$("#zu_code_btn").removeClass('gray').text('获取语音验证码');
				}
				isMobileSend = false;
			} else {
				$("#zu_code_btn").addClass('gray').html(P + "秒");
				isMobileSend = true;
				$('#zu_code_btn').attr('disabled',true);

				//倒计时过程中电话和账号不能编辑
				$('#zu_account').attr('disabled','disabled');
				if($("#zu_code_btn").text()=='0秒'){
					$("#zu_code_btn").removeClass('gray');
				}
			}
		}, 1000);

	},
	Code:function(){
		var _this = this;
		validArr2['zu_code'] = false;
		var oTips=$('#zu_code_msg');
		$('#zu_code').on('focus',function(){
			if($(this).val()=='输入验证码'){
				$(this).val('');
			}
		});
		$('#zu_code').on('blur',function(){
			if($(this).val()==''){
				$(this).val('输入验证码');
			}
			//$('.info').show();
			//手机验证码输完之后就立即验证正确与否
			var str = $(this).val().replace(/(^\s+)|(\s+$)/g,"");
            var isOk = /\d{4}/.test(str);
            if (str == "") {
				$('#zu_code').val('输入验证码').css('color','#ccc');
                return;
            }
			if (isOk) {
				$.ajax({
                    url: 'http://my.baihe.com/Getinterregist/checkPhoneCode?jsonCallBack=?',
                    dataType: 'jsonp',
                    data: {
                        'phone': $('#zu_account').val().replace(/(^\s+)|(\s+$)/g,""),
                        'code': str
                    },
                    success: function(data) {
                        if (data && data.data == 1) {
                            isOk = true;
							_this.tips(oTips, true, '', 'zu_code');
							$('#zu_code_btn').next().show();
							validArr2['zu_code']=true;
							clearInterval(zu_timer);
							$('#zu_code_btn').addClass('gray');
							oTips.removeClass('error');
							$("#zu_code_msg").hide();
							if(p_btn){
								$('#confirm_box_02').trigger('click');
							}
							return;
                        } else if (data && data.state == '1' && data.data == "-113") {
                            isOk = false;
                            _this.tips(oTips, isOk, '超过每天3次验证', 'zu_code');
							$('#zu_code_btn').next().hide();
							validArr2['zu_code']=false;
							if(p_btn){
								$('#confirm_box_02').trigger('click');
							}
                            return false;
                        } else {
                            isOk = false;
							$('#zu_code_btn').next().hide();
							_this.tips(oTips, isOk, errTips['zu_code'], 'zu_code');
							oTips.addClass('error');
							validArr2['zu_code']=false;
							if(p_btn){
								$('#confirm_box_02').trigger('click');
							}
							return false;
                        }
                    }
                });
            } else{
				isOk = false;
				_this.tips(oTips, isOk, errTips['zu_code'], 'zu_code');
			}
		});
	},
	//获取短信验证码按钮
	zu_codeShow:function(){
		var _this = this;
		$('#zu_code_btn').click(function(){
			validArr2['code'] = false;

			var iNum=1;
			if($(this).hasClass('gray')){
				return;
			}
			//如果电话正确才进行倒计时，否则不能点击
			if(validArr2['zu_account']){
				_this.time();
				zu_sendValiCode();  // 调用验证码发送的接口
			}
		});
	},
	/*
	*	变橘色后 短信和语音来回切换
	*	如果已经在倒计时  则点击无效
	*/
	zu_change:function(){
		var _this = this;
		$('#change').on('click',function(){
			if(!$('#zu_code_btn').hasClass('gray')){
				if($(this).text()=='语音验证码'){
					$(this).text('短信验证码');
					$('#zu_code_btn').text('获取语音验证码').attr('msg-type', 2);
					$('#zu_code').val('输入验证码').css('color','#999');
					$('#zu_code_btn').attr('msg','');
					$('.change_pre').text('若没收到语音请使用 ');
					$('#change').text('短信验证码');
					$('#zu_code_msg').hide();
					validArr2['zu_code'] = false;
				}else{
					$(this).text('语音验证码');
					$('#zu_code_btn').text('获取短信验证码').attr('msg-type', 1);
					$('#zu_code').val('输入验证码').css('color','#999');
					$('.change_pre').text('若没收到短信请使用 ');
					$('#zu_code_btn').attr('msg','');
					$('#change').text('语音验证码');
					$('#zu_code_msg').hide();
					validArr2['zu_code'] = false;
				}
			}
		});
	}
}

/*
*	点击发送产生结果后，按钮到底是语音还是短信判断
*	当变换短信和语音时，图形验证码为空
*/
function pre_text(){
	if($('#zu_code_btn').attr('msg-type')=='1'){
		$('.change_pre').text('若没收到短信请使用 ');
		$('#change').text('语音验证码');
		$("#zu_code_btn").attr('msg','');
		$("#zu_code_btn").text('获取短信验证码');

	}else if($('#zu_code_btn').attr('msg-type')=='2'){
		$('#zu_code_btn').text('获取语音验证码').attr('msg-type', 2);
		$('.change_pre').text('若没收到语音请使用 ');
		$('#change').text('短信验证码');
		$("#zu_code_btn").attr('msg','');
		$("#zu_code_btn").text('获取语音验证码');
	}
}
/*
*	手机注册发送验证码
*/
var zu_sendValiCode = function(msg) {
	var msgType = '',
		msgPhone = '';
	$('#zu_code_msg').hide();  //语音提示验证码隐藏
	if (validArr2['zu_account']) {
		msgPhone = $('#zu_account').val().replace(/(^\s+)|(\s+$)/g,"");
		msgType = $('#zu_code_btn').attr('msg-type');		//获取验证码input框
		console.log(msgPhone+' '+msgType);
	} else {
		msgPhone = $('#zu_account').val().replace(/(^\s+)|(\s+$)/g,""); //取手机注册时的手机号
		msgType = $('#zu_code_btn').attr('msg-type');          //获取验证码input框
		console.log(msgPhone+' '+msgType);
	}
	if (!msgPhone) {
		return false;
	}
	zu_newCheckValiCode(msgType, msgPhone);
};
/*
*	手机号注册
*	验证码倒计时并验证
*	没有判断已经认证过的手机，注册成功后将此手机号与原账号解绑
*/
function zu_newCheckValiCode(msgType, msgPhone) {

	$.ajax({
		url: 'http://my.baihe.com/Getinterregist/getLoginPhoneVerifyCode?jsonCallBack=?',
		dataType: 'jsonp',
		data: {
			'type': msgType, //决定是否是语音还是短信  2为语音  1为短信
			'phone': msgPhone,
		},
		success: function(data) {
			if (data.state == '0') {   //参数错误
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').show().addClass('error').html('参数错误');
				validArr2['zu_code']=false;
				pre_text();
				return;
			}else if (data.state == '1' && data.data == '1') {
				phonePicCode_index = parseInt(new Date().getTime() + Math.random() * 10000);
				mobileCodeDated=true;
				$("#zu_code_btn").addClass('gray').text('60秒').die();
				if (msgType == 1) {
					isMsgSend = true;
					$("#zu_code_msg").show().removeClass('error').html('短信验证码已发送。').show();
				}else if (msgType == 2) {
					if (isVoiceSend) {
						$('#zu_code_msg').hide();
						isMsgSend = true;
					}
					isVoiceSend = true;
					$("#zu_code_msg").show().removeClass('error').html('电话拨打中，请注意接听。').show();
				}
				return;
			} else if (data.state == '1' && data.data == '-1') {
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').html('服务器繁忙,请稍后重试').show();
				validArr2['zu_code']=false;
				pre_text();
				return;
			} else if (data.state == '1' && data.data == '-212') {
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').show().addClass('error').html('超过每天最大次数');
				validArr2['zu_code']=false;
				$("#zu_code_btn").addClass('gray');
				pre_text();
				return;
			} else if (data.state == '1' && data.data == '-112') {
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').show().addClass('error').html('每分钟只能发一次');
				validArr2['zu_code']=false;
				$("#zu_code_btn").removeClass('gray');
				pre_text();
				return;
			} else if (data.state == '1' && data.data == '-313') {
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').show().addClass('error').html('超过每天3次验证');
				validArr2['zu_code']=false;
				pre_text();
				return;
			}else if (data.state == '1' && data.data == '-222') {
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				$('#zu_code_msg').show().addClass('error').html('验证码错误');
				validArr2['zu_code']=false;
				$("#zu_code_btn").removeClass('gray');
				pre_text();
				return;
			}else if (data.state == '1' && data.data == '-1001') { //同盾
				window.clearInterval(zu_timer);
				mobileCodeDated=true;
				validArr2['zu_code']=false;
				pre_text();
				baihe.block({
					title: '提示',
					text: '您的手机号存在风险，请更换手机号后重试。如有疑问，请咨询客服：400-1520-555（8:00至20:00）。'
				});
				return;
			}
		}
	});
};





