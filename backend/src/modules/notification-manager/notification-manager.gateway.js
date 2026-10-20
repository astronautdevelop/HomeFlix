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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManagerGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var NotificationManagerGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            cors: {
                origin: '*',
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var NotificationManagerGateway = _classThis = /** @class */ (function () {
        function NotificationManagerGateway_1() {
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger(NotificationManagerGateway.name));
            this.clients = new Set();
        }
        // 🔥 Metodo per emettere eventi personalizzati
        NotificationManagerGateway_1.prototype.emitEvent = function (event, data) {
            this.server.emit(event, data);
        };
        // 🔥 Evento di inizio scansione
        NotificationManagerGateway_1.prototype.emitScanStarted = function (data) {
            this.server.emit('scan-started', data);
        };
        // 🔥 Evento di fine scansione
        NotificationManagerGateway_1.prototype.emitScanCompleted = function (data) {
            this.server.emit('scan-completed', data);
        };
        NotificationManagerGateway_1.prototype.handleConnection = function (client) {
            this.clients.add(client.id);
            this.logger.log("Client connesso: ".concat(client.id, " (").concat(this.clients.size, " connessi)"));
        };
        NotificationManagerGateway_1.prototype.handleDisconnect = function (client) {
            this.clients.delete(client.id);
            this.logger.log("Client disconnesso: ".concat(client.id, " (").concat(this.clients.size, " connessi)"));
        };
        NotificationManagerGateway_1.prototype.broadcastNotification = function (notification) {
            this.server.emit('notification', notification);
            this.logger.log("Notifica broadcast: ".concat(notification.message));
        };
        return NotificationManagerGateway_1;
    }());
    __setFunctionName(_classThis, "NotificationManagerGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationManagerGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationManagerGateway = _classThis;
}();
exports.NotificationManagerGateway = NotificationManagerGateway;
