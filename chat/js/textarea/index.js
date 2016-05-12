
function TextArea(node,core,window){
	var loadFile = require('../util/load.js')();
	var showMsg=require('./showMsg.js');//会话气泡
	var ZC_Face=require('../util/qqFace.js');//表情
	var uploadImg=require('./uploadImg.js');//上传附件
	var apihost = "http://test.sobot.com/chat/";
    var global;
    var $node;
    var uid="daijm";

    var parseDOM = function() {
        $node = $(node);
        $sendMessage=$node.find(".js-sendMessage");
    };
    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $node.find(".js-users-list").append(li);
    };
    var onReceive = function(value,data) {
        switch(data.type) {
            case 102:
                newUserMessage(data);
                break;
        }
    };
    var onEmotionClickHandler = function(){
        //打开集合,默认qq表情为显示状态
        $node.find("#faceGroup").show();
        $node.find("#emojiGroup").hide();
        $node.find(".icoLi").removeClass("active");
        $node.find(".firsticoLi").addClass("active");
        ZC_Face.show();
        ZC_Face.emojiShow();
    };
    var onEmotionIcoClickHandler = function(){
        //qq表情tab
        $(this).addClass("active").siblings().removeClass("active");
        $node.find('.groupChildren').hide();
        var dataId=$(this).attr("data-src");
        $(dataId).show();
    };
    var onbtnSendHandler=function(){
         
        var str = $sendMessage.val();
        str=ZC_Face.analysis(str);//str已做表情处理
        $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到后台
            'answer':str,
            'uid':uid
        }]);
        $sendMessage.val("");//清空待发送框
        //showMsg(uid,"daijm","img/qqarclist/jianjiao.gif",str,null,null,null);//显示气泡
    };
    var onEnterSendHandler=function(evt){
            //监听文本框回车
            if(evt.keyCode == 13){
                if($sendMessage.val()==""){
                    return false;
                }else{
                    onbtnSendHandler()
                }
            }
         
    };
    var onloadHandler = function(evt,data) {
        $node.find("img.js-my-logo").attr("src",data.face);
        $node.find(".js-customer-service").html(data.name);
    };
 
    var onSelected = function(evt,data){
        if(data.data.from=='online'){
            $node.find(".js-botTextBox").show();
        }else if(data.data.from=='history'){
            $node.find(".js-botTextBox").hide();
        }
    };
    var onQuickreplyHandler=function(evn,data){
        $sendMessage.val(data.data)
    };
    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $(document.body).on('leftside.onselected',onSelected);//监听历史用户、在线用户，控制输入框
        $(document.body).on('rightside.onSelectedByFastRelpy',onQuickreplyHandler);//监听快捷回复
        $(document.body).on("resize",botTextBoxPosition);//控制输入框的位置
        $node.find(".js-btnSend").on("click",onbtnSendHandler);//发送按钮
        $sendMessage.on("keydown",onEnterSendHandler);
        /*
        *
        qq表情
        */
	  	$node.find(".js-emotion").on("click",onEmotionClickHandler);
		$node.find(".icoLi").on("click",onEmotionIcoClickHandler);

    };

    var initPlugsin = function() {//插件
        global = core.getGlobal();
        initFace();
        uploadFile();
    };

    var initFace = function() {
        /*
         *saytext 待发送内容框
         *group 大表情集合
         *faceGroup表情集合
         *emojiGroup emoji表情集合
         *showId	聊天窗体
         *emotion 表情集合按钮
         *sub_btn 提交按钮
         *path 表情集合路径
         *emojiPath emoji表情集合路径
         */
        ZC_Face.initConfig({
            saytext : ".js-sendMessage",
            Group : "#faceGroupTarea",
            faceGroup : "#faceGroup",
            emojiGroup : "#emojiGroup",
            //showId : ".panel-body",
            emotion : ".js-emotion",
            //sub_btn : ".js-btnSend",
            path : "img/qqarclist/",
            emojiPath : "img/emoji/"
        }, function() {
            //cbk
        });

        $node.find('#faceGroup').perfectScrollbar();//加载滚动条
    };


	var uploadFile=function(){
		var uploadBtn=$node.find(".js-upload");//btn
	  	//聊天窗口
		//$chat_new = $("#chat").clone();
		uploadImg(uploadBtn/*,$chat_new*/,node,core,window);//uploadBtn对准btn
		
	};
    var botTextBoxPosition=function(){
            $('.scrollBoxParent').height(($(window).height() - (50 + 52 + 230))+'px');
            $(".js-botTextBox").css("bottom","-230px")
    };
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
        botTextBoxPosition();
    };
    init();
}

module.exports = TextArea;
