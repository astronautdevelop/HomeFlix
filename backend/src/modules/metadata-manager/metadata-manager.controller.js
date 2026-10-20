"use strict";
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
exports.MetadataManagerController = void 0;
var common_1 = require("@nestjs/common");
var path = require("path");
var fs = require("fs/promises");
var MetadataManagerController = function () {
    var _classDecorators = [(0, common_1.Controller)('metadata')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _updateMediaMetadata_decorators;
    var _updateAllMetadata_decorators;
    var _getMetadataStatus_decorators;
    var _getActorImage_decorators;
    var _cleanupActorImages_decorators;
    var _getActorCacheStats_decorators;
    var MetadataManagerController = _classThis = /** @class */ (function () {
        function MetadataManagerController_1(metadataService, prisma, actorCache) {
            this.metadataService = (__runInitializers(this, _instanceExtraInitializers), metadataService);
            this.prisma = prisma;
            this.actorCache = actorCache;
        }
        MetadataManagerController_1.prototype.updateMediaMetadata = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.metadataService.updateMetadataForMedia(mediaId)];
                });
            });
        };
        MetadataManagerController_1.prototype.updateAllMetadata = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.metadataService.updateAllMetadata()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Aggiornamento metadati avviato',
                                    result: result,
                                }];
                    }
                });
            });
        };
        MetadataManagerController_1.prototype.getMetadataStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                var total, withLocal, withTmdb, withDefault;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.count()];
                        case 1:
                            total = _a.sent();
                            return [4 /*yield*/, this.prisma.media.count({
                                    where: { metadataSource: 'local' },
                                })];
                        case 2:
                            withLocal = _a.sent();
                            return [4 /*yield*/, this.prisma.media.count({
                                    where: { metadataSource: 'tmdb' },
                                })];
                        case 3:
                            withTmdb = _a.sent();
                            return [4 /*yield*/, this.prisma.media.count({
                                    where: { metadataSource: 'default' },
                                })];
                        case 4:
                            withDefault = _a.sent();
                            return [2 /*return*/, {
                                    total: total,
                                    local: withLocal,
                                    tmdb: withTmdb,
                                    default: withDefault,
                                }];
                    }
                });
            });
        };
        MetadataManagerController_1.prototype.getActorImage = function (name, res) {
            return __awaiter(this, void 0, void 0, function () {
                var actorService, cachePath, safeName, fileName, filePath, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            actorService = this.metadataService.getActorCacheService();
                            cachePath = actorService.getCachePath();
                            safeName = name
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, '_')
                                .replace(/_+/g, '_');
                            fileName = "".concat(safeName, ".jpg");
                            filePath = path.join(cachePath, fileName);
                            return [4 /*yield*/, fs.access(filePath)];
                        case 1:
                            _a.sent();
                            res.sendFile(filePath);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            res.status(404).json({ error: 'Immagine non trovata' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * POST /metadata/actors/cleanup
         * Esegue manualmente la garbage collection delle immagini degli attori
         */
        MetadataManagerController_1.prototype.cleanupActorImages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.actorCache.runGarbageCollection()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Garbage Collection completata',
                                    deleted: result.deleted,
                                    errors: result.errors,
                                }];
                    }
                });
            });
        };
        /**
         * GET /metadata/actors/stats
         * Restituisce statistiche sulle immagini degli attori in cache
         */
        MetadataManagerController_1.prototype.getActorCacheStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cachePath, count, size, files, _i, files_1, file, stat, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cachePath = this.actorCache.getCachePath();
                            count = 0;
                            size = 0;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, fs.readdir(cachePath)];
                        case 2:
                            files = _b.sent();
                            _i = 0, files_1 = files;
                            _b.label = 3;
                        case 3:
                            if (!(_i < files_1.length)) return [3 /*break*/, 6];
                            file = files_1[_i];
                            if (file.startsWith('.'))
                                return [3 /*break*/, 5];
                            return [4 /*yield*/, fs.stat(path.join(cachePath, file))];
                        case 4:
                            stat = _b.sent();
                            count++;
                            size += stat.size;
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            _a = _b.sent();
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, {
                                totalImages: count,
                                totalSizeMB: Math.round(size / (1024 * 1024) * 100) / 100,
                                cachePath: cachePath,
                            }];
                    }
                });
            });
        };
        return MetadataManagerController_1;
    }());
    __setFunctionName(_classThis, "MetadataManagerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _updateMediaMetadata_decorators = [(0, common_1.Post)('update/:mediaId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _updateAllMetadata_decorators = [(0, common_1.Post)('update-all'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED)];
        _getMetadataStatus_decorators = [(0, common_1.Get)('status')];
        _getActorImage_decorators = [(0, common_1.Get)('actor-image/:name')];
        _cleanupActorImages_decorators = [(0, common_1.Post)('actors/cleanup')];
        _getActorCacheStats_decorators = [(0, common_1.Get)('actors/stats')];
        __esDecorate(_classThis, null, _updateMediaMetadata_decorators, { kind: "method", name: "updateMediaMetadata", static: false, private: false, access: { has: function (obj) { return "updateMediaMetadata" in obj; }, get: function (obj) { return obj.updateMediaMetadata; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateAllMetadata_decorators, { kind: "method", name: "updateAllMetadata", static: false, private: false, access: { has: function (obj) { return "updateAllMetadata" in obj; }, get: function (obj) { return obj.updateAllMetadata; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetadataStatus_decorators, { kind: "method", name: "getMetadataStatus", static: false, private: false, access: { has: function (obj) { return "getMetadataStatus" in obj; }, get: function (obj) { return obj.getMetadataStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActorImage_decorators, { kind: "method", name: "getActorImage", static: false, private: false, access: { has: function (obj) { return "getActorImage" in obj; }, get: function (obj) { return obj.getActorImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cleanupActorImages_decorators, { kind: "method", name: "cleanupActorImages", static: false, private: false, access: { has: function (obj) { return "cleanupActorImages" in obj; }, get: function (obj) { return obj.cleanupActorImages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActorCacheStats_decorators, { kind: "method", name: "getActorCacheStats", static: false, private: false, access: { has: function (obj) { return "getActorCacheStats" in obj; }, get: function (obj) { return obj.getActorCacheStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MetadataManagerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MetadataManagerController = _classThis;
}();
exports.MetadataManagerController = MetadataManagerController;
