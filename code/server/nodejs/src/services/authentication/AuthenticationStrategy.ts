interface AuthenticationStrategy {
    login(user: string, password: string): Promise<boolean>;
    name: string;
}

export default AuthenticationStrategy;