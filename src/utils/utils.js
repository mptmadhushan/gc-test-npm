export const generateRandomKey = (length = 32) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._=";
    return Array.from({ length })
      .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
      .join("")
      .substring(0, 128);
  };
  