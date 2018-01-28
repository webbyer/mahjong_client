cc.Class({
    extends: cc.Component,

    properties: {
        BtnLogin: {
            default: null,
            type: cc.Button,
            tooltip: "登录的按钮",
        },
        CheckBox: {
            default: null,
            type: cc.Toggle,
            tooltip: "用户协议",
        },
        CheckBoxGotCheck: true,
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.tipMgr.init(this.node);
        cc.dd.sendGetAndroidDeviceId();
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.soundMgr.init();
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.setBtnLoginState(false);
        // 关闭2d
        if (cc.sys.localStorage.getItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE) != cc.dd.roomDeskType.Desk_3D){
            cc.sys.localStorage.setItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE,cc.dd.roomDeskType.Desk_2D);
        }
        // 默认3d视图
        // cc.sys.localStorage.setItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE,cc.dd.roomDeskType.Desk_3D);
        cc.dd.tipMgr.show("正在连接网络，请稍后...");
        cc.dd.net.connectNet(cc.dd.pubConst.HOST_STR, () => {
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GET_VERSION_REP);
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP, "6SDF4ASD4GFAS4FG5ASD5F5Dsdf");
        });
    },
    onDestroy() {
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 登录按钮
    onLoginClick() {
        cc.log(`用户登录`);
        // cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP, "6SDF4ASD4GFAS4FG5ASD5F5Dsdf");
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.dd.sendWXLogin();
        } else {
            cc.dd.sendOCWXlogin();
        }
    },
    // 同意与否用户协议
    clickCheckBoxToggle(event, custom) {
        this.CheckBoxGotCheck = !this.CheckBoxGotCheck;
        if(this.CheckBoxGotCheck){
        	this.setBtnLoginInterateState(true);
        }else{
            this.setBtnLoginInterateState(false);
        }
    },
    // 设置登录按钮的状态
    setBtnLoginState(state) {
        if (this.BtnLogin) {
            this.BtnLogin.node.active = state;
            this.CheckBox.node.parent.active = state;
            this.setBtnLoginInterateState(state);
        } else {
            cc.log(`节点未绑定`);
        }
    },
    setBtnLoginInterateState(state) {
        if (this.BtnLogin) {
            this.BtnLogin.getComponent(cc.Button).interactable = state;
        } else {
            cc.log(`节点未绑定`);
        }
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.userEvName.USER_LOGIN_SCU: {
                cc.log(`登录成功`);
                cc.dd.tipMgr.hide();
                cc.dd.sceneMgr.runScene(cc.dd.sceneID.HALL_SCENE);
                break;
            }
            case cc.dd.userEvName.USER_LOGIN_FAIL: {
                cc.log('登录失败');
                cc.dd.tipMgr.hide();
                this.setBtnLoginState(true);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: { // 4002
                if(data.subcommand == 1) {
                    cc.log("4002,action为1");
                }else {
                    cc.log("4002,action为其他");
                    cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                    });
                }
                break;
            }
            default: {
                cc.log(`unkown event: ${event}`);
            }
        }
    },
});
