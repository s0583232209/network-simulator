
const template_cable = document.createElement('template')
template_cable.innerHTML = `<link href='css/elements.css' rel='stylesheet'><div></div>`
import { i } from './client.js'
import { message } from './client_text.js'
export class Cable extends HTMLElement {
    constructor() {
        super()
        this._start_edge = i - 1;
        this._state = true;
        this.queue = []
        this.storage_server_edge = []
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(template_cable.content.cloneNode(true))
    }
    handle_queue() {
        if (this.queue.length > 0) {
            const current_package_start_edge = this.queue.shift()
            if (current_package_start_edge.edge == 'server') {
                const package_from_storage = document.getElementById(`storage${this.start_edge}`).take()
                if (package_from_storage) {
                    this.send_from_server(this, package_from_storage)
                    document.getElementById(`storage${this.start_edge}`).shadowRoot.querySelector('img')?.remove()
                }
            }
            else {
                const package_from_storage = current_package_start_edge.package._client.send_from_storage()
                if (package_from_storage)
                    this.send_from_client(package_from_storage)
            }
        }
    }
    send_from_server(cable, package_packed) {
        package_packed.left = true;
        package_packed.addressee = this._start_edge
        if (package_packed) {
            this.state = false
            this.animate(package_packed, -1)
            setTimeout(() => {
                document.getElementById(this._start_edge).get_message(cable, package_packed)
                this.state = true;
                this.handle_queue()
            }, 10000)

        }
    }
    send_from_client(package_packed) {
        package_packed.left = true
        if (package_packed) {
            this.state = false
            this.animate(package_packed, 1)
            setTimeout(() => {
                this.state = true
                document.querySelector("mail-server").get_package(package_packed)
                this.handle_queue()
            }, 10000)
        }
    }
    animate(package_packed, from) {
        if (package_packed) {
            let position = 0;
            let stage = null;
            const envelope = document.createElement('img')
            envelope.className = 'package hide'
            envelope.src = './media/images/envelope.png'
            envelope.alt = 'envelope'
            this.shadowRoot.appendChild(envelope);
            stage = setInterval(frame, 100)
            function frame() {
                if (position == 0)
                    envelope.classList.remove('hide')
                if (position == 100) {
                    envelope.remove()
                    clearInterval(stage);
                    return;
                }
                else {
                    position += 1;
                    if (from == -1) {
                        envelope.style.marginLeft = from * (-70 + position * 0.5) + 'vw'
                    }
                    else
                        envelope.style.marginLeft = (15 + position * 0.5) + 'vw'
                }
            }
        }
    }
    get start_edge() {
        return this._start_edge
    }
    set state(state) {
        this._state = state
        this.visible_state()
    }
    get state() {
        return this._state
    }
    visible_state() {
        if (this.state) {
            this.shadowRoot.querySelector('div').classList?.remove('cought')
            this.shadowRoot.querySelector('div').classList.add('free')
        }
        else {
            this.shadowRoot.querySelector('div').classList?.remove('free')
            this.shadowRoot.querySelector('div').classList.add('cought')
        }
    }
}
customElements.define('mail-cable', Cable)
