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
exports.StatisticsService = void 0;
var common_1 = require("@nestjs/common");
var StatisticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StatisticsService = _classThis = /** @class */ (function () {
        function StatisticsService_1(prisma) {
            this.prisma = prisma;
        }
        StatisticsService_1.prototype.getStatistics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var watchedMediaIds, mediaIds, totalMinutesWatched, medias, totalHoursWatched, watchCounts, mostWatchedMovies, filtered, _i, filtered_1, item, media, genreCountMap, watchedMedia, _a, watchedMedia_1, media, genres, _b, genres_1, g, favoriteGenres, recentHistory, recentlyWatched;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.watchHistory.findMany({
                                where: {
                                    progress: { gt: 2 },
                                },
                                distinct: ['mediaId'],
                                select: { mediaId: true },
                            })];
                        case 1:
                            watchedMediaIds = _c.sent();
                            mediaIds = watchedMediaIds.map(function (w) { return w.mediaId; });
                            totalMinutesWatched = 0;
                            if (!(mediaIds.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    where: { id: { in: mediaIds } },
                                    select: { runtime: true },
                                })];
                        case 2:
                            medias = _c.sent();
                            totalMinutesWatched = medias.reduce(function (sum, m) { return sum + (m.runtime || 0); }, 0);
                            _c.label = 3;
                        case 3:
                            totalHoursWatched = Math.round((totalMinutesWatched / 60) * 10) / 10;
                            return [4 /*yield*/, this.prisma.watchHistory.groupBy({
                                    by: ['mediaId'],
                                    where: {
                                        progress: { gt: 2 },
                                    },
                                    _count: {
                                        mediaId: true,
                                    },
                                })];
                        case 4:
                            watchCounts = _c.sent();
                            mostWatchedMovies = [];
                            filtered = watchCounts
                                .filter(function (item) { return item._count.mediaId > 1; })
                                .sort(function (a, b) { return b._count.mediaId - a._count.mediaId; })
                                .slice(0, 4);
                            _i = 0, filtered_1 = filtered;
                            _c.label = 5;
                        case 5:
                            if (!(_i < filtered_1.length)) return [3 /*break*/, 8];
                            item = filtered_1[_i];
                            return [4 /*yield*/, this.prisma.media.findUnique({
                                    where: { id: item.mediaId },
                                    select: { id: true, title: true, posterUrl: true },
                                })];
                        case 6:
                            media = _c.sent();
                            if (media) {
                                mostWatchedMovies.push({
                                    id: media.id,
                                    title: media.title || 'Sconosciuto',
                                    watchCount: item._count.mediaId,
                                    posterUrl: media.posterUrl || undefined,
                                });
                            }
                            _c.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 5];
                        case 8:
                            genreCountMap = new Map();
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    where: {
                                        watchHistory: {
                                            some: {
                                                progress: { gt: 2 },
                                            },
                                        },
                                    },
                                    select: { genres: true },
                                })];
                        case 9:
                            watchedMedia = _c.sent();
                            for (_a = 0, watchedMedia_1 = watchedMedia; _a < watchedMedia_1.length; _a++) {
                                media = watchedMedia_1[_a];
                                genres = media.genres;
                                if (Array.isArray(genres)) {
                                    for (_b = 0, genres_1 = genres; _b < genres_1.length; _b++) {
                                        g = genres_1[_b];
                                        if (typeof g === 'string') {
                                            genreCountMap.set(g, (genreCountMap.get(g) || 0) + 1);
                                        }
                                    }
                                }
                            }
                            favoriteGenres = Array.from(genreCountMap.entries())
                                .map(function (_a) {
                                var genre = _a[0], count = _a[1];
                                return ({ genre: genre, count: count });
                            })
                                .sort(function (a, b) { return b.count - a.count; })
                                .slice(0, 10);
                            return [4 /*yield*/, this.prisma.watchHistory.findMany({
                                    where: {
                                        progress: { gt: 2 },
                                    },
                                    orderBy: {
                                        watchedAt: 'desc',
                                    },
                                    take: 6,
                                    include: {
                                        media: {
                                            select: {
                                                id: true,
                                                title: true,
                                                posterUrl: true,
                                            },
                                        },
                                    },
                                })];
                        case 10:
                            recentHistory = _c.sent();
                            recentlyWatched = recentHistory.map(function (record) { return ({
                                id: record.media.id,
                                title: record.media.title || 'Sconosciuto',
                                watchedAt: record.watchedAt,
                                posterUrl: record.media.posterUrl || undefined,
                            }); });
                            return [2 /*return*/, {
                                    totalHoursWatched: totalHoursWatched,
                                    mostWatchedMovies: mostWatchedMovies,
                                    favoriteGenres: favoriteGenres,
                                    recentlyWatched: recentlyWatched,
                                }];
                    }
                });
            });
        };
        return StatisticsService_1;
    }());
    __setFunctionName(_classThis, "StatisticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatisticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatisticsService = _classThis;
}();
exports.StatisticsService = StatisticsService;
