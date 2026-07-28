import { describe, expect, it } from "vitest";
import { likesSchema, loginSchema, photosQuerySchema } from "@/lib/validations";

describe("validations", () => {
  it("rejects empty login credentials", () => {
    const result = loginSchema.safeParse({ username: "", password: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid login body", () => {
    const result = loginSchema.safeParse({
      username: "muser1",
      password: "mpassword1",
      remember: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing photoId", () => {
    const result = likesSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("coerces photo query defaults", () => {
    const result = photosQuerySchema.parse({});
    expect(result).toEqual({ page: 1, per_page: 12 });
  });
});
