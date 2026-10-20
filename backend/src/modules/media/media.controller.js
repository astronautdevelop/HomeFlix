"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.MediaController = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var fs_1 = require("fs");
var path = require("path");
var genres_config_1 = require("../../config/genres.config");
var MediaController = function () {
    var _classDecorators = [(0, common_1.Controller)('media')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listAllMedia_decorators;
    var _getSeasons_decorators;
    var _getSeasonDetails_decorators;
    var _getSeriesImage_decorators;
    var _getContinueWatchingEnriched_decorators;
    var _searchMedia_decorators;
    var _getRandomMedia_decorators;
    var _getGenres_decorators;
    var _getMediaByGenre_decorators;
    var _getImage_decorators;
    var _deleteMedia_decorators;
    var _deleteSeason_decorators;
    var _getMediaById_decorators;
    var MediaController = _classThis = /** @class */ (function () {
        function MediaController_1(prisma, actorCacheService, actorService, coreService, notificationService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.actorCacheService = actorCacheService;
            this.actorService = actorService;
            this.coreService = coreService;
            this.notificationService = notificationService;
            this.logger = new common_1.Logger(MediaController.name);
            this.MIME_TYPES = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.bmp': 'image/bmp',
            };
        }
        // ============================================================
        // LISTA MEDIA (esclude episodi — solo film)
        // ============================================================
        MediaController_1.prototype.listAllMedia = function (includeEpisodes) {
            return __awaiter(this, void 0, void 0, function () {
                var includeEp;
                return __generator(this, function (_a) {
                    includeEp = includeEpisodes === 'true';
                    return [2 /*return*/, this.prisma.media.findMany({
                            where: includeEp ? undefined : { type: { not: 'EPISODE' } },
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                posterUrl: true,
                                backgroundUrl: true,
                                releaseYear: true,
                                rating: true,
                                metadataSource: true,
                                runtime: true,
                                genres: true,
                                actors: true,
                                director: true,
                                plot: true,
                                createdAt: true,
                                available: true,
                            },
                            orderBy: { title: 'asc' },
                        })];
                });
            });
        };
        // ============================================================
        // SERIE TV — LISTA STAGIONI AGGREGATE (per la home)
        // ============================================================
        MediaController_1.prototype.getSeasons = function () {
            return __awaiter(this, void 0, void 0, function () {
                var seasons, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.season.findMany({
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
                        case 1:
                            seasons = _a.sent();
                            return [2 /*return*/, seasons.map(function (s) { return ({
                                    id: s.id,
                                    type: 'SEASON',
                                    seriesId: s.seriesId,
                                    seriesTitle: s.series.title,
                                    posterUrl: s.series.posterUrl,
                                    backgroundUrl: s.series.backgroundUrl,
                                    releaseYear: s.series.releaseYear,
                                    rating: s.series.rating,
                                    genres: s.series.genres,
                                    seasonNumber: s.seasonNumber,
                                    seasonTitle: s.title,
                                    episodesCount: s.episodes.length,
                                    episodesAvailable: s.episodes.filter(function (e) { return e.available; }).length,
                                    totalRuntime: s.episodes.reduce(function (sum, e) { return sum + (e.runtime || 0); }, 0),
                                }); })];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error('Errore recupero stagioni', error_1.stack);
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================
        // DETTAGLIO STAGIONE + EPISODI
        // ============================================================
        MediaController_1.prototype.getSeasonDetails = function (seasonId) {
            return __awaiter(this, void 0, void 0, function () {
                var season;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.season.findUnique({
                                where: { id: seasonId },
                                include: {
                                    series: true,
                                    episodes: {
                                        orderBy: { episodeNumber: 'asc' },
                                        select: {
                                            id: true,
                                            title: true,
                                            originalTitle: true,
                                            episodeNumber: true,
                                            plot: true,
                                            runtime: true,
                                            available: true,
                                            rating: true,
                                            releaseYear: true,
                                            posterUrl: true,
                                            backgroundUrl: true,
                                            type: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            season = _a.sent();
                            if (!season) {
                                throw new common_1.NotFoundException('Stagione non trovata');
                            }
                            return [2 /*return*/, {
                                    season: {
                                        id: season.id,
                                        seriesId: season.seriesId,
                                        seasonNumber: season.seasonNumber,
                                        title: season.title,
                                        posterUrl: season.series.posterUrl,
                                        backgroundUrl: season.series.backgroundUrl,
                                    },
                                    series: {
                                        id: season.series.id,
                                        title: season.series.title,
                                        plot: season.series.plot,
                                        rating: season.series.rating,
                                        releaseYear: season.series.releaseYear,
                                        genres: season.series.genres,
                                        actors: season.series.actors,
                                        country: season.series.country,
                                        language: season.series.language,
                                        metadataSource: season.series.metadataSource,
                                    },
                                    episodes: season.episodes,
                                }];
                    }
                });
            });
        };
        // ============================================================
        // IMMAGINI SERIE (poster/background di Series)
        // ============================================================
        MediaController_1.prototype.getSeriesImage = function (seriesId_1) {
            return __awaiter(this, arguments, void 0, function (seriesId, type, res) {
                var series, filePath, defaultImage, frontendDefault;
                if (type === void 0) { type = 'poster'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.series.findUnique({
                                where: { id: seriesId },
                                select: { posterUrl: true, backgroundUrl: true },
                            })];
                        case 1:
                            series = _a.sent();
                            if (!series) {
                                throw new common_1.NotFoundException('Serie not found');
                            }
                            filePath = type === 'poster' ? series.posterUrl : series.backgroundUrl;
                            if (filePath && fs.existsSync(filePath)) {
                                return [2 /*return*/, this.streamImage(res, filePath)];
                            }
                            defaultImage = type === 'poster'
                                ? path.join(process.cwd(), 'public', 'assets', 'default', 'poster.jpg')
                                : path.join(process.cwd(), 'public', 'assets', 'default', 'background.jpg');
                            if (fs.existsSync(defaultImage)) {
                                return [2 /*return*/, this.streamImage(res, defaultImage)];
                            }
                            frontendDefault = type === 'poster'
                                ? path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'poster.jpg')
                                : path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'background.jpg');
                            if (fs.existsSync(frontendDefault)) {
                                return [2 /*return*/, this.streamImage(res, frontendDefault)];
                            }
                            throw new common_1.NotFoundException('Image not found');
                    }
                });
            });
        };
        // ============================================================
        // CONTINUE WATCHING ARRICCHITO (con info serie)
        // ============================================================
        MediaController_1.prototype.getContinueWatchingEnriched = function () {
            return __awaiter(this, void 0, void 0, function () {
                var history_1, seen_1, unique, output, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.watchHistory.findMany({
                                    where: { progress: { gt: 0 } },
                                    orderBy: { watchedAt: 'desc' },
                                    take: 30,
                                    include: {
                                        media: {
                                            include: {
                                                season: true,
                                                series: true,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            history_1 = _a.sent();
                            seen_1 = new Set();
                            unique = history_1.filter(function (h) {
                                if (seen_1.has(h.mediaId))
                                    return false;
                                seen_1.add(h.mediaId);
                                return true;
                            });
                            output = unique
                                .filter(function (h) { return h.media.available !== false; })
                                .map(function (h) {
                                var _a, _b, _c;
                                var media = h.media;
                                var runtimeMinutes = media.runtime || 0;
                                var runtimeSeconds = runtimeMinutes * 60;
                                var progressSeconds = (_a = h.progress) !== null && _a !== void 0 ? _a : 0;
                                var progressPercent = runtimeSeconds > 0 ? (progressSeconds / runtimeSeconds) * 100 : 0;
                                var remainingSeconds = Math.max(0, runtimeSeconds - progressSeconds);
                                var remainingMinutes = Math.ceil(remainingSeconds / 60);
                                return {
                                    id: media.id,
                                    title: media.title,
                                    type: media.type,
                                    posterUrl: media.posterUrl,
                                    backgroundUrl: media.backgroundUrl,
                                    releaseYear: media.releaseYear,
                                    rating: media.rating,
                                    runtime: runtimeMinutes,
                                    progress: progressSeconds,
                                    progressPercent: Math.min(progressPercent, 100),
                                    remainingMinutes: remainingMinutes,
                                    available: media.available,
                                    seriesId: media.seriesId || null,
                                    seriesTitle: ((_b = media.series) === null || _b === void 0 ? void 0 : _b.title) || null,
                                    seasonId: media.seasonId || null,
                                    seasonNumber: ((_c = media.season) === null || _c === void 0 ? void 0 : _c.seasonNumber) || null,
                                    episodeNumber: media.episodeNumber || null,
                                };
                            });
                            // 🔥 Applica soglia 2%-85% (in JS) come da logica originale
                            return [2 /*return*/, output.filter(function (item) { return item.progressPercent >= 2 && item.progressPercent <= 85; })];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error('Errore continue-watching', error_2.stack);
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================
        // SEARCH
        // ============================================================
        MediaController_1.prototype.searchMedia = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var searchTerm, results, seenSeries, output, _i, results_1, item, firstSeason, _a, _b;
                var _c;
                var _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            if (!query || query.trim().length < 2) {
                                return [2 /*return*/, []];
                            }
                            searchTerm = query.trim();
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    where: {
                                        OR: [
                                            { title: { contains: searchTerm, mode: 'insensitive' } },
                                            { originalTitle: { contains: searchTerm, mode: 'insensitive' } },
                                            { director: { contains: searchTerm, mode: 'insensitive' } },
                                        ],
                                    },
                                    include: {
                                        season: true,
                                        series: true,
                                    },
                                    take: 40,
                                    orderBy: { title: 'asc' },
                                })];
                        case 1:
                            results = _h.sent();
                            seenSeries = new Set();
                            output = [];
                            _i = 0, results_1 = results;
                            _h.label = 2;
                        case 2:
                            if (!(_i < results_1.length)) return [3 /*break*/, 7];
                            item = results_1[_i];
                            if (!(item.type === 'EPISODE')) return [3 /*break*/, 5];
                            if (!item.seriesId)
                                return [3 /*break*/, 6];
                            if (seenSeries.has(item.seriesId))
                                return [3 /*break*/, 6];
                            seenSeries.add(item.seriesId);
                            return [4 /*yield*/, this.prisma.season.findFirst({
                                    where: { seriesId: item.seriesId },
                                    orderBy: { seasonNumber: 'asc' },
                                })];
                        case 3:
                            firstSeason = _h.sent();
                            _b = (_a = output).push;
                            _c = {
                                id: item.seriesId,
                                type: 'SERIES',
                                title: ((_d = item.series) === null || _d === void 0 ? void 0 : _d.title) || item.title,
                                posterUrl: ((_e = item.series) === null || _e === void 0 ? void 0 : _e.posterUrl) || null,
                                releaseYear: ((_f = item.series) === null || _f === void 0 ? void 0 : _f.releaseYear) || null,
                                rating: ((_g = item.series) === null || _g === void 0 ? void 0 : _g.rating) || null,
                                seasonId: (firstSeason === null || firstSeason === void 0 ? void 0 : firstSeason.id) || null
                            };
                            return [4 /*yield*/, this.prisma.season.count({
                                    where: { seriesId: item.seriesId },
                                })];
                        case 4:
                            _b.apply(_a, [(_c.seasonsCount = _h.sent(),
                                    _c)]);
                            return [3 /*break*/, 6];
                        case 5:
                            output.push({
                                id: item.id,
                                title: item.title,
                                posterUrl: item.posterUrl,
                                releaseYear: item.releaseYear,
                                rating: item.rating,
                                type: item.type,
                            });
                            _h.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, output.slice(0, 20)];
                    }
                });
            });
        };
        // ============================================================
        // RANDOM (film + serie TV)
        // ============================================================
        MediaController_1.prototype.getRandomMedia = function () {
            return __awaiter(this, void 0, void 0, function () {
                var movieCount, seriesWithSeasons, seriesCount, total, pick, media, seriesIndex, seriesId, series, firstSeason, fallback;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.count({
                                where: { type: 'MOVIE', available: true },
                            })];
                        case 1:
                            movieCount = _a.sent();
                            return [4 /*yield*/, this.prisma.season.findMany({
                                    distinct: ['seriesId'],
                                    select: { seriesId: true },
                                })];
                        case 2:
                            seriesWithSeasons = _a.sent();
                            seriesCount = seriesWithSeasons.length;
                            total = movieCount + seriesCount;
                            if (total === 0) {
                                throw new common_1.NotFoundException('Nessun contenuto trovato');
                            }
                            pick = Math.floor(Math.random() * total);
                            if (!(pick < movieCount)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    where: { type: 'MOVIE', available: true },
                                    skip: pick,
                                    take: 1,
                                    orderBy: { id: 'asc' },
                                    select: {
                                        id: true,
                                        title: true,
                                        posterUrl: true,
                                        backgroundUrl: true,
                                        releaseYear: true,
                                        rating: true,
                                        plot: true,
                                        type: true,
                                    },
                                })];
                        case 3:
                            media = _a.sent();
                            return [2 /*return*/, media[0] || null];
                        case 4:
                            seriesIndex = pick - movieCount;
                            seriesId = seriesWithSeasons[seriesIndex].seriesId;
                            return [4 /*yield*/, this.prisma.series.findUnique({
                                    where: { id: seriesId },
                                    select: {
                                        id: true,
                                        title: true,
                                        posterUrl: true,
                                        backgroundUrl: true,
                                        releaseYear: true,
                                        rating: true,
                                        plot: true,
                                    },
                                })];
                        case 5:
                            series = _a.sent();
                            return [4 /*yield*/, this.prisma.season.findFirst({
                                    where: { seriesId: seriesId },
                                    orderBy: { seasonNumber: 'asc' },
                                    select: { id: true },
                                })];
                        case 6:
                            firstSeason = _a.sent();
                            if (!(!series || !firstSeason)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.media.findFirst({
                                    where: { type: 'MOVIE', available: true },
                                    select: {
                                        id: true,
                                        title: true,
                                        posterUrl: true,
                                        backgroundUrl: true,
                                        releaseYear: true,
                                        rating: true,
                                        plot: true,
                                        type: true,
                                    },
                                })];
                        case 7:
                            fallback = _a.sent();
                            return [2 /*return*/, fallback];
                        case 8: return [2 /*return*/, {
                                id: series.id,
                                type: 'SERIES',
                                title: series.title,
                                posterUrl: series.posterUrl,
                                backgroundUrl: series.backgroundUrl,
                                releaseYear: series.releaseYear,
                                rating: series.rating,
                                plot: series.plot,
                                seasonId: firstSeason.id,
                            }];
                    }
                });
            });
        };
        // ============================================================
        // GENERI (Serie TV conteggia STAGIONI)
        // ============================================================
        MediaController_1.prototype.getGenres = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allMedia, seasonsCount, genreCount_1, noGenreCount, _i, allMedia_1, media, hasRecognizedGenre, _a, _b, g, displayName, result, error_3;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    select: { genres: true, type: true },
                                })];
                        case 1:
                            allMedia = _c.sent();
                            return [4 /*yield*/, this.prisma.season.count()];
                        case 2:
                            seasonsCount = _c.sent();
                            genreCount_1 = {};
                            genres_config_1.ALL_GENRES.forEach(function (genre) {
                                genreCount_1[genre] = 0;
                            });
                            genres_config_1.SPECIAL_GENRES.forEach(function (genre) {
                                genreCount_1[genre] = 0;
                            });
                            noGenreCount = 0;
                            for (_i = 0, allMedia_1 = allMedia; _i < allMedia_1.length; _i++) {
                                media = allMedia_1[_i];
                                if (media.type === 'EPISODE')
                                    continue;
                                if (media.genres && Array.isArray(media.genres) && media.genres.length > 0) {
                                    hasRecognizedGenre = false;
                                    for (_a = 0, _b = media.genres; _a < _b.length; _a++) {
                                        g = _b[_a];
                                        if (typeof g === 'string') {
                                            displayName = genres_config_1.GENRE_DISPLAY_NAMES[g] || g;
                                            if (genres_config_1.ALL_GENRES.includes(displayName)) {
                                                genreCount_1[displayName] = (genreCount_1[displayName] || 0) + 1;
                                                hasRecognizedGenre = true;
                                            }
                                        }
                                    }
                                    if (!hasRecognizedGenre) {
                                        noGenreCount++;
                                    }
                                }
                                else {
                                    noGenreCount++;
                                }
                            }
                            if (seasonsCount > 0) {
                                genreCount_1['Serie TV'] = seasonsCount;
                            }
                            if (noGenreCount > 0) {
                                genreCount_1['Altro'] = noGenreCount;
                            }
                            result = Object.entries(genreCount_1)
                                .map(function (_a) {
                                var genre = _a[0], count = _a[1];
                                return ({ genre: genre, count: count });
                            })
                                .sort(function (a, b) {
                                if (a.count !== b.count)
                                    return b.count - a.count;
                                return a.genre.localeCompare(b.genre);
                            });
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _c.sent();
                            this.logger.error('Errore recupero generi', error_3.stack);
                            return [2 /*return*/, genres_config_1.ALL_GENRES.map(function (genre) { return ({ genre: genre, count: 0 }); })];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================
        // FILM PER GENERE (Serie TV → stagioni aggregate)
        // ============================================================
        MediaController_1.prototype.getMediaByGenre = function (genre) {
            return __awaiter(this, void 0, void 0, function () {
                var decodedGenre, media_1, seasons, originalGenre, genreToSearch, media, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            decodedGenre = decodeURIComponent(genre);
                            if (!(decodedGenre === 'Altro')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          SELECT *\n          FROM \"Media\"\n          WHERE (genres IS NULL OR jsonb_array_length(genres) = 0)\n            AND type = 'MOVIE'\n          ORDER BY title ASC\n        "], ["\n          SELECT *\n          FROM \"Media\"\n          WHERE (genres IS NULL OR jsonb_array_length(genres) = 0)\n            AND type = 'MOVIE'\n          ORDER BY title ASC\n        "])))];
                        case 1:
                            media_1 = _a.sent();
                            return [2 /*return*/, media_1];
                        case 2:
                            if (!(decodedGenre === 'Serie TV')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.season.findMany({
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
                            seasons = _a.sent();
                            return [2 /*return*/, seasons.map(function (s) { return ({
                                    id: s.id,
                                    type: 'SEASON',
                                    seriesId: s.seriesId,
                                    seriesTitle: s.series.title,
                                    posterUrl: s.series.posterUrl,
                                    backgroundUrl: s.series.backgroundUrl,
                                    releaseYear: s.series.releaseYear,
                                    rating: s.series.rating,
                                    genres: s.series.genres,
                                    seasonNumber: s.seasonNumber,
                                    episodesCount: s.episodes.length,
                                    episodesAvailable: s.episodes.filter(function (e) { return e.available; }).length,
                                }); })];
                        case 4:
                            originalGenre = this.getOriginalGenre(decodedGenre);
                            genreToSearch = originalGenre || decodedGenre;
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        SELECT *\n        FROM \"Media\"\n        WHERE genres @> ", "::jsonb\n          AND type = 'MOVIE'\n        ORDER BY title ASC\n      "], ["\n        SELECT *\n        FROM \"Media\"\n        WHERE genres @> ", "::jsonb\n          AND type = 'MOVIE'\n        ORDER BY title ASC\n      "])), JSON.stringify([genreToSearch]))];
                        case 5:
                            media = _a.sent();
                            return [2 /*return*/, media];
                        case 6:
                            error_4 = _a.sent();
                            this.logger.error("Errore recupero film per genere ".concat(genre), error_4.stack);
                            throw new common_1.NotFoundException("Genere ".concat(genre, " non trovato"));
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================
        // IMMAGINI MEDIA (film)
        // ============================================================
        MediaController_1.prototype.getImage = function (mediaId_1) {
            return __awaiter(this, arguments, void 0, function (mediaId, type, res) {
                var media, filePath, defaultImage, frontendDefault;
                if (type === void 0) { type = 'poster'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                select: { posterUrl: true, backgroundUrl: true },
                            })];
                        case 1:
                            media = _a.sent();
                            if (!media) {
                                throw new common_1.NotFoundException('Media not found');
                            }
                            filePath = type === 'poster' ? media.posterUrl : media.backgroundUrl;
                            if (filePath && fs.existsSync(filePath)) {
                                return [2 /*return*/, this.streamImage(res, filePath)];
                            }
                            defaultImage = type === 'poster'
                                ? path.join(process.cwd(), 'public', 'assets', 'default', 'poster.jpg')
                                : path.join(process.cwd(), 'public', 'assets', 'default', 'background.jpg');
                            if (fs.existsSync(defaultImage)) {
                                return [2 /*return*/, this.streamImage(res, defaultImage)];
                            }
                            frontendDefault = type === 'poster'
                                ? path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'poster.jpg')
                                : path.join(process.cwd(), '..', 'frontend', 'public', 'assets', 'default', 'background.jpg');
                            if (fs.existsSync(frontendDefault)) {
                                return [2 /*return*/, this.streamImage(res, frontendDefault)];
                            }
                            throw new common_1.NotFoundException('Image not found');
                    }
                });
            });
        };
        MediaController_1.prototype.streamImage = function (res, filePath) {
            var _this = this;
            var ext = path.extname(filePath).toLowerCase();
            var mimeType = this.MIME_TYPES[ext] || 'application/octet-stream';
            try {
                var stat = fs.statSync(filePath);
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Cache-Control', 'public, max-age=86400');
                var stream = (0, fs_1.createReadStream)(filePath);
                stream.on('error', function (err) {
                    _this.logger.error("Errore stream immagine ".concat(filePath, ": ").concat(err.message));
                    if (!res.headersSent) {
                        res.status(500).end();
                    }
                    else {
                        res.end();
                    }
                });
                stream.pipe(res);
            }
            catch (err) {
                this.logger.error("Errore serving immagine ".concat(filePath, ": ").concat(err.message));
                if (!res.headersSent) {
                    res.status(404).end();
                }
            }
        };
        // ============================================================
        // DELETE MEDIA
        // ============================================================
        MediaController_1.prototype.deleteMedia = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var media, isEpisode, seriesId, filesToDelete, _i, filesToDelete_1, file, filePath, err_1, cacheFiles, _a, cacheFiles_1, filePath, err_2, remaining, seriesCacheFiles, _b, seriesCacheFiles_1, filePath, err_3, err_4, error_5;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 33, , 34]);
                            return [4 /*yield*/, this.prisma.media.findUnique({ where: { id: id } })];
                        case 1:
                            media = _c.sent();
                            if (!media) {
                                throw new common_1.NotFoundException("Media con ID ".concat(id, " non trovato"));
                            }
                            isEpisode = media.type === 'EPISODE';
                            seriesId = media.seriesId;
                            if (!media.folderPath) return [3 /*break*/, 8];
                            filesToDelete = [
                                'metadata.json',
                                'poster.jpg', 'poster.png',
                                'background.jpg', 'background.png',
                            ];
                            _i = 0, filesToDelete_1 = filesToDelete;
                            _c.label = 2;
                        case 2:
                            if (!(_i < filesToDelete_1.length)) return [3 /*break*/, 8];
                            file = filesToDelete_1[_i];
                            filePath = path.join(media.folderPath, file);
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 6, , 7]);
                            if (!fs.existsSync(filePath)) return [3 /*break*/, 5];
                            return [4 /*yield*/, fs.promises.unlink(filePath)];
                        case 4:
                            _c.sent();
                            this.logger.log("\uD83D\uDDD1\uFE0F File eliminato: ".concat(filePath));
                            _c.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_1 = _c.sent();
                            this.logger.warn("\u26A0\uFE0F Impossibile eliminare ".concat(filePath, ": ").concat(err_1.message));
                            return [3 /*break*/, 7];
                        case 7:
                            _i++;
                            return [3 /*break*/, 2];
                        case 8:
                            cacheFiles = [
                                path.join(this.coreService.getMediaPosterCachePath(), "".concat(id, ".jpg")),
                                path.join(this.coreService.getMediaBackgroundCachePath(), "".concat(id, ".jpg")),
                            ];
                            _a = 0, cacheFiles_1 = cacheFiles;
                            _c.label = 9;
                        case 9:
                            if (!(_a < cacheFiles_1.length)) return [3 /*break*/, 15];
                            filePath = cacheFiles_1[_a];
                            _c.label = 10;
                        case 10:
                            _c.trys.push([10, 13, , 14]);
                            if (!fs.existsSync(filePath)) return [3 /*break*/, 12];
                            return [4 /*yield*/, fs.promises.unlink(filePath)];
                        case 11:
                            _c.sent();
                            this.logger.log("\uD83D\uDDD1\uFE0F Cache eliminata: ".concat(filePath));
                            _c.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            err_2 = _c.sent();
                            this.logger.warn("\u26A0\uFE0F Impossibile eliminare ".concat(filePath, ": ").concat(err_2.message));
                            return [3 /*break*/, 14];
                        case 14:
                            _a++;
                            return [3 /*break*/, 9];
                        case 15: return [4 /*yield*/, this.prisma.mediaVersion.deleteMany({ where: { mediaId: id } })];
                        case 16:
                            _c.sent();
                            return [4 /*yield*/, this.prisma.watchHistory.deleteMany({ where: { mediaId: id } })];
                        case 17:
                            _c.sent();
                            return [4 /*yield*/, this.prisma.collectionMedia.deleteMany({ where: { mediaId: id } })];
                        case 18:
                            _c.sent();
                            return [4 /*yield*/, this.prisma.media.delete({ where: { id: id } })];
                        case 19:
                            _c.sent();
                            this.logger.log("\uD83D\uDDD1\uFE0F Media eliminato: ".concat(media.title, " (").concat(id, ")"));
                            // 🟡 Warning: film/episodio eliminato
                            this.notificationService
                                .notify('warning', "Media eliminato: \"".concat(media.title, "\""), { mediaId: id, title: media.title, type: media.type })
                                .catch(function (err) {
                                return _this.logger.error('Errore invio notifica eliminazione', err === null || err === void 0 ? void 0 : err.stack);
                            });
                            if (!(isEpisode && seriesId)) return [3 /*break*/, 32];
                            _c.label = 20;
                        case 20:
                            _c.trys.push([20, 31, , 32]);
                            return [4 /*yield*/, this.prisma.media.count({
                                    where: { seriesId: seriesId },
                                })];
                        case 21:
                            remaining = _c.sent();
                            if (!(remaining === 0)) return [3 /*break*/, 30];
                            seriesCacheFiles = [
                                path.join(this.coreService.getMediaPosterCachePath(), "series_".concat(seriesId, ".jpg")),
                                path.join(this.coreService.getMediaBackgroundCachePath(), "series_".concat(seriesId, ".jpg")),
                            ];
                            _b = 0, seriesCacheFiles_1 = seriesCacheFiles;
                            _c.label = 22;
                        case 22:
                            if (!(_b < seriesCacheFiles_1.length)) return [3 /*break*/, 28];
                            filePath = seriesCacheFiles_1[_b];
                            _c.label = 23;
                        case 23:
                            _c.trys.push([23, 26, , 27]);
                            if (!fs.existsSync(filePath)) return [3 /*break*/, 25];
                            return [4 /*yield*/, fs.promises.unlink(filePath)];
                        case 24:
                            _c.sent();
                            this.logger.log("\uD83D\uDDD1\uFE0F Cache serie eliminata: ".concat(filePath));
                            _c.label = 25;
                        case 25: return [3 /*break*/, 27];
                        case 26:
                            err_3 = _c.sent();
                            this.logger.warn("\u26A0\uFE0F Impossibile eliminare ".concat(filePath, ": ").concat(err_3.message));
                            return [3 /*break*/, 27];
                        case 27:
                            _b++;
                            return [3 /*break*/, 22];
                        case 28: return [4 /*yield*/, this.prisma.series.delete({ where: { id: seriesId } })];
                        case 29:
                            _c.sent();
                            this.logger.log("\uD83D\uDDD1\uFE0F Serie eliminata: ".concat(seriesId));
                            _c.label = 30;
                        case 30: return [3 /*break*/, 32];
                        case 31:
                            err_4 = _c.sent();
                            this.logger.warn("\u26A0\uFE0F Errore cleanup serie ".concat(seriesId, ": ").concat(err_4.message));
                            return [3 /*break*/, 32];
                        case 32:
                            setImmediate(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result, err_5;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.actorService.runGarbageCollection()];
                                        case 1:
                                            result = _a.sent();
                                            this.logger.log("\uD83E\uDDF9 Garbage Collection attori: ".concat(result.deletedImages, " immagini, ").concat(result.deletedMetadata, " metadati eliminati"));
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_5 = _a.sent();
                                            this.logger.error('❌ Errore garbage collection', err_5.stack);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/, { success: true, message: 'Media eliminato con successo' }];
                        case 33:
                            error_5 = _c.sent();
                            this.logger.error("Errore eliminazione media ".concat(id), error_5.stack);
                            throw error_5;
                        case 34: return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================
        // DELETE STAGIONE INTERA
        // ============================================================
        MediaController_1.prototype.deleteSeason = function (seasonId) {
            return __awaiter(this, void 0, void 0, function () {
                var season, _i, _a, ep, remaining, seriesCacheFiles, _b, seriesCacheFiles_2, filePath, err_6;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.season.findUnique({
                                where: { id: seasonId },
                                include: { episodes: true },
                            })];
                        case 1:
                            season = _c.sent();
                            if (!season) {
                                throw new common_1.NotFoundException('Stagione non trovata');
                            }
                            _i = 0, _a = season.episodes;
                            _c.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            ep = _a[_i];
                            return [4 /*yield*/, this.deleteMedia(ep.id)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, this.prisma.media.count({
                                where: { seriesId: season.seriesId },
                            })];
                        case 6:
                            remaining = _c.sent();
                            if (!(remaining === 0)) return [3 /*break*/, 15];
                            seriesCacheFiles = [
                                path.join(this.coreService.getMediaPosterCachePath(), "series_".concat(season.seriesId, ".jpg")),
                                path.join(this.coreService.getMediaBackgroundCachePath(), "series_".concat(season.seriesId, ".jpg")),
                            ];
                            _b = 0, seriesCacheFiles_2 = seriesCacheFiles;
                            _c.label = 7;
                        case 7:
                            if (!(_b < seriesCacheFiles_2.length)) return [3 /*break*/, 13];
                            filePath = seriesCacheFiles_2[_b];
                            _c.label = 8;
                        case 8:
                            _c.trys.push([8, 11, , 12]);
                            if (!fs.existsSync(filePath)) return [3 /*break*/, 10];
                            return [4 /*yield*/, fs.promises.unlink(filePath)];
                        case 9:
                            _c.sent();
                            _c.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            err_6 = _c.sent();
                            this.logger.warn("\u26A0\uFE0F Impossibile eliminare ".concat(filePath, ": ").concat(err_6.message));
                            return [3 /*break*/, 12];
                        case 12:
                            _b++;
                            return [3 /*break*/, 7];
                        case 13: return [4 /*yield*/, this.prisma.series.delete({ where: { id: season.seriesId } }).catch(function () { })];
                        case 14:
                            _c.sent();
                            _c.label = 15;
                        case 15: return [2 /*return*/, { success: true, message: 'Stagione eliminata' }];
                    }
                });
            });
        };
        // ============================================================
        // GET MEDIA BY ID
        // ============================================================
        MediaController_1.prototype.getMediaById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var media, serialized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!id) {
                                throw new common_1.NotFoundException('ID del media non fornito');
                            }
                            return [4 /*yield*/, this.prisma.media.findUnique({
                                    where: { id: id },
                                    include: {
                                        versions: true,
                                        season: true,
                                        series: true,
                                    },
                                })];
                        case 1:
                            media = _a.sent();
                            if (!media) {
                                throw new common_1.NotFoundException("Media con ID ".concat(id, " non trovato"));
                            }
                            serialized = __assign(__assign({}, media), { versions: media.versions.map(function (v) { return (__assign(__assign({}, v), { size: v.size ? Number(v.size) : null })); }) });
                            return [2 /*return*/, serialized];
                    }
                });
            });
        };
        MediaController_1.prototype.getOriginalGenre = function (displayName) {
            var reverseMap = {
                'Concerti Live': 'Musica',
            };
            return reverseMap[displayName] || null;
        };
        return MediaController_1;
    }());
    __setFunctionName(_classThis, "MediaController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listAllMedia_decorators = [(0, common_1.Get)()];
        _getSeasons_decorators = [(0, common_1.Get)('seasons')];
        _getSeasonDetails_decorators = [(0, common_1.Get)('seasons/:seasonId')];
        _getSeriesImage_decorators = [(0, common_1.Get)('series/:seriesId/image')];
        _getContinueWatchingEnriched_decorators = [(0, common_1.Get)('continue-watching')];
        _searchMedia_decorators = [(0, common_1.Get)('search')];
        _getRandomMedia_decorators = [(0, common_1.Get)('random')];
        _getGenres_decorators = [(0, common_1.Get)('genres')];
        _getMediaByGenre_decorators = [(0, common_1.Get)('by-genre/:genre')];
        _getImage_decorators = [(0, common_1.Get)('image/:mediaId')];
        _deleteMedia_decorators = [(0, common_1.Delete)(':id')];
        _deleteSeason_decorators = [(0, common_1.Delete)('seasons/:seasonId')];
        _getMediaById_decorators = [(0, common_1.Get)(':id')];
        __esDecorate(_classThis, null, _listAllMedia_decorators, { kind: "method", name: "listAllMedia", static: false, private: false, access: { has: function (obj) { return "listAllMedia" in obj; }, get: function (obj) { return obj.listAllMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSeasons_decorators, { kind: "method", name: "getSeasons", static: false, private: false, access: { has: function (obj) { return "getSeasons" in obj; }, get: function (obj) { return obj.getSeasons; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSeasonDetails_decorators, { kind: "method", name: "getSeasonDetails", static: false, private: false, access: { has: function (obj) { return "getSeasonDetails" in obj; }, get: function (obj) { return obj.getSeasonDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSeriesImage_decorators, { kind: "method", name: "getSeriesImage", static: false, private: false, access: { has: function (obj) { return "getSeriesImage" in obj; }, get: function (obj) { return obj.getSeriesImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getContinueWatchingEnriched_decorators, { kind: "method", name: "getContinueWatchingEnriched", static: false, private: false, access: { has: function (obj) { return "getContinueWatchingEnriched" in obj; }, get: function (obj) { return obj.getContinueWatchingEnriched; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchMedia_decorators, { kind: "method", name: "searchMedia", static: false, private: false, access: { has: function (obj) { return "searchMedia" in obj; }, get: function (obj) { return obj.searchMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRandomMedia_decorators, { kind: "method", name: "getRandomMedia", static: false, private: false, access: { has: function (obj) { return "getRandomMedia" in obj; }, get: function (obj) { return obj.getRandomMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGenres_decorators, { kind: "method", name: "getGenres", static: false, private: false, access: { has: function (obj) { return "getGenres" in obj; }, get: function (obj) { return obj.getGenres; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMediaByGenre_decorators, { kind: "method", name: "getMediaByGenre", static: false, private: false, access: { has: function (obj) { return "getMediaByGenre" in obj; }, get: function (obj) { return obj.getMediaByGenre; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getImage_decorators, { kind: "method", name: "getImage", static: false, private: false, access: { has: function (obj) { return "getImage" in obj; }, get: function (obj) { return obj.getImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteMedia_decorators, { kind: "method", name: "deleteMedia", static: false, private: false, access: { has: function (obj) { return "deleteMedia" in obj; }, get: function (obj) { return obj.deleteMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteSeason_decorators, { kind: "method", name: "deleteSeason", static: false, private: false, access: { has: function (obj) { return "deleteSeason" in obj; }, get: function (obj) { return obj.deleteSeason; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMediaById_decorators, { kind: "method", name: "getMediaById", static: false, private: false, access: { has: function (obj) { return "getMediaById" in obj; }, get: function (obj) { return obj.getMediaById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediaController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediaController = _classThis;
}();
exports.MediaController = MediaController;
var templateObject_1, templateObject_2;
