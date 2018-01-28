cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode: {
            default: null,
            type: cc.Node,
            tooltip: "容器",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化账单信息
     * @param data
     */
    initInfo(data) {
        cc.dd.Reload.loadPrefab("ChaGuan/Prefab/ChaguanBillInfo", (prefab) => {
            data.forEach((item) => {
            const info = cc.instantiate(prefab);
        info.getComponent("chaguanBillInfo").initInfo(item);
        if (this.ContentNode) {
            this.ContentNode.addChild(info);
        }
    });
    });
    },
    onCloseClick() {
        this.node.destroy();
    },

});
