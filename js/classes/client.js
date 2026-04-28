export let i = 1;
export class Client extends HTMLElement {
    constructor() {
        super()
        this.storage = []
        this._address = i++;
        this._previously_sent_messages = []
        this._previously_received_messages = []

    }

    connectedCallback() {
        this.shadowRoot.querySelector('.new_messages').textContent = "0";
        this.shadowRoot.querySelector('.view_messages').addEventListener('click', () => {
            page("#mesenger");
            put_data(this);
        });
    }

    get_message(cable, package_packed) {
        if (package_packed.sender === 'server-error') {
            const index = this._previously_sent_messages.findIndex(pkg => pkg.sender === 'server-error');
            if (index !== -1) {
                this._previously_sent_messages.splice(index, 1);
            }
        }

        this._previously_received_messages.push(package_packed);

        let messages_old_not_read = Number(this.shadowRoot.querySelector('.new_messages').textContent || 0);
        this.shadowRoot.querySelector('.new_messages').textContent = `${messages_old_not_read + 1}`;

        package_packed.remove?.();
    }

    send_from_storage() {
        const storage = this.shadowRoot.querySelector('mail-storage');
        storage.shadowRoot.querySelector('img')?.remove();
        return storage.storage.shift();
    }

    get previously_received_messages() {
        return this._previously_received_messages;
    }

    set previously_received_messages(val) {
        this._previously_received_messages = val;
    }

    get previously_sent_messages() {
        return this._previously_sent_messages;
    }

    set previously_sent_messages(val) {
        this._previously_sent_messages = val;
    }
}
