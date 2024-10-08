"use strict";
var _DataTransferUploadStill_stillIndex, _DataTransferUploadStill_name, _DataTransferUploadStill_description, _DataTransferUploadStill_dataLength;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DataTransfer_1 = require("../commands/DataTransfer");
const dataTransfer_1 = require("./dataTransfer");
const dataTransferUploadBuffer_1 = require("./dataTransferUploadBuffer");
class DataTransferUploadStill extends dataTransferUploadBuffer_1.DataTransferUploadBuffer {
    constructor(stillIndex, buffer, name, description) {
        super(buffer);
        _DataTransferUploadStill_stillIndex.set(this, void 0);
        _DataTransferUploadStill_name.set(this, void 0);
        _DataTransferUploadStill_description.set(this, void 0);
        _DataTransferUploadStill_dataLength.set(this, void 0);
        (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferUploadStill_stillIndex, stillIndex, "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferUploadStill_name, name, "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferUploadStill_description, description, "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferUploadStill_dataLength, buffer.rawDataLength, "f");
    }
    async startTransfer(transferId) {
        const command = new DataTransfer_1.DataTransferUploadRequestCommand({
            transferId: transferId,
            transferStoreId: 0,
            transferIndex: (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadStill_stillIndex, "f"),
            size: (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadStill_dataLength, "f"),
            mode: 1,
        });
        return {
            newState: dataTransfer_1.DataTransferState.Ready,
            commands: [command],
        };
    }
    generateDescriptionCommand(transferId) {
        return new DataTransfer_1.DataTransferFileDescriptionCommand({
            description: (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadStill_description, "f"),
            name: (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadStill_name, "f"),
            fileHash: this.hash,
            transferId: transferId,
        });
    }
}
exports.default = DataTransferUploadStill;
_DataTransferUploadStill_stillIndex = new WeakMap(), _DataTransferUploadStill_name = new WeakMap(), _DataTransferUploadStill_description = new WeakMap(), _DataTransferUploadStill_dataLength = new WeakMap();
//# sourceMappingURL=dataTransferUploadStill.js.map