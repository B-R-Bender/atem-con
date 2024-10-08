"use strict";
var _DataTransferDownloadMacro_data;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransferDownloadMacro = void 0;
const tslib_1 = require("tslib");
const DataTransfer_1 = require("../commands/DataTransfer");
const dataTransfer_1 = require("./dataTransfer");
// TODO - this should be reimplemented on top of a generic DataTransferDownloadBuffer class
class DataTransferDownloadMacro extends dataTransfer_1.DataTransfer {
    constructor(macroIndex) {
        super();
        this.macroIndex = macroIndex;
        _DataTransferDownloadMacro_data.set(this, Buffer.alloc(0));
    }
    async startTransfer(transferId) {
        const command = new DataTransfer_1.DataTransferDownloadRequestCommand({
            transferId: transferId,
            transferStoreId: 0xffff,
            transferIndex: this.macroIndex,
            transferType: 3,
        });
        return {
            newState: dataTransfer_1.DataTransferState.Ready,
            commands: [command],
        };
    }
    async handleCommand(command, oldState) {
        if (command instanceof DataTransfer_1.DataTransferErrorCommand) {
            switch (command.properties.errorCode) {
                case DataTransfer_1.ErrorCode.Retry:
                    return this.restartTransfer(command.properties.transferId);
                case DataTransfer_1.ErrorCode.NotFound:
                    this.abort(new Error('Invalid download'));
                    return {
                        newState: dataTransfer_1.DataTransferState.Finished,
                        commands: [],
                    };
                default:
                    // Abort the transfer.
                    this.abort(new Error(`Unknown error ${command.properties.errorCode}`));
                    return {
                        newState: dataTransfer_1.DataTransferState.Finished,
                        commands: [],
                    };
            }
        }
        else if (command instanceof DataTransfer_1.DataTransferDataCommand) {
            (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferDownloadMacro_data, command.properties.body, "f");
            // todo - have we received all data? maybe check if the command.body < max_len
            return {
                newState: oldState,
                commands: [
                    new DataTransfer_1.DataTransferAckCommand({
                        transferId: command.properties.transferId,
                        transferIndex: this.macroIndex,
                    }),
                ],
            };
        }
        else if (command instanceof DataTransfer_1.DataTransferCompleteCommand) {
            this.resolvePromise((0, tslib_1.__classPrivateFieldGet)(this, _DataTransferDownloadMacro_data, "f"));
            return {
                newState: dataTransfer_1.DataTransferState.Finished,
                commands: [],
            };
        }
        return { newState: oldState, commands: [] };
    }
}
exports.DataTransferDownloadMacro = DataTransferDownloadMacro;
_DataTransferDownloadMacro_data = new WeakMap();
//# sourceMappingURL=dataTransferDownloadMacro.js.map