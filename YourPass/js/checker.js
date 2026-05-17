const commonPasswords = ['password', 'admin', 'qwerty', '123456', 'password123', 'admin123', 'root', 'user', 'letmein', 'welcome', 'iloveyou', 'monkey', 'dragon', 'master', 'hello', 'qwerty123', 'abc123', 'sunshine', 'football', 'baseball', 'superman', 'whatever', 'trustno1', 'qwertyuiop', 'asdfgh', 'zxcvbn', '12345678', '123456789', 'passw0rd', 'p@ssword', '123123', '654321', 'qwerty12345', '1q2w3e', 'q1w2e3', 'pass', 'password1', 'admin1', 'user123'];
const commonNames = ['alex', 'alexander', 'andrew', 'anna', 'anton', 'artem', 'bob', 'boris', 'daniil', 'danil', 'daria', 'david', 'dima', 'dmitry', 'egor', 'elena', 'eugen', 'eva', 'fedor', 'george', 'igor', 'ivan', 'james', 'jane', 'john', 'julia', 'kate', 'katya', 'kirill', 'lena', 'leonid', 'lisa', 'maksim', 'margo', 'maria', 'marina', 'mark', 'mary', 'masha', 'max', 'michael', 'mike', 'mikhail', 'nikita', 'nikolay', 'olga', 'pavel', 'petr', 'polina', 'roman', 'sasha', 'sergey', 'sofia', 'sofya', 'stepan', 'sveta', 'tanya', 'timur', 'vadim', 'valentin', 'vlad', 'vladimir', 'yana', 'yuri', 'zoya', 'анастасия', 'владимир', 'екатерина', 'максим'];
const commonCities = ['moscow', 'moskva', 'spb', 'peterburg', 'novosibirsk', 'ekaterinburg', 'kazan', 'nizhny', 'samara', 'ufa', 'rostov', 'krasnodar', 'london', 'paris', 'berlin', 'madrid', 'rome', 'vienna', 'amsterdam', 'brussels', 'prague', 'warsaw', 'budapest', 'newyork', 'losangeles', 'chicago', 'boston', 'seattle', 'moscowcity', 'москва', 'питер', 'сочи', 'крым'];
const commonSurnames = ['ivanov', 'petrov', 'sidorov', 'smirnov', 'kuznetsov', 'popov', 'vasiliev', 'morozov', 'novikov', 'volkov', 'soloviev', 'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez', 'wilson'];
const commonPatterns = ['qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop', 'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl', 'zxc', 'xcv', 'cvb', 'vbn', 'bnm', 'qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', '1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', 'zaq', 'xsw', 'cde', 'vfr', 'bgt', 'nhy', 'mju'];

function containsDate(password) {
    const lowerPwd = password.toLowerCase();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 1950; y <= currentYear; y++) {
        years.push(y.toString());
        years.push(y.toString().slice(-2));
    }
    const days = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    for (const day of days) {
        for (const month of months) {
            const ddmmyy = day + month;
            const mmddyy = month + day;
            if (lowerPwd.includes(ddmmyy) || lowerPwd.includes(mmddyy)) return true;
            for (const year of years.slice(0, 10)) {
                if (lowerPwd.includes(ddmmyy + year) || lowerPwd.includes(year + ddmmyy)) return true;
            }
        }
    }
    for (const year of years) {
        if (lowerPwd.includes(year) && year.length >= 2) return true;
    }
    return false;
}

function containsDictionaryWord(password) {
    const lowerPwd = password.toLowerCase();
    if (commonPasswords.some(word => lowerPwd.includes(word))) return true;
    if (commonNames.some(name => lowerPwd.includes(name))) return true;
    if (commonCities.some(city => lowerPwd.includes(city))) return true;
    if (commonSurnames.some(surname => lowerPwd.includes(surname))) return true;
    if (containsDate(password)) return true;
    if (commonPatterns.some(pattern => lowerPwd.includes(pattern))) return true;
    const halfLength = Math.floor(password.length / 2);
    for (let i = 2; i <= halfLength; i++) {
        const part = password.slice(0, i);
        if (password === part.repeat(password.length / i)) return true;
    }
    return false;
}

