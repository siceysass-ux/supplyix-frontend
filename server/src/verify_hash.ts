import bcrypt from 'bcrypt';

const hash = '$2b$10$MO5PuU8wj4670jfsO5LboOsDiIrYfPNAOZZDmzXx0y4A7SHC0raCm';
const pass = '12345678';

bcrypt.compare(pass, hash).then(result => {
    console.log(`Password matches: ${result}`);
});
