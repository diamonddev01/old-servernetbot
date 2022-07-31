"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FILTER_LEVEL = exports.LOGGER_CHANNEL = exports.LOGGER_ENABLED = exports.WARN_ESCALATION_THRESHOLD = exports.WARN_ESCALATION_BAN_TIME = exports.WARN_ESCALATION_ENABLED = exports.AUTOMOD_MESSAGES_FOR_MEDIA = exports.AUTOMOD_DEFINE_LINK = exports.AUTOMOD_MAX_LENGTH = exports.AUTOMOD_ENABLED = exports.SLOWMODE_TIME = exports.SLOWMODE = exports.WARN_TIMEOUT = void 0;
// Moderator Settings
exports.WARN_TIMEOUT = 2629800000; // 1 month
exports.SLOWMODE = true;
exports.SLOWMODE_TIME = 3000; // 3 seconds
// Automod Settings
exports.AUTOMOD_ENABLED = true;
exports.AUTOMOD_MAX_LENGTH = 2000;
exports.AUTOMOD_DEFINE_LINK = ["http://", "https://", ".com", ".gg", ".app", ".chat", ".org", ".dev", ".ru"];
exports.AUTOMOD_MESSAGES_FOR_MEDIA = 100;
// Warning escalation settings
exports.WARN_ESCALATION_ENABLED = true;
exports.WARN_ESCALATION_BAN_TIME = 86400000; // 1 day
exports.WARN_ESCALATION_THRESHOLD = 3;
// Logger settings
exports.LOGGER_ENABLED = true;
exports.LOGGER_CHANNEL = "925796503539294228";
// Defaults
exports.DEFAULT_FILTER_LEVEL = 2;
