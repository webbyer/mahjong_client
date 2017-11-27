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
    /**
     *  初始化
     * @param imgurl 图片相对下载地址
     */
    initContentPic(imgurl,uniqueRoomId) {
        if(cc.sys.isMobile) {
            cc.dd.setImageAndWriteToSandbox(imgurl,this.contentSpriteFrame,uniqueRoomId);
        }
    },
    // 返回大厅按钮响应方法
    onClickReturnBtn() {
        if (cc.director.getScene().sceneId !== cc.dd.sceneID.GAME_SCENE) {
            cc.log(`未在游戏场景`);
            this.node.destroy();
        }else {
            cc.dd.soundMgr.stopAllSound();
            cc.dd.Reload.loadDir("DirRes", () => {
                cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
            });
        }
    },
    // 分享按钮的响应方法
    onClickShareBtn() {
        cc.dd.shareZongZhanJiToWXFriends();
    },
    // 分享到微信朋友圈按钮的响应方法
    onClickShareToMomentsBtn() {
        cc.dd.shareZongZhanJiToWXMoment();
    },
});
