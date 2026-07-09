import { Cable } from './cable.js'
import { Package } from './package.js'
import { Client } from './client.js'
import { i } from './client.js'
function create_cable() {
    const cable = document.createElement('mail-cable')
    this.shadowRoot.querySelector('.client').appendChild(cable)
    document.querySelector('mail-server').entries.push(cable)
    cable.dataset['address'] = this._address
    cable.shadowRoot.querySelector('div').classList.add('cable')
    cable.shadowRoot.querySelector('div').classList.add('free')

}

const template_client = document.createElement('template')
template_client.innerHTML = `<link href='./css/elements.css' rel='stylesheet'>
<div class='client'>
<button type='button' id='view_messages' class='new_messages'></button>

    <div class='sender'></div>
    <form class='message_form hide' >
    <label for='addressee'>Addressee</label>
    <input type='text' placeholder='Addressee' name='addressee' class='addressee' >
    <label for='message'>Message</label>
    <textarea  name='message' class='message' ></textarea>
    <button type='button'class='submit'>Send</button>
    </form>
    </div>
<mail-storage class='storage_client'></mail-storge>
`
export let message = {
    sender: '',
    adderssee: '',
    message: ''
};
export class Client_Text extends Client {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.append(template_client.content.cloneNode(true))
        shadow.querySelector('.sender').textContent = `client number ${this._address}`;
        const button_send = shadow.querySelector('.submit')
        button_send.setAttribute('data-button-of', `${this._address}`)
        button_send.addEventListener('click', this.pack)
        this.addEventListener('click', this.open)
        const storage_server_side = document.createElement('mail-storage')
        storage_server_side.id = `storage-for-${this._address}`
        document.querySelector('#storage_server_side').appendChild(storage_server_side)
        create_cable.call(this)
        shadow.querySelector('.client').style.backgroundColor = `rgba(${Math.floor(Math.random() * 248 + 46)}, ${Math.floor(Math.random() * 248 + 46)}, ${Math.floor(Math.random() * 248 + 46)})`
    }
    connectedCallback() {
        this.id = this._address
        document.getElementById(`storage-for-${this._address}`).dataset['storage_for'] = this._address
        document.getElementById(`storage-for-${this._address}`).id = 'storage' + this._address
        this.shadowRoot.querySelector('.new_messages').textContent = 0
        this.shadowRoot.querySelector("#view_messages").attributes['data-button-of'] = this._address
        this.shadowRoot.querySelector("#view_messages").addEventListener('click', this.go_to_old_messages)

    }
    open() {
        this.removeEventListener('click', this.open)
        this.addEventListener("dblclick", this.close)
        this.shadowRoot.querySelector('form').classList.add('show')
        this.shadowRoot.querySelector('form').classList.remove('hide')

    }
    close() {
        this.removeEventListener('dblclick', this.close)
        this.shadowRoot.querySelector('form').classList.add('hide')
        this.shadowRoot.querySelector('form').classList.remove('show')
        this.addEventListener('click', this.open)
    } pack() {
        const shadow = document.getElementById(this.attributes['data-button-of'].value).shadowRoot;
        message.sender = document.getElementById(this.attributes['data-button-of'].value)
        message.adderssee = shadow.querySelector('input').value
        message.message = shadow.querySelector('textarea').value
        const package_element = document.createElement('mail-package')
        document.getElementById(this.attributes['data-button-of'].value).shadowRoot.appendChild(package_element)
    }

    go_to_old_messages() {
        this.textContent = 0
        document.querySelector('main').classList.add('messages_main')
        document.querySelector('#server_area').classList.add('background-color')
        document.querySelector('#server_area').classList.remove('outer_section_server')
        document.querySelector('mail-server').classList.add('none')
        document.querySelector('.clients').id = 'none'
        const messages_visible = document.createElement('mail-messages')
        messages_visible.attributes['data-button-of'] = this.attributes['data-button-of']
        document.querySelector('main').appendChild(messages_visible)

    }
    get previously_received_messages() {
        return this._previously_received_messages
    }
    set previously_received_messages(previously_received_messages_to_set) {
        this._previously_received_messages = previously_received_messages_to_set
    }
    get previously_sent_messages() {
        return this._previously_sent_messages
    }
    set previously_sent_messages(previously_sent_messages_to_set) {
        this._previously_sent_messages = previously_sent_messages_to_set
    }
}

customElements.define('mail-client', Client_Text)
