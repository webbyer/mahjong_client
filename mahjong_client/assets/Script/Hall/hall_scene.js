cc.Class({
    extends: cc.Component,

    properties: {
        NickNameLabel: {
            default:null,
            type: cc.Label,
        },
        PlayerId: {
            default:null,
            type: cc.Label,
        },
        RoomCard: {
            default:null,
            type: cc.Label,
        },
        CardTitle:{
            default:null,
            type: cc.Label,
        },
        CardContent:{
            default:null,
            type: cc.Label,
        },
        avatar: {
            default:null,
            type: cc.Sprite,
        },
        changeButton: {
            default:null,
            type: cc.Node,
        },
        infoNode: {
            default:null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.dd.tipMgr.init(this.node);
        cc.dd.appUtil.setScreenFit(this.node);
        cc.dd.roomEvent.addObserver(this);
        cc.dd.userEvent.addObserver(this);
        cc.dd.net.addObserver(this);
        this.setUserInfo();
    },
    onDestroy() {
        cc.dd.roomEvent.removeObserver(this);
        cc.dd.userEvent.removeObserver(this);
        cc.dd.net.removeObserver(this);
    },
    // 设置用户信息
    setUserInfo() {
        cc.log("设置用户信息" );
        cc.log(cc.dd.user.getUserInfo());
        this.setUserId(cc.dd.user.getUserInfo().UID);
        this.setUserNickName(cc.dd.user.getUserInfo().nickname);
        if(!cc.dd.user.getUserInfo().roomcardnum || cc.dd.user.getUserInfo().wereInGameSence) {// 游戏场景回到大厅场景
            cc.dd.user.getUserInfo().wereInGameSence = false;
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHECK_LOGIN_REP,cc.dd.user.getUserInfo().UID);
        }else { // 登录后进入
            this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
        }
        this.setAvatarSpriteFrame(cc.dd.user.getUserInfo().wx_portrait);
        this.setBtnChangeState(parseInt(cc.dd.user.getUserInfo().isagent));
    },
    // 设置用户的id
    setUserId(id) {
        this.PlayerId.string = "ID：" + id;
    },
    // 设置昵称
    setUserNickName(nickName) {
        this.NickNameLabel.string = nickName;
    },
    // 设置房卡数目
    setFangKaNum(num) {
        if(this.infoNode.children.length == 4) {
            return;
        }
        if(cc.dd.user.getCardState().unlimited === true) {
            this.RoomCard.string = "无限畅打";
            this.CardTitle.string = cc.dd.user.getCardState().unlimitedshowdetail[0];
            this.CardContent.string = cc.dd.user.getCardState().unlimitedshowdetail[1]
        }else {
            this.RoomCard.string = '次卡';
            this.CardTitle.string = '数量 :';
            this.CardContent.string = num + '';
        }
    },
    setAvatarSpriteFrame(sfurl) {
        var target = this.avatar;
        cc.dd.setPlayerHead(sfurl,target);
        // cc.dd.setImageAndWriteToSandbox(sfurl,target); // 测试用 正式版 用上面
    },
    // 设置转让房卡按钮是否可见
    setBtnChangeState(state) {
        if (!state || state == 0){
            this.changeButton.active = false;
        }else {
            this.changeButton.active = true;
        }
    },
    onMessageEvent(event, data) {
        switch (event) {
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP: { // 不存在房间 1004
                if(cc.dd.user._matching) {
                    cc.dd.user._matching = false;
                }
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const roomNotExitMes = cc.instantiate(prefab);
                    roomNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                    this.node.addChild(roomNotExitMes);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CREATE_ROOM_REP: {  // 新建房间失败的返回，1003
                if(cc.dd.user._matching) {
                    cc.dd.user._matching = false;
                }
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const roomNotExitMes = cc.instantiate(prefab);
                    roomNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                    this.node.addChild(roomNotExitMes);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_GAME_STATE: {
                if (cc.dd.user._matching){
                    cc.dd.user._matching = false;
                    cc.dd.Reload.loadPrefab("Hall/Prefab/Tip", (prefab) => {
                        const Tip = cc.instantiate(prefab);
                        this.node.addChild(Tip);
                    });
                    this.scheduleOnce(() => {
                        cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                        });
                    },3);
                    // this.node.getChildByName("Tip").destroy();
                }else {
                    cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.GAME_SCENE);
                });
                }
                break;
            }
            case cc.dd.userEvName.USER_LOGIN_SCU: { // 1001的返回，游戏或茶馆返回大厅后调用的返回
                this.setFangKaNum(cc.dd.user.getUserInfo().roomcardnum);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CARDCHANGE_REP: {  // 查询房卡失败返回，1007
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                    UIDNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                    this.node.addChild(UIDNotExitMes);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_CARDCHANGE_REQ: {
                cc.log("转让房卡成功，更新大厅房卡数");
                this.setFangKaNum(data.myroomcards);
                cc.dd.user.updateAgentInfo(data.agent);
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_QUERY_GAMERECORD_REQ: {
                cc.log("查询战绩成功");
                cc.dd.Reload.loadPrefab("Hall/Prefab/GameRecord", (prefab) => {
                    const gameRecord = cc.instantiate(prefab);
                    gameRecord.getComponent("GameRecord").initInfo(data.scoreset);
                    this.node.addChild(gameRecord);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_LOGOUT_REQ: {
                cc.log("成功登出");
                cc.dd.Reload.loadDir("DirRes", () => {
                    cc.dd.sceneMgr.runScene(cc.dd.sceneID.LOGIN_SCENE);
                });
                break;
            }
            // case cc.dd.gameCfg.EVENT.EVENT_DELEGATE_ROOM_REOCRD_REQ: { // 5015
            //     cc.log("成功返回房间代理记录或是成功创建代理房间");
            //     cc.dd.Reload.loadPrefab("Hall/Prefab/RoomDelegateRecord", (prefab) => {
            //         const delegateRecord = cc.instantiate(prefab);
            //         delegateRecord.getComponent("RoomDelegRecord").initInfo(data.rooms);
            //         cc.find("UI_ROOT").addChild(delegateRecord);
            //     });
            //     break;
            // }
            case cc.dd.gameCfg.EVENT.EVENT_JIESUAN_ZONGZHANJI_REQ: { // 4023,查询总战绩的返回
                cc.log("展示总战绩");
                cc.dd.Reload.loadPrefab("Game/Prefab/ZongZhanJi", (prefab) => {
                    const zzj = cc.instantiate(prefab);
                    zzj.getComponent("ZongZhanJi").initContentPic(data.totalscoreurl,cc.dd.user.roomserialnumber);
                    this.node.addChild(zzj);
                });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REP: { // 1015,进入茶馆错误处理
                cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                    const UIDNotExitMes = cc.instantiate(prefab);
                UIDNotExitMes.getComponent("AlterViewScript").initInfoMes(data.errmsg);
                this.node.addChild(UIDNotExitMes);
            });
                break;
            }
            case cc.dd.gameCfg.EVENT.EVENT_ENTER_CHAGUAN_REQ: { // 5015
                if (cc.dd.user.getChaGuan()) {
                    cc.dd.Reload.loadDir("DirRes", () => {
                        cc.dd.sceneMgr.runScene(cc.dd.sceneID.CHAGUAN_INNDER_SENCE);
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
