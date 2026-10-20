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
exports.MediaScannerService = void 0;
var common_1 = require("@nestjs/common");
var path = require("path");
var crypto = require("crypto");
var fs = require("fs/promises");
var MediaScannerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MediaScannerService = _classThis = /** @class */ (function () {
        function MediaScannerService_1(prisma, storageManager, coreService, notificationService, notificationGateway, metadataManager) {
            this.prisma = prisma;
            this.storageManager = storageManager;
            this.coreService = coreService;
            this.notificationService = notificationService;
            this.notificationGateway = notificationGateway;
            this.metadataManager = metadataManager;
            this.VIDEO_EXTENSIONS = new Set([
                '.mkv', '.mp4', '.avi', '.mov', '.m4v', '.webm',
            ]);
            this.QUALITY_PATTERNS = {
                '4k': '4K',
                '2160p': '4K',
                'uhd': '4K',
                '2160': '4K',
                '1080p': 'Full HD',
                '1080': 'Full HD',
                'fhd': 'Full HD',
                'bluray': 'Full HD',
                'blu-ray': 'Full HD',
                'bd': 'Full HD',
                'brrip': 'Full HD',
                '720p': 'HD',
                '720': 'HD',
                'hd': 'HD',
                'dvd': 'DVD',
                '480p': 'SD',
                '480': 'SD',
                'sd': 'SD',
            };
            this.SEASON_EPISODE_PATTERNS = [
                /[Ss](\d+)[Ee](\d+)/,
                /(\d+)x(\d+)/,
                /Episode\s*(\d+)/i,
            ];
            // 🔥 Flag in-memory per sapere se una scansione è in corso
            this.isScanning = false;
        }
        // 🔥 Getter per esporre lo stato al controller
        MediaScannerService_1.prototype.getIsScanning = function () {
            return this.isScanning;
        };
        // ================================
        // SCANSIONE PRINCIPALE
        // ================================
        MediaScannerService_1.prototype.scanAllDevices = function () {
            return __awaiter(this, void 0, void 0, function () {
                var totalResult, encounteredMediaIds, missingMetadataCount, addedTitles, updatedTitles, devices, _i, devices_1, device, result, error_1, msg;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // 🛡️ Evita scansioni concorrenti
                            if (this.isScanning) {
                                this.coreService.log('⚠️ Scansione già in corso, richiesta ignorata');
                                throw new Error('Scansione già in corso');
                            }
                            this.isScanning = true;
                            // 🔔 Notifica WebSocket: scansione avviata
                            this.notificationGateway.emitScanStarted({
                                startedAt: new Date().toISOString(),
                            });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 22, 23]);
                            totalResult = {
                                added: 0,
                                removed: 0,
                                updated: 0,
                                errors: [],
                            };
                            encounteredMediaIds = new Set();
                            missingMetadataCount = 0;
                            addedTitles = [];
                            updatedTitles = [];
                            devices = this.storageManager.getAvailableDevices();
                            this.coreService.log("\uD83D\uDD04 Scansione avviata su ".concat(devices.length, " dispositivi"));
                            if (!(devices.length === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.notificationService.notify('warning', 'Nessun percorso media configurato. Vai in Impostazioni per aggiungere i dischi.', { reason: 'no_media_roots' })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, totalResult];
                        case 3:
                            _i = 0, devices_1 = devices;
                            _b.label = 4;
                        case 4:
                            if (!(_i < devices_1.length)) return [3 /*break*/, 10];
                            device = devices_1[_i];
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, 7, , 9]);
                            this.coreService.log("\uD83D\uDCC1 Scansione di ".concat(device.path));
                            return [4 /*yield*/, this.scanDirectoryRecursive(device.path, false, encounteredMediaIds, addedTitles, updatedTitles)];
                        case 6:
                            result = _b.sent();
                            totalResult.added += result.added;
                            totalResult.removed += result.removed;
                            totalResult.updated += result.updated;
                            (_a = totalResult.errors).push.apply(_a, result.errors);
                            return [3 /*break*/, 9];
                        case 7:
                            error_1 = _b.sent();
                            msg = "\u274C Errore critico su ".concat(device.path, ": ").concat(error_1.message);
                            totalResult.errors.push(msg);
                            return [4 /*yield*/, this.notificationService.notify('error', msg, { device: device.path, error: error_1.stack })];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 9:
                            _i++;
                            return [3 /*break*/, 4];
                        case 10: return [4 /*yield*/, this.updateUnavailableMedia(encounteredMediaIds)];
                        case 11:
                            _b.sent();
                            if (!(totalResult.added > 0)) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.prisma.media.count({
                                    where: { metadataSource: 'default' },
                                })];
                        case 12:
                            missingMetadataCount = _b.sent();
                            _b.label = 13;
                        case 13: return [4 /*yield*/, this.notificationService.notify('success', "Scansione completata: ".concat(totalResult.added, " nuovi, ").concat(totalResult.updated, " aggiornati"), {
                                added: totalResult.added,
                                updated: totalResult.updated,
                                errors: totalResult.errors.length,
                            })];
                        case 14:
                            _b.sent();
                            if (!(addedTitles.length > 0 || updatedTitles.length > 0)) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.notificationService.notify('detail', 'Film scansionati', {
                                    added: addedTitles,
                                    updated: updatedTitles,
                                })];
                        case 15:
                            _b.sent();
                            _b.label = 16;
                        case 16:
                            if (!(missingMetadataCount > 0)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.notificationService.notify('warning', "".concat(missingMetadataCount, " media senza metadati TMDB"), { count: missingMetadataCount })];
                        case 17:
                            _b.sent();
                            _b.label = 18;
                        case 18:
                            if (!(totalResult.errors.length > 0)) return [3 /*break*/, 20];
                            return [4 /*yield*/, this.notificationService.notify('warning', "Scansione con ".concat(totalResult.errors.length, " errori"), { errors: totalResult.errors.length })];
                        case 19:
                            _b.sent();
                            _b.label = 20;
                        case 20:
                            this.notificationGateway.emitScanCompleted({
                                added: totalResult.added,
                                removed: totalResult.removed,
                                updated: totalResult.updated,
                                errors: totalResult.errors.length,
                            });
                            return [4 /*yield*/, this.prisma.scanLog.create({
                                    data: {
                                        status: totalResult.errors.length > 0 ? 'failed' : 'completed',
                                        details: {
                                            added: totalResult.added,
                                            removed: totalResult.removed,
                                            updated: totalResult.updated,
                                            errors: totalResult.errors.length,
                                        },
                                        type: 'full',
                                    },
                                })];
                        case 21:
                            _b.sent();
                            this.coreService.log("\u2705 Scansione completata: ".concat(totalResult.added, " aggiunti, ").concat(totalResult.updated, " aggiornati"));
                            return [2 /*return*/, totalResult];
                        case 22:
                            // 🔓 Rilascia il flag in qualsiasi caso (successo, errore, early return)
                            this.isScanning = false;
                            return [7 /*endfinally*/];
                        case 23: return [2 /*return*/];
                    }
                });
            });
        };
        // ================================
        // AGGIORNAMENTO MEDIA NON DISPONIBILI
        // ================================
        MediaScannerService_1.prototype.updateUnavailableMedia = function (encounteredIds) {
            return __awaiter(this, void 0, void 0, function () {
                var allMedia, toUpdate, err_1, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.prisma.media.findMany({
                                    select: { id: true, available: true },
                                })];
                        case 1:
                            allMedia = _a.sent();
                            toUpdate = allMedia.filter(function (m) { return !encounteredIds.has(m.id) && m.available !== false; });
                            if (toUpdate.length === 0) {
                                this.coreService.log('✅ Tutti i media sono stati incontrati, nessun aggiornamento necessario');
                                return [2 /*return*/];
                            }
                            this.coreService.log("\uD83D\uDD34 ".concat(toUpdate.length, " media non trovati, verranno marcati come non disponibili"));
                            return [4 /*yield*/, this.prisma.$transaction(toUpdate.map(function (m) {
                                    return _this.prisma.media.update({
                                        where: { id: m.id },
                                        data: { available: false },
                                    });
                                }))];
                        case 2:
                            _a.sent();
                            this.coreService.log("\u2705 ".concat(toUpdate.length, " media marcati come non disponibili"));
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.notificationService.notify('warning', "".concat(toUpdate.length, " media non pi\u00F9 disponibili (dischi scollegati?)"), { count: toUpdate.length, unavailable: toUpdate.length })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            this.coreService.error('Errore invio notifica dischi scollegati', err_1 === null || err_1 === void 0 ? void 0 : err_1.stack);
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_2 = _a.sent();
                            this.coreService.error('❌ Errore durante l\'aggiornamento dei media non disponibili', error_2.stack);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        // ================================
        // SCANSIONE RICORSIVA
        // ================================
        MediaScannerService_1.prototype.scanDirectoryRecursive = function (dirPath_1) {
            return __awaiter(this, arguments, void 0, function (dirPath, isPersonalRoot, encounteredIds, addedTitles, updatedTitles) {
                var result, entries, files, folders, _i, entries_1, entry, fullPath, stat, videoFiles, subResult, _a, folders_1, folder, subPath, subResult, error_3;
                var _b, _c;
                var _this = this;
                if (isPersonalRoot === void 0) { isPersonalRoot = false; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            result = {
                                added: 0,
                                removed: 0,
                                updated: 0,
                                errors: [],
                            };
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 13, , 14]);
                            return [4 /*yield*/, this.storageManager.listDirectory(dirPath)];
                        case 2:
                            entries = _d.sent();
                            files = [];
                            folders = [];
                            _i = 0, entries_1 = entries;
                            _d.label = 3;
                        case 3:
                            if (!(_i < entries_1.length)) return [3 /*break*/, 6];
                            entry = entries_1[_i];
                            fullPath = path.join(dirPath, entry);
                            return [4 /*yield*/, this.storageManager.getFileStats(fullPath)];
                        case 4:
                            stat = _d.sent();
                            if (stat && stat.isDirectory()) {
                                folders.push(entry);
                            }
                            else {
                                files.push(entry);
                            }
                            _d.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            videoFiles = files.filter(function (f) { return _this.isVideoFile(f); });
                            if (!(videoFiles.length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.processMediaFolder(dirPath, videoFiles, isPersonalRoot, encounteredIds, addedTitles, updatedTitles)];
                        case 7:
                            subResult = _d.sent();
                            result.added += subResult.added;
                            result.updated += subResult.updated;
                            (_b = result.errors).push.apply(_b, subResult.errors);
                            _d.label = 8;
                        case 8:
                            _a = 0, folders_1 = folders;
                            _d.label = 9;
                        case 9:
                            if (!(_a < folders_1.length)) return [3 /*break*/, 12];
                            folder = folders_1[_a];
                            subPath = path.join(dirPath, folder);
                            return [4 /*yield*/, this.scanDirectoryRecursive(subPath, isPersonalRoot, encounteredIds, addedTitles, updatedTitles)];
                        case 10:
                            subResult = _d.sent();
                            result.added += subResult.added;
                            result.removed += subResult.removed;
                            result.updated += subResult.updated;
                            (_c = result.errors).push.apply(_c, subResult.errors);
                            _d.label = 11;
                        case 11:
                            _a++;
                            return [3 /*break*/, 9];
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            error_3 = _d.sent();
                            result.errors.push("\u274C Errore scansione ".concat(dirPath, ": ").concat(error_3.message));
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/, result];
                    }
                });
            });
        };
        // ================================
        // ELABORAZIONE DI UNA CARTELLA MEDIA
        // ================================
        MediaScannerService_1.prototype.processMediaFolder = function (folderPath, videoFiles, isPersonalRoot, encounteredIds, addedTitles, updatedTitles) {
            return __awaiter(this, void 0, void 0, function () {
                var result, isSingleMovie, _loop_1, this_1, _i, videoFiles_1, filename;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = { added: 0, updated: 0, errors: [] };
                            isSingleMovie = videoFiles.length === 1;
                            _loop_1 = function (filename) {
                                var filePath, stats, hash, quality_1, mediaType, seasonNumber, episodeNumber, seriesTitle, isEpisodePattern, folderName, cleanFolderName, info, seriesTitleFromFile, parentDir, cleanTitle, folderName, existingMedia, existingVersion, seriesId, series, newMedia, season, metadataError_1, error_4;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 28, , 29]);
                                            filePath = path.join(folderPath, filename);
                                            return [4 /*yield*/, this_1.storageManager.getFileStats(filePath)];
                                        case 1:
                                            stats = _b.sent();
                                            if (!stats || !stats.isFile())
                                                return [2 /*return*/, "continue"];
                                            return [4 /*yield*/, this_1.computeFileHash(filePath)];
                                        case 2:
                                            hash = _b.sent();
                                            quality_1 = this_1.extractQuality(filename);
                                            mediaType = this_1.determineMediaType(filename);
                                            seasonNumber = void 0;
                                            episodeNumber = void 0;
                                            seriesTitle = void 0;
                                            isEpisodePattern = this_1.isSeriesFile(filename);
                                            if (isSingleMovie && !isEpisodePattern) {
                                                mediaType = 'MOVIE';
                                                folderName = path.basename(folderPath);
                                                cleanFolderName = this_1.normalizeName(folderName);
                                            }
                                            else if (mediaType === 'EPISODE') {
                                                info = this_1.parseSeriesInfo(filename);
                                                if (info) {
                                                    seasonNumber = info.season;
                                                    episodeNumber = info.episode;
                                                }
                                                seriesTitleFromFile = this_1.extractSeriesTitleFromFilename(filename);
                                                if (seriesTitleFromFile) {
                                                    seriesTitle = seriesTitleFromFile;
                                                }
                                                else {
                                                    parentDir = path.basename(path.dirname(filePath));
                                                    seriesTitle = this_1.normalizeName(parentDir);
                                                }
                                            }
                                            cleanTitle = this_1.extractCleanTitle(filename);
                                            if (mediaType === 'MOVIE' &&
                                                (cleanTitle === 'Untitled' ||
                                                    cleanTitle.toLowerCase() === 'video' ||
                                                    cleanTitle.toLowerCase() === 'movie')) {
                                                folderName = path.basename(folderPath);
                                                cleanTitle = this_1.normalizeName(folderName);
                                            }
                                            this_1.coreService.log("\uD83D\uDCC1 [".concat(folderPath, "] Tipo: ").concat(mediaType, ", Titolo: \"").concat(cleanTitle, "\""));
                                            return [4 /*yield*/, this_1.prisma.media.findUnique({
                                                    where: { hash: hash },
                                                    include: { versions: true },
                                                })];
                                        case 3:
                                            existingMedia = _b.sent();
                                            if (!existingMedia) return [3 /*break*/, 12];
                                            encounteredIds.add(existingMedia.id);
                                            if (!(existingMedia.available === false)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, this_1.prisma.media.update({
                                                    where: { id: existingMedia.id },
                                                    data: { available: true },
                                                })];
                                        case 4:
                                            _b.sent();
                                            this_1.coreService.log("\u267B\uFE0F Media ".concat(existingMedia.title, " ripristinato come disponibile"));
                                            _b.label = 5;
                                        case 5:
                                            this_1.coreService.log("\uD83D\uDD04 Media esistente: ".concat(existingMedia.title, " (").concat(existingMedia.id, ")"));
                                            existingVersion = existingMedia.versions.find(function (v) { return v.quality === quality_1; });
                                            if (!existingVersion) return [3 /*break*/, 9];
                                            if (!(existingVersion.lastModified !== stats.mtime)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this_1.prisma.mediaVersion.update({
                                                    where: { id: existingVersion.id },
                                                    data: {
                                                        filePath: filePath,
                                                        size: stats.size,
                                                        lastModified: stats.mtime,
                                                    },
                                                })];
                                        case 6:
                                            _b.sent();
                                            if (!updatedTitles.includes(existingMedia.title)) {
                                                updatedTitles.push(existingMedia.title);
                                            }
                                            result.updated++;
                                            this_1.coreService.log("\uD83D\uDD04 Versione aggiornata per ".concat(filename));
                                            return [3 /*break*/, 8];
                                        case 7:
                                            this_1.coreService.log("\u23ED\uFE0F Versione gi\u00E0 aggiornata per ".concat(filename));
                                            _b.label = 8;
                                        case 8: return [3 /*break*/, 11];
                                        case 9: return [4 /*yield*/, this_1.prisma.mediaVersion.create({
                                                data: {
                                                    mediaId: existingMedia.id,
                                                    quality: quality_1,
                                                    filePath: filePath,
                                                    size: stats.size,
                                                    lastModified: stats.mtime,
                                                },
                                            })];
                                        case 10:
                                            _b.sent();
                                            if (!updatedTitles.includes(existingMedia.title)) {
                                                updatedTitles.push(existingMedia.title);
                                            }
                                            result.added++;
                                            this_1.coreService.log("\u2795 Nuova versione aggiunta per ".concat(filename, " (").concat(quality_1, ")"));
                                            _b.label = 11;
                                        case 11: return [3 /*break*/, 27];
                                        case 12:
                                            this_1.coreService.log("\uD83C\uDD95 Nuovo media: ".concat(cleanTitle));
                                            seriesId = void 0;
                                            if (!(mediaType === 'EPISODE' && seriesTitle)) return [3 /*break*/, 16];
                                            return [4 /*yield*/, this_1.prisma.series.findFirst({
                                                    where: { title: seriesTitle },
                                                })];
                                        case 13:
                                            series = _b.sent();
                                            if (!!series) return [3 /*break*/, 15];
                                            return [4 /*yield*/, this_1.prisma.series.create({
                                                    data: {
                                                        title: seriesTitle,
                                                        metadataSource: 'default',
                                                    },
                                                })];
                                        case 14:
                                            series = _b.sent();
                                            this_1.coreService.log("\uD83D\uDCFA Serie creata: ".concat(seriesTitle));
                                            _b.label = 15;
                                        case 15:
                                            seriesId = series.id;
                                            _b.label = 16;
                                        case 16: return [4 /*yield*/, this_1.prisma.media.create({
                                                data: {
                                                    hash: hash,
                                                    title: cleanTitle,
                                                    type: mediaType,
                                                    seriesId: seriesId || null,
                                                    episodeNumber: episodeNumber || null,
                                                    metadataSource: isPersonalRoot ? 'local' : 'default',
                                                    folderPath: folderPath,
                                                    available: true,
                                                },
                                            })];
                                        case 17:
                                            newMedia = _b.sent();
                                            encounteredIds.add(newMedia.id);
                                            if (!(mediaType === 'EPISODE' && seriesId && seasonNumber !== undefined)) return [3 /*break*/, 22];
                                            return [4 /*yield*/, this_1.prisma.season.findFirst({
                                                    where: {
                                                        seriesId: seriesId,
                                                        seasonNumber: seasonNumber,
                                                    },
                                                })];
                                        case 18:
                                            season = _b.sent();
                                            if (!!season) return [3 /*break*/, 20];
                                            return [4 /*yield*/, this_1.prisma.season.create({
                                                    data: {
                                                        seriesId: seriesId,
                                                        seasonNumber: seasonNumber,
                                                    },
                                                })];
                                        case 19:
                                            season = _b.sent();
                                            _b.label = 20;
                                        case 20: return [4 /*yield*/, this_1.prisma.media.update({
                                                where: { id: newMedia.id },
                                                data: { seasonId: season.id },
                                            })];
                                        case 21:
                                            _b.sent();
                                            _b.label = 22;
                                        case 22: return [4 /*yield*/, this_1.prisma.mediaVersion.create({
                                                data: {
                                                    mediaId: newMedia.id,
                                                    quality: quality_1,
                                                    filePath: filePath,
                                                    size: stats.size,
                                                    lastModified: stats.mtime,
                                                },
                                            })];
                                        case 23:
                                            _b.sent();
                                            if (!addedTitles.includes(cleanTitle)) {
                                                addedTitles.push(cleanTitle);
                                            }
                                            result.added++;
                                            this_1.coreService.log("\u2705 Nuovo media creato: ".concat(cleanTitle, " (ID: ").concat(newMedia.id, ")"));
                                            _b.label = 24;
                                        case 24:
                                            _b.trys.push([24, 26, , 27]);
                                            this_1.coreService.log("\uD83D\uDCE1 Avvio aggiornamento metadati per \"".concat(cleanTitle, "\"..."));
                                            return [4 /*yield*/, this_1.metadataManager.updateMetadataForMedia(newMedia.id)];
                                        case 25:
                                            _b.sent();
                                            return [3 /*break*/, 27];
                                        case 26:
                                            metadataError_1 = _b.sent();
                                            this_1.coreService.error("\u274C Errore metadati per ".concat(cleanTitle), metadataError_1.message);
                                            result.errors.push("Errore metadati per ".concat(cleanTitle, ": ").concat(metadataError_1.message));
                                            return [3 /*break*/, 27];
                                        case 27: return [3 /*break*/, 29];
                                        case 28:
                                            error_4 = _b.sent();
                                            result.errors.push("\u274C Errore su ".concat(filename, ": ").concat(error_4.message));
                                            this_1.coreService.error("\u274C Errore scansione ".concat(filename), error_4.stack);
                                            return [3 /*break*/, 29];
                                        case 29: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, videoFiles_1 = videoFiles;
                            _a.label = 1;
                        case 1:
                            if (!(_i < videoFiles_1.length)) return [3 /*break*/, 4];
                            filename = videoFiles_1[_i];
                            return [5 /*yield**/, _loop_1(filename)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, result];
                    }
                });
            });
        };
        // ================================
        // METODI DI RICONOSCIMENTO
        // ================================
        MediaScannerService_1.prototype.isVideoFile = function (filename) {
            var ext = path.extname(filename).toLowerCase();
            return this.VIDEO_EXTENSIONS.has(ext);
        };
        MediaScannerService_1.prototype.extractQuality = function (filename) {
            var lower = filename.toLowerCase();
            for (var _i = 0, _a = Object.entries(this.QUALITY_PATTERNS); _i < _a.length; _i++) {
                var _b = _a[_i], pattern = _b[0], quality = _b[1];
                if (lower.includes(pattern))
                    return quality;
            }
            return 'SD';
        };
        MediaScannerService_1.prototype.parseSeriesInfo = function (filename) {
            for (var _i = 0, _a = this.SEASON_EPISODE_PATTERNS; _i < _a.length; _i++) {
                var pattern = _a[_i];
                var match = filename.match(pattern);
                if (match) {
                    var season = parseInt(match[1]);
                    var episode = parseInt(match[2]);
                    if (!isNaN(season) && !isNaN(episode)) {
                        return { season: season, episode: episode };
                    }
                }
            }
            return null;
        };
        MediaScannerService_1.prototype.isSeriesFile = function (filename) {
            return this.parseSeriesInfo(filename) !== null;
        };
        MediaScannerService_1.prototype.determineMediaType = function (filename) {
            if (this.isSeriesFile(filename))
                return 'EPISODE';
            return 'MOVIE';
        };
        MediaScannerService_1.prototype.normalizeName = function (name) {
            return name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().replace(/\s+/g, ' ');
        };
        MediaScannerService_1.prototype.extractCleanTitle = function (filename) {
            var title = path.basename(filename, path.extname(filename));
            title = title.replace(/\((\d{4})\)/, '');
            for (var _i = 0, _a = Object.keys(this.QUALITY_PATTERNS); _i < _a.length; _i++) {
                var pattern = _a[_i];
                title = title.replace(new RegExp(pattern, 'gi'), '');
            }
            for (var _b = 0, _c = this.SEASON_EPISODE_PATTERNS; _b < _c.length; _b++) {
                var pattern = _c[_b];
                title = title.replace(pattern, '');
            }
            title = title.replace(/[_.-]/g, ' ').trim().replace(/\s+/g, ' ');
            title = title.replace(/[^a-zA-Z0-9\s]/g, '');
            return title || 'Untitled';
        };
        MediaScannerService_1.prototype.computeFileHash = function (filePath) {
            return __awaiter(this, void 0, void 0, function () {
                var fileHandle, buffer, bytesRead, hash, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, fs.open(filePath, 'r')];
                        case 1:
                            fileHandle = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, , 4, 6]);
                            buffer = Buffer.alloc(1024 * 1024);
                            return [4 /*yield*/, fileHandle.read(buffer, 0, buffer.length, 0)];
                        case 3:
                            bytesRead = (_a.sent()).bytesRead;
                            hash = crypto.createHash('sha256').update(buffer.slice(0, bytesRead)).digest('hex');
                            return [2 /*return*/, hash];
                        case 4: return [4 /*yield*/, fileHandle.close()];
                        case 5:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_5 = _a.sent();
                            this.coreService.error("\u274C Errore calcolo hash per ".concat(filePath), error_5.message);
                            throw error_5;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        MediaScannerService_1.prototype.extractSeriesTitleFromFilename = function (filename) {
            var nameWithoutExt = path.basename(filename, path.extname(filename));
            for (var _i = 0, _a = this.SEASON_EPISODE_PATTERNS; _i < _a.length; _i++) {
                var pattern = _a[_i];
                var match = nameWithoutExt.match(pattern);
                if (match && match.index !== undefined && match.index > 0) {
                    var seriesPart = nameWithoutExt.substring(0, match.index);
                    seriesPart = seriesPart
                        .replace(/[._\-]+/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    if (seriesPart.length > 0) {
                        return seriesPart;
                    }
                }
            }
            return null;
        };
        return MediaScannerService_1;
    }());
    __setFunctionName(_classThis, "MediaScannerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediaScannerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediaScannerService = _classThis;
}();
exports.MediaScannerService = MediaScannerService;
