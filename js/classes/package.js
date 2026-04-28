const template_mail_package = document.createElement('template')
template_mail_package.innerHTML = `<link href='../css/elements.css' rel='stylesheet'>
 <img src="./media/images/envelope.png" alt="envelope" class='package'>`
import { message } from './client_text.js'
import { Storage } from './storage.js'
    export class Package extends HTMLElement {
    constructor() {
        super()
        this._client = message.sender
    this._sender = message.sender.id || 'server'
        this.left = false
        this.addressee = message.adderssee
        this._contents = message.message
    }
    connectedCallback() {
        this.save_package()
    }
    save_package() {
        if (this.sender == 'server') {
            document.querySelector('mail-server').get_package(this)
        return;
        }
        const cable_shadow = (message.sender).shadowRoot
        const cable = cable_shadow.querySelector('mail-cable')
        if (cable.state) {
            this.left = true;
            this.go_to_cable()
        }
        else {
            this.put_in_storage()
        }
    }
    put_in_storage() {
        document.getElementById(this.sender).shadowRoot.querySelector('mail-storage').add(this, 'client')
        this._client._previously_sent_messages.push(this)

    }
    go_to_cable() {
        const cable_shadow = this._client.shadowRoot
        const cable = cable_shadow.querySelector('mail-cable')
        cable.send_from_client(this)
        setTimeout(() => {
            this._client._previously_sent_messages.push(this)
        }, 2000);

    }
    get sender() {
        return this._sender
    }
    set sender(sender_to_set) {
        this._sender = sender_to_set
    }
    get addressee() {
        return this._addressee
    }
    set addressee(addressee_to_set) {
        this._addressee = addressee_to_set
    }
    get contents() {
        return this._contents
    }
    set contents(contents_to_set) {
        this._contents = contents_to_set
    }
    get left() {
        return this._left
    }
    set left(left_to_set) {
        this._left = left_to_set
    }
    get reached() {
        return this._reached
    }
    set reached(reched_to_set) {
        this._reached = reched_to_set
    }

}
customElements.define('mail-package', Package)