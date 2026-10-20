"use strict";
// player-engine.service.ts (COMPLETO)
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
exports.PlayerEngineService = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
var PlayerEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlayerEngineService = _classThis = /** @class */ (function () {
        function PlayerEngineService_1(prisma, storageManager, coreService) {
            this.prisma = prisma;
            this.storageManager = storageManager;
            this.coreService = coreService;
            this.logger = new common_1.Logger(PlayerEngineService.name);
            this.MIME_TYPES = {
                '.mp4': 'video/mp4',
                '.mkv': 'video/x-matroska',
                '.avi': 'video/x-msvideo',
                '.mov': 'video/quicktime',
                '.webm': 'video/webm',
                '.srt': 'text/plain',
                '.vtt': 'text/vtt',
                '.ass': 'text/plain',
            };
        }
        PlayerEngineService_1.prototype.getMediaInfo = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var media, qualities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                include: { versions: true },
                            })];
                        case 1:
                            media = _a.sent();
                            if (!media) {
                                throw new common_1.NotFoundException("Media ".concat(mediaId, " non trovato"));
                            }
                            qualities = media.versions.map(function (version) { return ({
                                quality: version.quality,
                                filePath: version.filePath,
                                size: Number(version.size) || 0,
                                mimeType: _this.getMimeType(version.filePath),
                            }); });
                            return [2 /*return*/, {
                                    id: media.id,
                                    title: media.title,
                                    type: media.type,
                                    qualities: qualities,
                                }];
                    }
                });
            });
        };
        PlayerEngineService_1.prototype.getAvailableQualities = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMediaInfo(mediaId)];
                        case 1:
                            info = _a.sent();
                            return [2 /*return*/, info.qualities];
                    }
                });
            });
        };
        PlayerEngineService_1.prototype.getVersionFilePath = function (mediaId, quality) {
            return __awaiter(this, void 0, void 0, function () {
                var media, sortedVersions, bestVersion, exists_1, version, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                include: { versions: true },
                            })];
                        case 1:
                            media = _a.sent();
                            if (!media) {
                                throw new common_1.NotFoundException("Media ".concat(mediaId, " non trovato"));
                            }
                            if (!media.available) {
                                throw new common_1.NotFoundException('Il file non è più disponibile sul disco');
                            }
                            if (!!quality) return [3 /*break*/, 3];
                            sortedVersions = media.versions.sort(function (a, b) {
                                var order = ['4K', 'Full HD', 'HD', 'DVD', 'SD'];
                                return order.indexOf(a.quality) - order.indexOf(b.quality);
                            });
                            bestVersion = sortedVersions[0];
                            if (!bestVersion)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.storageManager.fileExists(bestVersion.filePath)];
                        case 2:
                            exists_1 = _a.sent();
                            if (!exists_1) {
                                throw new common_1.NotFoundException("File non trovato per la qualit\u00E0 ".concat(bestVersion.quality));
                            }
                            return [2 /*return*/, bestVersion.filePath];
                        case 3:
                            version = media.versions.find(function (v) { return v.quality === quality; });
                            if (!version) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.storageManager.fileExists(version.filePath)];
                        case 4:
                            exists = _a.sent();
                            if (!exists) {
                                throw new common_1.NotFoundException("File non trovato per la qualit\u00E0 ".concat(quality));
                            }
                            return [2 /*return*/, version.filePath];
                    }
                });
            });
        };
        PlayerEngineService_1.prototype.getMimeType = function (filePath) {
            var ext = path.extname(filePath).toLowerCase();
            if (ext === '.avi') {
                return 'video/mp4';
            }
            return this.MIME_TYPES[ext] || 'application/octet-stream';
        };
        PlayerEngineService_1.prototype.streamVideo = function (mediaId, quality, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var filePath, stats, fileSize, mimeType, range, parts, start, end, chunkSize, stream, stream, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.getVersionFilePath(mediaId, quality)];
                        case 1:
                            filePath = _a.sent();
                            if (!filePath) {
                                this.logger.warn("File non trovato per media ".concat(mediaId, ", qualit\u00E0 ").concat(quality));
                                res.status(404).json({ error: 'File non trovato o qualità non disponibile' });
                                return [2 /*return*/];
                            }
                            this.logger.log("\uD83D\uDD0D Streaming file: ".concat(filePath));
                            return [4 /*yield*/, this.storageManager.getFileStats(filePath)];
                        case 2:
                            stats = _a.sent();
                            if (!stats) {
                                this.logger.error("File stats non trovato: ".concat(filePath));
                                res.status(404).send('File non trovato');
                                return [2 /*return*/];
                            }
                            fileSize = stats.size;
                            mimeType = this.getMimeType(filePath);
                            range = req.headers.range;
                            if (range) {
                                parts = range.replace(/bytes=/, '').split('-');
                                start = parseInt(parts[0], 10);
                                end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                                chunkSize = end - start + 1;
                                if (start >= fileSize || end >= fileSize) {
                                    res.status(416).set('Content-Range', "bytes */".concat(fileSize)).send();
                                    return [2 /*return*/];
                                }
                                stream = fs.createReadStream(filePath, { start: start, end: end });
                                res.writeHead(206, {
                                    'Content-Range': "bytes ".concat(start, "-").concat(end, "/").concat(fileSize),
                                    'Accept-Ranges': 'bytes',
                                    'Content-Length': chunkSize,
                                    'Content-Type': mimeType,
                                    'Cache-Control': 'no-cache',
                                });
                                stream.pipe(res);
                            }
                            else {
                                stream = fs.createReadStream(filePath);
                                res.writeHead(200, {
                                    'Content-Length': fileSize,
                                    'Content-Type': mimeType,
                                    'Accept-Ranges': 'bytes',
                                    'Cache-Control': 'no-cache',
                                });
                                stream.pipe(res);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Errore streaming video ".concat(mediaId), error_1.stack);
                            if (error_1 instanceof common_1.NotFoundException) {
                                res.status(404).send(error_1.message);
                            }
                            else {
                                res.status(500).send('Errore durante lo streaming');
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PlayerEngineService_1.prototype.getSubtitles = function (mediaId_1) {
            return __awaiter(this, arguments, void 0, function (mediaId, language) {
                var media, filePath, folderPath, fileName, subtitleExtensions, patterns, _i, subtitleExtensions_1, ext, _a, patterns_1, pattern, subPath, content, mimeType, _b;
                if (language === void 0) { language = 'it'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                include: { versions: true },
                            })];
                        case 1:
                            media = _c.sent();
                            if (!media || !media.versions || media.versions.length === 0) {
                                throw new common_1.NotFoundException("Media ".concat(mediaId, " non trovato o senza versioni"));
                            }
                            filePath = media.versions[0].filePath;
                            folderPath = path.dirname(filePath);
                            fileName = path.basename(filePath, path.extname(filePath));
                            subtitleExtensions = ['.srt', '.vtt', '.ass'];
                            patterns = [
                                "".concat(fileName, ".").concat(language),
                                "".concat(fileName, "_").concat(language),
                                "".concat(fileName),
                            ];
                            _i = 0, subtitleExtensions_1 = subtitleExtensions;
                            _c.label = 2;
                        case 2:
                            if (!(_i < subtitleExtensions_1.length)) return [3 /*break*/, 10];
                            ext = subtitleExtensions_1[_i];
                            _a = 0, patterns_1 = patterns;
                            _c.label = 3;
                        case 3:
                            if (!(_a < patterns_1.length)) return [3 /*break*/, 9];
                            pattern = patterns_1[_a];
                            subPath = path.join(folderPath, "".concat(pattern).concat(ext));
                            _c.label = 4;
                        case 4:
                            _c.trys.push([4, 7, , 8]);
                            return [4 /*yield*/, fs.promises.access(subPath)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, fs.promises.readFile(subPath, 'utf-8')];
                        case 6:
                            content = _c.sent();
                            mimeType = this.getMimeType(subPath);
                            return [2 /*return*/, { content: content, mimeType: mimeType }];
                        case 7:
                            _b = _c.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            _a++;
                            return [3 /*break*/, 3];
                        case 9:
                            _i++;
                            return [3 /*break*/, 2];
                        case 10: return [2 /*return*/, null];
                    }
                });
            });
        };
        PlayerEngineService_1.prototype.getAudioTracks = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, [
                            { language: 'it', label: 'Italiano' },
                            { language: 'en', label: 'Inglese' },
                            { language: 'original', label: 'Originale' },
                        ]];
                });
            });
        };
        // ============================================================
        // 🔥 NAVIGAZIONE EPISODI (precedente / successivo)
        // ============================================================
        /**
         * Dato un episodio, restituisce l'episodio precedente e successivo
         * all'interno della stessa serie, ordinati per (seasonNumber, episodeNumber).
         * Funziona anche attraverso i confini di stagione.
         */
        PlayerEngineService_1.prototype.getEpisodeNavigation = function (mediaId) {
            return __awaiter(this, void 0, void 0, function () {
                var media, episodes, currentIndex, seriesTitle, mapEpisode;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.media.findUnique({
                                where: { id: mediaId },
                                include: { season: true, series: true },
                            })];
                        case 1:
                            media = _c.sent();
                            // Se non è un episodio, o non appartiene a una serie → nessuna navigazione
                            if (!media || media.type !== 'EPISODE' || !media.seriesId) {
                                return [2 /*return*/, { previous: null, next: null }];
                            }
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    where: { seriesId: media.seriesId, type: 'EPISODE' },
                                    include: { season: true },
                                })];
                        case 2:
                            episodes = _c.sent();
                            // Ordina per stagione, poi per numero episodio (gestendo i null)
                            episodes.sort(function (a, b) {
                                var _a, _b, _c, _d, _e, _f;
                                var sa = (_b = (_a = a.season) === null || _a === void 0 ? void 0 : _a.seasonNumber) !== null && _b !== void 0 ? _b : 0;
                                var sb = (_d = (_c = b.season) === null || _c === void 0 ? void 0 : _c.seasonNumber) !== null && _d !== void 0 ? _d : 0;
                                if (sa !== sb)
                                    return sa - sb;
                                return ((_e = a.episodeNumber) !== null && _e !== void 0 ? _e : 0) - ((_f = b.episodeNumber) !== null && _f !== void 0 ? _f : 0);
                            });
                            currentIndex = episodes.findIndex(function (e) { return e.id === mediaId; });
                            if (currentIndex === -1) {
                                return [2 /*return*/, { previous: null, next: null }];
                            }
                            seriesTitle = (_b = (_a = media.series) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : null;
                            mapEpisode = function (ep) {
                                var _a, _b, _c, _d, _e;
                                return ({
                                    id: ep.id,
                                    title: ep.title,
                                    originalTitle: (_a = ep.originalTitle) !== null && _a !== void 0 ? _a : null,
                                    episodeNumber: (_b = ep.episodeNumber) !== null && _b !== void 0 ? _b : null,
                                    seasonNumber: (_d = (_c = ep.season) === null || _c === void 0 ? void 0 : _c.seasonNumber) !== null && _d !== void 0 ? _d : null,
                                    seasonId: (_e = ep.seasonId) !== null && _e !== void 0 ? _e : null,
                                    seriesTitle: seriesTitle,
                                });
                            };
                            return [2 /*return*/, {
                                    previous: currentIndex > 0 ? mapEpisode(episodes[currentIndex - 1]) : null,
                                    next: currentIndex < episodes.length - 1
                                        ? mapEpisode(episodes[currentIndex + 1])
                                        : null,
                                }];
                    }
                });
            });
        };
        return PlayerEngineService_1;
    }());
    __setFunctionName(_classThis, "PlayerEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlayerEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlayerEngineService = _classThis;
}();
exports.PlayerEngineService = PlayerEngineService;
