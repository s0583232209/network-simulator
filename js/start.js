import { Cable } from './classes/cable.js'
import { Client } from './classes/client.js'
import { Client_Text } from './classes/client_text.js'
import { Package } from './classes/package.js'
import { Server } from './classes/server.js'
import { Storage } from './classes/storage.js'
import { Messages } from './classes/messages.js'
init()
function init() {
    const mail_server = document.createElement('mail-server')
    mail_server.textContent = 'S  E  R  V  E  R'
    document.getElementById('server_area').appendChild(mail_server)
    document.querySelector('#create_client').addEventListener('click', add_client)
    document.getElementById('scheduled_message').addEventListener('click', document.querySelector('mail-server').scheduled_messages)
    document.getElementById('send_to_all').addEventListener('click', document.querySelector('mail-server').send_to_all)
    for (let i = 0; i < 3; i++)
        add_client()
}
function add_client() {
    const mail_client = document.createElement('mail-client')
    document.querySelector('.clients').appendChild(mail_client)
}
document.querySelectorAll('mail-client').forEach(client => {
    client.setAttribute('id', client._address)
});

