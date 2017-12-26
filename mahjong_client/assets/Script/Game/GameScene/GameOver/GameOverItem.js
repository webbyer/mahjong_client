cc.Class({
    extends: cc.Component,

    properties: {
        PlayerAvatar: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家头像",
        },
        GameTag: {
            default: null,
            type: cc.Label,
            tooltip: "tag",
        },
        NicknameLayout: {
            default: null,
            type: cc.Node,
            tooltip: "昵称的layout层",
        },
        Nickname: {
            default: null,
            type: cc.Label,
            tooltip: "玩家昵称",
        },
        FristPoint: {
            default: null,
            type: cc.Node,
            tooltip: "胡得分",
        },
        SecondPoint: {
            default: null,
            type: cc.Node,
            tooltip: "杠得分",
        },
        ThridPoint: {
            default: null,
            type: cc.Node,
            tooltip: "总得分",
        },
        zhuangjia: {
            default: null,
            type: cc.Node,
            tooltip: "庄家头像层",
        },
        userHandCards: {
            default: null,
            type: cc.Node,
            tooltip: "个人牌面",
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     *  初始化单个信息
     * @param data
     */
    initInfo(data) {
        this.Nickname.string = data.nickname;
        if (data.tags) {
            if (data.tags.indexOf("庄") != -1) {
                this.zhuangjia.active = true;
            }
            // this.GameTag.string = data.tags;
            this.Nickname.string = data.nickname + " | " + data.tags;
        }
        // else {
            // this.GameTag.string = "";
        // }
        cc.dd.setPlayerHead(data.wx_portrait,this.PlayerAvatar);
        let nlayout = this.NicknameLayout;
        if(data.UID === cc.dd.room._winneruid) {
            cc.dd.Reload.loadAtlas("Game/Atlas/gameOverAl",(atlas) => {
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("js-miying@2x");
                nlayout.addChild(node1);
            });
        }
        if(data.UID === cc.dd.room._dianpaouid) {
            cc.dd.Reload.loadAtlas("Game/Atlas/gameOverAl",(atlas) => {
                var node1 = new cc.Node('numstr1');
                var sp1 = node1.addComponent(cc.Sprite);
                sp1.spriteFrame = atlas.getSpriteFrame("js-midp@2x");
                nlayout.addChild(node1);
            });
        }
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.huscore,atlas);
                this.FristPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.gangscore,atlas);
                this.SecondPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
            const ponitstr = cc.instantiate(prefab);
            ponitstr.getComponent("composeNum").initPoint(data.roomscore,atlas);
            this.ThridPoint.addChild(ponitstr);
            });
        });
        this.presentCards(data);
    },
    // 黄局
    initHuangjuInfo(data) {
        this.Nickname.string = data.nickname;
        cc.dd.setPlayerHead(data.wx_portrait,this.PlayerAvatar);
        if (data.tags) {
            if (data.tags.indexOf("庄") != -1) {
                this.zhuangjia.active = true;
            }
            // this.GameTag.string = data.tags;
            this.Nickname.string = data.nickname + " | " + data.tags;
        }
        // else {
        //     this.GameTag.string = "";
        // }
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.huscore,atlas);
                this.FristPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
                const ponitstr = cc.instantiate(prefab);
                ponitstr.getComponent("composeNum").initPoint(data.gangscore,atlas);
                this.SecondPoint.addChild(ponitstr);
            });
        });
        cc.dd.Reload.loadAtlas("Game/Atlas/num", (atlas) => {
            cc.dd.Reload.loadPrefab("Game/Prefab/ShowTime", (prefab) => {
            const ponitstr = cc.instantiate(prefab);
            ponitstr.getComponent("composeNum").initPoint(data.roomscore,atlas);
            this.ThridPoint.addChild(ponitstr);
            });
        });
    },
    /**
     *  用户牌面
     * @param data
     */
    presentCards(data) {
        let parantNode = this.userHandCards;
        cc.dd.Reload.loadAtlas("Game/Atlas/gameOver", (atlas) => {
            const handcardNode = parantNode.getChildByName("HandCard");
        // 手牌
        if (data.handcards) {
            cc.dd.Reload.loadPrefab("Game/Prefab/GO_HandPoker", (prefab) => {
                data.handcards.forEach((item) => {
                const card = cc.instantiate(prefab);
            const str = "little_card_" + (item +1);
            card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
            // 加鬼牌遮罩 Giupai
            if(cc.dd.room._guipai == item){
                card.getChildByName("Giupai").active = true;
            }
            handcardNode.addChild(card);
        });
        });
        }
        // 碰的牌
        cc.dd.Reload.loadPrefab("Game/Prefab/GO_PengGang", (prefab) => {
            const pengGangNode = parantNode.getChildByName("PengGang");
        if (data.pengcards) {
            data.pengcards.forEach((item) => {
                const penggang = cc.instantiate(prefab);
                const str = "little_card_" + (item  + 1);
                penggang.children.forEach((card) => {
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
            });
            pengGangNode.addChild(penggang);
        });
        }
        // 杠的牌
        if (data.gangcards) {
            data.gangcards.forEach((item) => {
                const penggang = cc.instantiate(prefab);
            const str = "little_card_" + (item  + 1);
            penggang.children.forEach((card) => {
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
            card.active = true;
        });
            pengGangNode.addChild(penggang);
        });
        }
        // 吃的牌
        if (data.chicards) {
            data.chicards.forEach((item) => {
                const penggang = cc.instantiate(prefab);
            let index = 0;
            penggang.children.forEach((card) => {
                const str = "little_card_" + (item[index]  + 1);
            if (card.name !== "Gang") {
                card.getChildByName("Spr").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str);
                index ++;
            }
        });
            pengGangNode.addChild(penggang);
        });
        }
    });
    });
    },
});
