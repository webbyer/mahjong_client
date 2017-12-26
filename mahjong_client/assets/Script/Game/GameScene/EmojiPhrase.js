const END_POS = {
    x: 250,
    y: -30,
};
const MOVE_TIME = 0.3;
const WITHDRAW = 100;
cc.Class({
    extends: cc.Component,

    properties: {
        seletedFrist: {
            default: null,
            type: cc.Node,
        },
        seletedSecond: {
            default: null,
            type: cc.Node,
        },
        phraseContainer: {
            default: null,
            type: cc.Node,
        },
        emojiContainer: {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        if (this.node) {
            const moveAni = cc.moveTo(MOVE_TIME, cc.p(END_POS.x, END_POS.y));
            this.node.runAction(moveAni);
        }
    },

    // 常用短语
    onClickCommonPhrase() {
        this.seletedFrist.active = true;
        this.seletedSecond.active = false;
        this.phraseContainer.active = true;
        this.emojiContainer.active = false;
    },
    // 表情
    onClickEmoji() {
        this.seletedFrist.active = false;
        this.seletedSecond.active = true;
        this.phraseContainer.active = false;
        this.emojiContainer.active = true;
    },
    // 选择的短语或表情
    onChoeseItem(event,customData) {
        if (this.node) {
            this.node.parent.getComponent("desk_click").showEmoji = false;
            const moveAni = cc.moveTo(MOVE_TIME, cc.p(END_POS.x+WITHDRAW, END_POS.y));
            this.node.runAction(moveAni);
            this.scheduleOnce(() => {
                this.node.active = false;
            }, MOVE_TIME);
        }
        let msgbody = {};
        if(customData.length <=3){
            msgbody.type = 2;
            msgbody.msgid = customData;
            //emoji
        }else {
            // cc.log(customData);
            msgbody.type = 1;
            msgbody.msgid = customData;
            // 无动画 播放语音 禁用语音和短语按钮
        }
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_USER_SENT_EMOJI_REP,msgbody);
    },

});
