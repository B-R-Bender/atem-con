import AbstractCommand from './AbstractCommand'
import { Util } from '../lib/atemUtil'

export class ProductIdentifierCommand implements AbstractCommand {
	rawName = '_pin'
	deviceName: string
	model: number

	deserialize (rawCommand: Buffer) {
		this.deviceName = Util.parseString(rawCommand)
		this.model = rawCommand[40]
	}

	serialize () {
		let rawName = Buffer.from(this.deviceName)
		// https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DeviceProfile/ProductIdentifierCommand.cs#L12
		return Buffer.from([...rawName, 0x28, 0x36, 0x9B, 0x60, 0x4C, 0x08, 0x11, 0x60, 0x04, 0x3D, 0xA4, 0x60])
	}

	getAttributes () {
		return {
			deviceName: this.deviceName,
			model: this.model
		}
	}
}
