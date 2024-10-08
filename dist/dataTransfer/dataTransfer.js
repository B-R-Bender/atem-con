"use strict";
var _DataTransfer_completionPromise;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransfer = exports.DataTransferState = void 0;
const tslib_1 = require("tslib");
var DataTransferState;
(function (DataTransferState) {
    /** Waiting for strt */
    DataTransferState[DataTransferState["Pending"] = 0] = "Pending";
    /** Started, waiting for first response */
    DataTransferState[DataTransferState["Ready"] = 1] = "Ready";
    /** In progress */
    DataTransferState[DataTransferState["Transferring"] = 2] = "Transferring";
    /** Finished */
    DataTransferState[DataTransferState["Finished"] = 3] = "Finished";
})(DataTransferState = exports.DataTransferState || (exports.DataTransferState = {}));
class DataTransfer {
    constructor() {
        _DataTransfer_completionPromise.set(this, void 0);
        // Make typescript happy
        this.resolvePromise = () => {
            // Ignore
        };
        this.rejectPromise = () => {
            // Ignore
        };
        (0, tslib_1.__classPrivateFieldSet)(this, _DataTransfer_completionPromise, new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        }), "f");
    }
    /** Get the promise that will resolve upon completion/failure of the transfer */
    get promise() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _DataTransfer_completionPromise, "f");
    }
    /** Restart the current transfer */
    async restartTransfer(transferId) {
        return this.startTransfer(transferId);
    }
    /** The current transfer has been aborted and should report failure */
    abort(reason) {
        this.rejectPromise(reason);
    }
}
exports.DataTransfer = DataTransfer;
_DataTransfer_completionPromise = new WeakMap();
//# sourceMappingURL=dataTransfer.js.map