export default interface ITokenData {
    role: "user" | "activeUser";
    id: number;
    identity: string;
}