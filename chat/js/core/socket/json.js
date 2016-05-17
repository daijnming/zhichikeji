function polling(global) {
    var eventCache = {};
    var defaultParams = {
        answer : "",
        answerType : "",
        cid : "",
        docId : "",
        pid : "",
        questionId : "",
        uid : ""
    };

    var on = function(evt,cbk) {
        eventCache[evt] = cbk;
    };

    var onsend = function(evt,data) {
        $.ajax({
            'url' : '/chat/admin/send1.action',
            'dataType' : 'json',
            'type' : "post",
            'data' : $.extend(defaultParams, {
                'answer' : data.answer,
                'cid' : data.cid,
                'uid' : global.id
            })
        });
    };

    var bindListener = function(){
        $(document.body).on("textarea.send",onsend);
    };


    var messageAdapter = function(ret) {
        var arr = [];
        for(var i = 0;i < ret.length;i++) {
            var obj = JSON.parse(ret[i]);
            arr.push(obj);
        }
        return arr;
    };

    var start = function() {
        $.ajax({
            'url' : '/chat/admin/msg.action',
            'dataType' : "json",
            'type' : "get",
            'data' : {
                'puid' : global.puid,
                'uid' : global.id
            }
        }).success(function(ret) {
            var arr = messageAdapter(ret);
            eventCache['receive'] && eventCache['receive'](arr);
        }).fail(function(ret,err) {
        });
        setTimeout(start,1500);
    };

    var init = function(){
        bindListener();
    };

    init();
    
    this.on = on;
    this.start = start;
}

module.exports = polling;
