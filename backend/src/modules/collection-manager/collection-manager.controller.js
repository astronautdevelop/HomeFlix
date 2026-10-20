"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionManagerController = void 0;
var common_1 = require("@nestjs/common");
var CollectionManagerController = function () {
    var _classDecorators = [(0, common_1.Controller)('collections')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getAllWithMedia_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _addMedia_decorators;
    var _removeMedia_decorators;
    var _updateOrder_decorators;
    var _getAvailableMedia_decorators;
    var CollectionManagerController = _classThis = /** @class */ (function () {
        function CollectionManagerController_1(collectionService) {
            this.collectionService = (__runInitializers(this, _instanceExtraInitializers), collectionService);
        }
        CollectionManagerController_1.prototype.create = function (dto) {
            return this.collectionService.create(null, dto);
        };
        CollectionManagerController_1.prototype.findAll = function () {
            return this.collectionService.findAll();
        };
        // 🔥 Route statiche PRIMA di quelle dinamiche (:id)
        CollectionManagerController_1.prototype.getAllWithMedia = function () {
            return this.collectionService.getCollectionsWithMedia();
        };
        CollectionManagerController_1.prototype.findOne = function (id) {
            return this.collectionService.findOne(id);
        };
        CollectionManagerController_1.prototype.update = function (id, dto) {
            return this.collectionService.update(id, dto);
        };
        CollectionManagerController_1.prototype.remove = function (id) {
            return this.collectionService.remove(id);
        };
        CollectionManagerController_1.prototype.addMedia = function (id, dto) {
            return this.collectionService.addMedia(id, dto);
        };
        CollectionManagerController_1.prototype.removeMedia = function (id, mediaId) {
            return this.collectionService.removeMedia(id, mediaId);
        };
        CollectionManagerController_1.prototype.updateOrder = function (id, dto) {
            return this.collectionService.updateOrder(id, dto);
        };
        CollectionManagerController_1.prototype.getAvailableMedia = function (id) {
            return this.collectionService.getMediaNotInCollection(id);
        };
        return CollectionManagerController_1;
    }());
    __setFunctionName(_classThis, "CollectionManagerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _findAll_decorators = [(0, common_1.Get)()];
        _getAllWithMedia_decorators = [(0, common_1.Get)('detailed/all')];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Put)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        _addMedia_decorators = [(0, common_1.Post)(':id/media'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _removeMedia_decorators = [(0, common_1.Delete)(':id/media/:mediaId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _updateOrder_decorators = [(0, common_1.Put)(':id/order'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _getAvailableMedia_decorators = [(0, common_1.Get)(':id/media/available')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllWithMedia_decorators, { kind: "method", name: "getAllWithMedia", static: false, private: false, access: { has: function (obj) { return "getAllWithMedia" in obj; }, get: function (obj) { return obj.getAllWithMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addMedia_decorators, { kind: "method", name: "addMedia", static: false, private: false, access: { has: function (obj) { return "addMedia" in obj; }, get: function (obj) { return obj.addMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeMedia_decorators, { kind: "method", name: "removeMedia", static: false, private: false, access: { has: function (obj) { return "removeMedia" in obj; }, get: function (obj) { return obj.removeMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateOrder_decorators, { kind: "method", name: "updateOrder", static: false, private: false, access: { has: function (obj) { return "updateOrder" in obj; }, get: function (obj) { return obj.updateOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAvailableMedia_decorators, { kind: "method", name: "getAvailableMedia", static: false, private: false, access: { has: function (obj) { return "getAvailableMedia" in obj; }, get: function (obj) { return obj.getAvailableMedia; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CollectionManagerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CollectionManagerController = _classThis;
}();
exports.CollectionManagerController = CollectionManagerController;
