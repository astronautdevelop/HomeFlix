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
exports.SettingsService = void 0;
var common_1 = require("@nestjs/common");
var SettingsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SettingsService = _classThis = /** @class */ (function () {
        function SettingsService_1(prisma, coreService, storageManager, notificationService) {
            this.prisma = prisma;
            this.coreService = coreService;
            this.storageManager = storageManager;
            this.notificationService = notificationService;
            this.cachedSettings = null;
        }
        SettingsService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadSettingsFromDb()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Carica le impostazioni dal DB. Se non esistono, le crea usando i valori di .env.
         *
         * 🟢 Regola di priorità chiave TMDB:
         *    - DB non vuoto  → usa DB (utente ha inserito la chiave manualmente)
         *    - DB vuoto      → fallback su .env
         */
        SettingsService_1.prototype.loadSettingsFromDb = function () {
            return __awaiter(this, void 0, void 0, function () {
                var setting, envKey, envRoots, value, dbKey, envKey, effectiveKey, dbRoots, envRoots, effectiveRoots, error_1;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.prisma.setting.findUnique({
                                    where: { key: 'app_settings' },
                                })];
                        case 1:
                            setting = _e.sent();
                            if (!!setting) return [3 /*break*/, 3];
                            envKey = (_a = this.coreService.getTmdbApiKeyFromEnv()) !== null && _a !== void 0 ? _a : null;
                            envRoots = (_b = this.coreService.getMediaRootsFromEnv()) !== null && _b !== void 0 ? _b : [];
                            value = {
                                tmdbApiKey: envKey,
                                mediaRoots: envRoots,
                            };
                            return [4 /*yield*/, this.prisma.setting.create({
                                    data: {
                                        key: 'app_settings',
                                        value: value,
                                    },
                                })];
                        case 2:
                            setting = _e.sent();
                            this.coreService.log('Settings inizializzati dal .env');
                            _e.label = 3;
                        case 3:
                            this.cachedSettings = setting.value;
                            if (this.cachedSettings) {
                                dbKey = this.cachedSettings.tmdbApiKey;
                                envKey = this.coreService.getTmdbApiKeyFromEnv();
                                effectiveKey = dbKey && dbKey.trim() !== '' ? dbKey : envKey;
                                this.coreService.setTmdbApiKey(effectiveKey !== null && effectiveKey !== void 0 ? effectiveKey : undefined);
                                this.cachedSettings.tmdbApiKey = effectiveKey !== null && effectiveKey !== void 0 ? effectiveKey : null;
                                // Log della fonte (utile per debug)
                                if (!effectiveKey) {
                                    this.coreService.warn('🔑 TMDB Key: MISSING (né DB né .env)');
                                }
                                else if (dbKey && dbKey.trim() !== '') {
                                    this.coreService.log('🔑 TMDB Key source: DB (Settings)');
                                }
                                else {
                                    this.coreService.log('🔑 TMDB Key source: ENV (.env)');
                                }
                                dbRoots = this.cachedSettings.mediaRoots;
                                envRoots = this.coreService.getMediaRootsFromEnv();
                                effectiveRoots = Array.isArray(dbRoots) && dbRoots.length > 0 ? dbRoots : envRoots;
                                this.coreService.setMediaRoots(effectiveRoots !== null && effectiveRoots !== void 0 ? effectiveRoots : []);
                                this.cachedSettings.mediaRoots = effectiveRoots !== null && effectiveRoots !== void 0 ? effectiveRoots : [];
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _e.sent();
                            this.coreService.error('Errore caricamento settings', error_1.stack);
                            // Fallback a .env
                            this.cachedSettings = {
                                tmdbApiKey: (_c = this.coreService.getTmdbApiKeyFromEnv()) !== null && _c !== void 0 ? _c : null,
                                mediaRoots: (_d = this.coreService.getMediaRootsFromEnv()) !== null && _d !== void 0 ? _d : [],
                            };
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Restituisce le impostazioni correnti (dalla cache).
         */
        SettingsService_1.prototype.getSettings = function () {
            if (!this.cachedSettings) {
                this.loadSettingsFromDb();
            }
            return this.cachedSettings || { tmdbApiKey: null, mediaRoots: [] };
        };
        /**
         * Aggiorna le impostazioni nel DB e nella cache.
         */
        SettingsService_1.prototype.updateSettings = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var current, previousRoots, newValue, dbKey, envKey, effectiveKey, removedRoots, label, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            current = this.getSettings();
                            previousRoots = current.mediaRoots || [];
                            newValue = {
                                tmdbApiKey: dto.tmdbApiKey !== undefined ? dto.tmdbApiKey : current.tmdbApiKey,
                                mediaRoots: dto.mediaRoots !== undefined ? dto.mediaRoots : current.mediaRoots,
                            };
                            return [4 /*yield*/, this.prisma.setting.upsert({
                                    where: { key: 'app_settings' },
                                    update: { value: newValue },
                                    create: { key: 'app_settings', value: newValue },
                                })];
                        case 1:
                            _a.sent();
                            this.cachedSettings = newValue;
                            // ----- TMDB API Key -----
                            if (dto.tmdbApiKey !== undefined) {
                                dbKey = dto.tmdbApiKey;
                                envKey = this.coreService.getTmdbApiKeyFromEnv();
                                effectiveKey = dbKey && dbKey.trim() !== '' ? dbKey : envKey;
                                this.coreService.setTmdbApiKey(effectiveKey !== null && effectiveKey !== void 0 ? effectiveKey : undefined);
                                this.cachedSettings.tmdbApiKey = effectiveKey !== null && effectiveKey !== void 0 ? effectiveKey : null;
                                if (effectiveKey) {
                                    this.coreService.resetMissingApiKeyNotification();
                                }
                            }
                            if (!(dto.mediaRoots !== undefined)) return [3 /*break*/, 6];
                            this.coreService.setMediaRoots(dto.mediaRoots);
                            return [4 /*yield*/, this.storageManager.refreshDevices()];
                        case 2:
                            _a.sent();
                            removedRoots = previousRoots.filter(function (root) { return !dto.mediaRoots.includes(root); });
                            if (!(removedRoots.length > 0)) return [3 /*break*/, 6];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            label = removedRoots.length === 1
                                ? "Disco rimosso: \"".concat(removedRoots[0], "\"")
                                : "".concat(removedRoots.length, " dischi rimossi");
                            return [4 /*yield*/, this.notificationService.notify('warning', label, {
                                    removedRoots: removedRoots,
                                    count: removedRoots.length,
                                })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            this.coreService.error('Errore invio notifica rimozione disco', err_1 === null || err_1 === void 0 ? void 0 : err_1.stack);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/, newValue];
                    }
                });
            });
        };
        /**
         * Recupera solo la chiave TMDB (comodo per MetadataManager)
         */
        SettingsService_1.prototype.getTmdbApiKey = function () {
            return this.getSettings().tmdbApiKey;
        };
        /**
         * Recupera i mediaRoots (comodo per StorageManager)
         */
        SettingsService_1.prototype.getMediaRoots = function () {
            return this.getSettings().mediaRoots || [];
        };
        return SettingsService_1;
    }());
    __setFunctionName(_classThis, "SettingsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SettingsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettingsService = _classThis;
}();
exports.SettingsService = SettingsService;
