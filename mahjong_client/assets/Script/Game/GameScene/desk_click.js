const END_POS = {
    x: 250,
    y: -30,
};
const MOVE_TIME = 0.3;
const WITHDRAW = 100;
cc.Class({
    extends: cc.Component,

    properties: {
        _didClickRecordBtn: null,
        // recordSprite: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "录音按钮图标",
        // },
        // stopRecord: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "停止录音按钮图标",
        // },
        RecordBTN: {
            default: null,
            type: cc.Node,
            tooltip: "录音按钮",
        },
        disableRecordBTN: {
            default: null,
            type: cc.Node,
        },
        DuanyuBTN: {
            default: null,
            type: cc.Node,
            tooltip: "表情短语按钮",
        },
        disableDuanyuBTN: {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.RecordBTN.on('touchstart',function (event) {
            // this.node.getChildByName("Table").getChildByName("Right").getChildByName("emodisablelayer").active = true;
            // this.node.getChildByName("Table").getChildByName("Right").getChildByName("BtnEmoji").active = false;
            this.count = 0;
            this.callback = function () {
                if (this.count === 179) {
                    cc.log("achieve179:");
                    this.stopRecordingWithGvoiceSDk();
                    this.unschedule(this.callback);
                    this.callback = null;
                }
                // if (this.count === 1) {

                    // this.node.getChildByName("Table").getChildByName("Right").getChildByName("emodisablelayer").active = true;
                    // this.node.getChildByName("Table").getChildByName("Right").getChildByName("BtnEmoji").active = false;
                // }
                if (!cc.dd.room._selfRecording) {
                    cc.dd.room._selfRecording = true;
                }
                this.count++;
                cc.log(this.count);
            }

            this.schedule(this.callback, 1);
            cc.dd.Reload.loadPrefab("Game/Prefab/Recording", (prefan) => {
                const recording = cc.instantiate(prefan);
                if (cc.sys.localStorage.getItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE) == cc.dd.roomDeskType.Desk_3D){
                    this.node.getComponent("mj_gameScene").TimerFor3DNode.addChild(recording);
                }else {
                    this.node.getComponent("mj_gameScene").TimerFor2DNode.addChild(recording);
                }
            });
            cc.dd.startRecordingWithGvoice();
            cc.dd.soundMgr.pauseAllSounds();
        },this);
        this.RecordBTN.on('touchend',function (event) {
            if(this.callback) {
                this.unschedule(this.callback);
                this.stopRecordingWithGvoiceSDk();
            }
        },this);
        this.RecordBTN.on('touchcancel',function (event) {
            if(this.callback) {
                this.unschedule(this.callback);
                this.stopRecordingWithGvoiceSDk();
            }
        },this);
        cc.log(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE));
        if(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE) == cc.dd.userEvName.USER_YUYIN_ON) {
            this.RecordBTN.active = true;
        }else {
            this.RecordBTN.active = false;
        }
    },
    // 返回
    onReturnClick() {
        cc.log(`返回`);
    },
    // 扩展tool,isagent为1的时候才显示转让房卡
    onKuoZhanClick() {
        cc.log(`扩展，${cc.dd.user.getUserInfo().isagent}`);
        if (!cc.dd.user.getUserInfo().isagent || (cc.dd.user.getUserInfo().isagent == 0)){
            cc.dd.Reload.loadPrefab("Game/Prefab/NoKFKZTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }else {
            cc.dd.Reload.loadPrefab("Game/Prefab/KuoZhanTool", (prefan) => {
                const kzTool = cc.instantiate(prefan);
            this.node.addChild(kzTool);
            });
        }
    },
    // 停止录音
    stopRecordingWithGvoiceSDk() {
        let RecordAniNode = null;
        if (cc.sys.localStorage.getItem(cc.dd.userEvName.USER_DESK_TYPE_CHANGE) == cc.dd.roomDeskType.Desk_3D){
            RecordAniNode = this.node.getComponent("mj_gameScene").TimerFor3DNode.getChildByName("Recording");
        }else {
            RecordAniNode = this.node.getComponent("mj_gameScene").TimerFor2DNode.getChildByName("Recording");
        }
        RecordAniNode.removeFromParent();
        cc.dd.stopRecordingWithGvoice();
        cc.dd.soundMgr.resumeAllSounds();
        cc.dd.room._selfRecording = false;
    },
    // 表情和短语
    onEmojiClick() {
        if(this.showEmoji == true) {
            this.showEmoji = false;
            const moveAni = cc.moveTo(MOVE_TIME, cc.p(END_POS.x+WITHDRAW, END_POS.y));
            this.node.getChildByName("EmojiPhrase").runAction(moveAni);
            this.scheduleOnce(() => {
                this.node.getChildByName("EmojiPhrase").active = false;
            }, MOVE_TIME); //-0.1
        }else {
            this.showEmoji = true;
            if (this.node.getChildByName("EmojiPhrase")){
                this.node.getChildByName("EmojiPhrase").active = true;
            }else {
                cc.dd.Reload.loadPrefab("Game/Prefab/EmojiPhrase", (prefan) => {
                    const emoji = cc.instantiate(prefan);
                    this.node.addChild(emoji);
                });
            }
            if (this.node.getChildByName("EmojiPhrase")) {
                const moveAni = cc.moveTo(MOVE_TIME, cc.p(END_POS.x, END_POS.y));
                this.node.getChildByName("EmojiPhrase").runAction(moveAni);
            }
        }
    },
    // 语音 弃用
    onSoundClick() {
        if(!cc.sys.isMobile){
            return;
        }
        if(!this._didClickRecordBtn) {
            this._didClickRecordBtn = true;
            cc.dd.Reload.loadPrefab("Game/Prefab/Recording", (prefan) => {
                const recording = cc.instantiate(prefan);
                this.node.addChild(recording);
            });
            // var imgstop = cc.url.raw("Game/Atlas/stoprecord.png");// htu
            // var rejectTexture = cc.textureCache.addImage(imgstop);
            // this.recordSprite.spriteFrame.setTexture(rejectTexture);
            this.recordSprite.active = false;
            this.stopRecord.active = true;
            cc.dd.startRecordingWithGvoice();
            cc.dd.soundMgr.pauseAllSounds();
        }else {
            this._didClickRecordBtn = false;
            this.node.getChildByName("Recording").removeFromParent();
            this.recordSprite.active = true;
            this.stopRecord.active = false;
            cc.dd.stopRecordingWithGvoice();
            cc.dd.soundMgr.resumeAllSounds();
        }

    },
    // 碰
    onPengClick() {
        cc.log(`发送碰牌请求`);
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_PENGCARD_REP);
    },
    // 杠
    onGangClick() {
        cc.log(`发送杠牌请求`);
        if(cc.dd.room._isFourZeroOneTwo) {
            cc.dd.room._isFourZeroOneTwo = false;
        }
        const gangList = cc.dd.cardMgr.getZiMoGang();
        if (gangList) {
            if (gangList.length == 1) {
                cc.dd.cardMgr.setCurZiMoGangCard(gangList[0]);
                this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP, gangList[0]);
            } else {
                cc.dd.Reload.loadPrefab("Game/Prefab/GangSelect", (prefab) => {
                    const gangLayer = cc.instantiate(prefab);
                    gangLayer.getComponent("GangSelect").initCard(gangList);
                    this.node.addChild(gangLayer);
                });
            }
        } else {
            this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GANGCARD_REP);
        }
    },
    onHuClick() {
        cc.log(`发送胡牌请求`);
        if(cc.dd.room._isFourZeroOneTwo) {
            cc.dd.room._isFourZeroOneTwo = false;
        }
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_HUCARD_REP);
    },
    // 过
    onGuoClick(event) {
        cc.log(`过牌`);
        cc.dd.roomEvent.setIsCache(true);
        // cc.dd.roomEvent.notifyCacheList();
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        // if(cc.dd.room._isFourZeroOneTwo) {
        //     cc.dd.room._isFourZeroOneTwo = false;
        // }else {
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP);
        // }
        // this.scheduleOnce(() => {

        // });
        
        //如果在听、过状态选择了过那么可以出牌，因为显示操作按钮的时候已经禁止用户手动出牌
        cc.log(`isOnlyTing:`+event.target.isOnlyTing);
        if (event.target.isOnlyTing) {
        
            //过牌不应该影响能否出牌  但这里不置为true会有问题
            cc.dd.cardMgr.setIsCanOutCard(true);
            cc.dd.cardMgr.setTingList(null);
            return;
        }
        //这里暂时不知道是什么意思,似乎是自己摸牌后如果有杠、胡的操作会将customData置为true
        cc.log(`customData:`+event.target.customData);
        if (event.target.customData) {
            //过牌不应该影响能否出牌 
            cc.dd.cardMgr.setIsCanOutCard(false);

            if (cc.dd.cardMgr.getIsTing()) {
                cc.log(`customData = true isting = true moCard=`+moCard);
                const moCard = cc.dd.cardMgr.getMoCard();
                if (moCard) {
                    const moNode = this.node.getComponent("mj_gameScene").playerArr[0].
                    getChildByName("ParentContainer").getChildByName("HandCardLayer").getChildByName("MoCardLayer");
                    this.scheduleOnce(() => {
                        moNode.children.forEach((item) => {
                            item.destroy();
                        });
                        moNode.removeAllChildren();
                        const suit = parseInt(moCard / 9) + 1;
                        const num = moCard % 9 + 1;
                        cc.dd.playEffect(1, num, suit);
                        const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
                        cc.dd.cardMgr.outCard(outCardNode, 1, moCard);
                        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: moCard, tingpai: false});
                    }, 0.5);
                    return;
                }
            }else{
                //未听牌状态过牌后要允许用户手动出牌
                cc.dd.cardMgr.setIsCanOutCard(true);
            }
        } else {
            // cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_GUOCARD_REP);

        }

        //听牌状态,摸牌后、过牌后自动出牌
        cc.log(`过牌执行cc.dd.cardMgr.getIsTing()之前, isTing = `+cc.dd.cardMgr.getIsTing());
        if (cc.dd.cardMgr.getIsTing()) {
            cc.log(`过牌执行cc.dd.cardMgr.getIsTing():`+cc.dd.cardMgr.getIsTing());
            cc.log(`听牌状态`);
            const moCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("ParentContainer").getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            if (moCard) {
                moCard.children.forEach((item) => {
                    const suit = parseInt(item.cardId / 9) + 1;
                    const num = item.cardId % 9 + 1;
                    cc.dd.playEffect(1, num, suit);
                    const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
                    cc.dd.cardMgr.outCard(outCardNode, 1, item.cardId);
                    cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: item.cardId, tingpai: false});
                    item.removeFromParent(true);
                    item.destroy();
                });
            }
        }
    },
    // 吃
    onChiClick() {
        cc.log(`发送吃牌的请求`);
        const chiList = cc.dd.cardMgr.getChiList();
        if (chiList) {
            if (chiList.length == 1) {
                this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
                cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHICARD_REP, chiList[0]);
            } else {
                cc.dd.Reload.loadPrefab("Game/Prefab/ChiSelect", (prefab) => {
                    const chiLayer = cc.instantiate(prefab);
                    chiLayer.getComponent("ChiSelect").initCard(chiList);
                    this.node.addChild(chiLayer);
                });
            }
        }
    },
    // 听
    onTingClick() {
        cc.log(`玩家听牌`);
        if(cc.dd.room._isFourZeroOneTwo) {
            cc.dd.room._isFourZeroOneTwo = false;
        }
        this.node.getComponent("mj_gameScene").showTingSign();
        this.node.getComponent("mj_gameScene").playerArr[0].getComponent("PlayerSelf").hideOperateBtn();
        if (cc.dd.cardMgr.getTingList().length == 1) {
            const moCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("ParentContainer").getChildByName("HandCardLayer").getChildByName("MoCardLayer");
            const handCard = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("ParentContainer").getChildByName("HandCardLayer").getChildByName("HandCardLay");
            let hasRemove = false;
            moCard.children.forEach((card) => {
                if (cc.dd.cardMgr.getTingList()[0] == card.cardId) {
                    card.removeFromParent(true);
                    card.destroy();
                    hasRemove = true;
                }
            });
            if (!hasRemove) {
                handCard.children.forEach((card) => {
                    if (!hasRemove) {
                        if (cc.dd.cardMgr.getTingList()[0] == card.cardId) {
                            card.removeFromParent(true);
                            card.destroy();
                            hasRemove = true;
                        }
                    }
                });
            }
            const suit = parseInt(cc.dd.cardMgr.getTingList()[0] / 9) + 1;
            const num = cc.dd.cardMgr.getTingList()[0] % 9 + 1;
            cc.dd.playEffect(1, num, suit);
            const outCardNode = this.node.getComponent("mj_gameScene").playerArr[0].getChildByName("OutCardLayer");
            cc.dd.cardMgr.outCard(outCardNode, 1, cc.dd.cardMgr.getTingList()[0]);
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_OUTCARD_REP, {id: cc.dd.cardMgr.getTingList()[0], tingpai: true});
            /*************************************/
            //cc.dd.cardMgr.setIsCanOutCard(true);
            cc.dd.cardMgr.setIsCanOutCard(false);//自动出牌后不能再手动出牌
            /*************************************/            
        }else{
            cc.dd.cardMgr.setIsCanOutCard(true);
        }

    },
    // 茶馆进入牌桌的情况下，人数未满可以返回茶馆
    onClickExitToChaguan() {
        cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_CHAGUAN_LEAVE_MAJIONG_DESK_REP);
    },
    // 与语音相关的节点的隐藏与控制
    yuyinRelatedNodeInteracted(interactable) {
        if(cc.sys.localStorage.getItem(cc.dd.userEvName.USER_YUYIN_SWTICH_STATE) == cc.dd.userEvName.USER_YUYIN_ON) {
            this.RecordBTN.active = interactable;
            this.disableRecordBTN.active = !interactable;
            this.DuanyuBTN.active = interactable;
            this.disableDuanyuBTN.active = !interactable;
        }else {
            this.RecordBTN.active = false;
            this.DuanyuBTN.active = interactable;
            this.disableDuanyuBTN.active = !interactable;
        }
    },
});
