cc.Class({
    extends: cc.Component,

    properties: {
        MesLabel: {
            default: null,
            type: cc.Label,
            tooltip: "显示输入的节点",
        },
        DismissRoomSuc: null,
        netWorkData: null,
    },
    onLoad: function () {
    },
    // 改mes信息
    initInfoMes(data) {
        this.MesLabel.string = data;
        if(data == "解散房间成功") {
            this.DismissRoomSuc = true;
        }else if(data.indexOf("成功转让") != -1) {
            this.exchangeFKSuc = true;
        }else if(data.indexOf("转让失败") != -1) {
            this.exchangeFKFail = true;
        }else if(data.indexOf("更换茶馆口令") != -1){
            this.changeCGNum = true;
        }
    },
    // 确认按钮
    onClickComfrimMessage() {
        // cc.log(`alterview-确认：关闭`);
        if(this.DismissRoomSuc) {
            // cc.dd.soundMgr.stopAllSound();
            // cc.dd.Reload.loadDir("DirRes", () => {
            //     cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
            // });
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_JIESUAN_ZONGZHANJI_REP,cc.dd.room.roomserialnumber);
            this.node.destroy();
        }else if(this.exchangeFKSuc) {
            this.node.parent.parent.destroy();
        }else if(this.exchangeFKFail) {
            this.node.parent.parent.destroy();
        }else {
            this.node.destroy();
        }
    },
    // 成对，确认取消按钮，确认
    onPairBtnComfrimClick() {
        if (this.changeCGNum) {
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_CHANGE_NUM_REP);
        }else {
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_DELETE_DESK_REP,this.netWorkData);
        }
        this.node.destroy();
    },

    // 成对，确认取消按钮，取消
    onPairBtnCancleClick() {
        this.node.destroy();
    },
});
