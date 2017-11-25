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
    initContentPic(imgurl) {
        if(cc.sys.isMobile) {
            cc.dd.setImageAndWriteToSandbox(imgurl,this.contentSpriteFrame);
        }else {
            // 网页版测试用
            cc.dd.setPlayerHead(imgurl,this.contentSpriteFrame);
        }
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
        cc.dd.shareZongZhanJiToWXFriends();
    },
});
