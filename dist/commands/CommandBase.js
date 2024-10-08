"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricalCommand = exports.WritableCommand = exports.BasicWritableCommand = exports.DeserializedCommand = void 0;
/** Base type for a receivable command */
class DeserializedCommand {
    constructor(properties) {
        this.properties = properties;
    }
}
exports.DeserializedCommand = DeserializedCommand;
/** Base command type for a simple writable command, which has a few values which must all be sent */
class BasicWritableCommand {
    constructor(properties) {
        this._properties = properties;
    }
    get properties() {
        return this._properties;
    }
}
exports.BasicWritableCommand = BasicWritableCommand;
/** Base command type for a full writable command, which uses flags to indicate the changed properties */
class WritableCommand extends BasicWritableCommand {
    constructor() {
        super({});
        this.flag = 0;
    }
    /** Update the values of some properties with this command */
    updateProps(newProps) {
        return this._updateProps(newProps);
    }
    _updateProps(newProps) {
        const maskFlags = this.constructor.MaskFlags;
        let hasChanges = false;
        if (maskFlags) {
            for (const key in newProps) {
                const key2 = key;
                const val = newProps[key];
                if (key in maskFlags && val !== undefined) {
                    this.flag = this.flag | maskFlags[key];
                    this._properties[key2] = val;
                    hasChanges = true;
                }
            }
        }
        return hasChanges;
    }
}
exports.WritableCommand = WritableCommand;
/** Base command type for a command which gets sent in both directions */
class SymmetricalCommand extends DeserializedCommand {
}
exports.SymmetricalCommand = SymmetricalCommand;
//# sourceMappingURL=CommandBase.js.map