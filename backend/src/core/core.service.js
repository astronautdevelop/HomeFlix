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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
var common_1 = require("@nestjs/common");
var path = require("path"); // 🔥 AGGIUNTO
var CoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CoreService = _classThis = /** @class */ (function () {
        function CoreService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(CoreService.name);
            this.hasNotifiedMissingApiKey = false;
            this.tmdbApiKeyCache = this.configService.get('TMDB_API_KEY');
            var roots = this.configService.get('MEDIA_ROOTS');
            if (roots) {
                try {
                    this.mediaRootsCache = JSON.parse(roots);
                }
                catch (_a) {
                    this.mediaRootsCache = roots.split(',').map(function (p) { return p.trim(); });
                }
            }
            else {
                this.mediaRootsCache = [];
            }
        }
        CoreService_1.prototype.getTmdbApiKey = function () {
            return this.tmdbApiKeyCache;
        };
        CoreService_1.prototype.getMediaRoots = function () {
            return this.mediaRootsCache || [];
        };
        CoreService_1.prototype.getTmdbApiKeyFromEnv = function () {
            return this.configService.get('TMDB_API_KEY');
        };
        CoreService_1.prototype.getMediaRootsFromEnv = function () {
            var roots = this.configService.get('MEDIA_ROOTS');
            if (!roots)
                return [];
            try {
                return JSON.parse(roots);
            }
            catch (_a) {
                return roots.split(',').map(function (p) { return p.trim(); });
            }
        };
        CoreService_1.prototype.setTmdbApiKey = function (key) {
            this.tmdbApiKeyCache = key;
        };
        CoreService_1.prototype.setMediaRoots = function (roots) {
            this.mediaRootsCache = roots;
        };
        // ---------- METODI ESISTENTI ----------
        CoreService_1.prototype.getCachePath = function () {
            return this.configService.get('CACHE_PATH') || '.homeflix/cache';
        };
        // 🔥 NUOVI METODI — Cache centralizzata immagini media (path assoluti)
        CoreService_1.prototype.getMediaPosterCachePath = function () {
            return path.resolve(this.getCachePath(), 'media', 'poster');
        };
        CoreService_1.prototype.getMediaBackgroundCachePath = function () {
            return path.resolve(this.getCachePath(), 'media', 'background');
        };
        // ---------- LOGGING ROBUSTO ----------
        CoreService_1.prototype.log = function (message) {
            var _a;
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            var msg = message !== null && message !== void 0 ? message : '';
            if (optionalParams && optionalParams.length > 0) {
                var filtered = optionalParams.filter(function (p) { return p !== undefined; });
                if (filtered.length > 0) {
                    (_a = this.logger).log.apply(_a, __spreadArray([msg], filtered, false));
                }
                else {
                    this.logger.log(msg);
                }
            }
            else {
                this.logger.log(msg);
            }
        };
        CoreService_1.prototype.error = function (message, trace) {
            var _a, _b;
            var optionalParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                optionalParams[_i - 2] = arguments[_i];
            }
            var msg = message !== null && message !== void 0 ? message : '';
            if (trace) {
                var extra = optionalParams.filter(function (p) { return p !== undefined; });
                if (extra.length > 0) {
                    (_a = this.logger).error.apply(_a, __spreadArray([msg, trace], extra, false));
                }
                else {
                    this.logger.error(msg, trace);
                }
            }
            else {
                var extra = optionalParams.filter(function (p) { return p !== undefined; });
                if (extra.length > 0) {
                    (_b = this.logger).error.apply(_b, __spreadArray([msg], extra, false));
                }
                else {
                    this.logger.error(msg);
                }
            }
        };
        CoreService_1.prototype.warn = function (message) {
            var _a;
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            var msg = message !== null && message !== void 0 ? message : '';
            if (optionalParams && optionalParams.length > 0) {
                var filtered = optionalParams.filter(function (p) { return p !== undefined; });
                if (filtered.length > 0) {
                    (_a = this.logger).warn.apply(_a, __spreadArray([msg], filtered, false));
                }
                else {
                    this.logger.warn(msg);
                }
            }
            else {
                this.logger.warn(msg);
            }
        };
        CoreService_1.prototype.debug = function (message) {
            var _a;
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            var msg = message !== null && message !== void 0 ? message : '';
            if (optionalParams && optionalParams.length > 0) {
                var filtered = optionalParams.filter(function (p) { return p !== undefined; });
                if (filtered.length > 0) {
                    (_a = this.logger).debug.apply(_a, __spreadArray([msg], filtered, false));
                }
                else {
                    this.logger.debug(msg);
                }
            }
            else {
                this.logger.debug(msg);
            }
        };
        // ---------- WARNING API MANCANTE (dedup) ----------
        CoreService_1.prototype.hasNotifiedMissingApiKeyAlready = function () {
            return this.hasNotifiedMissingApiKey;
        };
        CoreService_1.prototype.markMissingApiKeyNotified = function () {
            this.hasNotifiedMissingApiKey = true;
        };
        CoreService_1.prototype.resetMissingApiKeyNotification = function () {
            this.hasNotifiedMissingApiKey = false;
        };
        return CoreService_1;
    }());
    __setFunctionName(_classThis, "CoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CoreService = _classThis;
}();
exports.CoreService = CoreService;
