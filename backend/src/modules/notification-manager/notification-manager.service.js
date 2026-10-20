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
exports.NotificationManagerService = void 0;
var common_1 = require("@nestjs/common");
var NotificationManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationManagerService = _classThis = /** @class */ (function () {
        function NotificationManagerService_1(prisma, eventEmitter, gateway) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.gateway = gateway;
            this.logger = new common_1.Logger(NotificationManagerService.name);
            this.MAX_LOGS = 1000;
            this.TTL_DAYS = 7;
        }
        NotificationManagerService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cleanupOldLogs()];
                        case 1:
                            _a.sent();
                            setInterval(function () { return _this.cleanupOldLogs(); }, 24 * 60 * 60 * 1000);
                            return [2 /*return*/];
                    }
                });
            });
        };
        NotificationManagerService_1.prototype.notify = function (type, message, details) {
            return __awaiter(this, void 0, void 0, function () {
                var notification, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notification = {
                                type: type,
                                message: message,
                                details: details,
                                createdAt: new Date(),
                                read: false,
                            };
                            return [4 /*yield*/, this.prisma.notificationLog.create({
                                    data: {
                                        type: notification.type,
                                        message: notification.message,
                                        details: notification.details || {},
                                        createdAt: notification.createdAt,
                                        read: notification.read,
                                        ttl: new Date(Date.now() + this.TTL_DAYS * 24 * 60 * 60 * 1000),
                                    },
                                })];
                        case 1:
                            saved = _a.sent();
                            notification.id = saved.id;
                            this.eventEmitter.emit('notification.new', notification);
                            this.gateway.broadcastNotification(notification);
                            this.logger.log("[".concat(type.toUpperCase(), "] ").concat(message));
                            return [4 /*yield*/, this.enforceMaxLogs()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, notification];
                    }
                });
            });
        };
        // CORREZIONE: mappiamo i campi del DB al tipo Notification
        NotificationManagerService_1.prototype.getRecentLogs = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var logs;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notificationLog.findMany({
                                orderBy: { createdAt: 'desc' },
                                take: limit,
                            })];
                        case 1:
                            logs = _a.sent();
                            return [2 /*return*/, logs.map(function (log) { return ({
                                    id: log.id,
                                    type: log.type, // cast al tipo corretto
                                    message: log.message,
                                    details: log.details,
                                    createdAt: log.createdAt,
                                    read: log.read,
                                }); })];
                    }
                });
            });
        };
        NotificationManagerService_1.prototype.markAsRead = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notificationLog.update({
                                where: { id: id },
                                data: { read: true },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        NotificationManagerService_1.prototype.markAllAsRead = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notificationLog.updateMany({
                                data: { read: true },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        NotificationManagerService_1.prototype.cleanupOldLogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cutoff = new Date(Date.now() - this.TTL_DAYS * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.notificationLog.deleteMany({
                                    where: {
                                        OR: [{ createdAt: { lt: cutoff } }, { ttl: { lt: new Date() } }],
                                    },
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log('Pulizia log vecchi completata');
                            return [2 /*return*/];
                    }
                });
            });
        };
        NotificationManagerService_1.prototype.enforceMaxLogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var count, toDelete, oldest, ids;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notificationLog.count()];
                        case 1:
                            count = _a.sent();
                            if (!(count > this.MAX_LOGS)) return [3 /*break*/, 4];
                            toDelete = count - this.MAX_LOGS;
                            return [4 /*yield*/, this.prisma.notificationLog.findMany({
                                    orderBy: { createdAt: 'asc' },
                                    take: toDelete,
                                    select: { id: true },
                                })];
                        case 2:
                            oldest = _a.sent();
                            ids = oldest.map(function (l) { return l.id; });
                            return [4 /*yield*/, this.prisma.notificationLog.deleteMany({
                                    where: { id: { in: ids } },
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Eliminati ".concat(toDelete, " log vecchi (limite ").concat(this.MAX_LOGS, ")"));
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return NotificationManagerService_1;
    }());
    __setFunctionName(_classThis, "NotificationManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationManagerService = _classThis;
}();
exports.NotificationManagerService = NotificationManagerService;
