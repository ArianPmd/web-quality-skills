export class CodeService {
  async confirm(user: string, code: string): Promise<boolean> {
    return user.length > 0 && code.length > 0;
  }
}
