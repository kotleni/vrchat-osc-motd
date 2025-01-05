import dgram from "dgram";
import OSC from "osc-js";

const VRC_CHATBOX_INPUT = "/chatbox/input";
// const VRC_CHATBOX_TYPING = "/chatbox/typing";

export default class VrcOscClient {
    private socket: any;

    constructor() {
        this.socket = dgram.createSocket('udp4')
    }

    sendInputToChatbox(text: string) {
        const message = new OSC.Message(VRC_CHATBOX_INPUT, text, true, false)
        const binary = message.pack()
        this.socket.send(new Buffer(binary), 0, binary.byteLength, 9000, 'localhost')

        console.log(`VRC_CHATBOX_INPUT <- '${text}'`)
    }
}