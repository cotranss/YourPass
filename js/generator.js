class PasswordGenerator {
    constructor() {
        this.charsets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*+.?'
        };
    }

    generateWithGuarantee(options) {
        const {
            length = 12,
            useLowercase = true,
            useUppercase = true,
            useNumbers = true,
            useSymbols = false,
            keyword = '',
            keywordPosition = 'random'
        } = options;

        const selectedTypes = [];
        if (useLowercase) selectedTypes.push(this.charsets.lowercase);
        if (useUppercase) selectedTypes.push(this.charsets.uppercase);
        if (useNumbers) selectedTypes.push(this.charsets.numbers);
        if (useSymbols) selectedTypes.push(this.charsets.symbols);

        if (selectedTypes.length === 0) {
            throw new Error('Выберите хотя бы один тип символов');
        }

        let effectiveLength = length;
        let keywordLength = keyword ? keyword.length : 0;

        if (keyword && keywordLength > 0) {
            if (length <= keywordLength) {
                throw new Error(`Длина пароля (${length}) должна быть больше длины ключевого слова (${keywordLength})`);
            }
            effectiveLength = length - keywordLength;
        }

        if (effectiveLength < selectedTypes.length) {
            throw new Error(`Длина пароля должна быть не меньше ${selectedTypes.length + keywordLength}`);
        }

        let basePassword = '';

        for (const charset of selectedTypes) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            basePassword += charset[randomIndex];
        }

        const allChars = selectedTypes.join('');
        for (let i = basePassword.length; i < effectiveLength; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            basePassword += allChars[randomIndex];
        }

        basePassword = this.shuffleString(basePassword);

        let finalPassword = basePassword;
        let positionInfo = '';

        if (keyword && keywordLength > 0) {
            switch(keywordPosition) {
                case 'start':
                    finalPassword = keyword + basePassword;
                    positionInfo = 'в начале';
                    break;
                case 'end':
                    finalPassword = basePassword + keyword;
                    positionInfo = 'в конце';
                    break;
                case 'random':
                default:
                    const position = Math.floor(Math.random() * (basePassword.length + 1));
                    finalPassword = basePassword.slice(0, position) + keyword + basePassword.slice(position);
                    positionInfo = 'случайно';
            }
        }

        return {
            password: finalPassword,
            info: {
                keywordUsed: keyword,
                keywordPosition: positionInfo,
                baseLength: basePassword.length,
                keywordLength: keywordLength,
                totalLength: finalPassword.length
            }
        };
    }

    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gen = new PasswordGenerator();

    const elements = {
        passwordDisplay: document.getElementById('password'),
        lengthInput: document.getElementById('length'),
        keywordInput: document.getElementById('keyword'),
        radioButtons: document.querySelectorAll('input[name="keywordPosition"]'),
        checkboxes: {
            lowercase: document.getElementById('lowercase'),
            uppercase: document.getElementById('uppercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols')
        },
        generateBtn: document.querySelector('.generate-btn'),
        copyBtn: document.querySelector('.copy-btn'),
        infoPanel: document.getElementById('info')
    };

    function generatePassword() {
        const options = {
            length: parseInt(elements.lengthInput.value),
            useLowercase: elements.checkboxes.lowercase.checked,
            useUppercase: elements.checkboxes.uppercase.checked,
            useNumbers: elements.checkboxes.numbers.checked,
            useSymbols: elements.checkboxes.symbols.checked,
            keyword: elements.keywordInput.value,
            keywordPosition: document.querySelector('input[name="keywordPosition"]:checked').value
        };

        try {
            const result = gen.generateWithGuarantee(options);
            elements.passwordDisplay.textContent = result.password;

            if (result.info.keywordUsed) {
                elements.infoPanel.innerHTML = `<span class="material-symbols-outlined">check_circle</span> <strong>Пароль сгенерирован</strong><br>
                <span class="material-symbols-outlined">key</span> Ключевое слово «${result.info.keywordUsed}» вставлено ${result.info.keywordPosition}<br>
                <span class="material-symbols-outlined">arrow_range</span> Длина: ${result.info.totalLength} символов (основа: ${result.info.baseLength} + слово: ${result.info.keywordLength})<br>
                <span class="material-symbols-outlined">lock</span> Содержит все выбранные типы символов`;
            } else {
                elements.infoPanel.innerHTML = `<span class="material-symbols-outlined">check_circle</span>
                <strong>Пароль сгенерирован</strong><br>
                <span class="material-symbols-outlined">arrow_range</span>
                Длина: ${result.password.length} символов<br>
                <span class="material-symbols-outlined">lock</span>
                Содержит все выбранные типы символов`;
            }

            elements.passwordDisplay.style.backgroundColor = '#e8f5e9';
            setTimeout(() => elements.passwordDisplay.style.backgroundColor = '', 300);

        } catch (error) {
            alert(error.message);
            elements.infoPanel.innerHTML = `<strong>Ошибка:</strong> ${error.message}`;
        }
    }

    function copyToClipboard() {
        const password = elements.passwordDisplay.textContent;

        if (!password || password === 'Нажмите "Сгенерировать"') {
            alert('Сначала сгенерируйте пароль');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            const originalText = elements.copyBtn.innerHTML;
            elements.copyBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Скопировано!';
            elements.copyBtn.style.background = '#7a9c7e';
            setTimeout(() => {
                elements.copyBtn.innerHTML = originalText;
                elements.copyBtn.style.background = '';
            }, 1500);

            const originalHtml = elements.infoPanel.innerHTML;
            elements.infoPanel.innerHTML = '<span class="material-symbols-outlined">check_circle</span> <strong>Пароль скопирован в буфер обмена!</strong>';
            elements.infoPanel.style.backgroundColor = '#e8f5e9';
            setTimeout(() => {
                elements.infoPanel.innerHTML = originalHtml;
                elements.infoPanel.style.backgroundColor = '';
            }, 2000);

        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = password;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Пароль скопирован!');
        });
    }

    elements.generateBtn.addEventListener('click', generatePassword);
    elements.copyBtn.addEventListener('click', copyToClipboard);
});
