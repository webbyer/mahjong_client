/**
 * Created by Administrator on 2017/8/31.
 */
const GameEventManager = require("./GameEventManager.js");
const MJEventManager = cc.Class({
    extends: GameEventManager,
    statics: {
        getInstance() {
            if (!this.mjEvntManager) {
                this.mjEvntManager = new MJEventManager();
            }
            return this.mjEvntManager;
        },
    },

    connectNet(host, cb) {
        this.connect(host, cb);
    },

    /**
     *  请求协议
     * @param event 协议id
     * @param data 需要的字段
     */
    startEvent(event, data) {
        cc.log(`发送的协议id为：${event}`);
        const body = {
            "command": event,
        };
        if(cc.sys.isMobile) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                body.did = cc.dd.user.getUserDid();
            } else {
                var deviceid = jsb.reflection.callStaticMethod("CCCKeychianTool", "getDeviceIDInKeychain");
                body.did = deviceid;
            }
        }else{
            body.did = "1b34c7a3-b9cf-45b8-878e-83c52dc652e7";// 网页 47194279-dfb8-4e35-9ba2-d13dd70028dc
        }//1b34c7a3-b9cf-45b8-878e-83c52dc652e7 //0e6b168c-d397-4add-969f-60f66b039de0 //

        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_GET_VERSION_REP: {   // 检测最新版本，1000
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP: {  // 检查登录，1001
                if(!cc.sys.isNative) {
                    body.code = data; // 真机里不需要它
                }
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGIN_REP: {  // 未登录过的设备登录，1002
                body.code = data;
                body.appid = "wxeed9199aa8377c6a";
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP: {  // 新建房间，1003
                body.roomsetting = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: {  // 玩家进入房间的请求,1004
                body.roomid = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP: {  // 查询房卡请求，1007
                body.uid4query = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REP: {  // 转让房卡请求，1008
                body.receiveruid = data.uid4query;
                body.cardtype = data.recieveCardtype;
                body.cardnumber = data.recieveCardNum;
                // body.cardtype = cc.dd.user._userInfo.recieveCardtype;
                // body.cardnumber = cc.dd.user._userInfo.recieveCardNum;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REP: {  // 查询战绩请求，1006
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP: {  // 玩家出牌的请求
                body.chupai = data.id;
                body.tingpai = data.tingpai;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHICARD_REP: {  // 玩家吃牌的请求
                body.straight = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PENGCARD_REP: {  // 玩家碰牌的请求
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP: {  // 玩家杠牌的请求
                body.gangpai = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP: {  // 玩家胡牌的请求
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP: {  // 玩家过牌的请求
                this.sendMessage(body);
                break;
            }
            // 需要添加协议，你在下面添加，我在上面添加
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_REQUEST: { // 申请解散房间，1009
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_AGREE: { // 同意解散房间，1010
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_DISAGREE: { // 不同意解散房间，1011
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REP: { // 申请解散房间，1013
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_JIESUAN_START_NEXTROUND: { //  结算界面点击开始下一局按钮，1014，不需要监听返回
                this.sendMessage(body);
                break;
            }
            case  cc.dd.gameCfg.EVENT.EVENT_YUYIN_UPLOAD: { // 2009，通知服务器语音消息上传成功
                body.voiceid = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_JIESUAN_ZONGZHANJI_REP: { // 请求总战绩
                body.roomserialnumber = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_USER_SENT_EMOJI_REP: { // 请求发送短语或表情包
                body.type = data.type;
                body.msgid = data.msgid;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP: { // 1015，用户进入茶馆,茶馆相关信息
                body.clubtoken = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_DELETE_DESK_REP: { // 1016，删除茶馆内牌桌
                body.roomid = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_CHANGE_NUM_REP: { //  更换自己茶馆的口令号
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_PERSONAL_REP: { // 1019，查看成员
                body.status = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_CONTROL_PERSONAL_REP: { // 1020，处理成员
                body.uid = data.uid;
                body.operation = data.operation;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_BILL_REP: { // 1017，查看账单
                body.clubtoken = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_APPALY_REP: { // 1021，申请加入茶馆会员
                body.clubtoken = data;
                this.sendMessage(body);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_LEAVE_MAJIONG_DESK_REP: { // 1022,牌桌离开到茶馆
                this.sendMessage(body);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },

    /**
     *  收到服务器回复
     * @param msgId 回复的协议id
     * @param msgData 回复的字段
     */
    onMsg(msgId, msgData) {
        cc.log(`收到的协议id为：${msgId}`);
        // cc.log(msgData);
        switch (msgId) {
            case cc.dd.gameCfg.EVENT.EVENT_GET_VERSION_REQ: {  // 检测最新版本的返回，5000
                if (msgData.noticeboard) {
                    cc.dd.user._noticeboard = msgData.noticeboard;
                }
                cc.dd.checkForNewVersion(msgData.iosversion,msgData.androidversion,msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REQ: {  // 检查登录的回复,5001
                if(msgData.agent) {
                    cc.dd.user.updateAgentInfo(msgData.agent);
                }
                this.writtenUserInfoIntoCellPhone(msgData);
                cc.dd.user.updateCardStateInfo(msgData.cards);
                cc.dd.user.updataUserInfo(msgData.user);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGIN_REQ: {  // 检查登录的回复，1002登录成功返回5002
                if(msgData.agent) {
                    cc.dd.user.updateAgentInfo(msgData.agent);
                }
                cc.dd.user.updateCardStateInfo(msgData.cards);
                this.writtenUserInfoIntoCellPhone(msgData);
                cc.dd.user.updataUserInfo(msgData.user);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP: {  // 没有登录过的设备返回1001
                cc.log("未登录过的设备");
                cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_LOGIN_FAIL);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: {  // 房间状态，不存在房间 1004
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DATA: {  // 房间数据,4001
                cc.dd.room.updataRoomData(msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {  // 房间状态，存在房间 4002
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP: {  // 查询房卡失败返回，1007
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REQ: {  // 查询房卡成功返回，5007
                cc.dd.user.updataUserFangka(msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REP: {  // 失败转让房卡返回，1008
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {  // 成功转让房卡返回，5008
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_OUTCARD_RAD: {  // 玩家出牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHICARD_RAD: {  // 玩家吃牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PENGCARD_RAD: {  // 玩家碰牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GANGCARD_RAD: {  // 玩家杠牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HUCARD_RAD: {  // 玩家胡牌的广播
                cc.dd.room.huing = true;
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_MOCARD_RAB: {  // 玩家摸牌的广播
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_TIMER_SPRCIEL: {  // 指针转动
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ONE_GAME_OVER: { // 结算
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_PLAYER_TING_CARD: { // 听牌
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_BAO_CARD_CHANGE: { // 宝牌更换
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_HAI_DI_LAO: { // 海底捞
                // cc.dd.room.huing = true;
                cc.dd.room.saveMsg(msgId, msgData);
                break;
            }
            // 回复处理，你在下面添加，我在上面添加
            case cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REQ: { // 查询战绩成功，5006
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_ANOUNCE: { // 收到解散房间申请，4003
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_STATE: { // 收到解散房间众人态度，4004
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ROOM_DISMISS_RESULT: { // 收到解散房间结果，4008
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REQ: { // 收到登出的结果，5013
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_YUYIN_COMING: { // 4019,收到玩家发语音的广播
                cc.dd.room.saveMsg(msgId,msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_USER_OFFLINE: { // 用户调线
                cc.dd.room.saveMsg(msgId,msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_USER_BACKONLINE: { // 用户重新上线
                cc.dd.room.saveMsg(msgId,msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_JIESUAN_ZONGZHANJI_REQ: { // 4023，总战绩查询的返回
                if (cc.director.getScene().sceneId !== cc.dd.sceneID.GAME_SCENE) {
                    this.notifyEvent(msgId, msgData);
                }else {
                    cc.dd.room.saveMsg(msgId,msgData);
                }
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_USER_SENT_EMOJI_REQ: { // 收到用户发送的表情包广播
                cc.dd.room.saveMsg(msgId,msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_PERSONAL_REQ: { // 收到权限管理的用户列表
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_BILL_REQ: { // 5017,查看账单
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP: { // 1015,进入茶馆错误处理
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REQ: { // 查询茶馆信息的返回，5015
                cc.dd.user.setChaGuan(msgData);
                this.notifyEvent(msgId, msgData);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_LEAVE_MAJIONG_DESK_REQ: { // 5022,牌桌离开到茶馆
                if (msgData.rtncode && msgData.rtncode == -1){
                    // cc.log("不能离开牌桌");
                }else {
                    this.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP,msgData.clubtoken);
                }
                break;
            }
            default: {
                cc.log(`unkown msgId: ${msgId}`);
            }
        }
    },
    /**
     *  微信回调返回到code后，被调用的方法(被原生回调的)
     * @param wxcode 微信成功授权登录后传过来的code
     */
    recieveWXAuthenticationCode(wxcode){
        this.startEvent(cc.dd.gameCfg.EVENT.EVENT_LOGIN_REP,wxcode);
    },
    // 往手机本地存用户信息
    writtenUserInfoIntoCellPhone(data) {
        cc.sys.localStorage.setItem(cc.dd.userEvName.USER_INFO_KEY, JSON.stringify(data.user));
        cc.sys.localStorage.setItem(cc.dd.userEvName.USER_CARD_INFO_KEY, JSON.stringify(data.cards));
        // if(data.agent) {
        //     cc.sys.localStorage.setItem(cc.dd.userEvName.USER_ANGENT_INFO, JSON.stringify(data.agent));
        // }
    },
    /**
     *  电量改变监听的回调更新(被原生回调的)
     * @param sta 充电状态
     */
    updateCurrentBatteryStatus(sta) {
        cc.log("oc观察者观察电量发生改变回调"+sta);
        if(sta == "Charging"){
            this.notifyEvent(cc.dd.gameCfg.BATTERTY.BATTERTY_CHARGING,true);
        }else {
            this.notifyEvent(cc.dd.gameCfg.BATTERTY.BATTERTY_CHARGING,false);
        }
    },
    /**
     *  电量改变监听的回调更新(被原生回调的)
     * @param elevel 电量值
     */
    updateCurrentBatteryLevel(elevel) {
        cc.log("oc观察者观察电量发生改变回调"+elevel);
        this.notifyEvent(cc.dd.gameCfg.BATTERTY.BATTERTY_LEVEL_UPDATE,elevel.toPrecision(2));
    },
    /**
     *  成功上传到腾讯服务器后回调(被原生回调的)
     * @param fileID 语音消息id
     */
    didUploadToGvoiceSever(fileID) {
        cc.log("oc回调js成功，上传成功"+fileID);
        this.startEvent(cc.dd.gameCfg.EVENT.EVENT_YUYIN_UPLOAD,fileID);
    },
    /**
     *  播放成功后回调(被原生回调的)
     * @param
     */
    didFinishPlayCurrentMessage() {
        cc.log("oc回调js成功，播放完成");
        this.notifyEvent(cc.dd.gameCfg.GVOICE.GVOICE_MESSAGE_FINISH_PLAYING);
    },
});
cc.dd.net = MJEventManager.getInstance();