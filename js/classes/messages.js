const template_messages = document.createElement('template');
template_messages.id = "messanger";
template_messages.innerHTML = `
    <link rel="stylesheet" href="./css/messages.css">
    <div id="messages_area">
        <div id="name"></div>
        <div id="messages_div">
         <div id="send_messages_area">
            <h2 class="titles">send messages<h2>
            <div id="send_messages"></div>
         </div>
         <div id="recived_messages_area">
            <h2 class="titles">recived messages<h2>
            <div id="recived_messages"></div>
         </div>
        </div>
      <button id="back_to_email">back to emails</button>
    </div>`;
export class Messages extends HTMLElement {
    constructor() {
        super()
        window.addEventListener('popstate', this.back)
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.append(template_messages.content.cloneNode(true))
        this.shadowRoot.querySelector("#back_to_email").addEventListener('click', this.back)
    }
    connectedCallback() {

        this.place_data(this.attributes['data-button-of'])
    }
    place_data(client) {
        const client_for_messages = document.getElementById(client);
        const recived_packages_array = client_for_messages._previously_received_messages;
        const sent_packages_array = client_for_messages._previously_sent_messages;
        document.querySelector('mail-messages').shadowRoot.querySelector('#name').textContent = ` client number: ${client}`
        this.put_messages_in_place(recived_packages_array, 1);
        this.put_messages_in_place(sent_packages_array, 0);
    }
    put_messages_in_place(packages_array, type) {
        packages_array.forEach(individual_package => {
            this.create_HTML_message(individual_package, type);
        });
    }
    create_HTML_message(individual_package, message_type) {
        let word;
        let container;
        let sender_addressee;
        let warning = "";
        if (message_type == 0) {
            container = document.querySelector('mail-messages').shadowRoot.querySelector("#send_messages");
            word = 'To: '
            sender_addressee = individual_package.addressee
        } else {
            container = document.querySelector('mail-messages').shadowRoot.querySelector("#recived_messages");
            word = 'From: ';
            sender_addressee = individual_package.sender

            if (individual_package.sender == 'server-error') {
                warning = "Were sorry but this message had a problem"
            }
        }

        const messageHTML = `
        <div class="email-wrapper">
            <div class="email-message">
                <div class="email-header">
                    <p>${word} ${sender_addressee}</p>
                </div>
                <div class="email-body">
                    <p>${individual_package.contents}</p>
                </div>
                <div class="warning">${warning}</div>
            </div>
        </div>    `;
        container.insertAdjacentHTML('beforeend', messageHTML);
    }
    back() {
        document.querySelector('main').classList.remove('messages_main')
        document.querySelector('main').children[0].remove()
        document.querySelector('.clients').id = ''
        document.querySelector('mail-server').classList.remove('none')
        document.querySelector('#server_area').classList.remove('background-color')
        document.querySelector('#server_area').classList.add('outer_section_server')
    }
    go_to_old_messages() {
        document.querySelector('.clients').id = 'none'
        const messages_visible = document.createElement('mail-messages')
        messages_visible.attributes['data-button-of'] = this.attributes['data-button-of']
        document.querySelector('#server_area').appendChild(messages_visible)
    }
}
customElements.define('mail-messages', Messages)

