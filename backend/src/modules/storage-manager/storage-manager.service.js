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
exports.StorageManagerService = void 0;
var common_1 = require("@nestjs/common");
var fs_1 = require("fs");
var path = require("path");
var diskusage = require("diskusage");
var StorageManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StorageManagerService = _classThis = /** @class */ (function () {
        function StorageManagerService_1(coreService) {
            this.coreService = coreService;
            this.devices = [];
        }
        StorageManagerService_1.prototype.onApplicationBootstrap = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refreshDevices()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StorageManagerService_1.prototype.refreshDevices = function () {
            return __awaiter(this, void 0, void 0, function () {
                var roots, _i, roots_1, root, stats, totalSpace, freeSpace, type, usage, drive, spaceError_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roots = this.coreService.getMediaRoots();
                            this.devices = [];
                            _i = 0, roots_1 = roots;
                            _a.label = 1;
                        case 1:
                            if (!(_i < roots_1.length)) return [3 /*break*/, 10];
                            root = roots_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            return [4 /*yield*/, fs_1.promises.stat(root)];
                        case 3:
                            stats = _a.sent();
                            if (!stats.isDirectory()) {
                                this.coreService.warn("Il percorso ".concat(root, " non \u00E8 una cartella valida"));
                                return [3 /*break*/, 9];
                            }
                            totalSpace = 0;
                            freeSpace = 0;
                            type = 'Cartella';
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, diskusage.check(root)];
                        case 5:
                            usage = _a.sent();
                            totalSpace = usage.total;
                            freeSpace = usage.free;
                            // Rilevazione tipo (semplificata)
                            // Puoi migliorare con logiche più raffinate
                            if (process.platform === 'win32') {
                                drive = root.charAt(0).toUpperCase();
                                // Potresti usare wmic o altri strumenti, ma per ora mettiamo 'HDD'
                                type = 'HDD';
                            }
                            else {
                                // Su Linux/Mac, controlla se è un mount point di rete
                                // (implementazione base)
                                type = 'Cartella';
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            spaceError_1 = _a.sent();
                            this.coreService.warn("Impossibile ottenere spazio per ".concat(root, ": ").concat(spaceError_1.message));
                            // Usa valori placeholder se fallisce
                            totalSpace = 1024 * 1024 * 1024 * 1024; // 1TB
                            freeSpace = 512 * 1024 * 1024 * 1024; // 512GB
                            return [3 /*break*/, 7];
                        case 7:
                            this.devices.push({
                                path: root,
                                isAvailable: true,
                                totalSpace: totalSpace,
                                freeSpace: freeSpace,
                                type: type,
                            });
                            return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            this.coreService.error("Errore nell'accesso a ".concat(root, ": ").concat(error_1.message), error_1.stack);
                            this.devices.push({
                                path: root,
                                isAvailable: false,
                                totalSpace: 0,
                                freeSpace: 0,
                                type: "Cartella",
                            });
                            return [3 /*break*/, 9];
                        case 9:
                            _i++;
                            return [3 /*break*/, 1];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        StorageManagerService_1.prototype.getDevices = function () {
            return this.devices;
        };
        StorageManagerService_1.prototype.getAvailableDevices = function () {
            return this.devices.filter(function (d) { return d.isAvailable; });
        };
        StorageManagerService_1.prototype.fileExists = function (filePath) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs_1.promises.access(filePath)];
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
        StorageManagerService_1.prototype.listDirectory = function (dirPath) {
            return __awaiter(this, void 0, void 0, function () {
                var entries, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs_1.promises.readdir(dirPath, { withFileTypes: true })];
                        case 1:
                            entries = _b.sent();
                            return [2 /*return*/, entries.map(function (entry) { return entry.name; })];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StorageManagerService_1.prototype.isDirectory = function (dirPath) {
            return __awaiter(this, void 0, void 0, function () {
                var stat, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs_1.promises.stat(dirPath)];
                        case 1:
                            stat = _b.sent();
                            return [2 /*return*/, stat.isDirectory()];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StorageManagerService_1.prototype.getFileStats = function (filePath) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs_1.promises.stat(filePath)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StorageManagerService_1.prototype.joinPath = function () {
            var parts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parts[_i] = arguments[_i];
            }
            return path.join.apply(path, parts);
        };
        return StorageManagerService_1;
    }());
    __setFunctionName(_classThis, "StorageManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StorageManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StorageManagerService = _classThis;
}();
exports.StorageManagerService = StorageManagerService;
