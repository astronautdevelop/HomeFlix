"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ActorCacheService = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs/promises");
var path = require("path");
var axios_1 = require("axios");
var ActorCacheService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ActorCacheService = _classThis = /** @class */ (function () {
        function ActorCacheService_1(coreService, prisma) {
            this.coreService = coreService;
            this.prisma = prisma;
            this.logger = new common_1.Logger(ActorCacheService.name);
            this.CACHE_FOLDER = 'actors';
            this.IMAGE_SIZE = 'w185';
        }
        ActorCacheService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cachePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cachePath = this.getCachePath();
                            return [4 /*yield*/, fs.mkdir(cachePath, { recursive: true })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // RENDE PUBBLICO PER IL CONTROLLER
        ActorCacheService_1.prototype.getCachePath = function () {
            var basePath = this.coreService.getCachePath();
            return path.join(basePath, this.CACHE_FOLDER);
        };
        ActorCacheService_1.prototype.getActorFileName = function (actorName) {
            var safeName = actorName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_');
            return "".concat(safeName, ".jpg");
        };
        ActorCacheService_1.prototype.getActorImage = function (actorName, tmdbProfilePath) {
            return __awaiter(this, void 0, void 0, function () {
                var cachePath, fileName, localPath, _a, url, response, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!tmdbProfilePath) {
                                return [2 /*return*/, null];
                            }
                            cachePath = this.getCachePath();
                            fileName = this.getActorFileName(actorName);
                            localPath = path.join(cachePath, fileName);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs.access(localPath)];
                        case 2:
                            _b.sent();
                            this.logger.log("Immagine attore in cache: ".concat(actorName));
                            return [2 /*return*/, localPath];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            _b.trys.push([4, 7, , 8]);
                            url = "https://image.tmdb.org/t/p/".concat(this.IMAGE_SIZE).concat(tmdbProfilePath);
                            return [4 /*yield*/, axios_1.default.get(url, { responseType: 'arraybuffer' })];
                        case 5:
                            response = _b.sent();
                            return [4 /*yield*/, fs.writeFile(localPath, Buffer.from(response.data))];
                        case 6:
                            _b.sent();
                            this.logger.log("Immagine attore scaricata: ".concat(actorName));
                            return [2 /*return*/, localPath];
                        case 7:
                            error_1 = _b.sent();
                            this.logger.error("Errore download immagine attore ".concat(actorName), error_1.stack);
                            return [2 /*return*/, null];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        ActorCacheService_1.prototype.getActorImages = function (actors) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, actors_1, actor, imagePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            results = [];
                            _i = 0, actors_1 = actors;
                            _a.label = 1;
                        case 1:
                            if (!(_i < actors_1.length)) return [3 /*break*/, 4];
                            actor = actors_1[_i];
                            return [4 /*yield*/, this.getActorImage(actor.name, actor.profilePath)];
                        case 2:
                            imagePath = _a.sent();
                            results.push({ name: actor.name, imagePath: imagePath });
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        // ============================================================
        // 🔥 GARBAGE COLLECTION – RIMUOVE IMMAGINI ATTORE NON UTILIZZATE
        // ============================================================
        /**
         * 🔥 Garbage Collection: rimuove le immagini degli attori non più utilizzate
         * Controlla tutti i film nel database e mantiene solo le immagini
         * degli attori che appaiono in almeno un film.
         */
        ActorCacheService_1.prototype.runGarbageCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, allMedia, allSeries, actorNamesSet_1, collect, _i, allMedia_1, media, _a, allSeries_1, series, cachePath, _b, files, _c, files_1, file, actorNameFromFile, normalizedFileActor, filePath, err_1, error_2;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            result = { deleted: 0, errors: [] };
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 15, , 16]);
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    select: { actors: true },
                                })];
                        case 2:
                            allMedia = _d.sent();
                            return [4 /*yield*/, this.prisma.series.findMany({
                                    select: { actors: true },
                                })];
                        case 3:
                            allSeries = _d.sent();
                            actorNamesSet_1 = new Set();
                            collect = function (actors) {
                                if (actors && Array.isArray(actors)) {
                                    for (var _i = 0, actors_2 = actors; _i < actors_2.length; _i++) {
                                        var actor = actors_2[_i];
                                        if (typeof actor === 'string' && actor.trim()) {
                                            actorNamesSet_1.add(_this.normalizeActorName(actor));
                                        }
                                    }
                                }
                            };
                            for (_i = 0, allMedia_1 = allMedia; _i < allMedia_1.length; _i++) {
                                media = allMedia_1[_i];
                                collect(media.actors);
                            }
                            for (_a = 0, allSeries_1 = allSeries; _a < allSeries_1.length; _a++) {
                                series = allSeries_1[_a];
                                collect(series.actors);
                            }
                            this.logger.log("\uD83D\uDCCA Trovati ".concat(actorNamesSet_1.size, " attori unici in Media + Series"));
                            cachePath = this.getCachePath();
                            _d.label = 4;
                        case 4:
                            _d.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, fs.access(cachePath)];
                        case 5:
                            _d.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _b = _d.sent();
                            this.logger.log('📁 Cartella cache attori non trovata, nessuna pulizia necessaria');
                            return [2 /*return*/, result];
                        case 7: return [4 /*yield*/, fs.readdir(cachePath)];
                        case 8:
                            files = _d.sent();
                            _c = 0, files_1 = files;
                            _d.label = 9;
                        case 9:
                            if (!(_c < files_1.length)) return [3 /*break*/, 14];
                            file = files_1[_c];
                            if (file.startsWith('.') || !file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                                return [3 /*break*/, 13];
                            }
                            actorNameFromFile = this.extractActorNameFromFile(file);
                            normalizedFileActor = this.normalizeActorName(actorNameFromFile);
                            if (!!actorNamesSet_1.has(normalizedFileActor)) return [3 /*break*/, 13];
                            filePath = path.join(cachePath, file);
                            _d.label = 10;
                        case 10:
                            _d.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, fs.unlink(filePath)];
                        case 11:
                            _d.sent();
                            result.deleted++;
                            this.logger.log("\uD83D\uDDD1\uFE0F Eliminata immagine cache: ".concat(file));
                            return [3 /*break*/, 13];
                        case 12:
                            err_1 = _d.sent();
                            result.errors.push("Errore eliminazione ".concat(file, ": ").concat(err_1.message));
                            this.logger.error("Errore eliminazione ".concat(file), err_1.stack);
                            return [3 /*break*/, 13];
                        case 13:
                            _c++;
                            return [3 /*break*/, 9];
                        case 14:
                            this.logger.log("\u2705 Garbage Collection completata: ".concat(result.deleted, " file eliminati"));
                            return [2 /*return*/, result];
                        case 15:
                            error_2 = _d.sent();
                            this.logger.error('❌ Errore durante garbage collection', error_2.stack);
                            result.errors.push("Errore generale: ".concat(error_2.message));
                            return [2 /*return*/, result];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Normalizza il nome di un attore per il confronto
         * Es. "Tom Hanks" → "tom_hanks"
         */
        ActorCacheService_1.prototype.normalizeActorName = function (name) {
            return name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
        };
        /**
         * Estrae il nome dell'attore dal nome del file
         * Es. "tom_hanks.jpg" → "tom hanks"
         */
        ActorCacheService_1.prototype.extractActorNameFromFile = function (filename) {
            var baseName = path.basename(filename, path.extname(filename));
            // Sostituisci underscores con spazi per il confronto (verrà normalizzato dopo)
            return baseName.replace(/_/g, ' ');
        };
        return ActorCacheService_1;
    }());
    __setFunctionName(_classThis, "ActorCacheService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActorCacheService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActorCacheService = _classThis;
}();
exports.ActorCacheService = ActorCacheService;
