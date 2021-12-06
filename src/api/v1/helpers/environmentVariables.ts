const getSalt = (): string => {
  const salt =
    typeof process.env.SALT === "string" ? process.env.SALT : "encriptionSalt";
  return salt;
};

export { getSalt };
