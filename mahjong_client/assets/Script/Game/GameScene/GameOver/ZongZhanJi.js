cc.Class({
    extends: cc.Component,

    properties: {
        ShareBtn: {
            default: null,
            type: cc.Node,
            tooltip: "分享的按钮",
        },
        contentSpriteFrame:{
            default: null,
            type: cc.Sprite,
            tooltip: "总战绩图片",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    initContentPic(imgurl) {
        cc.dd.setPlayerHead(imgurl,this.contentSpriteFrame);
    },
    // 返回大厅按钮响应方法
    onClickReturnBtn() {
        cc.dd.soundMgr.stopAllSound();
        cc.dd.Reload.loadDir("DirRes", () => {
            cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
        });
    },
    // 分享按钮的响应方法
    onClickShareBtn() {
        this.ShareBtn.active = false;
        cc.dd.shareZongZhanJiToWXFriends();
    },
});
