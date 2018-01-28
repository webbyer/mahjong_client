cc.Class({
    extends: cc.Component,

    properties: {
        fristLabel: {
            default:null,
            type: cc.Label,
        },
        secondLabel: {
            default:null,
            type: cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        if(cc.dd.user._noticeboard){
            if (cc.dd.user._noticeboard.length === 1) {
                this.fristLabel.node.active = true;
                this.fristLabel.string = cc.dd.user._noticeboard[0][0] + cc.dd.user._noticeboard[0][1];
            }else if (cc.dd.user._noticeboard.length == 2) {
                this.fristLabel.node.active = true;
                this.secondLabel.node.active = true;
                this.fristLabel.string = cc.dd.user._noticeboard[0][0] + cc.dd.user._noticeboard[0][1];
                this.secondLabel.string = cc.dd.user._noticeboard[1][0] + cc.dd.user._noticeboard[1][1];
            }
        }
    },
    onCloseClick() {
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
