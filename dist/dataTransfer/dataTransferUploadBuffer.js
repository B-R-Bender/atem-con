"use strict";
var _DataTransferUploadBuffer_bytesSent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransferUploadBuffer = exports.generateBufferInfo = exports.generateHashForBuffer = void 0;
const tslib_1 = require("tslib");
const DataTransfer_1 = require("../commands/DataTransfer");
const crypto = require("crypto");
const dataTransfer_1 = require("./dataTransfer");
const debug0 = require("debug");
const Util = require("../lib/atemUtil");
const debug = debug0('atem-connection:data-transfer:upload-buffer');
function generateHashForBuffer(data) {
    return data ? crypto.createHash('md5').update(data).digest('base64') : '';
}
exports.generateHashForBuffer = generateHashForBuffer;
function generateBufferInfo(data, shouldEncodeRLE) {
    return {
        encodedData: shouldEncodeRLE ? Util.encodeRLE(data) : data,
        rawDataLength: data.length,
        hash: generateHashForBuffer(data),
    };
}
exports.generateBufferInfo = generateBufferInfo;
class DataTransferUploadBuffer extends dataTransfer_1.DataTransfer {
    constructor(buffer) {
        super();
        _DataTransferUploadBuffer_bytesSent.set(this, 0);
        this.hash = buffer.hash ?? generateHashForBuffer(buffer.encodedData);
        this.data = buffer.encodedData;
    }
    async handleCommand(command, oldState) {
        if (command instanceof DataTransfer_1.DataTransferErrorCommand) {
            switch (command.properties.errorCode) {
                case DataTransfer_1.ErrorCode.Retry:
                    return this.restartTransfer(command.properties.transferId);
                case DataTransfer_1.ErrorCode.NotFound:
                    this.abort(new Error('Invalid upload'));
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
        else if (command instanceof DataTransfer_1.DataTransferUploadContinueCommand) {
            const result = {
                newState: oldState,
                commands: [],
            };
            // Atem requested more packets of data
            if (oldState === dataTransfer_1.DataTransferState.Ready) {
                // First bunch of packets, also send the description
                result.newState = dataTransfer_1.DataTransferState.Transferring;
                result.commands.push(this.generateDescriptionCommand(command.properties.transferId));
            }
            const nextChunks = this.getNextChunks(command.properties);
            result.commands.push(...nextChunks);
            // if (nextChunks.length === 0) this.abort(new Error('Ran out of data'))
            return result;
        }
        else if (command instanceof DataTransfer_1.DataTransferCompleteCommand) {
            // Atem reports that it recieved everything
            if (oldState === dataTransfer_1.DataTransferState.Transferring) {
                this.resolvePromise();
                return {
                    newState: dataTransfer_1.DataTransferState.Finished,
                    commands: [],
                };
            }
            else {
                return { newState: oldState, commands: [] };
            }
        }
        else {
            // Unknown command
            return { newState: oldState, commands: [] };
        }
    }
    getNextChunks(props) {
        const commands = [];
        // Take a little less because the atem does that?
        // const chunkSize = props.chunkSize - 4
        const chunkSize = Math.floor(props.chunkSize / 8) * 8;
        for (let i = 0; i < props.chunkCount; i++) {
            // Make sure the packet isn't empty
            if ((0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") >= this.data.length)
                break;
            // Make sure the packet doesn't end in the middle of a RLE block
            let shortenBy = 0;
            if (chunkSize + (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") > this.data.length) {
                // The last chunk can't end with a RLE header
                shortenBy = (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") + chunkSize - this.data.length;
            }
            else if (Util.RLE_HEADER === this.data.readBigUint64BE((0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") + chunkSize - 8)) {
                // RLE header starts 8 bytes before the end
                shortenBy = 8;
            }
            else if (Util.RLE_HEADER === this.data.readBigUint64BE((0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") + chunkSize - 16)) {
                // RLE header starts 16 bytes before the end
                shortenBy = 16;
            }
            commands.push(new DataTransfer_1.DataTransferDataCommand({
                transferId: props.transferId,
                body: this.data.slice((0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f"), (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") + chunkSize - shortenBy),
            }));
            (0, tslib_1.__classPrivateFieldSet)(this, _DataTransferUploadBuffer_bytesSent, (0, tslib_1.__classPrivateFieldGet)(this, _DataTransferUploadBuffer_bytesSent, "f") + (chunkSize - shortenBy), "f");
        }
        debug(`Generated ${commands.length} chunks for size ${chunkSize}`);
        return commands;
    }
}
exports.DataTransferUploadBuffer = DataTransferUploadBuffer;
_DataTransferUploadBuffer_bytesSent = new WeakMap();
//# sourceMappingURL=dataTransferUploadBuffer.js.map