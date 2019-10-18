var form ;
var showVerifyDiv=false;
function HandleKeyPress(evt)
{
    evt = evt ? evt : event;

    if(evt && evt.keyCode == 13)
        DoLogin();
}

function HandleKeyPressToPwd(evt)
{

    evt = evt ? evt : event;

    if(evt && evt.keyCode == 13){
        if(!form){
            getForm();
        }

        form.txtLoginPwd.focus();

        return false;
    }
}
function checkEmail(){
    var n = $("#txtLoginEMail").val().replace(/(^\s+)|(\s+$)/g,"");
    if(n == ""||n=="邮箱/手机号"){
        Msg = '账号格式不正确';
        $("#txtLoginEMail_e").html(Msg);
        $("#txtLoginEMail_e").show();
        return false;
    }else{
        //var mobile = /^(1\d{2}|0[1-9][0-9]{1,2})\d{8}$/;
        var mobile = /^1[0-9]{10}$/;
        //var email = /^[A-Za-z0-9]+[A-Za-z0-9_\-\.]*[A-Za-z0-9]+@[A-Za-z0-9\-_]+(((\._\-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)+$/;
        var email = /^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[A-Za-z0-9\-_]+(((\._-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)+$/;
        if(!email.test(n))//  邮件登录
        {
            if(!mobile.test(n)){
                Msg = '账号格式不正确';
                $("#txtLoginEMail_e").html(Msg);
                $("#txtLoginEMail_e").show();
                return false;
            }else{
                if(n.length>11){
                    Msg = '账号格式不正确';
                    $("#txtLoginEMail_e").html(Msg);
                    $("#txtLoginEMail_e").show();
                    return false;
                }
            }
        }else{
            if(n.length>40){
                Msg = '账号格式不正确';
                $("#txtLoginEMail_e").html(Msg);
                $("#txtLoginEMail_e").show();
                return false;
            }
        }

    }
    return true;
}
function DoLogin()
{
	baihe.bhtongji.tongji({'event':'0','spm':'4.20.87.257.1050'});
    var c=checkEmail();
    if(c==true){
        $.getJSON("http://my.baihe.com/register/emailCheckForXs?jsonCallBack=?&email="+$("#txtLoginEMail").val().replace(/(^\s+)|(\s+$)/g,""),
            function(data){
                if(data.state==1){
                    Msg = '您的账号不存在！';
                    $("#txtLoginEMail_e").html(Msg);
                    $("#txtLoginEMail_e").show();
                    return false;
                }else{
                    $("#txtLoginEMail_e").hide();
                    return true;
                }
            });
        if($("#txtLoginPwd").val()==""||$("#txtLoginPwd").val().length>16){
            Msg = '请输入密码！';
            $("#txtLoginPwd_e").html(Msg);
            $("#txtLoginPwd_e").show();
            return false;
        }
        $("#txtLoginPwd_e").hide();
        var chkRm =  $("#chkRememberMe").attr("checked")=="checked"?1:0;
        var options={
            txtLoginEMail:$("input[name='txtLoginEMail']").val().replace(/(^\s+)|(\s+$)/g,""),
            txtLoginPwd:  $("input[name='txtLoginPwd']").val(),
            chkRememberMe: chkRm,
            codeId:$("#tmpid").val(),
            codeValue:$("#code").val()
        };
        if(showVerifyDiv==true){
            //checkVerify($("#tmpid").val(),$("#code").val());
            $.getJSON("http://my.baihe.com/Getinterlogin/checkVerifyPic?jsonCallBack=?&tmpId="+$("#tmpid").val()+"&checkcode="+encodeURIComponent($("#code").val())+"&event=3&spmp=4.20.53.225.685",
                function(msg){
                    if(msg.state==1&&msg.data==1){

                        $("#verifyErr").hide();
                        $.ajax({
                            url: 'http://my.baihe.com/Getinterlogin/gotoLogin?jsonCallBack=?&event=3&spmp=4.20.87.225.1049',
                            dataType: 'jsonp',
                            data: options,
                            success:function(msg) {
                            	if(msg.data == 11){  //如果是2013-2014注册的账号，出现防刷弹层
                    				PreventData(msg.state);
                    				console.log(msg.state);
                    				return;
                    			}else if(msg&&msg['state']=="1"){
                                    if(chkRm){
                                        var img = new Image();
                                        img.src="";
                                    }
                                    $("#loginForm").submit();
                                }else if(msg['state']=="0"&&msg['data']=="4"){
                                    Msg = '您的账号不存在！';
                                    $("#txtLoginEMail_e").html(Msg);
                                    $("#txtLoginEMail_e").show();
									showVerify();
									$('#code').val('');
                                    return false;
                                }else if(msg['state']=="0"&&msg['data']=="3"){
                                	baihe.bhtongji.tongji({'event':'3','spm':'4.20.87.225.1049'});
                                    window.location.href="http://my.baihe.com/register/";
                                    return false;
                                }else if(msg['state']=="0"&&msg['data']=="12"){
                                    baihe.block({
                                        title: '提示',
                                        text: '抱歉，您的账号存在登录异常，请检查您的登录环境后再次尝试。如有问题，请咨询客服电话：400-1520-555（8:00至20:00）。'
                                    });
									showVerify();
									$('#code').val('');
                                    return false;
                                }else{
                                    Msg = '账号或密码错误';
                                    $("#txtLoginEMail_e").html(Msg);
                                    $("#txtLoginEMail_e").show();
									showVerify();
									$('#code').val('');
                                    return false;
                                }
                            }
                        });

                    }else{
                        $("#verifyErr").show();
						showVerify();
						$('#code').val('');
                        return false;
                    }
                });
        }else{
            $.ajax({
                url: 'http://my.baihe.com/Getinterlogin/gotoLogin?jsonCallBack=?&event=3&spmp=4.20.87.225.1049',
                dataType: 'jsonp',
                data: options,
                success:function(msg) {
                	if(msg.data == 11){  //如果是2013-2014注册的账号，出现防刷弹层
        				PreventData(msg.state);
        				console.log(msg.state);
        				return;
        			}else  if(msg&&msg['state']=="1"){
                        if(chkRm){
                            var img = new Image();
                            img.src="";
                        }
                        $("#loginForm").submit();
                    }else if(msg['state']=="0"&&msg['data']=="4"){
                        Msg = '您的账号不存在！';
                        $("#txtLoginEMail_e").html(Msg);
                        $("#txtLoginEMail_e").show();
						showVerify();
						$('#code').val('');
                        return false;
                    }else if(msg['state']=="0"&&msg['data']=="3"){
                        window.location.href="http://my.baihe.com/register/";
                        return false;
                    }else if(msg['state']=="0"&&msg['data']=="12"){
                        baihe.block({
                            title: '提示',
                            text: '抱歉，您的账号存在登录异常，请检查您的登录环境后再次尝试。如有问题，请咨询客服电话：400-1520-555（8:00至20:00）。'
                        });
                        showVerify();
                        $('#code').val('');
                        return false;
                    }else{
                        Msg = '账号或密码错误';
                        $("#txtLoginEMail_e").html(Msg);
                        $("#txtLoginEMail_e").show();
						showVerify();
						$('#code').val('');
                        return false;
                    }
                }
            });
        }

    }
}

function getForm(){
    form = document.getElementById("loginForm");
}

window.ready = function(){
    document.getElementById('txtLoginEmail').click = HandleKeyPressToPwd;
}

