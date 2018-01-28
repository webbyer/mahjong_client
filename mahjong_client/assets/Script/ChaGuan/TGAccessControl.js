cc.Class({
    extends: cc.Component,

    properties: {
        topNode: {
            default: null,
            type: cc.Node,
            tooltip: "顶部栏节点",
        },
        centerContainerNode: {
            default: null,
            type: cc.Node,
            tooltip: "中间容器节点",
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.net.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        this.onClickToChoosePersonalType(1,cc.dd.hall_config.ACCESS_TYPE.APPALYING);
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 渲染中间部分
    setupCenterContent(data) {
        cc.dd.Reload.loadPrefab("ChaGuan/Prefab/TGAccessControlItem", (prefab) => {
            data.users.forEach((item) => {
            const controlitem = cc.instantiate(prefab);
        this.centerContainerNode.addChild(controlitem);
        controlitem.getComponent("TGAccessControlItem").setupInitContent(item,data.status);
    });
    });

    },
    // 顶部两个tab的点击响应方法
    onClickToChoosePersonalType(event,customData) {
        this.centerContainerNode.removeAllChildren();
        switch (customData) {
            case cc.dd.hall_config.ACCESS_TYPE.APPALYING: {
                this.topNode.getChildByName("tab1").active = true;
                this.topNode.getChildByName("tab2").active = false;
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_PERSONAL_REP,0);
                break;
            }
            case cc.dd.hall_config.ACCESS_TYPE.AGREED: {
                this.topNode.getChildByName("tab1").active = false;
                this.topNode.getChildByName("tab2").active = true;
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_PERSONAL_REP,1);
                break;
            }
            default: {
                cc.log(`unkown init: ${type}`);
            }
        }
    },
    // 关闭按钮
    onCloseClick() {
        this.node.destroy();
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_VIEW_PERSONAL_REQ: {
                this.setupCenterContent(data);
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
