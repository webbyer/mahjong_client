const PLAY_OPERA_NAME = [
    null,
    "可断门",
    "闭门胡",
    "会牌",
    "搂宝",
    "夹胡",
    "点炮包三家",
    "清一色",
    "四归一",
    "七小对",
];
cc.Class({
    extends: cc.Component,

    properties: {
        RoomID: {
            default: null,
            type: cc.Label,
            tooltip: "房号",
        },
        // AvatarOne: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "底部玩家",
        // },
        Avatars: {
            default: null,
            type: cc.Node,
            tooltip: "玩家们",
        },
        // AvatarThree: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "顶部玩家",
        // },
        // AvatarFour: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "左边玩家",
        // },
        RoundLabel: {
            default: null,
            type: cc.Label,
            tooltip: "圈数信息",
        },
        WanfaLabel: {
            default: null,
            type: cc.Label,
            tooltip: "玩法信息",
        },
        DeleteBtn: {
            default: null,
            type: cc.Node,
            tooltip: "删除按钮",
        },
        _itemRoomid: null,
        _isOwner: null,
        _userApplystatus: null
    },

    // use this for initialization
    onLoad: function () {

    },
    // 初始化
    setupInitContent(data,isOwner,userApplystatus) {
        cc.log(`该桌子所在${isOwner}`);
        this._isOwner = isOwner;
        this._userApplystatus = userApplystatus;
        this._itemRoomid = data.roomid;
        this.RoomID.string = "房号：" + data.roomid;
        this.RoundLabel.string = data.rounds + "把/" + data.basicraise + "底";
        this.setDelegRoomGameRulesString(data.rules);
        this.DeleteBtn.active = isOwner;
        if (data.players){
            this.updateAvtars(data.players);
        }
    },
    setDelegRoomGameRulesString(data){
        if (data) {
            // this.wanfaSet = data;
            let str;
            data.forEach((item) => {
                if(!str){
                str = PLAY_OPERA_NAME[item];
            }else {
                str = str + "、" + PLAY_OPERA_NAME[item];
            }
        });
            this.WanfaLabel.string = str;
        }
    },
    // 玩家入座
    onSitInDeskClick(event,customdata) {
        if (cc.dd.user._userCurrentApplystatus !== 1) {
            cc.dd.Reload.loadPrefab("Hall/Prefab/AlertView", (prefab) => {
                const UIDNotExitMes = cc.instantiate(prefab);
            UIDNotExitMes.getComponent("AlterViewScript").initInfoMes("请先申请进入茶馆\n馆主同意后才可进入游戏");
            this.node.parent.parent.parent.parent.addChild(UIDNotExitMes);
        });
        }else {
            cc.dd.net.startEvent(cc.dd.gameCfg.EVENT.EVENT_ENTER_ROOM_REP,this._itemRoomid);
        }
    },
    // 删除当前桌
    onDeleteClick() {
        cc.log("删除当前桌"+this._itemRoomid);
        cc.dd.Reload.loadPrefab("ChaGuan/Prefab/AlertViewTwoChoices", (prefab) => {
            const UIDNotExitMes = cc.instantiate(prefab);
        this.node.parent.parent.parent.parent.addChild(UIDNotExitMes);
        UIDNotExitMes.getComponent("AlterViewScript").netWorkData = this._itemRoomid;
    });
    },
    // update
    updateAvtars(data){
        if(data.length > 0) {
            if (this._isOwner) {
                this.DeleteBtn.active = false;
            }
            // 头像与disable该按钮
            data.forEach((item,index) => {
                this.Avatars.children[index].getComponent(cc.Button).interactable = false;
            cc.log("设置头像");
            cc.dd.setPlayerHead(item,this.Avatars.children[index].getComponent(cc.Sprite));
        });
            if (data.length <= 3) {
                cc.dd.Reload.loadAtlas("ChaGuan/Atlas/GameTea", (atlas) => {
                    let startnum = 3;
                let loopcount = 4 - data.length;
                for(let i = 0;i < loopcount;i++) {
                    cc.log("桌子里头像进来了吗");
                    this.Avatars.children[startnum].getComponent(cc.Button).interactable = true;
                    this.Avatars.children[startnum].getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("ChaGuan_TouXiang");
                    startnum -= 1;
                }
            });
            }
        }else {
            if (this._isOwner) {
                this.DeleteBtn.active = true;
            }
            cc.dd.Reload.loadAtlas("ChaGuan/Atlas/GameTea", (atlas) => {
                this.Avatars.children.forEach((item) => {
                cc.log("全部设置为默认头像");
            item.getComponent(cc.Button).interactable = true;
            item.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("ChaGuan_TouXiang");
        });
        });
        }
    },
});
