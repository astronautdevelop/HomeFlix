"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorService = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs/promises");
var path = require("path");
var axios_1 = require("axios");
var ActorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ActorService = _classThis = /** @class */ (function () {
        function ActorService_1(prisma, coreService, actorCache, notificationService) {
            this.prisma = prisma;
            this.coreService = coreService;
            this.actorCache = actorCache;
            this.notificationService = notificationService;
            this.logger = new common_1.Logger(ActorService.name);
            this.TMDB_BASE = 'https://api.themoviedb.org/3';
            this.CACHE_METADATA_FOLDER = 'metadata/actors';
        }
        ActorService_1.prototype.getCacheBase = function () {
            return this.coreService.getCachePath();
        };
        ActorService_1.prototype.getMetadataCachePath = function () {
            return path.join(this.getCacheBase(), this.CACHE_METADATA_FOLDER);
        };
        ActorService_1.prototype.getActorMetadataFileName = function (actorName) {
            var safe = this.normalizeName(actorName);
            return "".concat(safe, ".json");
        };
        ActorService_1.prototype.normalizeName = function (name) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
        };
        /**
         * 🟡 Invia il warning "API mancante" una sola volta per sessione.
         *    Usa il flag condiviso su CoreService per evitare spam di notifiche.
         */
        ActorService_1.prototype.notifyMissingApiKeyOnce = function () {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.coreService.hasNotifiedMissingApiKeyAlready())
                                return [2 /*return*/];
                            this.coreService.markMissingApiKeyNotified();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.notificationService.notify('warning', 'TMDB API Key non configurata', { reason: 'missing_api_key' })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            this.logger.error('Errore invio notifica API mancante', err_1 === null || err_1 === void 0 ? void 0 : err_1.stack);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ---------- Recupero dettagli attore (con cache) ----------
        ActorService_1.prototype.getActorDetails = function (actorName) {
            return __awaiter(this, void 0, void 0, function () {
                var cachePath, fileName, filePath, content, _a, apiKey, searchUrl, searchRes, personId, detailUrl, detailRes, data, biography, englishDetailRes, error_1, countryCode, country, details, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cachePath = this.getMetadataCachePath();
                            fileName = this.getActorMetadataFileName(actorName);
                            filePath = path.join(cachePath, fileName);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, fs.access(filePath)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                        case 3:
                            content = _b.sent();
                            return [2 /*return*/, JSON.parse(content)];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            apiKey = this.coreService.getTmdbApiKey();
                            if (!!apiKey) return [3 /*break*/, 7];
                            this.logger.warn('TMDB API Key non configurata');
                            return [4 /*yield*/, this.notifyMissingApiKeyOnce()];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, null];
                        case 7:
                            _b.trys.push([7, 18, , 19]);
                            searchUrl = "".concat(this.TMDB_BASE, "/search/person");
                            return [4 /*yield*/, axios_1.default.get(searchUrl, {
                                    params: {
                                        api_key: apiKey,
                                        query: actorName,
                                        language: 'it-IT',
                                    },
                                })];
                        case 8:
                            searchRes = _b.sent();
                            if (!searchRes.data.results || searchRes.data.results.length === 0) {
                                this.logger.warn("Attore non trovato su TMDB: ".concat(actorName));
                                return [2 /*return*/, null];
                            }
                            personId = searchRes.data.results[0].id;
                            detailUrl = "".concat(this.TMDB_BASE, "/person/").concat(personId);
                            return [4 /*yield*/, axios_1.default.get(detailUrl, {
                                    params: {
                                        api_key: apiKey,
                                        language: 'it-IT',
                                        append_to_response: 'images',
                                    },
                                })];
                        case 9:
                            detailRes = _b.sent();
                            data = detailRes.data;
                            biography = data.biography || '';
                            if (!!biography) return [3 /*break*/, 13];
                            _b.label = 10;
                        case 10:
                            _b.trys.push([10, 12, , 13]);
                            this.logger.log("\uD83D\uDD0D Biografia non trovata in italiano per ".concat(actorName, ", recupero in inglese..."));
                            return [4 /*yield*/, axios_1.default.get(detailUrl, {
                                    params: {
                                        api_key: apiKey,
                                        language: 'en-US',
                                        append_to_response: 'images',
                                    },
                                })];
                        case 11:
                            englishDetailRes = _b.sent();
                            biography = englishDetailRes.data.biography || '';
                            if (biography) {
                                this.logger.log("\u2705 Biografia recuperata in inglese per ".concat(actorName));
                            }
                            else {
                                this.logger.warn("\u26A0\uFE0F Nessuna biografia disponibile (n\u00E9 italiano n\u00E9 inglese) per ".concat(actorName));
                            }
                            return [3 /*break*/, 13];
                        case 12:
                            error_1 = _b.sent();
                            this.logger.warn("Impossibile recuperare biografia in inglese per ".concat(actorName, ": ").concat(error_1.message));
                            return [3 /*break*/, 13];
                        case 13:
                            countryCode = null;
                            if (data.place_of_birth) {
                                country = this.extractCountryFromPlace(data.place_of_birth);
                                if (country) {
                                    countryCode = this.mapCountryToCode(country);
                                }
                            }
                            details = {
                                name: data.name || actorName,
                                biography: biography,
                                birthday: data.birthday || null,
                                deathday: data.deathday || null,
                                placeOfBirth: data.place_of_birth || null,
                                alsoKnownAs: data.also_known_as || [],
                                profilePath: data.profile_path || null,
                                countryCode: countryCode,
                            };
                            // 3. Salva in cache
                            return [4 /*yield*/, fs.mkdir(cachePath, { recursive: true })];
                        case 14:
                            // 3. Salva in cache
                            _b.sent();
                            return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(details, null, 2), 'utf-8')];
                        case 15:
                            _b.sent();
                            if (!data.profile_path) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.actorCache.getActorImage(actorName, data.profile_path)];
                        case 16:
                            _b.sent();
                            _b.label = 17;
                        case 17: return [2 /*return*/, details];
                        case 18:
                            error_2 = _b.sent();
                            this.logger.error("Errore recupero attore ".concat(actorName), error_2.stack);
                            return [2 /*return*/, null];
                        case 19: return [2 /*return*/];
                    }
                });
            });
        };
        // ---------- Filmografia (film + stagioni serie TV) ----------
        ActorService_1.prototype.getMoviesForActor = function (actorName) {
            return __awaiter(this, void 0, void 0, function () {
                var actorJson, movies, seasonRows, seasonIds, seasonsAggregated, seasonData, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            actorJson = JSON.stringify([actorName]);
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        SELECT id, title, \"posterUrl\", \"backgroundUrl\", \"releaseYear\", rating, type\n        FROM \"Media\"\n        WHERE \"actors\" @> ", "::jsonb\n          AND type = 'MOVIE'\n        ORDER BY \"releaseYear\" DESC NULLS LAST\n      "], ["\n        SELECT id, title, \"posterUrl\", \"backgroundUrl\", \"releaseYear\", rating, type\n        FROM \"Media\"\n        WHERE \"actors\" @> ", "::jsonb\n          AND type = 'MOVIE'\n        ORDER BY \"releaseYear\" DESC NULLS LAST\n      "])), actorJson)];
                        case 1:
                            movies = _a.sent();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        SELECT DISTINCT s.id\n        FROM \"Season\" s\n        INNER JOIN \"Media\" m ON m.\"seasonId\" = s.id\n        WHERE m.\"actors\" @> ", "::jsonb\n          AND m.type = 'EPISODE'\n      "], ["\n        SELECT DISTINCT s.id\n        FROM \"Season\" s\n        INNER JOIN \"Media\" m ON m.\"seasonId\" = s.id\n        WHERE m.\"actors\" @> ", "::jsonb\n          AND m.type = 'EPISODE'\n      "])), actorJson)];
                        case 2:
                            seasonRows = _a.sent();
                            seasonIds = seasonRows.map(function (s) { return s.id; });
                            seasonsAggregated = [];
                            if (!(seasonIds.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.season.findMany({
                                    where: { id: { in: seasonIds } },
                                    include: {
                                        series: true,
                                        episodes: {
                                            select: { id: true, available: true, runtime: true },
                                        },
                                    },
                                    orderBy: [
                                        { series: { title: 'asc' } },
                                        { seasonNumber: 'asc' },
                                    ],
                                })];
                        case 3:
                            seasonData = _a.sent();
                            seasonsAggregated = seasonData.map(function (s) { return ({
                                id: s.id,
                                type: 'SEASON',
                                seriesId: s.seriesId,
                                seriesTitle: s.series.title,
                                title: s.series.title,
                                posterUrl: s.series.posterUrl,
                                backgroundUrl: s.series.backgroundUrl,
                                releaseYear: s.series.releaseYear,
                                rating: s.series.rating,
                                genres: s.series.genres,
                                seasonNumber: s.seasonNumber,
                                seasonTitle: s.title,
                                episodesCount: s.episodes.length,
                                episodesAvailable: s.episodes.filter(function (e) { return e.available; }).length,
                            }); });
                            _a.label = 4;
                        case 4: return [2 /*return*/, __spreadArray(__spreadArray([], movies, true), seasonsAggregated, true)];
                        case 5:
                            error_3 = _a.sent();
                            this.logger.error("Errore recupero film per attore ".concat(actorName), error_3.stack);
                            return [2 /*return*/, []];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // ---------- Garbage Collection estesa ----------
        ActorService_1.prototype.runGarbageCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, allMedia, activeNames, _i, allMedia_1, media, _a, _b, actor, imageResult, metadataPath, files, _c, files_1, file, baseName, filePath, err_2, _d;
                var _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            result = {
                                deletedImages: 0,
                                deletedMetadata: 0,
                                errors: [],
                            };
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    select: { actors: true },
                                })];
                        case 1:
                            allMedia = _f.sent();
                            activeNames = new Set();
                            for (_i = 0, allMedia_1 = allMedia; _i < allMedia_1.length; _i++) {
                                media = allMedia_1[_i];
                                if (media.actors && Array.isArray(media.actors)) {
                                    for (_a = 0, _b = media.actors; _a < _b.length; _a++) {
                                        actor = _b[_a];
                                        if (typeof actor === 'string') {
                                            activeNames.add(this.normalizeName(actor));
                                        }
                                    }
                                }
                            }
                            this.logger.log("\uD83D\uDCCA Attori unici attivi: ".concat(activeNames.size));
                            return [4 /*yield*/, this.actorCache.runGarbageCollection()];
                        case 2:
                            imageResult = _f.sent();
                            result.deletedImages = imageResult.deleted;
                            (_e = result.errors).push.apply(_e, imageResult.errors);
                            metadataPath = this.getMetadataCachePath();
                            _f.label = 3;
                        case 3:
                            _f.trys.push([3, 12, , 13]);
                            return [4 /*yield*/, fs.access(metadataPath)];
                        case 4:
                            _f.sent();
                            return [4 /*yield*/, fs.readdir(metadataPath)];
                        case 5:
                            files = _f.sent();
                            _c = 0, files_1 = files;
                            _f.label = 6;
                        case 6:
                            if (!(_c < files_1.length)) return [3 /*break*/, 11];
                            file = files_1[_c];
                            if (!file.endsWith('.json'))
                                return [3 /*break*/, 10];
                            baseName = path.basename(file, '.json');
                            if (!!activeNames.has(baseName)) return [3 /*break*/, 10];
                            filePath = path.join(metadataPath, file);
                            _f.label = 7;
                        case 7:
                            _f.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, fs.unlink(filePath)];
                        case 8:
                            _f.sent();
                            result.deletedMetadata++;
                            this.logger.log("\uD83D\uDDD1\uFE0F Eliminato metadato attore: ".concat(file));
                            return [3 /*break*/, 10];
                        case 9:
                            err_2 = _f.sent();
                            result.errors.push("Errore eliminazione ".concat(file, ": ").concat(err_2.message));
                            return [3 /*break*/, 10];
                        case 10:
                            _c++;
                            return [3 /*break*/, 6];
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            _d = _f.sent();
                            return [3 /*break*/, 13];
                        case 13:
                            this.logger.log("\u2705 Garbage Collection completata: ".concat(result.deletedImages, " immagini, ").concat(result.deletedMetadata, " metadati eliminati"));
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        // ---------- Utility: paese da luogo di nascita ----------
        ActorService_1.prototype.extractCountryFromPlace = function (place) {
            var parts = place.split(',').map(function (p) { return p.trim(); });
            if (parts.length === 0)
                return null;
            return parts[parts.length - 1];
        };
        ActorService_1.prototype.mapCountryToCode = function (countryName) {
            var map = {
                USA: 'us',
                'United States': 'us',
                'United States of America': 'us',
                Italia: 'it',
                Italy: 'it',
                Ukraine: 'ukr',
                Ucraina: 'ukr',
                UK: 'gb',
                England: 'gb',
                'Regno Unito': 'gb',
                'United Kingdom': 'gb',
                Francia: 'fr',
                France: 'fr',
                Germania: 'de',
                Germany: 'de',
                Spagna: 'es',
                Spain: 'es',
                Sweden: 'swe',
                Svedese: 'swe',
                Swedish: 'swe',
                Svezia: 'swe',
                Canada: 'ca',
                Australia: 'au',
                Giappone: 'jp',
                Japan: 'jp',
                Cina: 'cn',
                China: 'cn',
                India: 'in',
                Brasile: 'br',
                Brazil: 'br',
                Messico: 'mx',
                Mexico: 'mx',
                'Corea del Sud': 'kr',
                'South Korea': 'kr',
                Russia: 'ru',
                Sudafrica: 'za',
                'South Africa': 'za',
            };
            var lower = countryName.toLowerCase();
            for (var _i = 0, _a = Object.entries(map); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], code = _b[1];
                if (lower.includes(key.toLowerCase())) {
                    return code;
                }
            }
            return null;
        };
        return ActorService_1;
    }());
    __setFunctionName(_classThis, "ActorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActorService = _classThis;
}();
exports.ActorService = ActorService;
var templateObject_1, templateObject_2;
