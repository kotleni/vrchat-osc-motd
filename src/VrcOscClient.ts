import dgram from "dgram";
import OSC from "osc-js";

const VRC_CHATBOX_INPUT = "/chatbox/input";
// const VRC_CHATBOX_TYPING = "/chatbox/typing";
const VRC_CHATBOX_AFK = "/avatar/parameters/AFK";

export default class VrcOscClient {
    private socket: any;

    private isAfk: boolean = false;

    private toArrayBuffer(buffer: Buffer) : ArrayBuffer {
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }

    constructor() {
        this.socket = dgram.createSocket('udp4')
        this.socket.on('message', (data: Buffer) => {
            const dataView = new DataView(this.toArrayBuffer(data))
            const msg = new OSC.Message('/nothing')
            msg.unpack(dataView)

            switch (msg.address) {
                case VRC_CHATBOX_AFK:
                    this.isAfk = msg.args[0] as boolean;
                    break;
            }
        })
        this.socket.bind(9001)
    }

    sendInputToChatbox(text: string) {
        const message = new OSC.Message(VRC_CHATBOX_INPUT, text, true, false)
        const binary = message.pack()
        this.socket.send(new Buffer(binary), 0, binary.byteLength, 9000, 'localhost')

        console.log(`VRC_CHATBOX_INPUT <- '${text}'`)
    }

    getIsAfk(): boolean {
        return this.isAfk;
    }
}