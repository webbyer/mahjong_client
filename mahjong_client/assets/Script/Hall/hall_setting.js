cc.Class({
    extends: cc.Component,

    properties: {
        musicSlider: {
            default: null,
            type: cc.Slider,
            tooltip: "音乐的控制",
        },
        soundSlider: {
            default: null,
            type: cc.Slider,
            tooltip: "音效的控制",
        },
        logoutButton: {
            default: null,
            type: cc.Node,
            tooltip: "退出登录",
        },
        yuyinSwitch: {
            default: null,
            type: cc.Toggle,
            tooltip: "语音聊天的开关",
        },
        deskLayout: {
            default: null,
            type: cc.Node,
            tooltip: "桌面布局选项父节点",
        }
    },

    // use this for initialization
    onLoad: function () {
        if (this.musicSlider) {
            this.musicSlider.progress = cc.dd.soundMgr.getMusicVoluem();
        }
        if (this.soundSlider) {
            this.soundSlider.progress = cc.dd.soundMgr.getSoundVolume();
        }
        if (cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE) == cc.dd.userEvName.USER_YUYIN_OFF) {
            this.yuyinSwitch.uncheck();
        }else {
            this.yuyinSwitch.check();
        }
        if (cc.sys.localStorage.getItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE) == cc.dd.roomDeskType.Desk_3D) {
            this.deskLayout.getChildByName("toggle3D").getComponent(cc.Toggle).check();
        }
        if (cc.director.getScene().sceneId == cc.dd.sceneID.GAME_SCENE) {
            this.deskLayout.active = false;
        }
    },
    // 控制注销登录按钮的显示
    initLogoutInfo() {
        this.logoutButton.active = false;
    },
    // 音量条
    onSliderClick(event, custom) {
        switch (parseInt(custom)) {
            case 1: {
                cc.dd.soundMgr.setMusicVolume(event.progress);
                break;
            }
            case 2: {
                cc.dd.soundMgr.setSoundVolume(event.progress);
                break;
            }
            default: {
                cc.log(`unkown custom: ${custom}`);
                break;
            }
        }
    },
    // 关闭
    onCloseClick() {
        this.node.destroy();
    },
    // 退出登录按钮的响应方法
    onLogoutClick() {
        cc.log("退出微信登录");
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REP, "logout");
        this.node.destroy();
    },
    // 语音聊天开关
    onClickYuYinConvoSwitch(event,customData) {
        if(!cc.dd.user.previousSwitchState){
            cc.log("给previousSwitchState赋值："+ cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE));
            cc.dd.user.previousSwitchState = cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE);
        }
        if(event.isChecked) {
            cc.log("语音开关打开");
            cc.sys.localStorage.setItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE,cc.dd.userEvName.USER_YUYIN_ON);
        }else {
            cc.sys.localStorage.setItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE,cc.dd.userEvName.USER_YUYIN_OFF);
            cc.log("语音开关关闭");
        }
        if(cc.dd.user.previousSwitchState != cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE)) {
            if (cc.director.getScene().sceneId == cc.dd.sceneID.GAME_SCENE) {
                cc.dd.userEvent.notifyEvent(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE_CHANGE);
            }
            cc.dd.user.previousSwitchState = cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE);
        }
    },
    // 选择 2d/3d 桌面布局
    onChooseDeskTypeClick(event,customData) {
        cc.sys.localStorage.setItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE,customData);
        switch (customData) {
            case cc.dd.roomDeskType.Desk_2D: {
                this.deskLayout.getChildByName("toggle3D").getComponent(cc.Toggle).isChecked = false;
                this.deskLayout.getChildByName("toggle2D").getComponent(cc.Toggle).isChecked = true;
                break;
            }
            case cc.dd.roomDeskType.Desk_3D: {
                this.deskLayout.getChildByName("toggle3D").getComponent(cc.Toggle).isChecked = true;
                this.deskLayout.getChildByName("toggle2D").getComponent(cc.Toggle).isChecked = false;
                break;
            }
            default: {
                break;
            }
        }
        // cc.log(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE));
    },
    chooseVisable(data) {
        switch (data) {
            case cc.dd.roomDeskType.Desk_2D: {
                this.deskLayout.getChildByName("toggle3D").getComponent(cc.Toggle).uncheck();
                this.deskLayout.getChildByName("toggle2D").getComponent(cc.Toggle).check();
                break;
            }
            case cc.dd.roomDeskType.Desk_3D: {
                this.deskLayout.getChildByName("toggle3D").getComponent(cc.Toggle).check();
                this.deskLayout.getChildByName("toggle2D").getComponent(cc.Toggle).uncheck();
                break;
            }
            default: {
                break;
            }
        }
    },
});
