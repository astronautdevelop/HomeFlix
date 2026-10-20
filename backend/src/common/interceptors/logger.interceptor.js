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
exports.LoggerInterceptor = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var LoggerInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LoggerInterceptor = _classThis = /** @class */ (function () {
        function LoggerInterceptor_1(notificationService) {
            this.notificationService = notificationService;
        }
        LoggerInterceptor_1.prototype.intercept = function (context, next) {
            var _this = this;
            var request = context.switchToHttp().getRequest();
            var method = request.method, url = request.url;
            var now = Date.now();
            return next.handle().pipe((0, operators_1.tap)({
                next: function (data) {
                    var response = context.switchToHttp().getResponse();
                    var statusCode = response.statusCode;
                    var duration = Date.now() - now;
                    // Log solo se non è una richiesta di health check o asset statici
                    if (!url.includes('/health') && !url.includes('/assets')) {
                        var message = "".concat(method, " ").concat(url, " \u2192 ").concat(statusCode, " (").concat(duration, "ms)");
                        if (statusCode >= 400) {
                            _this.notificationService.notify('error', message, { statusCode: statusCode, duration: duration });
                        }
                        else if (statusCode >= 300) {
                            _this.notificationService.notify('warning', message, { statusCode: statusCode, duration: duration });
                        }
                        else {
                            _this.notificationService.notify('info', message, { statusCode: statusCode, duration: duration });
                        }
                    }
                },
                error: function (error) {
                    var duration = Date.now() - now;
                    _this.notificationService.notify('error', "".concat(method, " ").concat(url, " \u2192 ").concat(error.message), {
                        duration: duration,
                        stack: error.stack,
                    });
                },
            }));
        };
        return LoggerInterceptor_1;
    }());
    __setFunctionName(_classThis, "LoggerInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoggerInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoggerInterceptor = _classThis;
}();
exports.LoggerInterceptor = LoggerInterceptor;
