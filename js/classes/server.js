import { message } from './client_text.js'
const template_server = document.createElement('template')
template_server.innerHTML = `<link href='css/elements.css' rel='stylesheet'><div id='server'><slot></slot><mail-storage></mail-storage></div>`
export class Server extends HTMLElement {
    constructor() {
        super()
        this.entries = [];
        this.storage = [];
        this._active_package = null;
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.append(template_server.content.cloneNode(true))
    };
    send_to_all() {
        for (let i = 0; i < document.querySelector('mail-server').entries.length; i++) {
            message.sender = document.querySelector('mail-server')
            message.adderssee = String(document.querySelector('mail-server').entries[i]._start_edge)
            message.message = document.getElementById('send_to_all_message').value
            document.querySelector('mail-server').shadowRoot.querySelector('mail-storage').appendChild(document.createElement('mail-package'))

        }
    }
    scheduled_messages() {
        message.sender = 'server'
        message.adderssee = String(document.querySelector('mail-server').entries[Math.floor(Math.random() * (document.querySelector('mail-server').entries).length)]._start_edge)
        message.message = 'Random Message'
        document.querySelector('mail-server').shadowRoot.querySelector('mail-storage').appendChild(document.createElement('mail-package'))
    }
    find_cable(package_packed) {
        const cable_edge = this.entries.find(cable => cable._start_edge == package_packed._addressee)
        const active_package = this._active_package
        if (!cable_edge) {
            this.active_package = null;
            setTimeout(() => { this.send_back(document.getElementById(package_packed.sender).shadowRoot.querySelector('mail-cable'), package_packed) }, 100)
        }
        else {
            this.active_package = null;
            this.send_to_cable(cable_edge, active_package)
        }
    }
    send_back(cable, active_package) {
        active_package._addressee = active_package.sender
        active_package.sender = 'server-error'
        this.send_to_cable(cable, active_package)
    }
    get_package(package_packed) {
        if (!this._active_package) {
            this.active_package = package_packed
        }
        else
            this.add_to_storage(package_packed)
    }
    get_from_storage() {
        if (this.storage.length == 0)
            return null;
        else {
            this.active_package = this.storage.shift()
            this.querySelector('mail-storage').take()
        }
    };
    add_to_storage(package_packed) {
        this.storage.push(package_packed)
    };
    send_to_cable(cable, packed_package) {
        if (!cable.state) {
            console.log(document.querySelector(`#storage${cable.start_edge}`));

            document.querySelector(`#storage${cable.start_edge}`).add(packed_package, 'server')
        }
        else
            cable.send_from_server(cable, packed_package)
    }
    set active_package(package_for_active) {
        if (!package_for_active) {
            if (this.storage.length == 0)
                this._active_package = null
            else
                this.get_from_storage()

        }
        else {
            let addressees = package_for_active.addressee.split(' ')
            for (let i = 0; i < addressees.length; i++) {
                this._active_package = package_for_active
                this._active_package.addressee = addressees[i]
                this.find_cable(this._active_package)

            }

        }

    }
}
customElements.define('mail-server', Server)
