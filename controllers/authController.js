import { login as loginService, createUser, createToken } from "../services/authService.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ field: "email", message: "Invalid email format" });
  }

  const { email, password } = parsed.data;
  const result = await loginService(email, password);

  if (result === null) {
    return res.status(401).json({ field: "email", message: "Incorrect email" });
  }
  if (result.wrongPassword) {
    return res.status(401).json({ field: "password", message: "Incorrect password" });
  }

  const token = createToken({ sub: result.id, email: result.email });
  res.status(200).json({ user: { id: result.id, email: result.email, name: result.name }, token });
}

export async function register(req, res, next) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return res.status(400).json({ message: firstError.message });
  }

  const { name, email, password } = parsed.data;
  const user = await createUser(name, email, password);

  if (!user) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const token = createToken({ sub: user.id, email: user.email });
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
}

export function me(req, res) {
  res.status(200).json({ user: req.user });
}
