import bcrypt from "bcryptjs";

const useHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const useComparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}

export {
    useHashPassword,
    useComparePassword
}