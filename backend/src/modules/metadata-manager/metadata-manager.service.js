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
exports.MetadataManagerService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var fs = require("fs/promises");
var path = require("path");
var MetadataManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MetadataManagerService = _classThis = /** @class */ (function () {
        function MetadataManagerService_1(prisma, coreService, storageManager, actorCache, notificationService) {
            this.prisma = prisma;
            this.coreService = coreService;
            this.storageManager = storageManager;
            this.actorCache = actorCache;
            this.notificationService = notificationService;
            this.logger = new common_1.Logger(MetadataManagerService.name);
            this.TMDB_BASE_URL = 'https://api.themoviedb.org/3';
            this.TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
            this.POSTER_SIZE = 'w500';
            this.BACKDROP_SIZE = 'w780';
            this.LOGO_SIZE = 'w300';
            this.tmdbCache = new Map();
            this.IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];
        }
        MetadataManagerService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cachePath, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.actorCache.onModuleInit()];
                        case 1:
                            _a.sent();
                            cachePath = this.coreService.getCachePath();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            return [4 /*yield*/, fs.mkdir(cachePath, { recursive: true })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, fs.mkdir(path.join(cachePath, 'images'), { recursive: true })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, fs.mkdir(path.join(cachePath, 'metadata'), { recursive: true })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, fs.mkdir(this.coreService.getMediaPosterCachePath(), { recursive: true })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, fs.mkdir(this.coreService.getMediaBackgroundCachePath(), { recursive: true })];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            this.logger.error('Impossibile creare la cartella cache', error_1.stack);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================
        // METODI PRINCIPALI
        // ============================
        MetadataManagerService_1.prototype.updateMetadataForMedia = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var media, folderPath, isEpisode, localMetadata, _a, metadata, source, series, tmdbSeries, season, episodeData, seriesCast, actorData, actorsWithImages, actorNames, seriesPosterPath, seriesBackgroundPath, bgPath, tmdbData, error_2;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 29, , 30]);
                            return [4 /*yield*/, this.prisma.media.findUnique({
                                    where: { id: mediaId },
                                    include: { versions: true, series: true, season: true },
                                })];
                        case 1:
                            media = _e.sent();
                            if (!media) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Media non trovato',
                                        mediaId: mediaId,
                                        metadataSource: 'none',
                                    }];
                            }
                            folderPath = this.getMediaFolderPath(media);
                            if (!folderPath) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Impossibile determinare il percorso della cartella',
                                        mediaId: mediaId,
                                        metadataSource: 'none',
                                    }];
                            }
                            isEpisode = media.type === 'EPISODE';
                            if (!isEpisode) return [3 /*break*/, 2];
                            _a = null;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.readLocalMetadata(folderPath)];
                        case 3:
                            _a = _e.sent();
                            _e.label = 4;
                        case 4:
                            localMetadata = _a;
                            metadata = null;
                            source = 'default';
                            if (!isEpisode) return [3 /*break*/, 18];
                            if (!media.seriesId) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.prisma.series.findUnique({
                                    where: { id: media.seriesId },
                                })];
                        case 5:
                            series = _e.sent();
                            if (!series) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.fetchSeriesFromTMDB(series.title)];
                        case 6:
                            tmdbSeries = _e.sent();
                            if (!(tmdbSeries && media.seasonId && media.episodeNumber)) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.prisma.season.findUnique({
                                    where: { id: media.seasonId },
                                })];
                        case 7:
                            season = _e.sent();
                            if (!season) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.fetchEpisodeFromTMDB(tmdbSeries.id, season.seasonNumber, media.episodeNumber)];
                        case 8:
                            episodeData = _e.sent();
                            if (!episodeData) return [3 /*break*/, 17];
                            metadata = this.mapTmdbEpisodeToMetadata(episodeData, tmdbSeries.name);
                            source = 'tmdb';
                            return [4 /*yield*/, this.downloadAndCacheSeriesImages(tmdbSeries.id, series.id)];
                        case 9:
                            _e.sent();
                            seriesCast = ((_c = (_b = tmdbSeries.credits) === null || _b === void 0 ? void 0 : _b.cast) === null || _c === void 0 ? void 0 : _c.slice(0, 10)) || [];
                            if (!(seriesCast.length > 0)) return [3 /*break*/, 12];
                            actorData = seriesCast.map(function (c) { return ({
                                name: c.name,
                                profilePath: c.profile_path || null,
                            }); });
                            return [4 /*yield*/, this.actorCache.getActorImages(actorData)];
                        case 10:
                            actorsWithImages = _e.sent();
                            actorNames = actorsWithImages.map(function (a) { return a.name; });
                            metadata.actors = actorNames;
                            return [4 /*yield*/, this.prisma.series.update({
                                    where: { id: series.id },
                                    data: { actors: actorNames },
                                })];
                        case 11:
                            _e.sent();
                            _e.label = 12;
                        case 12:
                            seriesPosterPath = path.join(this.coreService.getMediaPosterCachePath(), "series_".concat(series.id, ".jpg"));
                            seriesBackgroundPath = path.join(this.coreService.getMediaBackgroundCachePath(), "series_".concat(series.id, ".jpg"));
                            return [4 /*yield*/, this.fileExists(seriesPosterPath)];
                        case 13:
                            if (_e.sent()) {
                                metadata.posterUrl = seriesPosterPath;
                            }
                            if (!episodeData.still_path) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.downloadBackground(mediaId, episodeData.still_path)];
                        case 14:
                            bgPath = _e.sent();
                            if (bgPath)
                                metadata.backgroundUrl = bgPath;
                            return [3 /*break*/, 17];
                        case 15: return [4 /*yield*/, this.fileExists(seriesBackgroundPath)];
                        case 16:
                            if (_e.sent()) {
                                metadata.backgroundUrl = seriesBackgroundPath;
                            }
                            _e.label = 17;
                        case 17: return [3 /*break*/, 23];
                        case 18:
                            if (!localMetadata) return [3 /*break*/, 19];
                            metadata = localMetadata;
                            source = 'local';
                            this.logger.log("\uD83D\uDCC1 Metadati locali trovati per ".concat(media.title));
                            return [3 /*break*/, 23];
                        case 19:
                            if (!(media.type === 'MOVIE')) return [3 /*break*/, 23];
                            return [4 /*yield*/, this.fetchMovieFromTMDB(media.title, (_d = media.releaseYear) !== null && _d !== void 0 ? _d : undefined)];
                        case 20:
                            tmdbData = _e.sent();
                            if (!tmdbData) return [3 /*break*/, 23];
                            return [4 /*yield*/, this.mapTmdbMovieToMetadata(tmdbData, folderPath, mediaId)];
                        case 21:
                            metadata = _e.sent();
                            source = 'tmdb';
                            return [4 /*yield*/, this.saveMetadataJson(folderPath, metadata)];
                        case 22:
                            _e.sent();
                            this.logger.log("\uD83D\uDCE1 Metadati TMDB scaricati per ".concat(media.title));
                            _e.label = 23;
                        case 23:
                            if (!!metadata) return [3 /*break*/, 26];
                            metadata = this.createDefaultMetadata(media.title);
                            source = 'default';
                            if (!!isEpisode) return [3 /*break*/, 25];
                            return [4 /*yield*/, this.saveMetadataJson(folderPath, metadata)];
                        case 24:
                            _e.sent();
                            _e.label = 25;
                        case 25:
                            this.logger.log("\uD83D\uDCC4 Metadati di default creati per ".concat(media.title));
                            _e.label = 26;
                        case 26: return [4 /*yield*/, this.updateMediaInDb(mediaId, metadata, source, media.title)];
                        case 27:
                            _e.sent();
                            return [4 /*yield*/, this.updateMediaImages(mediaId, folderPath, source)];
                        case 28:
                            _e.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Metadati aggiornati da ".concat(source),
                                    mediaId: mediaId,
                                    metadataSource: source,
                                }];
                        case 29:
                            error_2 = _e.sent();
                            this.logger.error("\u274C Errore aggiornamento metadati per ".concat(mediaId), error_2.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    message: error_2.message,
                                    mediaId: mediaId,
                                    metadataSource: 'error',
                                }];
                        case 30: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.updateAllMetadata = function () {
            return __awaiter(this, void 0, void 0, function () {
                var mediaList, success, failed, _i, mediaList_1, media, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findMany()];
                        case 1:
                            mediaList = _a.sent();
                            success = 0;
                            failed = 0;
                            _i = 0, mediaList_1 = mediaList;
                            _a.label = 2;
                        case 2:
                            if (!(_i < mediaList_1.length)) return [3 /*break*/, 6];
                            media = mediaList_1[_i];
                            return [4 /*yield*/, this.updateMetadataForMedia(media.id)];
                        case 3:
                            result = _a.sent();
                            if (result.success) {
                                success++;
                            }
                            else {
                                failed++;
                            }
                            return [4 /*yield*/, this.delay(200)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/, { total: mediaList.length, success: success, failed: failed }];
                    }
                });
            });
        };
        // ============================
        // METODI DI SUPPORTO - PERCORSO
        // ============================
        MetadataManagerService_1.prototype.getMediaFolderPath = function (media) {
            if (media.folderPath) {
                return media.folderPath;
            }
            if (media.versions && media.versions.length > 0) {
                return path.dirname(media.versions[0].filePath);
            }
            return null;
        };
        // ============================
        // METODI DI SUPPORTO - METADATA JSON
        // ============================
        MetadataManagerService_1.prototype.readLocalMetadata = function (folderPath) {
            return __awaiter(this, void 0, void 0, function () {
                var metadataPath, content, parsed, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            metadataPath = path.join(folderPath, 'metadata.json');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs.readFile(metadataPath, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            parsed = JSON.parse(content);
                            return [2 /*return*/, parsed];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.saveMetadataJson = function (folderPath, metadata) {
            return __awaiter(this, void 0, void 0, function () {
                var metadataPath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            metadataPath = path.join(folderPath, 'metadata.json');
                            return [4 /*yield*/, fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ============================
        // TMDB FETCH
        // ============================
        MetadataManagerService_1.prototype.fetchMovieFromTMDB = function (title, year) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, apiKey, searchUrl, searchParams, searchResponse, movieId, detailsUrl, detailsParams, detailsResponse, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "movie_".concat(title, "_").concat(year || 'any');
                            if (this.tmdbCache.has(cacheKey)) {
                                return [2 /*return*/, this.tmdbCache.get(cacheKey)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            apiKey = this.coreService.getTmdbApiKey();
                            if (!!apiKey) return [3 /*break*/, 3];
                            this.logger.warn('TMDB API Key non configurata');
                            return [4 /*yield*/, this.notifyMissingApiKeyOnce()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, null];
                        case 3:
                            searchUrl = "".concat(this.TMDB_BASE_URL, "/search/movie");
                            searchParams = {
                                api_key: apiKey,
                                query: title,
                                year: year || undefined,
                                language: 'it-IT',
                                include_adult: false,
                            };
                            return [4 /*yield*/, axios_1.default.get(searchUrl, {
                                    params: searchParams,
                                })];
                        case 4:
                            searchResponse = _a.sent();
                            if (searchResponse.data.results.length === 0) {
                                return [2 /*return*/, null];
                            }
                            movieId = searchResponse.data.results[0].id;
                            detailsUrl = "".concat(this.TMDB_BASE_URL, "/movie/").concat(movieId);
                            detailsParams = {
                                api_key: apiKey,
                                language: 'it-IT',
                                append_to_response: 'credits,videos,images',
                            };
                            return [4 /*yield*/, axios_1.default.get(detailsUrl, {
                                    params: detailsParams,
                                })];
                        case 5:
                            detailsResponse = _a.sent();
                            this.tmdbCache.set(cacheKey, detailsResponse.data);
                            return [2 /*return*/, detailsResponse.data];
                        case 6:
                            error_3 = _a.sent();
                            this.logger.error("Errore TMDB per film ".concat(title), error_3.stack);
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.fetchSeriesFromTMDB = function (title) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, apiKey, searchUrl, searchParams, searchResponse, seriesId, detailsUrl, detailsParams, detailsResponse, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "series_".concat(title);
                            if (this.tmdbCache.has(cacheKey)) {
                                return [2 /*return*/, this.tmdbCache.get(cacheKey)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            apiKey = this.coreService.getTmdbApiKey();
                            if (!!apiKey) return [3 /*break*/, 3];
                            this.logger.warn('TMDB API Key non configurata');
                            return [4 /*yield*/, this.notifyMissingApiKeyOnce()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, null];
                        case 3:
                            searchUrl = "".concat(this.TMDB_BASE_URL, "/search/tv");
                            searchParams = {
                                api_key: apiKey,
                                query: title,
                                language: 'it-IT',
                                include_adult: false,
                            };
                            return [4 /*yield*/, axios_1.default.get(searchUrl, {
                                    params: searchParams,
                                })];
                        case 4:
                            searchResponse = _a.sent();
                            if (searchResponse.data.results.length === 0) {
                                return [2 /*return*/, null];
                            }
                            seriesId = searchResponse.data.results[0].id;
                            detailsUrl = "".concat(this.TMDB_BASE_URL, "/tv/").concat(seriesId);
                            detailsParams = {
                                api_key: apiKey,
                                language: 'it-IT',
                                append_to_response: 'credits,videos,images',
                            };
                            return [4 /*yield*/, axios_1.default.get(detailsUrl, {
                                    params: detailsParams,
                                })];
                        case 5:
                            detailsResponse = _a.sent();
                            this.tmdbCache.set(cacheKey, detailsResponse.data);
                            return [2 /*return*/, detailsResponse.data];
                        case 6:
                            error_4 = _a.sent();
                            this.logger.error("Errore TMDB per serie ".concat(title), error_4.stack);
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.fetchEpisodeFromTMDB = function (seriesId, seasonNumber, episodeNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, apiKey, url, params, response, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "episode_".concat(seriesId, "_").concat(seasonNumber, "_").concat(episodeNumber);
                            if (this.tmdbCache.has(cacheKey)) {
                                return [2 /*return*/, this.tmdbCache.get(cacheKey)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            apiKey = this.coreService.getTmdbApiKey();
                            if (!!apiKey) return [3 /*break*/, 3];
                            this.logger.warn('TMDB API Key non configurata');
                            return [4 /*yield*/, this.notifyMissingApiKeyOnce()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, null];
                        case 3:
                            url = "".concat(this.TMDB_BASE_URL, "/tv/").concat(seriesId, "/season/").concat(seasonNumber, "/episode/").concat(episodeNumber);
                            params = {
                                api_key: apiKey,
                                language: 'it-IT',
                                append_to_response: 'images',
                            };
                            return [4 /*yield*/, axios_1.default.get(url, { params: params })];
                        case 4:
                            response = _a.sent();
                            this.tmdbCache.set(cacheKey, response.data);
                            return [2 /*return*/, response.data];
                        case 5:
                            error_5 = _a.sent();
                            this.logger.error("Errore TMDB per episodio S".concat(seasonNumber, "E").concat(episodeNumber), error_5.stack);
                            return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.fetchSeriesFromTMDBByid = function (seriesId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, apiKey, url, params, response, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "series_id_".concat(seriesId);
                            if (this.tmdbCache.has(cacheKey)) {
                                return [2 /*return*/, this.tmdbCache.get(cacheKey)];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            apiKey = this.coreService.getTmdbApiKey();
                            if (!!apiKey) return [3 /*break*/, 3];
                            this.logger.warn('TMDB API Key non configurata');
                            return [4 /*yield*/, this.notifyMissingApiKeyOnce()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, null];
                        case 3:
                            url = "".concat(this.TMDB_BASE_URL, "/tv/").concat(seriesId);
                            params = {
                                api_key: apiKey,
                                language: 'it-IT',
                                append_to_response: 'credits,videos,images',
                            };
                            return [4 /*yield*/, axios_1.default.get(url, { params: params })];
                        case 4:
                            response = _a.sent();
                            this.tmdbCache.set(cacheKey, response.data);
                            return [2 /*return*/, response.data];
                        case 5:
                            error_6 = _a.sent();
                            this.logger.error("Errore TMDB per serie ID ".concat(seriesId), error_6.stack);
                            return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================
        // DOWNLOAD IMMAGINI - CACHE CENTRALIZZATA
        // ============================
        MetadataManagerService_1.prototype.downloadImageToCache = function (url, cachePath, filename) {
            return __awaiter(this, void 0, void 0, function () {
                var response, filePath, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, fs.mkdir(cachePath, { recursive: true })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, axios_1.default.get(url, { responseType: 'arraybuffer' })];
                        case 2:
                            response = _a.sent();
                            filePath = path.join(cachePath, filename);
                            return [4 /*yield*/, fs.writeFile(filePath, Buffer.from(response.data))];
                        case 3:
                            _a.sent();
                            this.logger.log("\u2705 Immagine cache salvata: ".concat(filePath));
                            return [2 /*return*/, filePath];
                        case 4:
                            error_7 = _a.sent();
                            this.logger.error("\u274C Errore download immagine ".concat(url), error_7.stack);
                            return [2 /*return*/, null];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.downloadPoster = function (mediaId, tmdbPath) {
            return __awaiter(this, void 0, void 0, function () {
                var url;
                return __generator(this, function (_a) {
                    if (!tmdbPath)
                        return [2 /*return*/, null];
                    url = "".concat(this.TMDB_IMAGE_BASE_URL, "/").concat(this.POSTER_SIZE).concat(tmdbPath);
                    return [2 /*return*/, this.downloadImageToCache(url, this.coreService.getMediaPosterCachePath(), "".concat(mediaId, ".jpg"))];
                });
            });
        };
        MetadataManagerService_1.prototype.downloadBackground = function (mediaId, tmdbPath) {
            return __awaiter(this, void 0, void 0, function () {
                var url;
                return __generator(this, function (_a) {
                    if (!tmdbPath)
                        return [2 /*return*/, null];
                    url = "".concat(this.TMDB_IMAGE_BASE_URL, "/").concat(this.BACKDROP_SIZE).concat(tmdbPath);
                    return [2 /*return*/, this.downloadImageToCache(url, this.coreService.getMediaBackgroundCachePath(), "".concat(mediaId, ".jpg"))];
                });
            });
        };
        MetadataManagerService_1.prototype.getCachedPosterPath = function (mediaId) {
            return path.join(this.coreService.getMediaPosterCachePath(), "".concat(mediaId, ".jpg"));
        };
        MetadataManagerService_1.prototype.getCachedBackgroundPath = function (mediaId) {
            return path.join(this.coreService.getMediaBackgroundCachePath(), "".concat(mediaId, ".jpg"));
        };
        MetadataManagerService_1.prototype.downloadAndCacheSeriesImages = function (seriesId, seriesDbId) {
            return __awaiter(this, void 0, void 0, function () {
                var posterPath, backgroundPath, posterExists, backgroundExists, details, newPosterPath, newBackgroundPath, url, url, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 11, , 12]);
                            posterPath = path.join(this.coreService.getMediaPosterCachePath(), "series_".concat(seriesDbId, ".jpg"));
                            backgroundPath = path.join(this.coreService.getMediaBackgroundCachePath(), "series_".concat(seriesDbId, ".jpg"));
                            return [4 /*yield*/, this.fileExists(posterPath)];
                        case 1:
                            posterExists = _a.sent();
                            return [4 /*yield*/, this.fileExists(backgroundPath)];
                        case 2:
                            backgroundExists = _a.sent();
                            if (!(posterExists && backgroundExists)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.series.update({
                                    where: { id: seriesDbId },
                                    data: {
                                        posterUrl: posterPath,
                                        backgroundUrl: backgroundPath,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                        case 4: return [4 /*yield*/, this.fetchSeriesFromTMDBByid(seriesId)];
                        case 5:
                            details = _a.sent();
                            if (!details)
                                return [2 /*return*/];
                            newPosterPath = posterExists ? posterPath : null;
                            newBackgroundPath = backgroundExists ? backgroundPath : null;
                            if (!(!posterExists && details.poster_path)) return [3 /*break*/, 7];
                            url = "".concat(this.TMDB_IMAGE_BASE_URL, "/").concat(this.POSTER_SIZE).concat(details.poster_path);
                            return [4 /*yield*/, this.downloadImageToCache(url, this.coreService.getMediaPosterCachePath(), "series_".concat(seriesDbId, ".jpg"))];
                        case 6:
                            newPosterPath = _a.sent();
                            _a.label = 7;
                        case 7:
                            if (!(!backgroundExists && details.backdrop_path)) return [3 /*break*/, 9];
                            url = "".concat(this.TMDB_IMAGE_BASE_URL, "/").concat(this.BACKDROP_SIZE).concat(details.backdrop_path);
                            return [4 /*yield*/, this.downloadImageToCache(url, this.coreService.getMediaBackgroundCachePath(), "series_".concat(seriesDbId, ".jpg"))];
                        case 8:
                            newBackgroundPath = _a.sent();
                            _a.label = 9;
                        case 9: return [4 /*yield*/, this.prisma.series.update({
                                where: { id: seriesDbId },
                                data: {
                                    posterUrl: newPosterPath || undefined,
                                    backgroundUrl: newBackgroundPath || undefined,
                                },
                            })];
                        case 10:
                            _a.sent();
                            this.logger.log("\u2705 Immagini serie in cache per series ".concat(seriesDbId));
                            return [3 /*break*/, 12];
                        case 11:
                            error_8 = _a.sent();
                            this.logger.error('Errore download immagini serie', error_8.stack);
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================
        // MAP DATI TMDB
        // ============================
        MetadataManagerService_1.prototype.mapTmdbMovieToMetadata = function (tmdbData, folderPath, mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var genres, cast, actorData, actorsWithImages, actorNames, director, country, language, trailer, trailerUrl, posterPath, backgroundPath;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0:
                            genres = ((_a = tmdbData.genres) === null || _a === void 0 ? void 0 : _a.map(function (g) { return g.name; })) || [];
                            cast = ((_c = (_b = tmdbData.credits) === null || _b === void 0 ? void 0 : _b.cast) === null || _c === void 0 ? void 0 : _c.slice(0, 10)) || [];
                            actorData = cast.map(function (c) { return ({
                                name: c.name,
                                profilePath: c.profile_path || null,
                            }); });
                            return [4 /*yield*/, this.actorCache.getActorImages(actorData)];
                        case 1:
                            actorsWithImages = _p.sent();
                            actorNames = actorsWithImages.map(function (a) { return a.name; });
                            director = (_f = (_e = (_d = tmdbData.credits) === null || _d === void 0 ? void 0 : _d.crew) === null || _e === void 0 ? void 0 : _e.find(function (c) { return c.job === 'Director'; })) === null || _f === void 0 ? void 0 : _f.name;
                            country = ((_h = (_g = tmdbData.production_countries) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.iso_3166_1) || '';
                            language = ((_k = (_j = tmdbData.spoken_languages) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.iso_639_1) || '';
                            trailer = (_o = (_m = (_l = tmdbData.videos) === null || _l === void 0 ? void 0 : _l.results) === null || _m === void 0 ? void 0 : _m.find(function (v) { return v.type === 'Trailer' && v.site === 'YouTube'; })) === null || _o === void 0 ? void 0 : _o.key;
                            trailerUrl = trailer ? "https://www.youtube.com/watch?v=".concat(trailer) : undefined;
                            return [4 /*yield*/, this.downloadPoster(mediaId, tmdbData.poster_path)];
                        case 2:
                            posterPath = _p.sent();
                            return [4 /*yield*/, this.downloadBackground(mediaId, tmdbData.backdrop_path)];
                        case 3:
                            backgroundPath = _p.sent();
                            return [2 /*return*/, {
                                    title: tmdbData.title || 'Titolo sconosciuto',
                                    originalTitle: tmdbData.original_title,
                                    plot: tmdbData.overview,
                                    runtime: tmdbData.runtime,
                                    releaseYear: tmdbData.release_date
                                        ? parseInt(tmdbData.release_date.substring(0, 4))
                                        : undefined,
                                    genres: genres,
                                    actors: actorNames,
                                    director: director,
                                    country: country,
                                    language: language,
                                    revenue: tmdbData.revenue,
                                    oscarAwards: 0,
                                    rating: tmdbData.vote_average,
                                    trailerUrl: trailerUrl,
                                    posterUrl: posterPath || undefined,
                                    backgroundUrl: backgroundPath || undefined,
                                    logoUrl: undefined,
                                    metadataSource: 'tmdb',
                                }];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.mapTmdbEpisodeToMetadata = function (episodeData, seriesTitle) {
            return {
                title: "".concat(seriesTitle, " - S").concat(episodeData.season_number, "E").concat(episodeData.episode_number, ": ").concat(episodeData.name),
                originalTitle: episodeData.name,
                plot: episodeData.overview,
                runtime: episodeData.runtime,
                releaseYear: episodeData.air_date
                    ? parseInt(episodeData.air_date.substring(0, 4))
                    : undefined,
                genres: [],
                actors: [],
                director: undefined,
                country: undefined,
                language: undefined,
                revenue: undefined,
                oscarAwards: 0,
                rating: episodeData.vote_average,
                trailerUrl: undefined,
                posterUrl: undefined,
                backgroundUrl: undefined,
                logoUrl: undefined,
                metadataSource: 'tmdb',
            };
        };
        // ============================
        // METADATI DEFAULT
        // ============================
        MetadataManagerService_1.prototype.createDefaultMetadata = function (title) {
            return {
                title: title,
                originalTitle: '',
                plot: 'Nessuna trama disponibile',
                runtime: 0,
                releaseYear: new Date().getFullYear(),
                genres: [],
                actors: [],
                director: '',
                country: '',
                language: '',
                revenue: 0,
                oscarAwards: 0,
                rating: 0,
                trailerUrl: '',
                posterUrl: '',
                backgroundUrl: '',
                logoUrl: '',
                metadataSource: 'default',
            };
        };
        // ============================
        // AGGIORNAMENTO DB
        // ============================
        MetadataManagerService_1.prototype.updateMediaInDb = function (mediaId, metadata, source, mediaTitle) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.update({
                                where: { id: mediaId },
                                data: {
                                    title: metadata.title,
                                    originalTitle: metadata.originalTitle,
                                    plot: metadata.plot,
                                    runtime: metadata.runtime,
                                    releaseYear: metadata.releaseYear,
                                    genres: metadata.genres || [],
                                    actors: metadata.actors || [],
                                    director: metadata.director,
                                    country: metadata.country,
                                    language: metadata.language,
                                    revenue: metadata.revenue,
                                    oscarAwards: metadata.oscarAwards,
                                    rating: metadata.rating,
                                    trailerUrl: metadata.trailerUrl,
                                    posterUrl: metadata.posterUrl,
                                    backgroundUrl: metadata.backgroundUrl,
                                    logoUrl: metadata.logoUrl,
                                    metadataSource: source,
                                },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ============================
        // AGGIORNAMENTO IMMAGINI — CACHE FIRST
        // ============================
        MetadataManagerService_1.prototype.fileExists = function (filePath) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs.access(filePath)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, true];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.findImageFile = function (folderPath, baseName) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, ext, filePath, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _i = 0, _a = this.IMAGE_EXTENSIONS;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            ext = _a[_i];
                            filePath = path.join(folderPath, "".concat(baseName).concat(ext));
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, fs.access(filePath)];
                        case 3:
                            _c.sent();
                            return [2 /*return*/, filePath];
                        case 4:
                            _b = _c.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, null];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.resolveImagePath = function (mediaId, folderPath, imageType, currentUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cachedPath, folderFile, defaultFile;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = currentUrl && currentUrl.trim() !== '';
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.fileExists(currentUrl)];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            if (_a) {
                                this.logger.log("\u2705 ".concat(imageType, " mantenuto da URL corrente: ").concat(currentUrl));
                                return [2 /*return*/, currentUrl];
                            }
                            cachedPath = imageType === 'poster'
                                ? this.getCachedPosterPath(mediaId)
                                : this.getCachedBackgroundPath(mediaId);
                            return [4 /*yield*/, this.fileExists(cachedPath)];
                        case 3:
                            if (_b.sent()) {
                                this.logger.log("\u2705 ".concat(imageType, " da cache: ").concat(cachedPath));
                                return [2 /*return*/, cachedPath];
                            }
                            return [4 /*yield*/, this.findImageFile(folderPath, imageType)];
                        case 4:
                            folderFile = _b.sent();
                            if (folderFile) {
                                this.logger.log("\uD83D\uDCC1 ".concat(imageType, " da folder legacy: ").concat(folderFile));
                                return [2 /*return*/, folderFile];
                            }
                            return [4 /*yield*/, this.findDefaultImage(imageType)];
                        case 5:
                            defaultFile = _b.sent();
                            if (defaultFile) {
                                this.logger.log("\uD83D\uDDBC\uFE0F ".concat(imageType, " di default: ").concat(defaultFile));
                                return [2 /*return*/, defaultFile];
                            }
                            return [2 /*return*/, currentUrl || undefined];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.updateMediaImages = function (mediaId, folderPath, source) {
            return __awaiter(this, void 0, void 0, function () {
                var current, posterUrl, backgroundUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                select: { posterUrl: true, backgroundUrl: true },
                            })];
                        case 1:
                            current = _a.sent();
                            return [4 /*yield*/, this.resolveImagePath(mediaId, folderPath, 'poster', current === null || current === void 0 ? void 0 : current.posterUrl)];
                        case 2:
                            posterUrl = _a.sent();
                            return [4 /*yield*/, this.resolveImagePath(mediaId, folderPath, 'background', current === null || current === void 0 ? void 0 : current.backgroundUrl)];
                        case 3:
                            backgroundUrl = _a.sent();
                            return [4 /*yield*/, this.prisma.media.update({
                                    where: { id: mediaId },
                                    data: { posterUrl: posterUrl, backgroundUrl: backgroundUrl },
                                })];
                        case 4:
                            _a.sent();
                            this.logger.log("\uD83D\uDCBE Immagini salvate nel DB per media ".concat(mediaId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        MetadataManagerService_1.prototype.findDefaultImage = function (imageName) {
            return __awaiter(this, void 0, void 0, function () {
                var possiblePaths, _i, possiblePaths_1, basePath, found;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            possiblePaths = [
                                path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default'),
                                path.join(process.cwd(), '..', 'frontend', 'src', 'assets', 'default'),
                                path.join(process.cwd(), 'public', 'assets', 'default'),
                                path.join(process.cwd(), 'src', 'assets', 'default'),
                            ];
                            _i = 0, possiblePaths_1 = possiblePaths;
                            _a.label = 1;
                        case 1:
                            if (!(_i < possiblePaths_1.length)) return [3 /*break*/, 4];
                            basePath = possiblePaths_1[_i];
                            return [4 /*yield*/, this.findImageFile(basePath, imageName)];
                        case 2:
                            found = _a.sent();
                            if (found) {
                                return [2 /*return*/, found];
                            }
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, null];
                    }
                });
            });
        };
        // ============================
        // UTILITY
        // ============================
        MetadataManagerService_1.prototype.delay = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        /**
         * 🟡 Invia il warning "API mancante" una sola volta per sessione.
         */
        MetadataManagerService_1.prototype.notifyMissingApiKeyOnce = function () {
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
        MetadataManagerService_1.prototype.getActorCacheService = function () {
            return this.actorCache;
        };
        return MetadataManagerService_1;
    }());
    __setFunctionName(_classThis, "MetadataManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MetadataManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MetadataManagerService = _classThis;
}();
exports.MetadataManagerService = MetadataManagerService;