const criteriaConfig = [
    { id: 'length', name: 'Длина пароля', icon: '📏', desc: 'Не менее 12 символов', check: (pwd) => pwd.length >= 12, important: true },
    { id: 'digits', name: 'Цифры', icon: '🔢', desc: 'Хотя бы 2 цифры', check: (pwd) => (pwd.match(/\d/g) || []).length >= 2 },
    { id: 'uppercase', name: 'Заглавные буквы', icon: '🔠', desc: 'Хотя бы 2 заглавные буквы', check: (pwd) => (pwd.match(/[A-Z]/g) || []).length >= 2 },
    { id: 'lowercase', name: 'Строчные буквы', icon: '🔡', desc: 'Хотя бы 2 строчные буквы', check: (pwd) => (pwd.match(/[a-z]/g) || []).length >= 2 },
    { id: 'special', name: 'Специальные символы', icon: '✨', desc: 'Хотя бы 1 спецсимвол (!@#$%^&*)', check: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd) },
    { id: 'noCommonWords', name: 'Нет словарных слов, дат, имён', icon: '🚫', desc: 'Не содержит простые слова, даты, имена, города', check: (pwd) => !containsDictionaryWord(pwd) },
    { id: 'noSequential', name: 'Нет последовательных символов', icon: '🔀', desc: 'Нет последовательностей (123, abc, qwe)', check: (pwd) => {
        const lowerPwd = pwd.toLowerCase();
        const sequences = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl'];
        return !sequences.some(seq => lowerPwd.includes(seq));
    } },
    { id: 'noRepeating', name: 'Нет повторяющихся символов', icon: '🔄', desc: 'Нет 3+ одинаковых символов подряд (aaa, 111)', check: (pwd) => !/(.)\1\1/.test(pwd) }
];

function getStrength(passedCount, lengthPassed) {
    if (!lengthPassed) return { strength: 'weak', text: 'Слабый', icon: 'warning' };
    if (passedCount >= 7) return { strength: 'strong', text: 'Надёжный', icon: 'lock' };
    if (passedCount >= 5) return { strength: 'medium', text: 'Средний', icon: 'lock_open' };
    return { strength: 'weak', text: 'Слабый', icon: 'warning' };
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (!password) return;
    const results = criteriaConfig.map(criterion => ({ ...criterion, passed: criterion.check(password) }));
    const passedCount = results.filter(r => r.passed).length;
    const lengthPassed = results.find(r => r.id === 'length').passed;
    const { strength, text, icon } = getStrength(passedCount, lengthPassed);
    const strengthBadge = document.getElementById('strengthBadge');
    strengthBadge.className = `strength-badge strength-${strength}`;
    strengthBadge.innerHTML = `<span class="material-symbols-outlined">${icon}</span> ${text}`;
    const scoreText = document.getElementById('scoreText');
    scoreText.innerHTML = `Выполнено ${passedCount} из ${criteriaConfig.length} критериев`;
    const criteriaList = document.getElementById('criteriaList');
    criteriaList.innerHTML = results.map(criterion => `
        <div class="criterion">
            <div class="criterion-icon ${criterion.passed ? 'pass' : 'fail'}">
                <span class="material-symbols-outlined">${criterion.passed ? 'check_circle' : 'cancel'}</span>
            </div>
            <div class="criterion-text">
                ${criterion.name}
                <div class="criterion-desc">${criterion.desc}</div>
            </div>
            <div class="criterion-status ${criterion.passed ? 'status-pass' : 'status-fail'}">
                ${criterion.passed ? '✓ Выполнено' : '✗ Не выполнено'}
            </div>
        </div>
    `).join('');
    const tipsDiv = document.getElementById('tips');
    if (strength === 'strong') {
        tipsDiv.innerHTML = `
            <h4><span class="material-symbols-outlined">check_circle</span> Отлично! Ваш пароль надёжный</h4>
            <ul>
                <li>Продолжайте использовать сложные пароли</li>
                <li>Не повторяйте один и тот же пароль на разных сайтах</li>
                <li>Используйте менеджер паролей для хранения</li>
            </ul>
        `;
    } else {
        const failed = results.filter(r => !r.passed).map(r => r.name);
        tipsDiv.innerHTML = `
            <h4><span class="material-symbols-outlined">lightbulb_2</span> Что нужно исправить:</h4>
            <ul>
                ${failed.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 12px;">
            <span class="material-symbols-outlined" style="font-size: 20px; transform: translateY(-2px);">shield_with_heart</span> Используйте генератор паролей YourPass для создания надёжного пароля
            <div/>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    const checkBtn = document.getElementById('checkBtn');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('.material-symbols-outlined');
            icon.textContent = type === 'password' ? 'visibility_off' : 'visibility';
        });
    }
    if (checkBtn) {
        checkBtn.addEventListener('click', checkPassword);
    }
    checkPassword();
});