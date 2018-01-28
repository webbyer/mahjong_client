cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        cc.dd.appUtil.setScreenFit(this.node);
        // cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        cc.dd.tipMgr.init(this.node);
        if (cc.dd.user.getUserInfo()) {
            cc.dd.user.getUserInfo().wereInGameSence = true;
        }
    },
    onDestroy() {
        cc.dd.net.removeObserver(this);
        // cc.dd.userEvent.removeObserver(this);
    },
    // 其他茶馆
    onClickOtherChaguan() {
        cc.log(`输入其他茶馆`);
        cc.dd.Reload.loadPrefab("ChaGuan/Prefab/EnterChaguan", (prefab) => {
            const EnterChaguan = cc.instantiate(prefab);
        this.node.addChild(EnterChaguan);
    });
    },
    // 我的茶馆
    onClickMyChaguan() {
        cc.log(`进入我的茶馆`);
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP,-1);
    },
    // 返回大厅按钮
    onCloseClick() {
        cc.log(`离开茶馆`);
        cc.dd.Reload.loadDir("DirRes", () => {
            cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
    });
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REQ: { // 5015
                // this.node.getChildByName("Bk").getChildByName("testlabel").getComponent(cc.Label).string = JSON.stringify(data);
                if (cc.dd.user.getChaGuan()) {
                    cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.CHAGUAN_INNDER_SENCE);
                });
                }
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP: { // 1015
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                UIDNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                this.node.addChild(UIDNotExitMes);
            });
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
