/*
 * @Description: 互动屏 SDK
 * @Author: MX
 * @Date: 2019-09-05 15:00:45
 * @LastEditTime: 2019-09-06 14:29:47
 * @LastEditors: Please set LastEditors
 */
(function() {
  let lockReconnect = false; //连接状态
  let wsUrl = "ws://localhost:7000/"; // 设置服务器地址
  let ws;

  function createWebSocket() {
    try {
      ws = new WebSocket(wsUrl);
      websocketInit();
    } catch (e) {
      console.log("catch");
      websocketReconnect(wsUrl);
    }
  }
  // 创建websocket
  createWebSocket();

  //websocket 初始化
  function websocketInit() {
     // onopen 连接触发
    ws.onopen = function() {
      console.log("websocket open");
      //心跳检测重置
      heartCheck.start();
    };
    // 通信发生错误时触发
	ws.onerror = function () {
		websocketReconnect(wsUrl);
		console.log("websocket error");
    };
      // onclose 断开触发
    ws.onclose = function() {
      console.log("websocket close");
      websocketReconnect(wsUrl);
    };
    // onmessage 接收到信息触发
    ws.onmessage = function(e) {
      console.log("websocket onmessage");
      //拿到任何消息都说明当前连接是正常的
      heartCheck.start();
    };
  }
  //websocket重连
  function websocketReconnect() {
    if (lockReconnect) {
      // 是否已经执行重连
      return;
    }
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
    let tt = setTimeout(function() {
      createWebSocket();
      lockReconnect = false;
    }, 5000);
  }

  //心跳检测
  let heartCheck = {
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function() {
      let self = this;
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(function() {
        //发送测试信息，后端收到后，返回一个消息，
        ws.send(JSON.stringify({
            type:0
        }));
        self.serverTimeoutObj = setTimeout(function() {//如果超过一定时间还没重置，说明后端主动断开了
          ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.
        }, self.timeout);
      }, this.timeout);
    }
  };

  let SecondaryScreenUtil = {};
  //播放视频
  SecondaryScreenUtil.showVideo = function(url) {
    let mes = {
        type:1,
        url
    }
    setTimeout(() => {
    ws.send(JSON.stringify(mes));
    }, 0);
  };
  //展示图片
  SecondaryScreenUtil.showImage = function(url) {
    let mes = {
        type:2,
        url
    }
    setTimeout(() => {
        ws.send(JSON.stringify(mes));
    }, 0);
  };
  //展示指定页面
  SecondaryScreenUtil.showLink = function(url) {
    let mes = {
        type:3,
        url
    }
    setTimeout(() => {
        ws.send(JSON.stringify(mes));
    }, 0);
  };
  //显示文本
  SecondaryScreenUtil.showText = function(text) {
    let mes = {
        type:4,
        text
    }
    setTimeout(() => {
      ws.send(JSON.stringify(mes));
    }, 0);
  };

  window.SecondaryScreenUtil = SecondaryScreenUtil 

})();
