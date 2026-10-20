"use strict";
// player-engine.controller.ts (COMPLETO)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerEngineController = void 0;
var common_1 = require("@nestjs/common");
var PlayerEngineController = function () {
    var _classDecorators = [(0, common_1.Controller)('player')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMediaInfo_decorators;
    var _getQualities_decorators;
    var _getEpisodeNavigation_decorators;
    var _playVideo_decorators;
    var _getSubtitles_decorators;
    var _getAudioTracks_decorators;
    var _saveProgress_decorators;
    var _getContinueWatching_decorators;
    var _getProgress_decorators;
    var PlayerEngineController = _classThis = /** @class */ (function () {
        function PlayerEngineController_1(playerService, prisma) {
            this.playerService = (__runInitializers(this, _instanceExtraInitializers), playerService);
            this.prisma = prisma;
        }
        // ========================================
        // 🔹 ROUTE STATICHE (DEVONO ESSERE PRIMA)
        // ========================================
        PlayerEngineController_1.prototype.getMediaInfo = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.playerService.getMediaInfo(mediaId)];
                });
            });
        };
        PlayerEngineController_1.prototype.getQualities = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.playerService.getAvailableQualities(mediaId)];
                });
            });
        };
        // 🔥 NAVIGAZIONE EPISODI (precedente / successivo)
        PlayerEngineController_1.prototype.getEpisodeNavigation = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.playerService.getEpisodeNavigation(mediaId)];
                });
            });
        };
        PlayerEngineController_1.prototype.playVideo = function (mediaId, quality, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.playerService.streamVideo(mediaId, quality, req, res)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlayerEngineController_1.prototype.getSubtitles = function (mediaId_1) {
            return __awaiter(this, arguments, void 0, function (mediaId, language, res) {
                var subtitles;
                if (language === void 0) { language = 'it'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.playerService.getSubtitles(mediaId, language)];
                        case 1:
                            subtitles = _a.sent();
                            if (!subtitles) {
                                res.status(404).send('Sottotitoli non trovati');
                                return [2 /*return*/];
                            }
                            res.setHeader('Content-Type', subtitles.mimeType);
                            res.send(subtitles.content);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlayerEngineController_1.prototype.getAudioTracks = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.playerService.getAudioTracks(mediaId)];
                });
            });
        };
        // ========================================
        // 🔹 ROUTE PER IL PROGRESSO (STATICHE)
        // ========================================
        PlayerEngineController_1.prototype.saveProgress = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var mediaId, progress, quality, duration, media, totalDuration, progressPercent, shouldSave, existing, allHistory, toDelete, idsToDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mediaId = body.mediaId, progress = body.progress, quality = body.quality, duration = body.duration;
                            return [4 /*yield*/, this.prisma.media.findUnique({
                                    where: { id: mediaId },
                                })];
                        case 1:
                            media = _a.sent();
                            if (!media) {
                                throw new common_1.NotFoundException('Media non trovato');
                            }
                            totalDuration = duration || (media.runtime ? media.runtime * 60 : 0);
                            progressPercent = totalDuration > 0 ? (progress / totalDuration) * 100 : 0;
                            shouldSave = progressPercent >= 2 && progressPercent <= 85;
                            if (!!shouldSave) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.watchHistory.deleteMany({
                                    where: { mediaId: mediaId },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Progresso rimosso (fuori soglia 2%-85%)',
                                    progressPercent: progressPercent,
                                    action: 'removed',
                                }];
                        case 3: return [4 /*yield*/, this.prisma.watchHistory.findFirst({
                                where: { mediaId: mediaId },
                            })];
                        case 4:
                            existing = _a.sent();
                            if (!existing) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.watchHistory.update({
                                    where: { id: existing.id },
                                    data: {
                                        progress: progress,
                                        quality: quality || null,
                                        watchedAt: new Date(),
                                    },
                                })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.prisma.watchHistory.create({
                                data: {
                                    mediaId: mediaId,
                                    progress: progress,
                                    quality: quality || null,
                                    watchedAt: new Date(),
                                },
                            })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [4 /*yield*/, this.prisma.watchHistory.findMany({
                                orderBy: { watchedAt: 'desc' },
                            })];
                        case 9:
                            allHistory = _a.sent();
                            if (!(allHistory.length > 10)) return [3 /*break*/, 11];
                            toDelete = allHistory.slice(10);
                            idsToDelete = toDelete.map(function (h) { return h.id; });
                            return [4 /*yield*/, this.prisma.watchHistory.deleteMany({
                                    where: { id: { in: idsToDelete } },
                                })];
                        case 10:
                            _a.sent();
                            _a.label = 11;
                        case 11: return [2 /*return*/, {
                                success: true,
                                message: 'Progresso salvato',
                                progressPercent: progressPercent,
                                action: 'saved',
                            }];
                    }
                });
            });
        };
        PlayerEngineController_1.prototype.getContinueWatching = function () {
            return __awaiter(this, void 0, void 0, function () {
                var history;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.watchHistory.findMany({
                                where: { progress: { gt: 0 } },
                                include: {
                                    media: {
                                        select: {
                                            id: true,
                                            title: true,
                                            posterUrl: true,
                                            backgroundUrl: true,
                                            releaseYear: true,
                                            rating: true,
                                            type: true,
                                            runtime: true,
                                        },
                                    },
                                },
                                orderBy: { watchedAt: 'desc' },
                                take: 10,
                            })];
                        case 1:
                            history = _a.sent();
                            return [2 /*return*/, history.map(function (h) {
                                    var _a;
                                    var runtimeMinutes = h.media.runtime || 0;
                                    var runtimeSeconds = runtimeMinutes * 60;
                                    var progress = (_a = h.progress) !== null && _a !== void 0 ? _a : 0;
                                    var progressPercent = runtimeSeconds > 0 ? (progress / runtimeSeconds) * 100 : 0;
                                    var remainingSeconds = Math.max(0, runtimeSeconds - progress);
                                    var remainingMinutes = Math.ceil(remainingSeconds / 60);
                                    return __assign(__assign({}, h.media), { progress: progress, progressPercent: Math.min(progressPercent, 100), remainingMinutes: remainingMinutes, quality: h.quality, watchedAt: h.watchedAt });
                                })];
                    }
                });
            });
        };
        PlayerEngineController_1.prototype.getProgress = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var history;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.watchHistory.findFirst({
                                where: { mediaId: mediaId },
                            })];
                        case 1:
                            history = _a.sent();
                            return [2 /*return*/, { progress: (history === null || history === void 0 ? void 0 : history.progress) || 0 }];
                    }
                });
            });
        };
        return PlayerEngineController_1;
    }());
    __setFunctionName(_classThis, "PlayerEngineController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMediaInfo_decorators = [(0, common_1.Get)('info/:mediaId')];
        _getQualities_decorators = [(0, common_1.Get)('qualities/:mediaId')];
        _getEpisodeNavigation_decorators = [(0, common_1.Get)('episode-nav/:mediaId')];
        _playVideo_decorators = [(0, common_1.Get)('play/:mediaId')];
        _getSubtitles_decorators = [(0, common_1.Get)('subtitles/:mediaId')];
        _getAudioTracks_decorators = [(0, common_1.Get)('audio/:mediaId')];
        _saveProgress_decorators = [(0, common_1.Post)('progress')];
        _getContinueWatching_decorators = [(0, common_1.Get)('continue-watching')];
        _getProgress_decorators = [(0, common_1.Get)('progress/:mediaId')];
        __esDecorate(_classThis, null, _getMediaInfo_decorators, { kind: "method", name: "getMediaInfo", static: false, private: false, access: { has: function (obj) { return "getMediaInfo" in obj; }, get: function (obj) { return obj.getMediaInfo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQualities_decorators, { kind: "method", name: "getQualities", static: false, private: false, access: { has: function (obj) { return "getQualities" in obj; }, get: function (obj) { return obj.getQualities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEpisodeNavigation_decorators, { kind: "method", name: "getEpisodeNavigation", static: false, private: false, access: { has: function (obj) { return "getEpisodeNavigation" in obj; }, get: function (obj) { return obj.getEpisodeNavigation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _playVideo_decorators, { kind: "method", name: "playVideo", static: false, private: false, access: { has: function (obj) { return "playVideo" in obj; }, get: function (obj) { return obj.playVideo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubtitles_decorators, { kind: "method", name: "getSubtitles", static: false, private: false, access: { has: function (obj) { return "getSubtitles" in obj; }, get: function (obj) { return obj.getSubtitles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudioTracks_decorators, { kind: "method", name: "getAudioTracks", static: false, private: false, access: { has: function (obj) { return "getAudioTracks" in obj; }, get: function (obj) { return obj.getAudioTracks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _saveProgress_decorators, { kind: "method", name: "saveProgress", static: false, private: false, access: { has: function (obj) { return "saveProgress" in obj; }, get: function (obj) { return obj.saveProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getContinueWatching_decorators, { kind: "method", name: "getContinueWatching", static: false, private: false, access: { has: function (obj) { return "getContinueWatching" in obj; }, get: function (obj) { return obj.getContinueWatching; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProgress_decorators, { kind: "method", name: "getProgress", static: false, private: false, access: { has: function (obj) { return "getProgress" in obj; }, get: function (obj) { return obj.getProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlayerEngineController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlayerEngineController = _classThis;
}();
exports.PlayerEngineController = PlayerEngineController;
