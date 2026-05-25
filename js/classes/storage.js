export { message } from './client_text.js'
const template_storage = document.createElement('template')
template_storage.innerHTML = `<link href='css/elements.css' rel='stylesheet'><div class='storage'></div>`
export class Storage extends HTMLElement {
    constructor() {
        history.pushState({ name: 'messages' }, 'messages', '#messages')
        super();
        this.address = null
        this.storage = []
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.append(template_storage.content.cloneNode(true));

    }
    take() {
        this.querySelector('img')?.remove()
        return this.storage.shift()
    };
    add(pkg, edge) {
        let cable;
        if (pkg.left || pkg.sender == 'server') {
            cable = document.getElementById(pkg.addressee).shadowRoot.querySelector('mail-cable')
        }
        else {
            cable = document.getElementById(pkg.sender).shadowRoot.querySelector('mail-cable')
        }
        cable.queue.push({ package: pkg, edge: edge })
        document.getElementById(`storage${cable.start_edge}`).storage.push(pkg)
        this.storage.push(pkg)
        const envelope = document.createElement('img')
        envelope.className = 'envelope storage-envelope'
        envelope.src = './media/images/envelope.png'
        envelope.alt = 'package'
        this.shadowRoot.querySelector('.storage').appendChild(envelope)
    }

}
customElements.define('mail-storage', Storage)
