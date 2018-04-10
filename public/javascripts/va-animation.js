AFRAME.registerComponent('va-animation', {

    init: function () {
        this.LISTENING_STATE = "listening";
        this.RESULT_STATE = "result";
        this.FAIL_STATE = "fail";
        this.RING_ACTIVE_STATE = "ring active";
        this.CORE_ACTIVE_STATE = "core active";
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMatch = this.onMatch.bind(this);
        this.onNomatch = this.onNomatch.bind(this);
        this.onRingAnimationEnd = this.onRingAnimationEnd.bind(this);
        this.onCoreAnimationEnd = this.onCoreAnimationEnd.bind(this);
    },

    play: function () {
        var vaEl = document.querySelector('#voice-assistant');
        var varingEl = document.querySelector('#va-ring');
        var vacoreEl = document.querySelector('#va-core');
        vaEl.addEventListener("start", this.onStart);
        vaEl.addEventListener("error", this.onEnd);
        vaEl.addEventListener("end", this.onEnd);
        vaEl.addEventListener("match", this.onMatch);
        vaEl.addEventListener("nomatch", this.onNomatch);
        varingEl.querySelector('a-animation').addEventListener('animationend', this.onRingAnimationEnd);
        vacoreEl.querySelector('a-animation').addEventListener('animationend', this.onCoreAnimationEnd);
    },

    pause: function () {
        this.el.addEventListener("start", this.onStart);
        this.el.addEventListener("end", this.onEnd);
        this.el.addEventListener("match", this.onMatch);
        this.el.addEventListener("nomatch", this.onNomatch);
    },

    onStart: function () {
        this.el.addState(this.LISTENING_STATE);
        this.el.emit('va-appear');
        document.querySelector('#va-text').setAttribute('value', "listening");
    },

    onEnd: function () {
        if (!this.el.is(this.FAIL_STATE) && !this.el.is(this.RESULT_STATE)) {
            this.el.removeState(this.LISTENING_STATE);
            document.querySelector('#va-text').setAttribute('value', "command not understood");
            this.el.emit('va-disappear');
        }
        this.el.removeState(this.FAIL_STATE);
        this.el.removeState(this.RESULT_STATE);
        this.el.removeState(this.RING_ACTIVE_STATE);
        this.el.removeState(this.CORE_ACTIVE_STATE);
    },

    onMatch: function (evt) {
        console.log(evt);
        this.el.addState(this.RESULT_STATE);
        document.querySelector('#va-text').setAttribute('value', evt.detail.userSaid);
        this.el.emit('va-disappear');
    },

    onNomatch: function () {
        this.el.addState(this.FAIL_STATE);
        document.querySelector('#va-text').setAttribute('value', "command not matched");
        this.el.emit('va-disappear');
    },

    onRingAnimationEnd: function () {
        this.el.removeState(this.RING_ACTIVE_STATE);
    },

    onCoreAnimationEnd: function () {
        this.el.removeState(this.CORE_ACTIVE_STATE);
    },

    tick: function () {
        var vaEl = document.querySelector('#voice-assistant');
        var varingEl = document.querySelector('#va-ring');
        var vacoreEl = document.querySelector('#va-core');

        if (this.el.is(this.LISTENING_STATE)) {
            if (!this.el.is(this.RING_ACTIVE_STATE)) {
                varingEl.emit("ring-start");
                this.el.addState(this.RING_ACTIVE_STATE);
            }
            if (!this.el.is(this.CORE_ACTIVE_STATE)) {
                vacoreEl.emit("core-start");
                this.el.addState(this.CORE_ACTIVE_STATE);
            }
        }
    }
});