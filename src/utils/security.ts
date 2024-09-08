import bcrypt from 'bcrypt';

export class SecurityService {
    async hash(str: string) {
        const salt = await this.generateSalt();
        return bcrypt.hash(str, salt);
    }

    async compare(str: string, hash: string) {
        return bcrypt.compare(str, hash);
    }

    private async generateSalt() {
        return await bcrypt.genSalt();
    }
}
