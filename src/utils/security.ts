import bcrypt from 'bcrypt';

export class SecurityService {
    async hash(str: string) {
        const salt = await this.generateSalt();
        return bcrypt.hashSync(str, salt);
    }

    async compare(str: string, hash: string) {
        return bcrypt.compareSync(str, hash);
    }

    private async generateSalt() {
        return bcrypt.genSaltSync();
    }
}
