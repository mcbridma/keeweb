
'use strict';

var Backbone = require('backbone'),
    AutoTypeHintView = require('../auto-type-hint-view'),
    Locale = require('../../util/locale'),
    FeatureDetector = require('../../util/feature-detector'),
    AutoType = require('../../auto-type');

var DetailsAutoTypeView = Backbone.View.extend({
    template: require('templates/details/details-auto-type.hbs'),

    events: {
        'focus #details__auto-type-sequence': 'seqFocus',
        'input #details__auto-type-sequence': 'seqInput',
        'keypress #details__auto-type-sequence': 'seqKeyPress',
        'keydown #details__auto-type-sequence': 'seqKeyDown',
        'change #details__auto-type-enabled': 'enabledChange',
        'change #details__auto-type-obfuscation': 'obfuscationChange'
    },

    initialize: function() {
        this.views = {};
    },

    render: function() {
        var detAutoTypeShortcutsDesc = Locale.detAutoTypeShortcutsDesc
            .replace('{}', FeatureDetector.actionShortcutSymbol() + 'T')
            .replace('{}', FeatureDetector.globalShortcutSymbol() + 'T');
        this.renderTemplate({
            enabled: this.model.getEffectiveEnableAutoType(),
            obfuscation: this.model.autoTypeObfuscation,
            sequence: this.model.autoTypeSequence,
            windows: this.model.autoTypeWindows,
            defaultSequence: this.model.group.getEffectiveAutoTypeSeq(),
            detAutoTypeShortcutsDesc: detAutoTypeShortcutsDesc
        });
        return this;
    },

    seqInput: function(e) {
        var that = this;
        var el = e.target;
        var seq = $.trim(el.value);
        AutoType.validate(this.model, seq, function(err) {
            $(el).toggleClass('input--error', !!err);
            if (!err) {
                that.model.setAutoTypeSeq(seq);
            }
        });
    },

    seqKeyPress: function(e) {
        e.stopPropagation();
    },

    seqKeyDown: function(e) {
        e.stopPropagation();
    },

    seqFocus: function(e) {
        if (!this.views.hint) {
            this.views.hint = new AutoTypeHintView({input: e.target}).render();
            this.views.hint.on('remove', (function() {delete this.views.hint; }).bind(this));
        }
    },

    enabledChange: function(e) {
        this.model.setEnableAutoType(e.target.checked);
    },

    obfuscationChange: function(e) {
        this.model.setAutoTypeObfuscation(e.target.checked);
    }
});

module.exports = DetailsAutoTypeView;
