cc.Class({
    extends: cc.Component,

    properties: {
        UserIDLabel: {
            default: null,
            type: cc.Label,
            tooltip: "uid",
        },
        NameLabel: {
            default: null,
            type: cc.Label,
            tooltip: "昵称label",
        },
        DateLabel: {
            default: null,
            type: cc.Label,
            tooltip: "日期label",
        },
        Avtar: {
            default: null,
            type: cc.Sprite,
            tooltip: "头像",
        },
        rightBtnSet: {
            default: null,
            type: cc.Node,
            tooltip: "申请中按钮组",
        },
        AskToLeaveBtn: {
            default: null,
            type: cc.Node,
            tooltip: "踢出茶馆",
        },
        centerTipLabel:{
            default: null,
            type: cc.Node,
            tooltip: "申请进行游戏",
        },
        inlineUserid: null,
    },

    // use this for initialization
    onLoad: function () {

    },
    // 初始化
    setupInitContent(data,status) {
        this.inlineUserid = data.UID;
        if (status === 0) { // 待审核
            this.rightBtnSet.active = true;
            this.AskToLeaveBtn.active = false;
            this.centerTipLabel.active = true;
        }else {
            this.rightBtnSet.active = false;
            this.AskToLeaveBtn.active = true;
            this.centerTipLabel.active = false;
        }
        this.UserIDLabel.string = data.UID;
        this.NameLabel.string = data.nickname;
        this.DateLabel.string = data.applytime;
        cc.dd.setPlayerHead(data.wx_portrait,this.Avtar);
    },
    // 同意申请
    onAgreeClick() {
        cc.log("同意申请");
    },
    // 拒绝申请
    onDeclineClick() {
        cc.log("拒绝申请");
    },
    // 踢出茶馆
    onAsktoLeaveClick() {
        cc.log("踢出茶馆");
    },
    // 操作
    onControlBtnClick(event,customdata) {
        let body = {};
        body.uid = this.inlineUserid;
        body.operation = customdata;
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_CONTROL_PERSONAL_REP,body);
        this.node.destroy();
        this.node.removeFromParent();
    },
    // // 关闭按钮
    // onCloseClick() {
    //     this.node.destroy();
    // },
});
